/**
 * Development helper: records a walkthrough of the site — scroll reveals, hover
 * states, the case study route and the mobile sheet. Not part of the build.
 *
 *   node scripts/walkthrough.mjs [baseUrl] [outDir]
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:43127";
const outDir = process.argv[3] ?? "/tmp/walkthrough";

await mkdir(outDir, { recursive: true });

/** Scrolls in small steps so the reveal transitions are visible on film. */
async function glide(page, distance, { step = 70, pause = 28 } = {}) {
  await page.evaluate(
    async ([distance, step, pause]) => {
      const steps = Math.ceil(distance / step);
      for (let i = 0; i < steps; i += 1) {
        window.scrollBy(0, step);
        await new Promise((resolve) => setTimeout(resolve, pause));
      }
    },
    [distance, step, pause],
  );
}

/**
 * Glides until a section's heading sits near the top of the viewport, pausing
 * on arrival. Continuous scrolling rather than jumping, so every row between
 * here and there is actually on film.
 */
async function glideTo(page, id, { settle = 1400, ...options } = {}) {
  const distance = await page.evaluate((target) => {
    const node = document.getElementById(target);
    return node ? node.getBoundingClientRect().top - 120 : 0;
  }, id);
  if (distance > 0) await glide(page, distance, options);
  await page.waitForTimeout(settle);
}

/**
 * Scrolls a target to a given fraction down the viewport, then moves the real
 * pointer onto it. Playwright's own actionability scroll re-centres the element
 * under the sticky masthead, whose container then intercepts every hover and
 * click; driving the mouse ourselves keeps the position we chose.
 */
