// Training assumptions, deliberately independent of any claimed official costing.
export const SCENARIO = {
  version: "envelopes-2026.09-v3",
  title: "The first five Budgets",
  baseline: [130, 118, 105, 93, 80, 76, 72, 68, 64, 60],
  startingDebt: 2850,
  startingGDP: 3000,
  nominalGrowth: 0.04,
  marginalInterest: 0.03, // Applied to last year's incremental debt, not the full stock.
  target: 40,
  serviceFloor: -5,
  termTarget: 100,
  pressureFloors: [-4, -4, -5, -5, -5],
  disclaimer:
    "Training scenario. All policy costs, baseline paths and outcome points are illustrative, not OBR forecasts or official policy costings.",
  sources: [
    [
      "OBR economic and fiscal outlook",
      "https://obr.uk/efo/economic-and-fiscal-outlook-march-2026/",
      "Fiscal context; not the numerical baseline used in this game.",
    ],
    [
      "HMRC tax ready reckoner",
      "https://www.gov.uk/government/statistics/direct-effects-of-illustrative-tax-changes",
      "Reference for future calibration; the game does not claim these yields.",
    ],
    [
      "Treasury spending review",
      "https://www.gov.uk/government/publications/spending-review-2025-document/spending-review-2025-html",
      "Spending and devolution context.",
    ],
  ],
};
export const SHOCKS = {
  calm: {
    name: "Steady waters",
    subtitle: "Learn the trade-offs without a shock.",
    borrowing: Array(10).fill(0),
    pressure: 0,
    rate: 0,
  },
  energy: {
    name: "Energy squeeze",
    subtitle: "An energy shock arrives in Budget 3.",
    borrowing: [0, 0, 12, 8, 4, 0, 0, 0, 0, 0],
    pressure: -1,
    rate: 0,
  },
  rates: {
    name: "Borrowing costs rise",
    subtitle: "A gilt-yield shock arrives in Budget 3.",
    borrowing: [0, 0, 2, 4, 6, 7, 8, 9, 10, 11],
    pressure: 0,
    rate: 0.01,
  },
};
// Envelopes are illustrative, non-overlapping annual baselines in £bn.
// A setting is an incremental change to the previous settlement, not a reset.
export const ENVELOPES = [
  {
    id: "health",
    title: "Health & care",
    base: 240,
    step: 12,
    service: 1.4,
    lag: 1,
    pressure: [0.5, 0.4, 0.3, 0.2, 0.1],
    note: "Day-to-day health and care funding. Capacity takes a year to respond.",
  },
  {
    id: "welfare",
    title: "Welfare & pensions",
    base: 320,
    step: 16,
    service: 0,
    lag: 0,
    pressure: [1, 0.8, 0.5, 0.3, 0.2],
    note: "Benefits and state pensions. Changes phase in: half this year, the full amount next year.",
  },
  {
    id: "defence",
    title: "Defence",
    base: 65,
    step: 12,
    service: 0.6,
    lag: 1,
    pressure: [0.1, 0.1, 0.1, 0.1, 0.1],
    note: "Day-to-day security funding. Each grow adds £12bn a year; equipment investment sits below.",
  },
  {
    id: "investment",
    title: "Public investment",
    base: 100,
    step: 15,
    service: 1.2,
    lag: 2,
    pressure: [0.4, 0.3, 0.2, 0.1, 0.1],
    note: "Capital across all services, housing and infrastructure. Growth adds £3bn maintenance from year four; a squeeze brings a £6bn catch-up bill in year four. Reversing a step cancels its future bills.",
  },
  {
    id: "other",
    title: "Everything else",
    base: 300,
    step: 12,
    service: 1.2,
    lag: 1,
    pressure: [0.5, 0.4, 0.3, 0.2, 0.1],
    note: "Other day-to-day services, including education, justice, councils and administration.",
  },
];
export const TAXES = [
  {
    id: "income",
    title: "Income tax",
    step: 15,
    pressure: [0.1, 0.2, 0.35, 0.5, 0.7],
    note: "A broad revenue package, with more direct pressure on higher incomes. Not a costing of a 1p rate change.",
  },
  {
    id: "vat",
    title: "VAT",
    step: 15,
    pressure: [0.8, 0.7, 0.5, 0.35, 0.25],
    note: "A broad consumption-tax package. Lower-income households feel more pressure relative to their resources.",
  },
  {
    id: "business",
    title: "Business & wealth taxes",
    step: 12,
    pressure: [0.05, 0.1, 0.15, 0.4, 0.8],
    note: "A combined illustrative package. Half the revenue arrives this year, all next year. Cautious delivery halves receipts; tax cuts retain their full cost.",
  },
];
export const BORROWING = [
  { level: -1, title: "Reduce", cap: -20 },
  { level: 0, title: "Hold", cap: 0 },
  { level: 1, title: "Allow more", cap: 30 },
];
export const CONTROLS = [
  ...ENVELOPES,
  ...TAXES,
  { id: "borrowing", title: "Borrowing allowance" },
];
export const choiceId = (id, level) => `${id}:${level}`;
export const defaultChoices = () => CONTROLS.map((c) => choiceId(c.id, 0));
export const choiceLevel = (ids, id) =>
  Number(ids.find((x) => x.startsWith(id + ":"))?.split(":")[1] ?? 0);
// The accounting engine retains annual cost profiles, lags and one-off bills.
export const CARDS = CONTROLS.flatMap((c) =>
  [-1, 0, 1].map((level) => {
    const spending = ENVELOPES.includes(c),
      tax = TAXES.includes(c);
    let cost = [0];
    if (spending)
      cost =
        c.id === "welfare"
          ? [(level * c.step) / 2, level * c.step]
          : [level * c.step];
    if (tax)
      cost =
        c.id === "business"
          ? [(-level * c.step) / 2, -level * c.step]
          : [-level * c.step];
    const label =
      c.id === "borrowing"
        ? BORROWING.find((b) => b.level === level).title
        : (spending ? ["Squeeze", "Hold", "Grow"] : ["Cut", "Hold", "Raise"])[
            level + 1
          ];
    return {
      id: choiceId(c.id, level),
      group: c.id,
      level,
      title: `${c.title}: ${label}`,
      cost,
      service: spending ? level * c.service : 0,
      lag: c.lag ?? 0,
      pressure: (c.pressure ?? [0, 0, 0, 0, 0]).map(
        (x) => x * level * (tax ? -1 : 1),
      ),
      uncertain: c.id === "business" && level === 1,
    };
  }),
);
export const ROUNDS = [
  "Set the direction",
  "Build on your choices",
  "Meet the pressure",
  "Make room",
  "Leave a settlement",
].map((label) => ({ label, cards: CARDS.map((c) => c.id) }));
