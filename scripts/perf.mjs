/**
 * Development helper: reports transfer weight, Largest Contentful Paint and
 * Cumulative Layout Shift for each route. Not part of the build.
 *
 *   node scripts/perf.mjs [baseUrl]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:43127";
const PATHS = ["/", "/work/minecraft-mob-catalog"];

const browser = await chromium.launch();

for (const path of PATHS) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const byType = new Map();
  page.on("response", async (response) => {
    if (response.status() >= 300) return;
    const type = (response.headers()["content-type"] ?? "other").split(";")[0];
    const length = Number(response.headers()["content-length"] ?? 0);
    const size =
      length || (await response.body().then((b) => b.length).catch(() => 0));
    byType.set(type, (byType.get(type) ?? 0) + size);
  });

  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(2500);

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });

        const nav = performance.getEntriesByType("navigation")[0];

        setTimeout(
          () =>
            resolve({
              lcp: Math.round(lcp),
              cls: Number(cls.toFixed(4)),
              domContentLoaded: Math.round(nav?.domContentLoadedEventEnd ?? 0),
              requests: performance.getEntriesByType("resource").length,
            }),
          600,
        );
      }),
  );

  // Scrolling the whole page is where layout shift from late images shows up.
  const clsAfterScroll = await page.evaluate(async () => {
    let cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });

    const step = window.innerHeight * 0.6;
    let previous = -1;
    for (let i = 0; i < 200 && window.scrollY !== previous; i += 1) {
      previous = window.scrollY;
      window.scrollBy(0, step);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    return Number(cls.toFixed(4));
  });

  const total = [...byType.values()].reduce((sum, n) => sum + n, 0);
  console.log(`\n${path}`);
  console.log(
    `  LCP ${vitals.lcp}ms · CLS ${vitals.cls} (${clsAfterScroll} incl. full scroll) · DCL ${vitals.domContentLoaded}ms · ${vitals.requests} requests`,
  );
  console.log(`  transfer ${(total / 1024).toFixed(0)} KB total`);
  for (const [type, size] of [...byType].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${(size / 1024).toFixed(1).padStart(8)} KB  ${type}`);
  }

  await context.close();
}

await browser.close();
