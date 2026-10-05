/**
 * Development helper: captures the site at a few viewport widths and reports
 * horizontal overflow, console errors and the tab order. Not part of the build.
 *
 *   node scripts/shots.mjs [baseUrl] [outDir]
 */
import { mkdir, rm } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:43127";
const outDir = process.argv[3] ?? "/tmp/shots";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 900 },
];

const PAGES = [
  { name: "home", path: "/" },
  { name: "case", path: "/work/minecraft-mob-catalog" },
];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  for (const page of PAGES) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2,
    });
    const tab = await context.newPage();

    const problems = [];
    tab.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        problems.push(`${message.type()}: ${message.text()}`);
      }
    });
    tab.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));

    tab.setDefaultTimeout(20_000);
    await tab.goto(base + page.path, { waitUntil: "load" });
    await tab.waitForTimeout(600);

    // Walk to the bottom so every reveal and lazy image settles. Driven by the
    // actual scroll position rather than a precomputed height, because the
    // document grows as images and fonts land.
    await tab.evaluate(async () => {
      const step = window.innerHeight * 0.6;
      let previous = -1;
      for (let i = 0; i < 200 && window.scrollY !== previous; i += 1) {
        previous = window.scrollY;
        window.scrollBy(0, step);
        await new Promise((resolve) => setTimeout(resolve, 110));
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    // A full-page screenshot expands the viewport, which can kick off another
    // round of lazy loading; wait for every image to decode before capturing.
    await tab
      .waitForFunction(
        () =>
          [...document.images]
            // Images inside a `display: none` branch never load, by design.
            .filter((image) => image.offsetParent !== null || image.offsetWidth)
            .every((image) => image.complete),
        { timeout: 15_000 },
      )
      .catch(() => console.warn("    (some images never finished loading)"));
    await tab.waitForTimeout(500);

    const metrics = await tab.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const viewWidth = window.innerWidth;
      const wide = [...document.querySelectorAll("body *")]
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && (rect.right > viewWidth + 1 || rect.left < -1);
        })
        .slice(0, 6)
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const cls =
            typeof node.className === "string" ? node.className.slice(0, 60) : "";
          return `${node.tagName.toLowerCase()}.${cls} [${Math.round(rect.left)}..${Math.round(rect.right)}]`;
        });

      const invisible = [...document.querySelectorAll("[data-state='hidden']")]
        .length;

      return {
        overflow: docWidth - viewWidth,
        wide,
        invisible,
        navVisible: Boolean(
          document.querySelector("nav[aria-label='Primary'] a")?.checkVisibility(),
        ),
        burgerVisible: Boolean(
          document
            .querySelector("[data-slot='sheet-trigger']")
            ?.checkVisibility(),
        ),
      };
    });

    const name = `${page.name}-${viewport.name}`;
    await tab.screenshot({
      path: `${outDir}/${name}.png`,
      fullPage: true,
    });

    console.log(
      [
        name.padEnd(16),
        `overflow=${metrics.overflow}px`,
        `nav=${metrics.navVisible}`,
        `burger=${metrics.burgerVisible}`,
        `stillHidden=${metrics.invisible}`,
        problems.length ? `\n    console: ${problems.join("\n    ")}` : "",
        metrics.wide.length ? `\n    wide: ${metrics.wide.join("\n          ")}` : "",
      ].join(" "),
    );

    await context.close();
  }
}

// Tab order on the home page at desktop width.
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const tab = await context.newPage();
await tab.goto(base, { waitUntil: "networkidle" });
const order = [];
for (let i = 0; i < 16; i += 1) {
  await tab.keyboard.press("Tab");
  order.push(
    await tab.evaluate(() => {
      const el = document.activeElement;
      if (!el) return "none";
      const style = getComputedStyle(el);
      const text = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 34);
      return `${el.tagName.toLowerCase()} "${text}" outline=${style.outlineWidth}/${style.outlineStyle}`;
    }),
  );
}
console.log("\nTab order:");
order.forEach((entry, i) => console.log(`  ${String(i + 1).padStart(2)}. ${entry}`));

await browser.close();
