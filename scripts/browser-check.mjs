import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.BASE_URL || "http://localhost:8787";
await fs.mkdir("artifacts/browser", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1080 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(base + "/");
  await page.waitForSelector(".box-canvas");
  await page.waitForTimeout(400);
  await page.setViewportSize({ width: 1400, height: 1000 });
  await page.setViewportSize({ width: 1440, height: 1080 });
  assert.equal(await page.locator(".box-canvas").count(), 1);
  await page.screenshot({
    path: "artifacts/browser/intro-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "How the numbers work" }).click();
  assert.ok(await page.locator("dialog").isVisible());
  await page.keyboard.press("Escape");
  await page.click('[data-shock="energy"]');
  await page.click("#start-btn");
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".envelope-icon")].length === 5 &&
      [...document.querySelectorAll(".envelope-icon")].every(
        (i) => i.complete && i.naturalWidth === 256,
      ),
  );
  const set = async (p, id, value) =>
    p.click(`[data-control="${id}"][data-level="${value}"]`);
  for (const id of ["health", "welfare", "defence", "investment", "other"])
    await set(page, id, 1);
  await page.screenshot({
    path: "artifacts/browser/spending-desktop.png",
    fullPage: true,
  });
  await page.click('[data-action="funding"]');
  await set(page, "borrowing", 1);
  assert.ok(await page.locator('[data-action="review"]').isDisabled());
  assert.ok(
    (await page.locator(".funding-bridge").innerText()).includes(
      "£29.0bn still to fund",
    ),
  );
  await page.screenshot({
    path: "artifacts/browser/funding-desktop.png",
    fullPage: true,
  });
  await page.click('[data-action="spending"]');
  await page.click('[data-action="clear"]');
  await page.click('[data-action="funding"]');
  await set(page, "income", 1);
  await page.click('[data-action="review"]');
  await page.click('[data-action="close"]');
  assert.equal(
    JSON.parse(await page.evaluate(() => render_game_to_text())).decisions
      .length,
    0,
  );
  await page.click('[data-action="review"]');
  await page.click('[data-action="commit"]');
  assert.ok(await page.locator("#edition-heading").isVisible());
  await page.waitForSelector('.box-canvas[data-animation="complete"]');
  await page.screenshot({
    path: "artifacts/browser/budget-bulletin-desktop.png",
    fullPage: true,
  });
  await page.click('[data-action="continue"]');
  await page.reload();
  await page.click('[data-action="resume"]');
  assert.equal(
    JSON.parse(await page.evaluate(() => render_game_to_text())).round,
    2,
  );
  await page.selectOption("#sensitivity", "cautious");
  for (let round = 2; round <= 5; round++) {
    if (round === 3) assert.ok(await page.locator(".shock-banner").isVisible());
    await page.click('[data-action="funding"]');
    if (round <= 3) await set(page, "income", 1);
    await page.click('[data-action="review"]');
    await page.click('[data-action="commit"]');
    assert.ok(await page.locator("#edition-heading").isVisible());
    await page.waitForSelector('.box-canvas[data-animation="complete"]');
    await page.screenshot({
      path: "artifacts/browser/budget-bulletin-desktop.png",
      fullPage: true,
    });
    await page.click('[data-action="continue"]');
  }
  assert.equal(
    JSON.parse(await page.evaluate(() => render_game_to_text())).mode,
    "results",
  );
  await page.screenshot({
    path: "artifacts/browser/results-desktop.png",
    fullPage: true,
  });
  const newspaperDownload = page.waitForEvent("download");
  await page.click('[data-action="newspaper"]');
  const newspaper = await newspaperDownload;
  await newspaper.saveAs("artifacts/browser/my-front-page.png");
  const png = await fs.readFile(await newspaper.path());
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 1720);
  const downloadPromise = page.waitForEvent("download");
  await page.click('[data-action="download"]');
  const download = await downloadPromise;
  const record = JSON.parse(await fs.readFile(await download.path(), "utf8"));
  assert.equal(record.decisions.length, 5);
  assert.equal(record.result.years.length, 10);
  const api = await page.request.post(base + "/api/simulate", {
    data: {
      decisions: record.decisions,
      shock: record.shock,
      sensitivity: record.sensitivity,
    },
  });
  assert.equal(api.status(), 200);
  const apiResult = await api.json();
  assert.deepEqual(apiResult.years, record.result.years);
  assert.equal(
    (
      await page.request.post(base + "/api/simulate", {
        data: { decisions: [["vat"]], shock: "calm", sensitivity: "central" },
      })
    ).status(),
    400,
  );
  assert.equal(
    (
      await page.request.post(base + "/api/simulate", {
        headers: { "Content-Type": "application/json" },
        data: "x".repeat(5000),
      })
    ).status(),
    413,
  );
  assert.equal((await page.request.get(base + "/api/simulate")).status(), 405);
  assert.equal((await page.request.get(base + "/api/nope")).status(), 404);
  const shareData = {
    decisions: record.decisions,
    shock: record.shock,
    sensitivity: record.sensitivity,
    version: record.version,
  };
  const shared = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await shared.goto(
    base +
      "/explorer.html#result=" +
      Buffer.from(JSON.stringify(shareData)).toString("base64"),
  );
  assert.equal(
    JSON.parse(await shared.evaluate(() => render_game_to_text())).mode,
    "results",
  );
  assert.equal(
    await shared.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await shared.screenshot({
    path: "artifacts/browser/results-mobile.png",
    fullPage: true,
  });
  await shared.click('[data-action="restart"]');
  await shared.click('[data-action="reset"]');
  await shared.waitForTimeout(300);
  await shared.screenshot({
    path: "artifacts/browser/intro-mobile.png",
    fullPage: true,
  });
  await shared.click("#start-btn");
  await set(shared, "health", 1);
  await shared.screenshot({
    path: "artifacts/browser/budget-mobile.png",
    fullPage: true,
  });
  assert.equal(
    await shared.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await shared.click('[data-action="funding"]');
  await shared.screenshot({
    path: "artifacts/browser/funding-mobile.png",
    fullPage: true,
  });
  assert.equal(
    await shared.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await set(shared, "income", 1);
  await shared.click('[data-action="review"]');
  await shared.click('[data-action="commit"]');
  await shared.waitForSelector('.box-canvas[data-animation="complete"]');
  await shared.screenshot({
    path: "artifacts/browser/budget-bulletin-mobile.png",
    fullPage: true,
  });
  assert.equal(
    await shared.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await shared.click('[data-action="continue"]');
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto(base + "/");
  await reduced.waitForTimeout(200);
  assert.equal(await reduced.locator(".box-canvas").count(), 0);
  await reduced.click("#start-btn");
  // Keyboard: native buttons and review dialog must remain usable.
  await reduced.click('[data-action="funding"]');
  await reduced.locator('[data-action="review"]').focus();
  await reduced.keyboard.press("Enter");
  assert.ok(await reduced.locator("dialog").isVisible());
  await reduced.keyboard.press("Escape");
  await reduced.locator('[data-action="review"]').click();
  await reduced.click('[data-action="commit"]');
  assert.ok(await reduced.locator("#edition-heading").isVisible());
  assert.equal(await reduced.locator(".box-canvas").count(), 0);
  await reduced.click('[data-action="continue"]');
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      {
        passed: true,
        checks: [
          "Blender model and complete lid animation",
          "Budget Bulletin desktop/mobile",
          "newspaper PNG export",
          "methodology modal",
          "size controls and reset",
          "unfunded settlement blocked",
          "intro resize",
          "confirm and resume",
          "all five rounds",
          "shock reveal",
          "sensitivity",
          "desktop/mobile layout",
          "download",
          "shared result",
          "API parity",
          "input bounds",
          "reduced motion",
          "keyboard",
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
