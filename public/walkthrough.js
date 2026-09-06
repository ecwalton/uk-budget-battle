import { fiscalStatementHTML } from "./fiscal-statement.js";
import { policyIcon, heroArt } from "./reform-art.js";
import { migrationPathHTML, migrationPath } from "./migration-path.js";
const chapters = [
  {
    short: "Spending",
    title: "What earns a place in your Budget?",
    lead: "Your ministers want to protect their programmes. Taxpayers want better value. Where do you draw the line?",
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
      "This is a proposal to reduce the scope and cost of government, not a claim that every spending cut raises growth. The £50bn target is an illustrative assumption, not a programme-by-programme costing or an OBR estimate.",
  },
  {
    short: "Taxes",
    title: "What do you do with the tax burden?",
    lead: "Households want relief. The Treasury wants a funded plan. Choose the commitment you will make.",
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
    short: "Business",
    title: "A business wants to expand. What stands in its way?",
    lead: "Investors bring you a project—and a long list of permissions. Decide how government should respond.",
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
    short: "Energy",
    title: "How will you tackle energy costs?",
    lead: "Households and employers want affordable, reliable power. You must decide the role of targets and mandates.",
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
    short: "Migration",
    title: "What migration settlement will you choose?",
    lead: "Your final decision concerns recruitment, public-service demand and living standards per person. Choose the scale of your policy.",
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
const decisions = [
  {
    options: [
      "Review programmes and end lower priorities",
      "Protect the existing programme of spending",
    ],
    descriptions: [
      "Target £50bn a year of net savings (illustrative: 3.5% of spending), after replacement and delivery costs.",
      "Keep current commitments and accept the revenue they require.",
    ],
    alternative: [
      "Existing commitments continue",
      "More spending needs funding",
      "Less room for funded tax reductions",
    ],
  },
  {
    options: [
      "Cut taxes as spending savings are delivered",
      "Hold tax rates and repair the finances first",
    ],
    descriptions: [
      "Target £30bn a year of tax relief, released only once the £50bn savings target is delivered.",
      "Use any savings for borrowing reduction or existing pressures.",
    ],
    alternative: [
      "Tax rates stay in place",
      "Any savings help the fiscal balance",
      "No new tax incentive is assumed",
    ],
  },
  {
    options: [
      "Streamline permissions and remove duplication",
      "Keep the existing approval framework",
    ],
    descriptions: [
      "Target barriers that delay worthwhile projects or deter new entrants.",
      "Retain established checks and assess projects under current rules.",
    ],
    alternative: [
      "Established checks remain",
      "Existing protections and processes continue",
      "Delays and compliance costs may persist",
    ],
  },
  {
    options: [
      "Replace net-zero mandates with an affordability test",
      "Keep net-zero targets and manage transition costs",
    ],
    descriptions: [
      "Let energy sources compete on cost and reliability.",
      "Continue the transition while testing delivery costs and consumer impacts.",
    ],
    alternative: [
      "Transition targets remain",
      "Upfront investment and policy costs continue",
      "Seek later fuel savings and lower emissions",
    ],
  },
];
const chosen = [null, null, null, null];
let migrationChosen = false;
function decisionHTML(index) {
  const d = decisions[index];
  return `<section class="decision-options" aria-label="Your decision">${d.options.map((label, i) => `<button data-policy="${i}" aria-pressed="${chosen[index] === i}"><span>${String.fromCharCode(65 + i)}</span><strong>${label}</strong><small>${d.descriptions[i]}</small></button>`).join("")}</section>`;
}
const app = document.querySelector("#app");
let step = 0;
let migration = "reference",
  unauthorisedBaseline = 20000;
const header = () =>
  `<header><a class="brand" href="/">THE BUDGET BATTLE<span>YOUR TURN AT THE TREASURY</span></a><button class="quiet" data-action="about">Your briefing ↗</button></header>`;
const path = (current = 0) =>
  `<ol class="path" aria-label="Your five decisions">${chapters.map((c, i) => `<li class="${i + 1 === current ? "current" : i + 1 < current ? "done" : ""}"><span>${String(i + 1).padStart(2, "0")}</span>${c.short}</li>`).join("")}</ol>`;
const footer = () =>
  `<footer>A Chancellor scenario · policy consequences are illustrative<button class="quiet" data-action="about">Sources & assumptions</button></footer>`;
function intro() {
  return `${header()}<main id="main" class="intro"><div class="hero-grid"><div class="hero-copy"><div class="eyebrow">YOU HAVE BEEN APPOINTED CHANCELLOR.</div><h1>The red box<br>is <em>yours.</em></h1><p class="lead">Your ministers want more. Taxpayers want relief.<br>Make five decisions, then see the government you’ve chosen.</p><div class="start-row"><button class="primary" data-action="next" id="start-btn">Take the red box <span>→</span></button><span>Five decisions · one programme</span></div></div>${heroArt()}</div>${path()}<p class="intro-note">Your brief: improve living standards, make the commitments add up and explain your decisions to the country.</p></main>${footer()}`;
}
function chapter() {
  const c = chapters[step - 1];
  const ready = step === 5 ? migrationChosen : chosen[step - 1] !== null;
  const chain =
    step < 5 && chosen[step - 1] === 1
      ? decisions[step - 1].alternative
      : c.chain;
  return `${header()}<main id="main" class="theme-${step}">${path(step)}<article class="chapter"><div class="chapter-heading"><div><div class="eyebrow">YOUR DECISION / ${String(step).padStart(2, "0")} OF 05</div><h1 tabindex="-1" id="heading">${c.title}</h1><p class="lead">${c.lead}</p></div><div class="chapter-art">${policyIcon(step - 1)}</div></div>${step < 5 ? decisionHTML(step - 1) : migrationPathHTML(migration, unauthorisedBaseline)}${ready ? `<div class="proposal"><span>YOUR CHOICE</span><p>${step < 5 ? decisions[step - 1].options[chosen[step - 1]] : `Set the migration scenario to ${migrationPath(migration, unauthorisedBaseline).net.toLocaleString("en-GB")} net per year.`}</p></div>${step < 5 ? `<ol class="chain" aria-label="Intended consequences">${chain.map((x, i) => `<li><span>${i + 1}</span><strong>${x}</strong>${i < 2 ? '<b aria-hidden="true">→</b>' : ""}</li>`).join("")}</ol>` : ""}` : '<p class="choice-prompt" role="status">Choose your policy to see its consequences.</p>'}<p class="connection">${step === 1 ? "Next, decide what taxpayers get back—and what the Treasury keeps." : step === 2 ? "Your tax settlement is only part of the picture. Next, consider the rules businesses face." : step === 3 ? "Now turn to the energy costs those businesses and households face." : step === 4 ? "One decision remains: the migration settlement your government will pursue." : "Your five decisions are ready. Open your Chancellor’s statement to see how they fit together."}</p><details class="evidence"><summary>What this depends on</summary><p><strong>${c.condition}</strong></p><p>${c.evidence}</p></details><nav class="actions" aria-label="Walkthrough navigation"><button class="quiet" data-action="back">← Back</button><button class="primary" data-action="next" ${ready ? "" : "disabled"}>${step === 5 ? "Read your Chancellor’s statement" : "Confirm and continue"} <span>→</span></button></nav></article></main>${footer()}`;
}
function conclusion() {
  const m = migrationPath(migration, unauthorisedBaseline);
  const smaller = chosen[0] === 0;
  const unfunded = chosen[0] === 1 && chosen[1] === 0;
  const completeReform = chosen.every((c) => c === 0) && m.net < 171000;
  const title = unfunded
    ? "Your tax pledge needs a funding plan."
    : completeReform
      ? "You’ve chosen a smaller state.<br>Now make it work."
      : smaller
        ? "You’ve chosen to spend less.<br>The rest is a mixed settlement."
        : "You’ve protected the spending programme.<br>It still needs funding.";
  const synthesis = completeReform
    ? "You challenged spending, committed the savings to tax relief, reduced barriers, replaced energy mandates and lowered migration. Together, those choices describe a smaller-state programme. That is the direction you chose—not a score the game has awarded you."
    : unfunded
      ? "You protected existing programmes but also promised tax cuts once savings arrive. Those savings have not been identified in your choices. The tax commitment must wait, or you must revisit spending."
      : smaller
        ? "Your spending decision points towards a smaller state, but your other choices qualify that direction. This is your particular combination of priorities, not a single pre-written manifesto."
        : "Your programme retains existing spending commitments. Some of your other decisions may change regulation, energy or migration, but they do not by themselves fund a lower tax burden.";
  return `${header()}<main id="main"><div class="eyebrow">YOUR CHANCELLOR’S STATEMENT</div><h1 tabindex="-1" id="heading">${title}</h1>${fiscalStatementHTML(chosen)}<p class="lead">${synthesis}</p><div class="summary-list">${chapters.map((c, i) => `<div><span class="summary-icon">${policyIcon(i)}</span><p><strong>${i < 4 ? decisions[i].options[chosen[i]] : `Migration: ${m.net.toLocaleString("en-GB")} net per year`}</strong><small>${i < 4 ? decisions[i].descriptions[chosen[i]] : "A flow scenario; its fiscal and per-person effects depend on who arrives, who leaves and how output responds."}</small></p></div>`).join("")}</div><aside class="destination"><div class="eyebrow">YOUR TEST IN OFFICE</div><h2>Can you deliver<br>better living standards?</h2><p>Your choices set a direction. They do not guarantee growth, lower energy bills or higher income per person. Delivering savings, maintaining services and improving productive capacity are the tests your government now faces.</p></aside><nav class="actions"><button class="quiet" data-action="back">← Revisit your decisions</button><button class="primary" data-action="restart">Start a new term ↺</button></nav></main>${footer()}`;
}

function render(focus = false) {
  app.innerHTML = step === 0 ? intro() : step === 6 ? conclusion() : chapter();
  if (focus) {
    window.scrollTo(0, 0);
    document.querySelector("#heading")?.focus({ preventScroll: true });
  }
}
document.addEventListener("click", (e) => {
  const policy = e.target.closest("[data-policy]")?.dataset.policy;
  if (policy !== undefined && step >= 1 && step <= 4) {
    chosen[step - 1] = Number(policy);
    render();
    document
      .querySelector(`[data-policy="${policy}"]`)
      ?.focus({ preventScroll: true });
    return;
  }
  const choice = e.target.closest("[data-migration]")?.dataset.migration;
  if (choice) {
    migration = choice;
    migrationChosen = true;
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
      `<button class="quiet close" data-action="close">Close ×</button><div class="eyebrow">YOUR TREASURY BRIEFING</div><h2>Five decisions.<br>A programme you can explain.</h2><p>You are the Chancellor. Choose your approach to spending, taxes, business rules, energy and migration. The reform route explores a smaller-state programme; other combinations produce different statements. This is a simplified, authored scenario, not a neutral comparison of every policy or a calibrated forecast.</p><p>The arrows show the mechanisms the argument relies on. They do not calculate a growth dividend or guarantee higher wages and GDP per person. Each step has an expandable explanation of its conditions and relevant evidence.</p><p>The previous Budget simulator has been removed from this main journey. There are no scores, tax sliders or separate fiscal ledgers. The migration step contains a people-flow stress test; its policy inputs are assumptions, not forecasts.</p><ul>${chapters.map((c, i) => `<li><strong>${i + 1}. ${c.short}</strong><p>${c.evidence}</p></li>`).join("")}</ul>`;
    document.querySelector("#about").showModal();
    return;
  }
  if (action === "close") {
    document.querySelector("#about").close();
    return;
  }
  if (
    action === "next" &&
    step > 0 &&
    step < 6 &&
    (step === 5 ? !migrationChosen : chosen[step - 1] === null)
  )
    return;
  if (action === "restart") {
    chosen.fill(null);
    migration = "reference";
    migrationChosen = false;
    unauthorisedBaseline = 20000;
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
    choices: [...chosen],
    migrationChosen,
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
