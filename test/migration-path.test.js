import test from "node:test";
import assert from "node:assert/strict";
import { migrationPath } from "../public/migration-path.js";
test("policy paths cross zero and count removals once", () => {
  for (const [id, net] of [
    ["reference", 171000],
    ["balance", 0],
    ["negative", -100000],
    ["deeper", -250000],
  ]) {
    const r = migrationPath(id);
    assert.equal(r.net, net);
    assert.equal(r.arrivals - r.departures, net);
    assert.equal(r.fiveYearNet, net * 5);
    assert.equal(r.unauthorisedChange, 20000 - r.removals);
    assert.ok(r.arrivals >= 0);
  }
  assert.equal(migrationPath("deeper").unauthorisedChange, -91000);
  assert.equal(migrationPath("negative", 100000).unauthorisedChange, 29000);
  assert.throws(() => migrationPath("__proto__"));
  assert.throws(() => migrationPath("negative", Infinity));
});
