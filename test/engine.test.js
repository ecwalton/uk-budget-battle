import test from "node:test";
import assert from "node:assert/strict";
import { simulate, policyCost, validateGame } from "../public/engine.js";
import { CARDS, ROUNDS, SCENARIO } from "../public/scenario.js";
const game = (decisions = [], shock = "calm", sensitivity = "central") => ({
  decisions,
  shock,
  sensitivity,
});
for (const shock of ["calm", "energy", "rates"])
  test(`unchanged plans have zero incremental effect under ${shock}`, () => {
    const result = simulate(game([[], [], [], [], []], shock));
    assert.ok(result.annualImprovement === 0);
    assert.ok(result.totalImprovement === 0);
    for (const year of result.years) {
      assert.equal(year.delta, 0);
      assert.equal(year.debt, year.baseDebt);
    }
  });
test("reject early, duplicate and malformed policy choices", () => {
  for (const invalid of [
    game([["vat"]]),
    game([["health", "health"]]),
    game([["not-real"]]),
    game([[], [], [], [], [], []]),
    game([], "__proto__"),
    game([["health"]], "calm", "bad"),
    null,
  ])
    assert.throws(() => validateGame(invalid));
});
test("recurring health cost persists and capacity starts after the lag", () => {
  const r = simulate(game([["health"]]));
  assert.equal(r.years[0].primary, 6);
  assert.equal(r.years[9].primary, 6);
  assert.equal(r.years[0].service, 0);
  assert.equal(r.years[1].service, 3);
  assert.ok(Math.abs(r.years[1].interest - 0.18) < 1e-9);
});
test("land proceeds occur once, then lost income follows", () => {
  const r = simulate(game([[], [], [], ["land"]]));
  assert.equal(r.years[3].primary, -3);
  assert.equal(r.years[4].primary, 0.15);
  assert.equal(r.years[9].primary, 0.15);
});
test("final year deferral reappears in legacy and capacity recovers", () => {
  const r = simulate(game([[], [], [], [], ["defer"]]));
  assert.equal(r.years[4].primary, -3);
  assert.equal(r.years[7].primary, 5);
  assert.equal(r.years[8].primary, 0);
  assert.equal(r.years[5].service, -2);
  assert.equal(r.years[7].service, 0);
  assert.ok(r.legacyImprovement < 0);
});
test("cautious reform delivery preserves upfront costs and halves net savings", () => {
  const c = CARDS.find((c) => c.id === "procurement");
  assert.equal(policyCost(c, 0, "cautious"), 1);
  assert.equal(policyCost(c, 3, "cautious"), -1);
});
test("shocks use same comparator without full-stock repricing", () => {
  const r = simulate(game([["health"]], "rates")),
    calm = simulate(game([["health"]]));
  assert.equal(r.years[2].baseline - calm.years[2].baseline, 2);
  assert.ok(r.years[2].interest < 1);
});
test("all 32768 card combinations have finite, reconciled ledgers", () => {
  for (let mask = 0; mask < 1 << 15; mask++) {
    const decisions = ROUNDS.map((r, i) =>
      r.cards.filter((id, j) => mask & (1 << (i * 3 + j))),
    );
    const r = simulate(game(decisions));
    let extra = 0;
    for (const y of r.years) {
      extra += y.delta;
      assert.ok(Number.isFinite(y.borrowing));
      assert.ok(Math.abs(y.debt - y.baseDebt - extra) < 1e-7);
    }
  }
});
test("a feasible package can meet disclosed safeguards", () => {
  const r = simulate(
    game([
      ["income", "procurement"],
      ["thresholds"],
      ["compliance"],
      [],
      ["reliefs"],
    ]),
  );
  assert.ok(r.passed);
  assert.ok(r.annualImprovement >= SCENARIO.target);
});
test("legacy fiscal safeguard requires £75bn cumulative improvement after the term", () => {
  const r = simulate(game([[], [], [], [], ["defer"]]));
  assert.equal(r.legacyPass, false);
  for (let mask = 0; mask < 1 << 15; mask += 31) {
    const decisions = ROUNDS.map((r, i) =>
      r.cards.filter((id, j) => mask & (1 << (i * 3 + j))),
    );
    const result = simulate(game(decisions));
    if (result.passed) assert.ok(result.legacyImprovement >= 75);
  }
});
