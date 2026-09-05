import test from "node:test";
import assert from "node:assert/strict";
import { budgetStory, newspaperSVG } from "../public/newspaper.js";
import { CONTROLS } from "../public/scenario.js";
const choices = (o = {}) => CONTROLS.map((c) => `${c.id}:${o[c.id] ?? 0}`);
const game = (decisions, sensitivity = "central") => ({
  decisions,
  shock: "calm",
  sensitivity,
});
test("bulletin distinguishes new choices from carried commitments and future capacity", () => {
  const g = game([choices({ health: 1, borrowing: 1 }), choices()]);
  const first = budgetStory(g, 0),
    second = budgetStory(g, 1);
  assert.equal(first.cost, 12);
  assert.match(first.delayed[0], /year 2/);
  assert.equal(second.cost, 0);
  assert.equal(second.revenue, 0);
  assert.match(second.deck, /Previous decisions/);
});
test("bulletin uses actual first-year receipts under cautious delivery", () => {
  const g = game([choices({ business: 1 })], "cautious");
  const story = budgetStory(g, 0);
  assert.equal(story.revenue, 3);
  assert.match(story.deck, /3.0bn/);
});
test("front page retains scenario, assumptions, all five records and exact model quantities", () => {
  const g = game(
    Array.from({ length: 5 }, (_, i) => choices({ income: i < 3 ? 1 : 0 })),
  );
  const svg = newspaperSVG(g);
  assert.match(svg, /45.0bn/);
  assert.match(svg, /225.0bn/);
  assert.match(svg, /NOT AN OFFICIAL FORECAST/);
  assert.match(svg, /before interest/);
  assert.match(svg, /1720/);
  assert.equal((svg.match(/Borrowing allowance/g) || []).length, 5);
});
