import { policyIcon, heroArt } from "./reform-art.js";
import { migrationPathHTML, migrationPath } from "./migration-path.js";
const chapters = [
  {
    short: "Smaller state",
    title: "Start with what the state spends.",
    lead: "A lasting tax cut starts with a government that costs less to run.",
    action:
      "Narrow the state's role. Reduce lower-priority programmes, simplify administration and require a clear purpose for every commitment.",
    chain: [
      "Less government spending",
      "Less tax needed to fund it",
      "More resources outside the state",
    ],
    connection:
      "That creates room for the next step: returning money to households and businesses.",
    condition:
      "The savings must be real. Cutting a useful service or investment can impose costs elsewhere; an efficiency promise is not money in the bank.",
    evidence:
      "This is a proposal to reduce the scope and cost of government, not a claim that every spending cut raises growth. The walkthrough does not assign savings to unspecified programmes.",
  },
  {
    short: "Lower taxes",
    title: "Let people keep more of what they earn.",
    lead: "Use spending savings to lower the tax burden on work, enterprise and investment.",
    action:
      "Fund tax reductions from delivered savings. Make additional work and investment more rewarding, with simpler rules and fewer distortions.",
    chain: [
      "Funded tax reductions",
      "Stronger incentives to work and invest",
      "A route to faster growth",
    ],
    connection:
      "But a better return is not enough if firms still cannot get permission to build or expand.",
    condition:
      "The growth response depends on which taxes fall and what spending is cut. Tax cuts do not automatically pay for themselves.",
    evidence:
      "The reform argument is about incentives and resource allocation. No fixed growth multiplier or self-financing tax cut is assumed here. Borrowing to pay for a tax cut is different from funding it through spending savings.",
  },
  {
    short: "Fewer barriers",
    title: "Make it easier to build, hire and grow.",
    lead: "Lower taxes matter more when investment can actually happen.",
    action:
      "Remove unnecessary permissions, duplicate reporting and barriers to entry. Make planning and approvals faster and more predictable.",
    chain: [
      "Fewer delays and compliance costs",
      "More viable projects and competition",
      "Higher productive capacity",
    ],
    connection:
      "The next constraint is the cost and reliability of the energy those businesses need.",
    condition:
      "Target rules whose costs exceed their benefits. Safety, competition and pollution protections still have economic value.",
    evidence:
      'There is evidence for specific reforms, not a universal deregulation multiplier. The <a href="https://obr.uk/efo/economic-and-fiscal-outlook-march-2025/" target="_blank" rel="noopener noreferrer">OBR’s March 2025 forecast</a> estimated that residential planning reforms would raise potential output. That does not establish the effect of removing every kind of regulation.',
  },
  {
    short: "Energy first",
    title: "End net-zero mandates. Put affordability first.",
    lead: "The proposal: replace the net-zero target and technology mandates with a focus on affordable, reliable energy.",
    action:
      "Allow competing energy sources to meet demand. Judge projects on cost and reliability, and remove mandated transitions that do not pass that test.",
    chain: [
      "Remove mandated transition costs",
      "Aim for lower household and business costs",
      "More room to produce and invest",
    ],
    connection:
      "That is the cost side of the argument. The final step asks who benefits from growth, and how it compares with population change.",
    condition:
      "Cheaper energy is the intended result, not a certainty. Fossil-fuel price exposure, emissions and climate damage must also be counted.",
    evidence:
      'This is an advocacy position, not a finding that abandoning net zero is the cheapest pathway. The <a href="https://www.theccc.org.uk/publication/the-seventh-carbon-budget/" target="_blank" rel="noopener noreferrer">Climate Change Committee’s modelling</a> reaches a different conclusion: upfront investment can lead to later operating savings. This walkthrough does not turn the gross cost of transition into an automatic net saving.',
  },
  {
    short: "Prosperity per person",
    title: "Lower migration. Judge growth per person.",
    lead: "The proposal: move towards negative net migration, so more people leave than arrive, while increasing output per worker.",
    action:
      "Reduce inflows and reliance on overseas recruitment. Build domestic skills, participation and productivity. Make living standards per person the test of success.",
    chain: [
      "Lower inflows; aim for net outflow",
      "Less additional demand for housing and services",
      "Aim for more resources per person",
    ],
    connection:
      "This completes the argument: grow productive capacity while reducing the demands placed on it.",
    condition:
      "Negative net migration is not the same as a falling population: births and deaths also matter. GDP per person rises only if output holds up sufficiently relative to population.",
    evidence:
      'Composition matters. <a href="https://www.gov.uk/government/publications/estimated-lifetime-net-fiscal-costs-for-care-workers-and-their-adult-dependants/estimated-lifetime-net-fiscal-costs-for-care-workers-and-their-adult-dependants" target="_blank" rel="noopener noreferrer">Care-route lifetime fiscal estimates</a> cannot be applied to all migrants or booked as immediate savings. Losing highly productive workers can reduce output and tax receipts. <a href="https://academic.oup.com/ooec/article/3/Supplement_1/i453/7708103" target="_blank" rel="noopener noreferrer">Historical wage research</a> finds different effects across the wage distribution, not a guaranteed general pay rise. Domestic workers, capital and services must adjust for the proposed per-person gains to materialise.',
  },
];
const app = document.querySelector("#app");
let step = 0;
let migration = "negative",
  unauthorisedBaseline = 20000;
