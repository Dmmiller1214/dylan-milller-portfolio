/**
 * Development helper: runs axe-core over every route at three viewport widths
 * and reports WCAG 2 A/AA violations. Not part of the build.
 *
 *   node scripts/audit.mjs [baseUrl]
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:43127";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 900 },
];

const PATHS = ["/", "/work/minecraft-mob-catalog", "/no-such-page"];

const browser = await chromium.launch();
let total = 0;

for (const viewport of VIEWPORTS) {
  for (const path of PATHS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20_000);
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForTimeout(500);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();

    const label = `${path} @ ${viewport.name}`;
    if (violations.length === 0) {
      console.log(`PASS  ${label}`);
    } else {
      total += violations.length;
      console.log(`FAIL  ${label}`);
      for (const violation of violations) {
        console.log(`  [${violation.impact}] ${violation.id} — ${violation.help}`);
        for (const node of violation.nodes.slice(0, 3)) {
          console.log(`      ${node.target.join(" ")}`);
          if (node.failureSummary) {
            console.log(
              `      ${node.failureSummary.replace(/\n/g, "\n      ")}`,
            );
          }
        }
      }
    }

    await context.close();
  }
}

// Keyboard reachability of the mobile navigation, which axe cannot exercise.
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
await page.goto(base, { waitUntil: "load" });
await page.getByRole("button", { name: /open navigation/i }).click();
// Wait for the dialog rather than a fixed delay: the sheet animates in, and a
// short sleep reported a working menu as broken.
const dialog = page.getByRole("dialog");
const dialogVisible = await dialog
  .waitFor({ state: "visible", timeout: 5000 })
  .then(() => true)
  .catch(() => false);
await page.getByRole("link", { name: "Skills", exact: true }).click();
await dialog.waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
// The smooth scroll to the section has to finish before position and focus mean
// anything.
await page.waitForFunction(
  () => {
    const y = Math.round(window.scrollY);
    window.__still = y === window.__y ? (window.__still ?? 0) + 1 : 0;
    window.__y = y;
    return window.__still > 3;
  },
  undefined,
  { polling: 120, timeout: 8000 },
);
const dialogClosed = !(await dialog.isVisible().catch(() => false));
const landedOnSkills = await page.evaluate(() => {
  const section = document.getElementById("skills");
  if (!section) return false;
  const top = section.getBoundingClientRect().top;
  return top > -40 && top < window.innerHeight * 0.5;
});
const focusInSkills = await page.evaluate(
  () => document.getElementById("skills")?.contains(document.activeElement) ?? false,
);
console.log(
  `\nMobile nav: opens=${dialogVisible} closesOnNavigate=${dialogClosed} landedOnSkills=${landedOnSkills} focusMovedToSection=${focusInSkills}`,
);

// Escape should also close it.
await page.getByRole("button", { name: /open navigation/i }).click();
await page.waitForTimeout(300);
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
console.log(
  `Mobile nav: closesOnEscape=${!(await page
    .getByRole("dialog")
    .isVisible()
    .catch(() => false))}`,
);

await browser.close();
console.log(`\n${total === 0 ? "No violations." : `${total} violation(s).`}`);
process.exitCode = total === 0 ? 0 : 1;
