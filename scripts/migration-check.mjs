import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { defaultChoices, SCENARIO } from "../public/scenario.js";
const base = process.env.BASE_URL || "http://localhost:8787";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/explorer.html");
  await page.selectOption("#migration", "lower");
  await page.selectOption("#wages", "historical");
  assert.match(
    await page.locator(".migration-results").innerText(),
    /3.48bn lower/,
  );
  assert.match(
    await page.locator(".migration-results").innerText(),
    /\+0.040%/,
  );
  await fs.mkdir("artifacts/migration", { recursive: true });
  await page
    .locator(".migration-panel")
    .screenshot({ path: "artifacts/migration/desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator(".migration-panel")
    .screenshot({ path: "artifacts/migration/mobile.png" });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.click("#start-btn");
  await page.click('[data-action="funding"]');
  await page.click('[data-action="review"]');
  await page.click('[data-action="commit"]');
  await page.reload();
  await page.click('[data-action="resume"]');
  await page.locator(".migration-summary > summary").click();
  assert.match(
    await page.locator(".migration-panel").innerText(),
    /3.48bn lower/,
  );
  const g = {
    decisions: Array.from({ length: 5 }, defaultChoices),
    shock: "calm",
    sensitivity: "central",
    migration: "lower",
    dependants: "1",
    wages: "historical",
    version: SCENARIO.version,
  };
  await page.goto(
    base +
      "/explorer.html#result=" +
      Buffer.from(JSON.stringify(g)).toString("base64"),
  );
  await page.reload();
  assert.match(
    await page.locator(".migration-panel").innerText(),
    /5.15bn lower/,
  );
  const api = await page.request.post(base + "/api/simulate", { data: g });
  assert.equal(api.status(), 200);
  const data = await api.json();
  assert.equal(data.migration.lifetimeNetCostBn, -5.15);
  assert.equal(data.years[0].primary, 0);
  const invalid = await page.request.post(base + "/api/simulate", {
    data: { ...g, migration: "<script>" },
  });
  assert.equal(invalid.status(), 400);
  const download = page.waitForEvent("download");
  await page.click('[data-action="download"]');
  const file = await download;
  const record = JSON.parse(await fs.readFile(await file.path(), "utf8"));
  assert.equal(record.migration, "lower");
  assert.equal(record.result.migration.lowerPaidWagePercent, 0.04);
  assert.deepEqual(errors, []);
  console.log(
    "Migration controls, mobile layout, resume, share, download and API passed.",
  );
} finally {
  await browser.close();
}
