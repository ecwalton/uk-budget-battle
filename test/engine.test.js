import test from "node:test";
import assert from "node:assert/strict";
import { simulate, policyCost, validateGame } from "../public/engine.js";
import { CARDS, CONTROLS, defaultChoices } from "../public/scenario.js";
const choices = (overrides = {}) =>
  CONTROLS.map((c) => `${c.id}:${overrides[c.id] ?? 0}`);
const game = (decisions = [], shock = "calm", sensitivity = "central") => ({
  decisions,
  shock,
  sensitivity,
});
for (const shock of ["calm", "energy", "rates"])
  test(`hold preserves baseline: ${shock}`, () => {
    const r = simulate(game(Array.from({ length: 5 }, defaultChoices), shock));
    assert.equal(r.annualImprovement, 0);
    assert.ok(r.fundingPass);
    for (const y of r.years) {
      assert.equal(y.delta, 0);
      assert.equal(y.debt, y.baseDebt);
    }
  });
test("requires exactly one valid size per control", () => {
  for (const bad of [
    null,
    game([[]]),
    game([["health"]]),
    game([[...defaultChoices().slice(1), "health:2"]]),
    game([[...defaultChoices().slice(1), "welfare:1"]]),
    game(Array(6).fill(defaultChoices())),
    game([], "__proto__"),
    game([], "calm", "bad"),
  ])
    assert.throws(() => validateGame(bad));
});
test("grow stacks, hold persists, squeeze reverses health funding after lag", () => {
  const r = simulate(
    game([
      choices({ health: 1, borrowing: 1 }),
      choices({ health: 1, borrowing: 1 }),
      choices(),
      choices({ health: -1 }),
    ]),
  );
  assert.deepEqual(
    r.years.slice(0, 5).map((y) => y.primary),
    [12, 24, 24, 12, 12],
  );
  assert.deepEqual(
    r.years.slice(0, 5).map((y) => y.service),
    [0, 1.4, 2.8, 2.8, 1.4],
  );
  assert.equal(r.years[9].primary, 12);
  assert.equal(r.years[1].interest, 0.36);
});
test("all grow cannot fit even maximum borrowing allowance", () => {
  const r = simulate(
    game([
      choices({
        health: 1,
        welfare: 1,
        defence: 1,
        investment: 1,
        other: 1,
        borrowing: 1,
      }),
    ]),
  );
  assert.equal(r.years[0].primary, 59);
  assert.equal(r.budgets[0].gap, 29);
  assert.equal(r.fundingPass, false);
});
test("funding requires spending plus interest; borrowing allowance is never revenue", () => {
  const a = simulate(game([choices({ health: 1, borrowing: 1 })]));
  const b = simulate(game([choices({ health: 1 })]));
  assert.deepEqual(a.years, b.years);
  assert.equal(a.budgets[0].ceiling, 160);
  assert.equal(b.budgets[0].gap, 12);
  const c = simulate(
    game([
      choices({ health: 1, borrowing: 1 }),
      choices({ income: 1, borrowing: -1 }),
    ]),
  );
  assert.equal(c.budgets[1].gap, 17.36);
});
test("welfare ramps and business revenue uncertainty preserves tax-cut cost", () => {
  const r = simulate(game([choices({ welfare: 1, business: 1 })]));
  assert.equal(r.years[0].primary, 2);
  assert.equal(r.years[1].primary, 4);
  assert.equal(
    policyCost(
      CARDS.find((c) => c.id === "business:1"),
      1,
      "cautious",
    ),
    -6,
  );
  assert.equal(
    policyCost(
      CARDS.find((c) => c.id === "business:-1"),
      1,
      "cautious",
    ),
    12,
  );
});
test("investment cut catch-up is a one-year bill; growth maintenance persists", () => {
  const cut = simulate(
    game([
      choices(),
      choices(),
      choices(),
      choices(),
      choices({ investment: -1 }),
    ]),
  );
  assert.equal(cut.years[4].primary, -15);
  assert.equal(cut.years[7].primary, -9);
  assert.equal(cut.years[8].primary, -15);
  assert.equal(cut.years[5].service, 0);
  assert.equal(cut.years[6].service, -1.2);
  const grow = simulate(game([choices({ investment: 1, borrowing: 1 })]));
  assert.equal(grow.years[2].primary, 15);
  assert.equal(grow.years[3].primary, 18);
  assert.equal(grow.years[9].primary, 18);
});
test("capacity and household safeguards can each bind", () => {
  const r = simulate(
    game(
      Array.from({ length: 5 }, () =>
        choices({ health: -1, welfare: -1, other: -1 }),
      ),
    ),
  );
  assert.equal(r.servicePass, false);
  assert.equal(r.incomePass, false);
  assert.ok(r.worstService < -5);
  assert.ok(r.worstPressure < -5);
  assert.ok(r.years[1].pressure[0] < 0);
});
test("both a tax route and a tax-free spending route can meet all safeguards", () => {
  const tax = simulate(
    game(
      Array.from({ length: 5 }, (_, i) => choices({ income: i < 3 ? 1 : 0 })),
    ),
  );
  const spending = simulate(
    game([
      choices({ other: -1 }),
      choices({ defence: -1 }),
      choices({ investment: -1 }),
      choices({ defence: -1 }),
      choices(),
    ]),
  );
  assert.ok(tax.passed);
  assert.ok(spending.passed);
});
test("higher rates do not improve fiscal or legacy scores", () => {
  const decisions = Array.from({ length: 5 }, (_, i) =>
    choices({ income: i < 3 ? 1 : 0 }),
  );
  const calm = simulate(game(decisions)),
    rates = simulate(game(decisions, "rates"));
  assert.equal(calm.annualImprovement, rates.annualImprovement);
  assert.equal(calm.legacyImprovement, rates.legacyImprovement);
  assert.notEqual(calm.years[4].interest, rates.years[4].interest);
  assert.equal(rates.years[2].baseline - calm.years[2].baseline, 2);
});
test("energy shock tightens household safeguard even with matched borrowing comparator", () => {
  const decisions = Array.from({ length: 5 }, (_, i) =>
    choices({ welfare: i < 4 ? -1 : 0, health: i === 0 ? -1 : 0 }),
  );
  const calm = simulate(game(decisions)),
    energy = simulate(game(decisions, "energy"));
  assert.ok(calm.incomePass);
  assert.equal(energy.incomePass, false);
  assert.equal(energy.years[2].baseline - calm.years[2].baseline, 12);
});
test("a funded year-five pass can still fail legacy on later commitments", () => {
  const rows = [
    [0, -1, -1, 1, -1, 0, 0, 0, 1],
    [-1, -1, 1, 1, -1, 1, -1, -1, -1],
    [1, 1, 0, -1, 1, 0, 1, -1, 1],
    [-1, 1, -1, -1, 1, 1, -1, 1, -1],
    [-1, 1, -1, 0, 1, 1, 0, 0, 1],
  ];
  const r = simulate(
    game(rows.map((row) => CONTROLS.map((c, i) => `${c.id}:${row[i]}`))),
  );
  assert.ok(r.fundingPass && r.fiscalPass && r.servicePass && r.incomePass);
  assert.equal(r.annualImprovement, 40);
  assert.equal(r.legacyImprovement, 148);
  assert.equal(r.legacyPass, false);
  assert.equal(r.passed, false);
});
test("seeded multi-year plans reconcile debt across all shocks and sensitivities", () => {
  let seed = 202609;
  const random = () => (seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32;
  for (let i = 0; i < 3000; i++) {
    const decisions = Array.from({ length: 5 }, () =>
      CONTROLS.map((c) => `${c.id}:${Math.floor(random() * 3) - 1}`),
    );
    const r = simulate(
      game(
        decisions,
        ["calm", "energy", "rates"][i % 3],
        i % 2 ? "central" : "cautious",
      ),
    );
    let extra = 0;
    for (const y of r.years) {
      extra += y.delta;
      assert.ok(Number.isFinite(y.borrowing));
      assert.ok(Math.abs(y.debt - y.baseDebt - extra) < 1e-7);
      assert.ok(
        Math.abs(y.borrowing - y.baseline - y.primary - y.interest) < 1e-8,
      );
    }
  }
});
