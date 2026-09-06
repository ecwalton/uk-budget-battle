import { chromium } from "playwright";
const base = process.env.BASE_URL || "http://localhost:8787";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.route("**/__social__", (r) =>
    r.fulfill({
      contentType: "text/html; charset=utf-8",
      body: `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#f7f5ef;color:#232d38;font-family:Arial}main{padding:45px 58px}header{font-size:13px;letter-spacing:3px;color:#852c37;border-bottom:1px solid #dcd9d0;padding-bottom:24px}header span{float:right;color:#696d6b;font-size:11px}.hero{display:flex;align-items:center;justify-content:space-between;padding-top:25px}section{width:660px;flex-shrink:0}h1{font:64px/1.07 Georgia;margin:0;letter-spacing:-2px}em{color:#852c37}p{font-size:18px;color:#696d6b;margin:25px 0}.cta{background:#852c37;color:white;display:inline-block;padding:16px 23px;font-size:15px}.box-stage{width:400px;height:355px;flex-shrink:0}.box-canvas{width:100%;height:100%}.note{font-size:12px;margin-top:25px}</style></head><body><main><header>THE BUDGET BATTLE <span>UNITED KINGDOM EDITION</span></header><div class="hero"><section><h1>A red box. A country.<br><em>Your call.</em></h1><p>Build five Budgets. Fund your promises.<br>Find out what survives the pressure.</p><div class="cta">Take the red box →</div></section><div class="box-stage"></div></div><p class="note">Independent strategy game · Illustrative training assumptions · No sign-up</p></main><script type="module">import {mountBox} from '/box.bundle.js';mountBox(document.querySelector('.box-stage'),{tableau:true});</script></body></html>`,
    }),
  );
  await page.goto(base + "/__social__");
  await page.waitForSelector(".box-canvas");
  await page.waitForTimeout(250);
  await page.screenshot({ path: "public/social-card.png" });
} finally {
  await browser.close();
}
