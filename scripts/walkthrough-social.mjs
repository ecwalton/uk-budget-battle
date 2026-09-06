import { chromium } from "playwright";
import fs from "node:fs/promises";
import { heroArt } from "../public/reform-art.js";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const css = await fs.readFile("public/walkthrough.css", "utf8");
  await page.setContent(`<html><head><meta charset="utf-8"><style>${css}
body{margin:0;padding:40px 60px}.preview{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:25px;height:515px}h1{font-size:78px;margin:26px 0;letter-spacing:-3px}h1 em{color:#007f72}p{font-size:21px;line-height:1.5}.hero-art{width:440px}.art-centre strong{font-size:25px}.art-caption{bottom:-8%}.preview-logo{font-size:14px;letter-spacing:2px;font-weight:bold}.eyebrow{margin-top:20px}</style></head><body><div class="preview-logo">THE BUDGET BATTLE / YOUR TURN AT THE TREASURY</div><div class="preview"><div><div class="eyebrow">YOU HAVE BEEN APPOINTED CHANCELLOR.</div><h1>The red box<br>is <em>yours.</em></h1><p>Five decisions. One government.<br>What will you choose?</p></div>${heroArt()}</div></body></html>`);
  await page.screenshot({ path: "public/social-card.png" });
} finally {
  await browser.close();
}
