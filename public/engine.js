import {
  SCENARIO,
  SHOCKS,
  ROUNDS,
  CARDS,
  CONTROLS,
  BORROWING,
  choiceLevel,
} from "./scenario.js";
export function validateGame(input) {
  if (
    !input ||
    typeof input !== "object" ||
    !Array.isArray(input.decisions) ||
    input.decisions.length > 5
  )
    throw new Error("Invalid game");
  if (!Object.hasOwn(SHOCKS, input.shock)) throw new Error("Unknown scenario");
  if (!["central", "cautious"].includes(input.sensitivity))
    throw new Error("Unknown sensitivity");
  input.decisions.forEach((ids, i) => {
    if (
      !Array.isArray(ids) ||
      ids.length !== CONTROLS.length ||
      new Set(ids).size !== ids.length ||
      ids.some((id) => !ROUNDS[i].cards.includes(id)) ||
      CONTROLS.some(
        (c) => ids.filter((id) => id.startsWith(c.id + ":")).length !== 1,
      )
    )
      throw new Error("Invalid policy choices");
  });
  return {
    decisions: input.decisions.map((ids) => [...ids]),
    shock: input.shock,
    sensitivity: input.sensitivity,
  };
}
export function policyCost(c, age, sensitivity = "central") {
  if (age < 0) return 0;
  let cost =
    c.id === "defer"
      ? (c.cost[age] ?? 0)
      : c.cost[Math.min(age, c.cost.length - 1)];
  // Cautious delivery halves eventual net savings, retaining upfront costs.
  if (c.uncertain && cost < 0 && sensitivity === "cautious") cost *= 0.5;
  return cost;
}
export function simulate(input) {
  const game = validateGame(input),
    shock = SHOCKS[game.shock];
  let debt = SCENARIO.startingDebt,
    baseDebt = debt,
    incrementalDebt = 0;
  const years = [];
  for (let y = 0; y < 10; y++) {
    let primary = 0,
      service = 0,
      pressure = [0, 0, 0, 0, 0];
    game.decisions.forEach((ids, start) =>
      ids.forEach((id) => {
        const c = CARDS.find((c) => c.id === id),
          age = y - start;
        primary += policyCost(c, age, game.sensitivity);
        if (
          age >= c.lag &&
          (c.serviceDuration === undefined || age < c.lag + c.serviceDuration)
        ) {
          service += c.service;
          pressure = pressure.map((v, i) => v + c.pressure[i]);
        }
      }),
    );
    if (y >= 2 && y <= 4) pressure = pressure.map((v) => v + shock.pressure);
    const rate = SCENARIO.marginalInterest + (y >= 2 ? shock.rate : 0);
    const interest = incrementalDebt * rate;
    const baseline = SCENARIO.baseline[y] + shock.borrowing[y];
    const delta = primary + interest,
      borrowing = baseline + delta;
    incrementalDebt += delta;
    debt += borrowing;
    baseDebt += baseline;
    const gdp = SCENARIO.startingGDP * (1 + SCENARIO.nominalGrowth) ** (y + 1);
    years.push({
      year: y + 1,
      baseline,
      borrowing,
      primary,
      interest,
      delta,
      debt,
      baseDebt,
      debtRatio: (debt / gdp) * 100,
      baseDebtRatio: (baseDebt / gdp) * 100,
      service,
      pressure,
      shock: shock.borrowing[y],
    });
  }
  const last = years[4],
    legacy = years.slice(5),
    worstPressure = Math.min(...years.flatMap((y) => y.pressure)),
    worstService = Math.min(...years.map((y) => y.service));
  const fiscalPass = -last.primary >= SCENARIO.target,
    servicePass = worstService >= SCENARIO.serviceFloor - 1e-8,
    incomePass = worstPressure >= SCENARIO.pressureFloor - 1e-8;
  const legacyImprovement = -legacy.reduce((s, y) => s + y.primary, 0),
    legacyPass = legacyImprovement >= SCENARIO.target * 5;
  const budgets = game.decisions.map((ids, i) => {
    const allowance = BORROWING.find(
      (b) => b.level === choiceLevel(ids, "borrowing"),
    ).cap;
    const ceiling = Math.max(0, years[i].baseline + allowance);
    return {
      ceiling,
      allowance,
      gap: Math.max(0, years[i].borrowing - ceiling),
      headroom: ceiling - years[i].borrowing,
    };
  });
  const fundingPass = budgets.every((b) => b.gap < 1e-8);
  return {
    years,
    budgets,
    fundingPass,
    annualImprovement: -last.primary || 0,
    totalImprovement: -years.slice(0, 5).reduce((s, y) => s + y.delta, 0),
    legacyImprovement,
    legacyPass,
    worstPressure,
    worstService,
    fiscalPass,
    servicePass,
    incomePass,
    passed:
      fundingPass && fiscalPass && servicePass && incomePass && legacyPass,
  };
}
