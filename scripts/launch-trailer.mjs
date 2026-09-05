import { chromium } from "playwright";
import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
const base = process.env.BASE_URL || "http://localhost:8787";
await fs.mkdir("artifacts/trailer", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: "artifacts/trailer", size: { width: 1280, height: 720 } },
});
let page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.route("**/__trailer__", (route) =>
  route.fulfill({
    contentType: "text/html",
    body: `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;background:#f7f4eb;color:#25323c;font-family:Georgia,serif}main{padding:42px 64px}.brand{font:13px Arial;letter-spacing:3px;border-bottom:1px solid #bbb1a1;padding-bottom:22px;color:#852c37}.scene{display:none;height:515px;padding-top:40px}.scene.active{display:flex;align-items:center;gap:40px}.copy{flex:1}h1{font-size:67px;line-height:1.06;font-weight:normal;letter-spacing:-2px;margin:0 0 26px}em{color:#852c37}p{font-size:22px;line-height:1.5}.box-stage{width:465px;height:390px}.box-canvas{width:100%;height:100%}.kicker{font:13px Arial;letter-spacing:3px;color:#852c37;margin-bottom:23px}.icons{display:flex;justify-content:space-between}.icons div{text-align:center;font:15px Arial;width:180px}.icons img{width:140px;height:140px;object-fit:contain}.ledger{background:#eae4d8;padding:28px;width:390px;font:19px/2 Arial}.ledger div{display:flex;justify-content:space-between}.total{border-top:1px solid #aaa;font-weight:bold;margin-top:12px;padding-top:12px}.number{font-size:100px;color:#852c37;letter-spacing:-4px}.button{background:#852c37;color:#fff;display:inline-block;padding:18px 27px;font:19px Arial}footer{font:12px Arial;position:absolute;bottom:35px;left:64px;color:#777}.wide{width:100%}
</style></head><body><main><div class="brand">THE BUDGET BATTLE <span style="float:right">UNITED KINGDOM EDITION</span></div>
<section class="scene active" id="s0"><div class="copy"><div class="kicker">THE RED BOX IS YOURS</div><h1>Everyone wants more.<br><em>You do the maths.</em></h1><p>Five Budgets. Ten years of consequences.</p></div><div class="box-stage"></div></section>
<section class="scene" id="s1"><div class="wide"><div class="kicker">CHOOSE HOW MUCH</div><h1>Five envelopes.<br><em>One settlement.</em></h1><div class="icons">${[
      ["health", "Health & care"],
      ["welfare", "Welfare & pensions"],
      ["defence", "Defence"],
      ["investment", "Investment"],
      ["other", "Everything else"],
    ]
      .map(([id, label]) => `<div><img src="/assets/${id}.png">${label}</div>`)
      .join("")}</div></div></section>
<section class="scene" id="s2"><div class="copy"><div class="kicker">THEN MAKE THE NUMBERS WORK</div><h1>Every pound needs<br><em>a source.</em></h1><p>Set taxes. Choose your borrowing ceiling.<br>Fund the settlement before confirming.</p></div><div class="ledger"><div>Existing borrowing <b>£130bn</b></div><div>Extra spending <b>+£59bn</b></div><div>Extra tax receipts <b>−£36bn</b></div><div class="total">Actual borrowing <b>£153bn</b></div><div>Your ceiling <b>£160bn</b></div><small>Illustrative first-year package</small></div></section>
<section class="scene" id="s3"><div class="copy"><div class="kicker">WHAT WILL YOUR SUCCESSOR INHERIT?</div><h1>Your choices.<br><em>Your legacy.</em></h1><p>See the consequences.<br>Share your own newspaper front page.</p><div class="button">Take the red box →</div><p style="font:17px Arial;margin-top:30px">uk-budget-battle.openuk-co.workers.dev</p></div><div style="width:350px;border:3px double #25323c;padding:30px;transform:rotate(5deg)"><div style="font:30px Georgia;border-bottom:2px solid;padding-bottom:12px">The Budget Bulletin</div><h2 style="font:40px Georgia">Your term,<br>in print.</h2><div style="height:90px;border-block:1px solid #bbb;margin-top:35px;background:repeating-linear-gradient(transparent 0 12px,#d7cfbf 12px 13px)"></div><p style="font:14px Arial">Five Budgets. One record.</p></div></section>
</main><footer>Independent strategy game · Illustrative training assumptions · No sign-up</footer><script type="module">import {mountBox} from '/box.bundle.js';window.startBox=()=>mountBox(document.querySelector('.box-stage'),{open:true});</script></body></html>`,
  }),
);
await page.goto(base + "/__trailer__");
await page.waitForFunction(() => typeof window.startBox === "function");
await page.evaluate(() =>
  Promise.all([...document.images].map((i) => i.decode())),
);
await page.evaluate(() => window.startBox());
await page.waitForSelector(".box-canvas");
await page.waitForTimeout(3000);
const video = page.video(),
  studio = await page.content();
await context.close();
const input = await video.path();
page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => errors.push(e.message));
await page.route("**/__trailer__", (route) =>
  route.fulfill({ contentType: "text/html; charset=utf-8", body: studio }),
);
await page.goto(base + "/__trailer__");
await page.evaluate(() =>
  Promise.all([...document.images].map((i) => i.decode())),
);
for (let i = 1; i <= 3; i++) {
  await page.evaluate((i) => {
    document.querySelector(".scene.active").classList.remove("active");
    document.getElementById("s" + i).classList.add("active");
  }, i);
  await page.screenshot({ path: `artifacts/trailer/scene-${i}.png` });
}
await browser.close();
if (errors.length) throw Error(errors.join("\n"));
const encode = [
  "-an",
  "-r",
  "25",
  "-c:v",
  "libx264",
  "-crf",
  "21",
  "-pix_fmt",
  "yuv420p",
];
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-sseof",
    "-3",
    "-i",
    input,
    "-t",
    "3",
    ...encode,
    "artifacts/trailer/clip-0.mp4",
  ],
  { stdio: "ignore" },
);
for (let i = 1; i <= 3; i++)
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loop",
      "1",
      "-i",
      `artifacts/trailer/scene-${i}.png`,
      "-t",
      "3",
      ...encode,
      `artifacts/trailer/clip-${i}.mp4`,
    ],
    { stdio: "ignore" },
  );
execFileSync(
  "ffmpeg",
  [
    "-y",
    ...Array.from({ length: 4 }, (_, i) => [
      "-i",
      `artifacts/trailer/clip-${i}.mp4`,
    ]).flat(),
    "-filter_complex",
    "[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0[out]",
    "-map",
    "[out]",
    ...encode,
    "-movflags",
    "+faststart",
    "public/assets/launch-trailer.mp4",
  ],
  { stdio: "ignore" },
);
console.log("Created four-scene public/assets/launch-trailer.mp4");
