// Evidence-based lifetime illustration, deliberately separate from annual cash scoring.
export const MIGRATION_DEFAULTS = {
  migration: "baseline",
  dependants: "0.5",
  wages: "none",
};
export const MIGRATION_SOURCES = {
  fiscal:
    "https://www.gov.uk/government/publications/estimated-lifetime-net-fiscal-costs-for-care-workers-and-their-adult-dependants/estimated-lifetime-net-fiscal-costs-for-care-workers-and-their-adult-dependants",
  wages: "https://academic.oup.com/ooec/article/3/Supplement_1/i453/7708103",
};
export function migrationSettings(input) {
  const values = Object.fromEntries(
    Object.entries(MIGRATION_DEFAULTS).map(([key, value]) => [
      key,
      input[key] === undefined ? value : input[key],
    ]),
  );
  if (
    !["lower", "baseline", "higher"].includes(values.migration) ||
    !["0", "0.5", "1"].includes(values.dependants) ||
    !["none", "historical"].includes(values.wages)
  )
    throw new Error("Invalid migration scenario");
  return values;
}
export function migrationImpact(input) {
  const settings = migrationSettings(input);
  const annualWorkers = { lower: -10000, baseline: 0, higher: 10000 }[
    settings.migration
  ];
  const workers = annualWorkers * 5;
  const adultDependants = workers * Number(settings.dependants);
  return {
    ...settings,
    annualWorkers,
    workers,
    adultDependants,
    lifetimeNetCostBn: (workers * 36000 + adultDependants * 67000) / 1e9,
    // Linear, symmetric extrapolation is a sensitivity, not an estimated policy response.
    lowerPaidWagePercent:
      settings.wages === "historical"
        ? -((workers / 30000000) * 100) * 0.24
        : null,
    cashEffectBn: null,
    assumptions: {
      cohorts: 5,
      workerLifetimeCost: 36000,
      adultDependantLifetimeCost: 67000,
      referenceNativeLabourForce: 30000000,
      wageCoefficient: -0.24,
    },
    sources: MIGRATION_SOURCES,
  };
}
const number = (n) => Math.abs(n).toLocaleString("en-GB");
export function migrationPanel(input, editable = false) {
  const m = migrationImpact(input);
  const select = (id, title, options) =>
    `<label>${title}<select id="${id}">${options.map(([v, t]) => `<option value="${v}" ${m[id] === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
  return `<section class="migration-panel" aria-label="Migration scenario"><div class="eyebrow">MIGRATION / A SEPARATE LIFETIME VIEW</div><h2>Fewer arrivals. What changes?</h2><p>Care-worker arrivals and adult dependants, compared with an illustrative unchanged flow. This is a counterfactual, not a description of current visa eligibility. Other migration is unchanged.</p>${
    editable
      ? `<div class="migration-controls">${select(
          "migration",
          "Worker arrivals each year, for five years",
          [
            ["lower", "Lower · 10,000 fewer / year"],
            ["baseline", "Baseline · no change"],
            ["higher", "Higher · 10,000 more / year"],
          ],
        )}${select("dependants", "Adult dependants per worker · assumption", [
          ["0", "None"],
          ["0.5", "One per two workers"],
          ["1", "One per worker"],
        ])}${select("wages", "Wage sensitivity", [
          ["none", "No quantified wage effect"],
          ["historical", "Illustrate historical lower-paid effect"],
        ])}</div>`
      : `<p><strong>${m.migration === "baseline" ? "Unchanged arrivals" : `${number(m.annualWorkers)} ${m.annualWorkers < 0 ? "fewer" : "more"} workers arriving per year`}</strong> · ${m.dependants} adult dependants per worker.</p>`
  }<div class="migration-results" aria-live="polite"><div><span>LIFETIME NET FISCAL COST</span><strong>£${Math.abs(m.lifetimeNetCostBn).toFixed(2)}bn ${m.lifetimeNetCostBn < 0 ? "lower" : m.lifetimeNetCostBn > 0 ? "higher" : "change"}</strong><small>Across the lifetimes of five arrival cohorts; includes receipts and spending in the source estimate.</small></div><div><span>ARRIVAL COHORTS OVER FIVE YEARS</span><strong>${number(m.workers + m.adultDependants)} ${m.workers < 0 ? "fewer" : m.workers > 0 ? "more" : "change"}</strong><small>${number(m.workers)} workers and ${number(m.adultDependants)} adult dependants. Arrival differences, not a resident-population forecast.</small></div><div><span>LOWER-PAID WAGES / SENSITIVITY</span><strong>${m.lowerPaidWagePercent === null ? "Not quantified" : `${m.lowerPaidWagePercent > 0 ? "+" : ""}${m.lowerPaidWagePercent.toFixed(3)}%`}</strong><small>${m.lowerPaidWagePercent === null ? "Choose the historical sensitivity before starting to explore a possible effect." : "Illustrative effect at the 10th percentile of native wages; not average pay or a guaranteed gain."}</small></div></div><p><strong>Ten-year Budget saving: not estimated.</strong> Lifetime amounts do not alter borrowing, funding headroom or your score. Lower arrivals can reduce demand for services, but reducing budgets requires actual capacity and staffing decisions; gross spending savings are not separately estimated here.</p><details><summary>Evidence, assumptions and trade-offs</summary><p>The <a href="${MIGRATION_SOURCES.fiscal}" target="_blank" rel="noopener noreferrer">Home Office note (March 2026)</a> cites MAC lifetime net costs of £36,000 per care worker and £67,000 per adult Health and Care dependant for the 2022–23 arrival cohort. Applying them to different arrival volumes is our illustration. These are uncertain model estimates, not annual costs or estimates for every migrant. Adult dependant ratios here are chosen assumptions; children are not modelled. Existing residents are unaffected by this counterfactual.</p><p>The optional <a href="${MIGRATION_SOURCES.wages}" target="_blank" rel="noopener noreferrer">2024 wage study</a> estimates −0.24% at the native wage distribution’s 10th percentile per inflow equal to 1% of the native labour force, using historical data. We illustrate an equal opposite response to lower inflows, with a fixed illustrative 30 million reference labour force and all five worker cohorts retained. This symmetric, linear extrapolation is not established for today's care route; adult dependants' employment is omitted. The study's mean wage effect is close to zero and insignificant, with gains higher up the distribution. No wage effect feeds into tax receipts.</p><p>Fewer care workers can also mean staffing shortages, reduced care provision or higher costs to recruit replacements. These offsets are not quantified. A smaller future service burden is not an automatic cash saving. The calculator retains both this lifetime view and the separate Budget accounts.</p></details></section>`;
}
