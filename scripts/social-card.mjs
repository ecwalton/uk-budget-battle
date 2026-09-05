import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(
  `<!doctype html><html><body style="margin:0;background:#f7f5ef;color:#232d38;font-family:Arial"><main style="padding:52px 65px;height:526px"><div style="font-size:14px;letter-spacing:3px;color:#852c37;border-bottom:1px solid #dcd9d0;padding-bottom:24px">THE BUDGET BATTLE <span style="float:right;color:#696d6b;font-size:11px">UNITED KINGDOM EDITION</span></div><div style="display:flex;align-items:center;justify-content:space-between;padding-top:44px"><section><h1 style="font:68px/1.06 Georgia;margin:0;letter-spacing:-2px">Everyone wants more.<br><em style="color:#852c37">You do the maths.</em></h1><p style="font-size:20px;color:#696d6b;margin:30px 0">Five Budgets. Five spending envelopes. Your turn at the Treasury.</p><div style="background:#852c37;color:white;display:inline-block;padding:17px 25px;font-size:15px">Take the red box →</div></section><div style="width:220px;height:148px;border-radius:5px;background:#852c37;transform:rotate(-8deg);position:relative;margin-left:40px;text-align:center;color:#e0c389;box-shadow:8px 12px 0 #e7dfd2"><div style="position:absolute;border:7px solid #852c37;width:70px;height:23px;top:-30px;left:68px;border-radius:6px 6px 0 0"></div><div style="padding-top:38px;font:18px/1.8 Georgia;letter-spacing:2px">THE BUDGET<br>YOUR CALL.</div></div></div><p style="font-size:12px;color:#696d6b;margin-top:38px">Independent strategy game · Illustrative training assumptions · No sign-up</p></main></body></html>`,
);
await page.screenshot({ path: "public/social-card.png" });
await browser.close();
