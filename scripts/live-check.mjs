import fs from "node:fs/promises";
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { SCENARIO } from "../public/scenario.js";
const base =
  process.env.BASE_URL || "https://uk-budget-battle.openuk-co.workers.dev";
await fs.mkdir("artifacts/live", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const response = await page.goto(base + "/explorer.html");
  assert.equal(response.status(), 200);
  assert.ok(response.headers()["content-security-policy"]);
  await page.waitForSelector(".box-canvas");
  await page.click("#start-btn");
  await page.click('[data-control="health"][data-level="1"]');
  assert.ok(
    (await page.locator("#budget-status").textContent()).includes(
      "£12.0bn still to fund",
    ),
  );
  await page.click('[data-action="funding"]');
  assert.ok(await page.locator('[data-action="review"]').isDisabled());
  await page.click('[data-action="spending"]');
  await page.click('[data-control="health"][data-level="0"]');
  for (let round = 1; round <= 5; round++) {
    await page.click('[data-action="funding"]');
    if (round <= 3) await page.click('[data-control="income"][data-level="1"]');
    await page.click('[data-action="review"]');
    await page.click('[data-action="commit"]');
    assert.ok(await page.locator("#edition-heading").isVisible());
    if (round === 1)
      await page.waitForSelector('.box-canvas[data-animation="complete"]');
    await page.click('[data-action="continue"]');
  }
  const result = JSON.parse(await page.evaluate(() => render_game_to_text()));
  assert.ok(result.result.passed);
  const newspaperDownload = page.waitForEvent("download");
  await page.click('[data-action="newspaper"]');
  const newspaper = await newspaperDownload;
  await newspaper.saveAs("artifacts/live/live-front-page.png");
  const png = await fs.readFile(await newspaper.path());
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 1720);
  for (const path of [
    "/assets/red-box.glb",
    "/assets/health.png",
    "/assets/welfare.png",
    "/assets/defence.png",
    "/assets/investment.png",
    "/assets/other.png",
    "/assets/launch-trailer.mp4",
  ])
    assert.equal((await page.request.get(base + path)).status(), 200);
  await page.click('[data-action="share"]');
  const url = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(url.startsWith(base + "/explorer.html#result="));
  const other = await context.newPage();
  await other.goto(url);
  assert.deepEqual(
    JSON.parse(await other.evaluate(() => render_game_to_text())).result,
    result.result,
  );
  const health = await page.request.get(base + "/api/health");
  assert.equal(health.status(), 200);
  assert.deepEqual(await health.json(), {
    ok: true,
    version: SCENARIO.version,
  });
  assert.equal(
    (await page.request.get(base + "/social-card.png")).status(),
    200,
  );
  assert.equal((await page.request.get(base + "/not-a-page")).status(), 404);
  await page.screenshot({
    path: "artifacts/live/live-winning-result.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      {
        live: base,
        passed: true,
        checks: [
          "HTTPS",
          "security headers",
          "Blender model and completed opening animation",
          "all public visual assets",
          "newspaper PNG download",
          "five rounds",
          "unfunded Budget blocked",
          "funding announcement",
          "deployed model version",
          "winning result",
          "actual clipboard share",
          "shared result parity",
          "health endpoint",
          "social preview",
          "404",
        ],
        errors,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