const header = () =>
  `<header><a class="brand" href="/">THE BUDGET BATTLE<span>A DIFFERENT DIRECTION</span></a><button class="quiet" data-action="about">About this argument ↗</button></header>`;
const path = (current = 0) =>
  `<ol class="path" aria-label="The five-part argument">${chapters.map((c, i) => `<li class="${i + 1 === current ? "current" : i + 1 < current ? "done" : ""}"><span>${String(i + 1).padStart(2, "0")}</span>${c.short}</li>`).join("")}</ol>`;
const footer = () =>
  `<footer>A reform argument · intended effects, not an economic forecast<button class="quiet" data-action="about">Sources & assumptions</button></footer>`;
function intro() {
  return `${header()}<main id="main" class="intro"><div class="hero-grid"><div class="hero-copy"><div class="eyebrow">ONE ARGUMENT. FIVE CONNECTED STEPS.</div><h1>Less state.<br>More room<br>to <em>prosper.</em></h1><p class="lead">Spend less. Tax less. Make it easier to produce.<br>Judge the result by living standards per person.</p><div class="start-row"><button class="primary" data-action="next" id="start-btn">Walk through the argument <span>→</span></button><span>Five connected steps</span></div></div>${heroArt()}</div>${path()}<p class="intro-note">A case for smaller government, fewer regulatory barriers, ending net-zero mandates and lower—potentially negative—net migration.</p></main>${footer()}`;
}
function chapter() {
  const c = chapters[step - 1];
  return `${header()}<main id="main" class="theme-${step}">${path(step)}<article class="chapter"><div class="chapter-heading"><div><div class="eyebrow">THE REFORM CASE / ${String(step).padStart(2, "0")} OF 05</div><h1 tabindex="-1" id="heading">${c.title}</h1><p class="lead">${c.lead}</p></div><div class="chapter-art">${policyIcon(step - 1)}</div></div><div class="proposal"><span>THE CHANGE</span><p>${c.action}</p></div><ol class="chain" aria-label="Intended sequence">${c.chain.map((x, i) => `<li><span>${i + 1}</span><strong>${x}</strong>${i < 2 ? '<b aria-hidden="true">→</b>' : ""}</li>`).join("")}</ol>${step === 5 ? migrationPathHTML(migration, unauthorisedBaseline) : ""}<p class="connection">${c.connection}</p><details class="evidence"><summary>What this depends on</summary><p><strong>${c.condition}</strong></p><p>${c.evidence}</p></details><nav class="actions" aria-label="Walkthrough navigation"><button class="quiet" data-action="back">← Back</button><button class="primary" data-action="next">${step === 5 ? "See how it fits together" : `Next: ${chapters[step].short}`} <span>→</span></button></nav></article></main>${footer()}`;
}
function conclusion() {
  return `${header()}<main id="main"><div class="eyebrow">THE WHOLE ARGUMENT</div><h1 tabindex="-1" id="heading">A smaller state.<br>A more productive economy.</h1><p class="lead">The policies are meant to work together.</p><div class="summary-list">${chapters.map((c, i) => `<div><span class="summary-icon">${policyIcon(i)}</span><p><strong>${["Spend less → tax less", "Tax less → reward work and investment", "Remove barriers → let investment happen", "End net-zero mandates → prioritise energy affordability", "Lower migration → focus on prosperity per person"][i]}</strong><small>${["Deliver savings before committing to tax reductions.", "Seek stronger incentives, without assuming tax cuts pay for themselves.", "Make it easier to turn private resources into productive capacity.", "The affordability gain is an objective; total energy and climate costs still matter.", "Aim for negative net migration while maintaining output and essential services."][i]}</small></p></div>`).join("")}</div><p class="selected-path">Selected migration scenario: <strong>${migrationPath(migration, unauthorisedBaseline).net.toLocaleString("en-GB")} net per year</strong>. A people-flow scenario, not a growth forecast.</p><aside class="destination"><div class="eyebrow">THE INTENDED DESTINATION</div><h2>More to keep.<br>More scope to build.<br>More prosperity per person.</h2><p>This is the case for the package—not a prediction that every link will succeed. Growth, service quality, energy costs and output per person are the tests it must pass.</p></aside><nav class="actions"><button class="quiet" data-action="back">← Back</button><button class="primary" data-action="restart">Walk through again ↺</button></nav></main>${footer()}`;
}
function render(focus = false) {
  app.innerHTML = step === 0 ? intro() : step === 6 ? conclusion() : chapter();
  if (focus) {
    window.scrollTo(0, 0);
    document.querySelector("#heading")?.focus({ preventScroll: true });
  }
}
document.addEventListener("click", (e) => {
  const choice = e.target.closest("[data-migration]")?.dataset.migration;
  if (choice) {
    migration = choice;
    render();
    document
      .querySelector(`[data-migration="${choice}"]`)
      ?.focus({ preventScroll: true });
    return;
  }
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "about") {
    document.querySelector("#about-content").innerHTML =
      `<button class="quiet close" data-action="close">Close ×</button><div class="eyebrow">READ THE ARGUMENT WITH OPEN EYES</div><h2>A clear position.<br>Visible assumptions.</h2><p>This walkthrough advocates a smaller state, lower taxes, fewer regulatory barriers, ending net-zero mandates and lower or negative net migration. It is not a neutral policy comparison or a calibrated forecast.</p><p>The arrows show the mechanisms the argument relies on. They do not calculate a growth dividend or guarantee higher wages and GDP per person. Each step has an expandable explanation of its conditions and relevant evidence.</p><p>The previous Budget simulator has been removed from this main journey. There are no scores, tax sliders or separate fiscal ledgers. The migration step contains a people-flow stress test; its policy inputs are assumptions, not forecasts.</p><ul>${chapters.map((c, i) => `<li><strong>${i + 1}. ${c.short}</strong><p>${c.evidence}</p></li>`).join("")}</ul>`;
    document.querySelector("#about").showModal();
    return;
  }
  if (action === "close") {
    document.querySelector("#about").close();
    return;
  }
  step =
    action === "restart"
      ? 0
      : action === "back"
        ? Math.max(0, step - 1)
        : Math.min(6, step + 1);
  render(true);
});
window.render_game_to_text = () =>
  JSON.stringify({
    screen: step === 0 ? "intro" : step === 6 ? "conclusion" : "chapter",
    step,
    title: chapters[step - 1]?.title ?? null,
    kind: "advocacy walkthrough; migration flow stress test, no economic forecast",
    migration: migrationPath(migration, unauthorisedBaseline),
  });
document.addEventListener("change", (e) => {
  if (e.target.id === "unauthorised-baseline") {
    unauthorisedBaseline = Number(e.target.value);
    render();
    const details = document.querySelector(".migration-choice details");
    if (details) details.open = true;
    document
      .querySelector("#unauthorised-baseline")
      ?.focus({ preventScroll: true });
  }
});
window.advanceTime = () => {};
if (location.hash.startsWith("#result="))
  location.replace("/explorer.html" + location.hash);
else render();
