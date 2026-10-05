/**
 * Development helper: captures a screenshot of each live project and writes it
 * to public/projects as a 16:10 WebP, matching the aspect ratio the project
 * frame reserves so nothing shifts while the image decodes.
 *
 *   node scripts/capture-projects.mjs
 *
 * Re-run it when a project is redeployed. Not part of the build.
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";

const OUT = new URL("../public/projects/", import.meta.url).pathname;

/** 16:10, so the capture matches the frame without being cropped. */
const VIEWPORT = { width: 1440, height: 900 };

const targets = [
  { slug: "minecraft-mob-catalog", url: "https://dmmiller1214.github.io/Build-like-a-pro/" },
  { slug: "business-website-clone", url: "https://dmmiller1214.github.io/Clone-Website/" },
  { slug: "nft-website-concept", url: "https://dylan-internship.vercel.app/" },
  { slug: "summarist", url: "https://summarist-umber.vercel.app/" },
  { slug: "skinstric", url: "https://skinstric-lime.vercel.app/" },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  // Entrance animations on these sites are keyed to the viewport, so let them
  // run rather than freezing the page mid-reveal.
  reducedMotion: "no-preference",
});

for (const { slug, url } of targets) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
    // Settle: webfonts swapping in, hero media decoding, entrance animations.
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
    await page
      .evaluate(() =>
        Promise.all(
          [...document.images]
            .filter((img) => img.offsetParent !== null || img.offsetWidth)
            .map((img) => (img.complete ? null : img.decode().catch(() => null))),
        ),
      )
      .catch(() => {});
    await page.waitForTimeout(3500);

    const raw = await page.screenshot({ type: "png" });
    await sharp(raw)
      .resize({ width: 1760, height: 1100, fit: "cover", position: "top" })
      .webp({ quality: 82, effort: 6 })
      .toFile(`${OUT}${slug}.webp`);
    console.log(`captured ${slug}`);
  } catch (error) {
    console.error(`FAILED ${slug}: ${error.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
