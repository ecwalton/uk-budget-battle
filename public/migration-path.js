// Policy stress tests, not projections. Observed total flows are not category counts.
export const FLOW_REFERENCE = {
  arrivals: 813000,
  departures: 642000,
  net: 171000,
  year: "year ending December 2025",
  source:
    "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/internationalmigration/bulletins/longterminternationalmigrationprovisional/yearendingdecember2025",
};
export const MIGRATION_PATHS = {
  reference: { name: "Reference", workers: 0, nonworkers: 0, removals: 0 },
  balance: {
    name: "0 net / year",
    workers: 40000,
    nonworkers: 100000,
    removals: 31000,
  },
  negative: {
    name: "−100,000 / year",
    workers: 50000,
    nonworkers: 150000,
    removals: 71000,
  },
  deeper: {
    name: "−250,000 / year",
    workers: 60000,
    nonworkers: 250000,
    removals: 111000,
  },
};
export function migrationPath(id = "reference", unauthorisedBaseline = 20000) {
  if (
    !Object.hasOwn(MIGRATION_PATHS, id) ||
    !Number.isInteger(unauthorisedBaseline) ||
    Math.abs(unauthorisedBaseline) > 200000
  )
    throw Error("Invalid migration path");
  const p = MIGRATION_PATHS[id];
  const arrivals = FLOW_REFERENCE.arrivals - p.workers - p.nonworkers;
  const departures = FLOW_REFERENCE.departures + p.removals;
  return {
    ...p,
    id,
    arrivals,
    departures,
    net: arrivals - departures,
    fiveYearNet: (arrivals - departures) * 5,
    difference: arrivals - departures - FLOW_REFERENCE.net,
    unauthorisedBaseline,
    unauthorisedChange: unauthorisedBaseline - p.removals,
  };
}
const fmt = (n) =>
  `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("en-GB")}`;
export function migrationPathHTML(id, baseline) {
  const m = migrationPath(id, baseline);
  return `<section class="migration-choice" aria-label="Migration policy scenario"><div class="eyebrow">CHOOSE THE SCALE / ILLUSTRATIVE POLICY PATHS</div><div class="migration-options" role="group" aria-label="Net migration scenario">${Object.entries(
    MIGRATION_PATHS,
  )
    .map(
      ([key, p]) =>
        `<button data-migration="${key}" aria-pressed="${key === id}">${p.name}</button>`,
    )
    .join(
      "",
    )}</div><div class="flow-results" aria-live="polite"><div><span>NET MIGRATION / YEAR</span><strong>${fmt(m.net)}</strong><small>${fmt(m.fiveYearNet)} over five years if repeated</small></div><div><span>UNAUTHORISED POPULATION / YEAR</span><strong>${fmt(m.unauthorisedChange)}</strong><small>${m.unauthorisedChange < 0 ? "Net reduction" : "Net addition"} under the illustrative stock-change assumption</small></div></div><p class="flow-equation">${m.arrivals.toLocaleString("en-GB")} arrivals − ${m.departures.toLocaleString("en-GB")} departures = <strong>${fmt(m.net)} net</strong></p><details><summary>See the flows and assumptions</summary><table><caption>Annual changes from the reference flow</caption><tbody><tr><th>Fewer lower-paid worker arrivals</th><td>${fmt(-m.workers)}</td></tr><tr><th>Fewer non-working arrivals</th><td>${fmt(-m.nonworkers)}</td></tr><tr><th>Additional removals of people without permission to stay</th><td>${fmt(m.removals)} departures</td></tr></tbody></table><p>The reference is the provisional <a href="${FLOW_REFERENCE.source}" target="_blank" rel="noopener noreferrer">ONS ${FLOW_REFERENCE.year} estimate</a>: 813,000 arrivals and 642,000 departures. Holding those flows constant is a comparison assumption, not the ONS forecast.</p><p>The policy splits are invented stress-test inputs, not measured stocks or evidence that these numbers can be delivered. Lower pay is a proxy here, not a definition of skill. “Non-working” is a scenario category, not a visa route: students and dependants may work. The categories are assumed non-overlapping; the actual eligible numbers need evidence.</p><p>Every additional removal is assumed to concern a long-term resident without permission to stay, to qualify as emigration, to be beyond departures already counted, and to follow a lawful process. It is subtracted once. In reality, returns statistics and ONS emigration do not map one-to-one. Deliverability, legal decisions, receiving-country cooperation and enforcement costs are not modelled.</p><label class="stock-assumption">Assumed annual change in the unauthorised population before additional removals<select id="unauthorised-baseline">${[-50000, 0, 20000, 50000, 100000].map((v) => `<option value="${v}" ${v === baseline ? "selected" : ""}>${fmt(v)} people</option>`).join("")}</select></label><p>This is a hypothetical net balance of all new cases, departures and changes of status, not an estimate of the current unauthorised population. The default +20,000 is an illustration. Subtracting extra removals shows when that balance becomes negative; it does not count irregular entries as an extra inflow on top of ONS totals. There is no assumed permanent ability to repeat removals beyond the eligible population.</p><p>These are people-flow calculations. They do not generate an automatic fiscal saving, wage rise or GDP-per-person gain. Those require evidence about earnings, tax, services, replacement workers and output. The old £51,500 care-household average is not used for these broader groups.</p></details></section>`;
}