async function reach(locator, fraction = 0.42) {
  const page = locator.page();
  await locator.evaluate((node, offset) => {
    const top = node.getBoundingClientRect().top - window.innerHeight * offset;
    window.scrollBy({ top, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(500);
  const box = await locator.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 14 });
}

async function follow(locator, fraction = 0.42) {
  const page = locator.page();
  await reach(locator, fraction);
  await page.waitForTimeout(600);
  await page.mouse.down();
  await page.mouse.up();
}

/** Moves the pointer onto a target where it is currently painted. */
async function point(locator) {
  const page = locator.page();
  const box = await locator.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
}

/**
 * Clicks a target where it is currently painted, without scrolling first. For
 * anything in the sticky masthead: Playwright's actionability scroll centres a
 * sticky element in the viewport, which drags the whole page along with it and
 * makes the film look as though the site jumped.
 */
async function tap(locator) {
  const page = locator.page();
  await point(locator);
  await page.waitForTimeout(400);
  await page.mouse.down();
  await page.mouse.up();
}

/**
 * Takes the scripted scrolling off the page's smooth-scroll animation. With it
 * on, `scrollBy` only queues an animation, so the film lags behind the script
 * and whole sections get cut short when the next step jumps the page. Leave it
 * alone for passes that demonstrate anchor navigation.
 */
async function directScroll(page) {
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important }" });
}

/**
 * Playwright's recorder does not draw the pointer, so hover states look like
 * they fire on their own. Paints a stand-in that follows the real mouse.
 */
async function showCursor(page) {
  await page.addStyleTag({
    content: `#walkthrough-cursor {
      position: fixed; top: 0; left: 0; z-index: 2147483647; pointer-events: none;
      width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%;
      border: 1.5px solid rgb(28 26 23 / 0.55);
      background: rgb(138 93 52 / 0.18);
      transition: opacity 200ms linear; opacity: 0;
    }`,
  });
  await page.evaluate(() => {
    const dot = document.createElement("div");
    dot.id = "walkthrough-cursor";
    document.body.append(dot);
    addEventListener(
      "mousemove",
      (event) => {
        dot.style.opacity = "1";
        dot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      },
      { passive: true },
    );
  });
}

const browser = await chromium.launch();

// Desktop pass.
const desktop = await browser.newContext({
  viewport: { width: 1360, height: 820 },
  recordVideo: { dir: outDir, size: { width: 1360, height: 820 } },
});
const page = await desktop.newPage();

await page.goto(base, { waitUntil: "load" });
await showCursor(page);
await directScroll(page);
await page.waitForTimeout(2200);

// Down into the work section, one project row at a time.
await glideTo(page, "work", { settle: 900 });
await glide(page, 700);
await page.waitForTimeout(900);

// Hover a project title, then its case study link, to show the underline
// growing from the left and the colour warming to bronze.
const row = page.locator("#work article").nth(1);
await reach(row.getByRole("link", { name: "Business Website Clone", exact: true }), 0.28);
await page.waitForTimeout(1900);
await point(row.getByRole("link", { name: /View Live Project/ }));
await page.waitForTimeout(1600);
await page.mouse.move(60, 420, { steps: 8 });
await page.waitForTimeout(400);

// Through the remaining project rows, pausing on each so it can be read, then
// on to About, Skills and Contact. A continuous sweep, so the reveals and the
// marble transitions are all on film.
for (const index of [2, 3, 4]) {
  const next = page.locator("#work article").nth(index);
  const distance = await next.evaluate(
    (node) => node.getBoundingClientRect().top - window.innerHeight * 0.18,
  );
  if (distance > 0) await glide(page, distance, { pause: 26 });
  await page.waitForTimeout(1100);
}
await glideTo(page, "about", { pause: 26, settle: 1800 });
await glide(page, 800, { pause: 26 });
await page.waitForTimeout(1000);
await glideTo(page, "skills", { pause: 26, settle: 1800 });
await glide(page, 1000, { pause: 26 });
await page.waitForTimeout(1500);
await glideTo(page, "contact", { pause: 26, settle: 1900 });
await glide(page, 600, { pause: 26 });
await page.waitForTimeout(1800);

// Into a case study. The injected cursor and scroll override live in the
// document, so they have to be re-applied after every navigation.
await follow(page.getByRole("link", { name: "Build Like a Pro — Minecraft Mob Catalog", exact: true }).first());
await page.waitForURL("**/work/minecraft-mob-catalog");
await showCursor(page);
await directScroll(page);
await page.waitForTimeout(2000);

await glide(page, 2200, { pause: 26 });
await page.waitForTimeout(1300);
await glide(page, 2200, { pause: 26 });
await page.waitForTimeout(1500);

// Onward to the next project, then back to the overview.
await follow(page.getByRole("link", { name: "Business Website Clone", exact: true }).last());
await page.waitForURL("**/work/business-website-clone");
await showCursor(page);
await directScroll(page);
await page.waitForTimeout(2000);
await follow(page.getByRole("link", { name: "All work" }));
await page.waitForTimeout(2200);

await desktop.close();

// Mobile pass: the sheet navigation.
const mobile = await browser.newContext({
  viewport: { width: 414, height: 860 },
  recordVideo: { dir: outDir, size: { width: 414, height: 860 } },
  isMobile: true,
  hasTouch: true,
});
const phone = await mobile.newPage();
await phone.goto(base, { waitUntil: "load" });
await showCursor(phone);
await phone.waitForTimeout(2000);
await glide(phone, 1100, { step: 50, pause: 34 });
await phone.waitForTimeout(1000);

// Open the sheet and dismiss it: the page stays exactly where it was.
await tap(phone.getByRole("button", { name: /open navigation/i }));
await phone.waitForTimeout(1700);
await tap(phone.getByRole("dialog").getByRole("button", { name: /close/i }));
await phone.waitForTimeout(1600);

// Open it again and navigate: the page lands on the section.
await tap(phone.getByRole("button", { name: /open navigation/i }));
await phone.waitForTimeout(1600);
await tap(phone.getByRole("link", { name: "Skills", exact: true }));
await phone.waitForTimeout(2600);
await glide(phone, 1200, { step: 50 });
await phone.waitForTimeout(1500);

await mobile.close();
await browser.close();

console.log(`Videos written to ${outDir}`);
