import test from "node:test";
import assert from "node:assert/strict";
import { migrationImpact, migrationSettings } from "../public/migration.js";
import { simulate, validateGame } from "../public/engine.js";
import { defaultChoices } from "../public/scenario.js";
import { newspaperSVG } from "../public/newspaper.js";
const base = {
  decisions: Array.from({ length: 5 }, defaultChoices),
  shock: "calm",
  sensitivity: "central",
};
test("migration lifetime arithmetic counts workers and adult dependants once", () => {
  const m = migrationImpact({
    migration: "lower",
    dependants: "0.5",
    wages: "historical",
  });
  assert.equal(m.workers, -50000);
  assert.equal(m.adultDependants, -25000);
  assert.equal(m.lifetimeNetCostBn, -3.475);
  assert.equal(m.lowerPaidWagePercent, 0.04);
  assert.equal(m.cashEffectBn, null);
  assert.equal(
    migrationImpact({ migration: "higher", dependants: "0.5" })
      .lifetimeNetCostBn,
    3.475,
  );
  assert.equal(
    migrationImpact({ migration: "lower", dependants: "0" }).lifetimeNetCostBn,
    -1.8,
  );
  assert.equal(migrationImpact({}).lowerPaidWagePercent, null);
});
test("migration is validated and survives serialization without changing Budget cash or score", () => {
  const lower = {
    ...base,
    migration: "lower",
    dependants: "1",
    wages: "historical",
  };
  const a = simulate(base),
    b = simulate(lower);
  assert.deepEqual(a.years, b.years);
  assert.deepEqual(a.budgets, b.budgets);
  assert.equal(a.passed, b.passed);
  assert.deepEqual(
    simulate(JSON.parse(JSON.stringify(validateGame(lower)))),
    b,
  );
  for (const settings of [
    { migration: "__proto__" },
    { dependants: 1 },
    { wages: "guaranteed" },
    { migration: null },
  ])
    assert.throws(() => migrationSettings(settings));
  assert.match(newspaperSVG(lower), /lifetime net cost change £-5.15bn/);
});
