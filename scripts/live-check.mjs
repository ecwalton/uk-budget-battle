import fs from "node:fs/promises";
import { chromium } from "playwright";
import assert from "node:assert/strict";
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
  const response = await page.goto(base);
  assert.equal(response.status(), 200);
  assert.ok(response.headers()["content-security-policy"]);
  await page.waitForSelector(".box-canvas");
  await page.click("#start-btn");
  for (const ids of [
    ["income", "procurement"],
    ["thresholds"],
    ["compliance"],
    [],
    ["reliefs"],
  ]) {
    for (const id of ids) await page.click(`[data-card="${id}"]`);
    await page.click('[data-action="review"]');
    await page.click('[data-action="commit"]');
  }
  const result = JSON.parse(await page.evaluate(() => render_game_to_text()));
  assert.ok(result.result.passed);
  await page.click('[data-action="share"]');
  const url = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(url.startsWith(base + "/#result="));
  const other = await context.newPage();
  await other.goto(url);
  assert.deepEqual(
    JSON.parse(await other.evaluate(() => render_game_to_text())).result,
    result.result,
  );
  const health = await page.request.get(base + "/api/health");
  assert.equal(health.status(), 200);
  assert.equal((await health.json()).ok, true);
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
          "3D loads",
          "five rounds",
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
