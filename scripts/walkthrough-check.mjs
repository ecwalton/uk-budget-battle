import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.BASE_URL || "http://localhost:8787";
const browser = await chromium.launch({ headless: true });
await fs.mkdir("artifacts/walkthrough", { recursive: true });
try {
  for (const width of [1280, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    assert.ok(response.headers()["content-security-policy"]);
    assert.equal(await page.locator("select,input,canvas").count(), 0);
    assert.equal(
      JSON.parse(await page.evaluate(() => window.render_game_to_text()))
        .migration.net,
      171000,
    );
    await page.screenshot({
      path: `artifacts/walkthrough/intro-${width}.png`,
      fullPage: true,
    });
    assert.match(
      await page.locator("main").innerText(),
      /APPOINTED CHANCELLOR/,
    );
    assert.doesNotMatch(
      await page.locator("main").innerText(),
      /smaller state|Less state/i,
    );
    await page.click("#start-btn");
    for (let i = 1; i <= 5; i++) {
      assert.equal(
        JSON.parse(await page.evaluate(() => window.render_game_to_text()))
          .step,
        i,
      );
      assert.ok(await page.locator('[data-action="next"]').isDisabled());
      if (i < 5) {
        await page.click('[data-policy="0"]');
        assert.equal(await page.locator(".chain li").count(), 3);
      }
      await page.locator(".evidence summary").click();
      assert.ok(
        (await page.locator(".evidence").getAttribute("open")) !== null,
      );
      await page.locator(".evidence summary").click();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      if (i === 5) {
        for (const [id, net] of [
          ["reference", 171000],
          ["balance", 0],
          ["negative", -100000],
          ["deeper", -250000],
        ]) {
          await page.click(`[data-migration="${id}"]`);
          const state = JSON.parse(
            await page.evaluate(() => window.render_game_to_text()),
          );
          assert.equal(state.migration.net, net);
        }
        await page.locator(".migration-choice summary").click();
        await page.selectOption("#unauthorised-baseline", "100000");
        assert.equal(
          JSON.parse(await page.evaluate(() => window.render_game_to_text()))
            .migration.unauthorisedChange,
          -11000,
        );
        await page.locator(".migration-choice summary").click();
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
      }
      if (i === 4 || i === 5)
        await page.screenshot({
          path: `artifacts/walkthrough/step-${i}-${width}.png`,
          fullPage: true,
        });
      await page.click('[data-action="next"]');
    }
    assert.equal(await page.locator(".summary-list>div").count(), 5);
    assert.equal(await page.locator(".fiscal-number").innerText(), "£95.5bn");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.match(await page.locator("h1").innerText(), /smaller state/);
    await page.screenshot({
      path: `artifacts/walkthrough/conclusion-${width}.png`,
      fullPage: true,
    });
    await page.click('[data-action="back"]');
    assert.equal(
      JSON.parse(await page.evaluate(() => window.render_game_to_text())).step,
      5,
    );
    await page.click('[data-action="next"]');
    await page.click('[data-action="restart"]');
    assert.ok(await page.locator("#start-btn").isVisible());
    await page.locator('header [data-action="about"]').click();
    assert.ok(await page.locator("dialog").isVisible());
    assert.equal(await page.locator("dialog a").count(), 4);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").isVisible(), false);
    await page.locator("#start-btn").focus();
    await page.keyboard.press("Enter");
    assert.equal(
      JSON.parse(await page.evaluate(() => window.render_game_to_text())).step,
      1,
    );
    for (let i = 1; i <= 4; i++) {
      await page.click('[data-policy="1"]');
      await page.click('[data-action="next"]');
    }
    await page.click('[data-migration="reference"]');
    await page.click('[data-action="next"]');
    assert.match(
      await page.locator("h1").innerText(),
      /protected the spending/,
    );
    assert.doesNotMatch(await page.locator("h1").innerText(), /smaller state/);
    assert.equal(await page.locator(".fiscal-number").innerText(), "£115.5bn");
    await page.click('[data-action="restart"]');
    await page.click("#start-btn");
    for (const value of [1, 0, 0, 0]) {
      await page.click(`[data-policy="${value}"]`);
      await page.click('[data-action="next"]');
    }
    await page.click('[data-migration="negative"]');
    await page.click('[data-action="next"]');
    assert.match(await page.locator("h1").innerText(), /funding plan/);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(
    "Walkthrough passed: all five steps, summary, back/restart, sources, keyboard, desktop/mobile, no overflow or browser errors.",
  );
} finally {
  await browser.close();
}
