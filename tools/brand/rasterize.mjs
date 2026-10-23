// Renders the generated SVGs to PNG app icons and the Open Graph base image.
// Usage: node tools/brand/rasterize.mjs   (after build_wordmark.py; uses the web app's Playwright)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const { chromium } = createRequire(`${root}apps/web/package.json`)("@playwright/test");
const read = (path) => readFileSync(`${root}${path}`, "utf8");

const jobs = [
  {
    src: "tools/brand/out/icon-square.svg",
    out: "apps/web/src/app/apple-icon.png",
    w: 180,
    h: 180,
  },
  {
    src: "tools/brand/out/icon-square.svg",
    out: "apps/web/public/icons/icon-192.png",
    w: 192,
    h: 192,
  },
  {
    src: "tools/brand/out/icon-square.svg",
    out: "apps/web/public/icons/icon-512.png",
    w: 512,
    h: 512,
  },
  {
    src: "tools/brand/out/og.svg",
    out: "apps/web/src/app/opengraph-image.png",
    w: 1200,
    h: 630,
  },
];

const browser = await chromium.launch();
for (const job of jobs) {
  const page = await browser.newPage({ viewport: { width: job.w, height: job.h } });
  const svg = read(job.src).replace("<svg ", `<svg width="${job.w}" height="${job.h}" `);
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: `${root}${job.out}`, omitBackground: false });
  await page.close();
  console.log("wrote", job.out);
}
await browser.close();
