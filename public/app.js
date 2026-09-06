import { PRESETS, presetYear } from "./presets.js";
import { MIGRATION_DEFAULTS, migrationPanel } from "./migration.js";
import {
  SCENARIO,
  SHOCKS,
  ROUNDS,
  CARDS,
  ENVELOPES,
  TAXES,
  BORROWING,
  CONTROLS,
  defaultChoices,
  choiceLevel,
} from "./scenario.js";
import { simulate, validateGame } from "./engine.js";
import { budgetStory, newspaperPNG } from "./newspaper.js";
const $ = (s) => document.querySelector(s),
  money = (n) => `${n < 0 ? "−" : ""}£${Math.abs(n).toFixed(1)}bn`,
  signed = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}`;
const STORE = "budget-battle-v4";
let disposeBox = () => {},
  renderGeneration = 0;
let state = {
    mode: "intro",
    decisions: [],
    pending: defaultChoices(),
    stage: "spending",
    shock: "calm",
    sensitivity: "central",
    ...MIGRATION_DEFAULTS,
  },
  saved = null;
try {
  saved = JSON.parse(localStorage.getItem(STORE));
  if (saved?.version !== SCENARIO.version) saved = null;
  else validateGame(saved);
} catch {
  saved = null;
}
try {
  if (location.hash.startsWith("#result=")) {
    const raw = location.hash.slice(8);
    if (raw.length > 2500) throw Error();
    const shared = JSON.parse(atob(raw));
    if (shared.version !== SCENARIO.version || shared.decisions.length !== 5)
      throw Error();
    state = { ...state, ...validateGame(shared), mode: "results" };
  }
} catch {
  history.replaceState(null, "", location.pathname);
}
const requestedPreset = new URLSearchParams(location.search).get("preset");
if (state.mode === "intro" && PRESETS[requestedPreset]) state.preset = requestedPreset;
function presetPicker() {
  return `<section class="preset-picker"><div class="eyebrow">01 / PICK A PLAN</div><div class="preset-options"><button class="scenario ${!state.preset ? 'active' : ''}" data-preset="custom" aria-pressed="${!state.preset}"><span class="preset-symbol" aria-hidden="true">＋</span><strong>Your own plan</strong><small>A blank page. All nine levers start on hold.</small></button>${Object.entries(PRESETS).map(([id,p])=>`<button class="scenario ${state.preset===id?'active':''}" data-preset="${id}" aria-pressed="${state.preset===id}"><span class="preset-symbol" aria-hidden="true">${id==='gbtt'?'↘':id==='revenue'?'≋':'↗'}</span><strong>${p.name}</strong><small>${id==='gbtt'?'Smaller spending envelopes. Lower taxes. Can you close the gap?':id==='revenue'?'Protect cash spending. Raise revenue through income tax.':'Build capacity. Pay with higher income and business taxes.'}</small></button>`).join('')}</div>${state.preset ? `<p><strong>${PRESETS[state.preset].name}:</strong> ${PRESETS[state.preset].limits}</p>` : ''}<p><a href="/programme.html">Explore the GBTT programme →</a></p></section>`;
}
const bag = `<svg viewBox="0 0 28 26" aria-hidden="true"><path d="M9 8V4h10v4M3 9h22v15H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 15h22M12 13h4v5h-4z" fill="currentColor"/></svg>`;
function building() {
  return `<svg class="building" viewBox="0 0 630 270" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 254h630M60 244V119h82V77h64V44h215v33h64v42h84v125M51 119h527M139 77h347M200 44h226M205 35h215M306 35V15m0 1h35l-10 9h-25M69 236h493M72 151h490M146 106h332M211 69h204M241 236V107h149v129M230 107l85-32 85 32z"/>${Array.from({ length: 13 }, (_, i) => `<path d="M${82 + i * 36} 163v62h17v-62zM${82 + i * 36} 193h17"/>`).join("")}${Array.from({ length: 7 }, (_, i) => `<path d="M${185 + i * 36} 87v15h15V87z"/>`).join("")}${[254, 283, 327, 356].map((x) => `<path d="M${x} 118v115m7-115v115"/>`).join("")}<path d="M297 236v-47a18 18 0 0 1 36 0v47M283 246h64M291 241h49"/></g></svg>`;
}
function header() {
  return `<header class="topbar"><a href="/" class="brand">${bag}<span>THE BUDGET BATTLE<small>UNITED KINGDOM EDITION</small></span></a><nav><span class="prototype">PLAYABLE PROTOTYPE</span><button class="text-button" data-action="method">How the numbers work <span aria-hidden="true">↗</span></button></nav></header>`;
}
function footer() {
  return `<footer><span>An independent fiscal strategy game</span><span>Training assumptions · ${SCENARIO.version}</span><button class="text-button" data-action="method">Sources & methodology</button></footer>`;
}
function intro() {
  return `${header()}<main id="main" class="intro home-v2">
  <section class="home-hero"><div class="home-copy"><div class="eyebrow"><span class="red-dot"></span> YOU ARE THE CHANCELLOR</div><h1>A red box.<br>A country.<br><em>Your call.</em></h1><p class="lede">Build five Budgets. Fund your promises.<br>Find out what survives the pressure.</p><div class="hero-actions"><button class="primary" id="start-btn" data-action="start">Start your term <span>→</span></button><a class="home-setup-link" href="#setup">Choose a starting plan ↓</a></div>${saved ? '<button class="text-button" data-action="resume">Continue your saved term →</button>' : ''}<p class="home-current">${state.preset ? PRESETS[state.preset].name : 'Your own plan'} <span>·</span> ${SHOCKS[state.shock].name}</p><div class="home-pills"><span>5 Budgets</span><span>9 levers</span><span>10 years of consequences</span></div></div>
  <div class="home-art"><div class="art-orbit" aria-hidden="true"></div><span class="scene-caption">YOUR FIRST DAY AT THE TREASURY</span><div class="box-stage treasury-stage" role="img" aria-label="A Blender-modelled Treasury desk with a red Budget box, spending envelopes, gold coins and a five-year ledger"><img class="desk-fallback" src="/assets/treasury-desk.png" width="1100" height="900" alt="" fetchpriority="high"></div><div class="desk-label desk-label-one"><span>01 / SPENDING</span><strong>Every promise has a price.</strong></div><div class="desk-label desk-label-two"><span>02 / FUNDING</span><strong>The numbers have to add up.</strong></div></div></section>
  <section class="how-play" aria-label="How to play"><div class="how-title"><div class="eyebrow">THE JOB, IN THREE MOVES</div><h2>Easy to start.<br> Hard choices to make.</h2></div><article><img src="/assets/health.png" width="80" height="80" alt="" loading="lazy"><span>01</span><h3>Set your priorities</h3><p>Grow, hold or squeeze five spending envelopes.</p></article><article><img src="/assets/welfare.png" width="80" height="80" alt="" loading="lazy"><span>02</span><h3>Make it add up</h3><p>Set taxes and borrowing. An unfunded Budget cannot pass.</p></article><article><img src="/assets/other.png" width="80" height="80" alt="" loading="lazy"><span>03</span><h3>Face the consequences</h3><p>Read each Budget’s headlines. Protect services and households.</p></article></section>
  <section class="home-challenge"><div><div class="eyebrow">WHAT COUNTS AS A WIN?</div><h2>Leave more than a good headline.</h2></div><p>Improve the annual deficit by <strong>£40bn</strong> in Budget 5, save <strong>£100bn</strong> over your term, and sustain the gains afterwards—without breaking the service or household safeguards. <button class="text-button" data-action="method">Read the rules ↗</button></p></section>
  <div id="setup" class="home-setup"><div class="setup-heading"><div class="eyebrow">MAKE IT YOUR TERM</div><h2>Choose your starting point.</h2><p>Start from scratch or take a plan apart. You can change every lever.</p></div>${presetPicker()}
  <section class="scenario-picker"><div><div class="eyebrow">02 / PICK THE CONDITIONS</div><p>Keep it steady—or test yourself against a shock in Budget 3.</p></div><div class="scenario-options">${Object.entries(SHOCKS).map(([id,sh],i)=>`<button class="scenario ${state.shock===id?'active':''}" data-shock="${id}" aria-pressed="${state.shock===id}"><span class="scenario-num">${['☀','ϟ','↗'][i]}</span><strong>${sh.name}</strong><small>${sh.subtitle}</small><span class="selection-dot" aria-hidden="true">${state.shock===id?'✓':'○'}</span></button>`).join('')}</div></section>
  <details class="home-extra"><summary>Optional: explore migration assumptions</summary>${migrationPanel(state,true)}</details><div class="home-launch"><div><span>YOUR BRIEF IS READY</span><strong>${state.preset?PRESETS[state.preset].name:'Your own plan'} · ${SHOCKS[state.shock].name}</strong></div><button class="primary" data-action="start">Start your term →</button></div></div>
  <p class="home-disclaimer">An independent strategy game. Costs and outcome points are illustrative training assumptions, not official forecasts. No sign-up. Your game stays in your browser.</p></main>${footer()}`;
}
function getGame(includePending = true) {
  return {
    decisions:
      includePending && state.mode === "game" && state.decisions.length < 5
        ? [...state.decisions, state.pending]
        : state.decisions,
    shock: state.shock,
    sensitivity: state.sensitivity,
    migration: state.migration,
    dependants: state.dependants,
    wages: state.wages,
  };
}
function current() {
  return simulate(getGame());
}
function metrics(result, index) {
  const y = result.years[index];
  return `<section class="metrics" aria-label="Budget indicators"><div><span>ANNUAL BORROWING <small>BUDGET ${index + 1}</small></span><strong>${money(y.borrowing)}</strong><small>Existing plans: ${money(y.baseline)}</small></div><div><span>CHANGE VS EXISTING PLANS</span><strong class="${y.delta <= 0 ? "positive" : "negative"}">${signed(y.delta)}<i>bn</i></strong><small>${y.delta === 0 ? "No change in" : y.delta < 0 ? "Less" : "More"} borrowing this year</small></div><div><span>PUBLIC CAPACITY</span><strong>${signed(y.service)}<i>pts</i></strong><small>Illustrative change · floor −5</small></div><div><span>LOWEST HOUSEHOLD SCORE</span><strong>${signed(Math.min(...y.pressure))}<i>pts</i></strong><small>Floors: lowest two −4; others −5</small></div></section>`;
}
function groupCost(id, year, includePending = true) {
  return simulate(getGame(includePending)).years[year].policyCosts[id];
}
function controlHTML(c) {
  const spending = ENVELOPES.includes(c),
    borrowing = c.id === "borrowing",
    n = state.decisions.length;
  const level = choiceLevel(state.pending, c.id);
  const amount = borrowing
    ? current().budgets[n].ceiling
    : (spending ? c.base : 0) + groupCost(c.id, n);
  return `<article class="envelope"><div class="envelope-description">${spending ? `<img class="envelope-icon" src="/assets/${c.id}.png" width="70" height="70" alt="" decoding="async">` : ""}<h2>${c.title}</h2><p>${borrowing ? "Maximum borrowing this year against the shock-adjusted baseline. This is a limit, not a receipt; unused room is not spent." : c.note}</p><details><summary>Amounts & effects</summary><p>${borrowing ? "Reduce = £20bn below existing plans; hold = existing plans; allow more = £30bn above. Actual borrowing is calculated from your spending, taxes and interest." : `Each ${spending ? "grow or squeeze" : "raise or cut"} changes eventual annual ${spending ? "spending" : "revenue"} by £${c.step}bn. Hold adds no new change; earlier decisions continue. ${spending ? `Starting cash envelope: £${c.base}bn; no inflation adjustment. Capacity changes by ${c.service} points per step after ${c.lag} year(s).` : "Revenue figures are changes from the baseline, not total tax receipts."} Household ${spending ? "relief from grow" : "pressure from raise"}, lowest to highest income: ${c.pressure.join(", ")} points; opposite choices reverse these points. ${c.id === "investment" ? "Reversals cancel future maintenance and catch-up bills for the newest outstanding step first. Past bills are not refunded." : ""}`}</p></details></div><div class="envelope-setting"><div class="envelope-amount"><strong>${borrowing || spending ? money(amount) : `${signed(-amount)}bn`}</strong><span>${borrowing ? "borrowing ceiling" : spending ? "this year’s envelope" : "revenue vs existing plans"}</span></div><div class="size-options" role="group" aria-label="${c.title}">${[-1, 0, 1].map((v) => `<button data-control="${c.id}" data-level="${v}" aria-pressed="${v === level}" class="${v === level ? "active" : ""}">${borrowing ? BORROWING[v + 1].title : (spending ? ["Squeeze", "Hold", "Grow"] : ["Cut", "Hold", "Raise"])[v + 1]}<small>${borrowing ? `${signed(BORROWING[v + 1].cap)}bn` : v === 0 ? (spending ? "Cash hold*" : "No new change") : `${signed(v * c.step)}bn / yr`}</small></button>`).join("")}</div>${spending ? '<p class="micro">*Hold adds no new cash increase. Earlier ramps and bills continue. No inflation protection.</p>' : ""}</div></article>`;
}
function fundingBridge(result, n) {
  const y = result.years[n],
    b = result.budgets[n];
  const spend = ENVELOPES.reduce((sum, c) => sum + groupCost(c.id, n), 0),
    tax = -TAXES.reduce((sum, c) => sum + groupCost(c.id, n), 0);
  return `<aside class="funding-bridge ${b.gap > 1e-8 ? "unfunded" : "funded"}" aria-live="polite"><div class="bridge-title"><div class="eyebrow">EVERY POUND ACCOUNTED FOR / £BN</div><strong>${b.gap > 1e-8 ? `${money(b.gap)} still to fund` : `${money(Math.max(0, b.headroom))} below your ceiling`}</strong></div><div class="bridge-lines"><span>Existing borrowing <b>${y.baseline.toFixed(1)}</b></span><span>Spending changes <b>${signed(spend)}</b></span><span>Tax receipts <b>${signed(-tax)}</b></span><span>Extra debt interest <b>${signed(y.interest)}</b></span><span class="bridge-total">Actual borrowing <b>${y.borrowing.toFixed(1)}</b></span><span>Your ceiling <b>${b.ceiling.toFixed(1)}</b></span></div><p>${b.gap > 1e-8 ? "Raise revenue, squeeze an envelope or allow more borrowing before confirming." : "Your settlement fits this year’s borrowing allowance."} Includes all earlier commitments. The baseline already borrows; hold does not mean a balanced Budget.</p></aside>`;
}
function chart(result, full = false) {
  const yrs = full ? result.years : result.years.slice(0, 5);
  return `<div class="chart-head"><div><div class="eyebrow">THE BORROWING PATH</div><h3>${full ? "Your term, and what comes after." : "Your choices change the trajectory."}</h3></div><div class="legend"><span><i class="base-dot"></i>Existing plans</span><span><i class="player-dot"></i>Your Budgets</span></div></div>${!full ? '<p class="micro">Future years assume no further changes. Earlier commitments, ramps and later bills continue.</p>' : ""}<canvas id="trajectory" width="950" height="220" role="img" aria-label="Annual borrowing in billions, your plan versus existing plans. Exact figures in the table below."></canvas><details class="chart-data"><summary>Read chart values as a table</summary><div class="table-scroll"><table><thead><tr><th>Budget year</th><th>Existing plans £bn</th><th>Your plan £bn</th><th>Model debt % GDP</th></tr></thead><tbody>${yrs.map((y) => `<tr><th>${y.year}${y.year > 5 ? " · legacy" : ""}</th><td>${y.baseline.toFixed(1)}</td><td>${y.borrowing.toFixed(1)}</td><td>${y.debtRatio.toFixed(1)}</td></tr>`).join("")}</tbody></table></div></details>`;
}
function drawChart(result, full = false) {
  const c = $("#trajectory");
  if (!c) return;
  const width = c.clientWidth || 900,
    height = 220,
    dpr = devicePixelRatio || 1;
  c.width = width * dpr;
  c.height = height * dpr;
  const ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  const ys = full ? result.years : result.years.slice(0, 5),
    values = ys.flatMap((y) => [y.baseline, y.borrowing]);
  const min = Math.min(0, ...values),
    max = Math.ceil(Math.max(...values) / 20) * 20 + 10,
    pad = 42,
    w = width - pad - 22,
    h = height - 52;
  const px = (i) => pad + (i * w) / (ys.length - 1),
    py = (v) => 20 + h - ((v - min) / (max - min)) * h;
  ctx.font = "11px system-ui";
  ctx.fillStyle = "#77746d";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const v = min + ((max - min) * i) / 3,
      y = py(v);
    ctx.strokeStyle = "#e4dfd6";
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - 10, y);
    ctx.stroke();
    ctx.fillText(v.toFixed(0), 3, y + 4);
  }
  if (full) {
    ctx.fillStyle = "#f0ece4";
    ctx.fillRect(
      (px(4) + px(5)) / 2,
      8,
      width - (px(4) + px(5)) / 2 - 10,
      h + 15,
    );
    ctx.fillStyle = "#79746a";
    ctx.fillText("LEGACY", px(5), 19);
  }
  for (const [key, color, dash] of [
    ["baseline", "#a6a39b", [5, 5]],
    ["borrowing", "#852c37", []],
  ]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ys.forEach((y, i) =>
      i ? ctx.lineTo(px(i), py(y[key])) : ctx.moveTo(px(i), py(y[key])),
    );
    ctx.stroke();
    ctx.setLineDash([]);
    if (key === "borrowing")
      ys.forEach((y, i) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px(i), py(y[key]), 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
  }
  ctx.fillStyle = "#77746d";
  ys.forEach((y, i) => ctx.fillText(`Y${y.year}`, px(i) - 7, height - 8));
}
function game() {
  const n = state.decisions.length,
    result = current(),
    funding = state.stage === "funding",
    budget = result.budgets[n];
  return `${header()}<main id="main" class="game">${state.preset ? `<aside class="shock-banner"><strong>${PRESETS[state.preset].name} / Budget ${n+1} draft</strong><span>All nine settings are editable. Changes affect this Budget; the next draft still follows the preset. The ledger can block confirmation.</span></aside>` : ""}<div class="game-top"><div class="eyebrow">YOUR TERM AT THE TREASURY</div><button class="text-button" data-action="restart">Start a new term ↺</button></div><ol class="steps">${ROUNDS.map((r, i) => `<li class="${i === n ? "now" : i < n ? "done" : ""}" ${i === n ? 'aria-current="step"' : ""}><span>${i < n ? "✓" : i + 1}</span><div>Budget ${i + 1}<small>${r.label}</small></div></li>`).join("")}</ol><div class="round-title"><section><div class="eyebrow">BUDGET ${n + 1} OF 5 / ${funding ? "02 · FUND THE SETTLEMENT" : "01 · ALLOCATE THE MONEY"}</div><h1 tabindex="-1" id="round-heading">${funding ? "How do you pay?" : "Who gets the money this year?"}</h1><p>${funding ? "Choose the size of your tax changes and a borrowing ceiling. The settlement must fit before you can open the red box." : "Five envelopes, one settlement. Squeeze, hold or grow each. Hold keeps earlier changes; another grow adds another annual commitment."}</p></section></div>${n >= 2 && state.shock !== "calm" ? `<aside class="shock-banner"><strong>ECONOMIC UPDATE / ${SHOCKS[state.shock].name}</strong><span>${money(SHOCKS[state.shock].borrowing[n])} extra baseline borrowing this year, already included below. ${state.shock === "energy" ? "Household scores also lose one point in years 3–5." : "The marginal interest rate is now 4%."}</span></aside>` : ""}<nav class="settlement-tabs" aria-label="Budget screens"><button class="${!funding ? "active" : ""}" data-action="spending" aria-current="${!funding ? "step" : "false"}">1. Spending envelopes</button><button class="${funding ? "active" : ""}" data-action="funding" aria-current="${funding ? "step" : "false"}">2. How you pay</button></nav><div class="settlement-layout"><section class="envelopes" aria-label="${funding ? "Funding settings" : "Spending envelopes"}">${(funding ? [...TAXES, CONTROLS.at(-1)] : ENVELOPES).map(controlHTML).join("")}</section>${fundingBridge(result, n)}</div><div class="decision-bar"><div><strong>${funding ? "A settlement, with consequences." : "Your envelopes share the same funding."}</strong><span>${funding ? "You can return to spending before confirming." : "See the funding screen to set taxes and borrowing."}</span></div><div class="decision-actions"><button class="text-button" data-action="${funding ? "spending" : "clear"}">${funding ? "← Edit spending" : "Reset this Budget"}</button><button class="primary" data-action="${funding ? "review" : "funding"}" ${funding && budget.gap > 1e-8 ? "disabled" : ""}>${funding ? `Review Budget ${n + 1}` : "How do you pay?"} <span>→</span></button></div></div><details class="migration-summary"><summary>Migration: ${state.migration} · separate lifetime effects</summary>${migrationPanel(state)}</details>${metrics(result, n)}<section class="chart-panel">${chart(result)}</section><div class="game-note"><span>Illustrative UK envelopes · no official costings · £40bn underlying deficit target by year 5</span><label>Revenue outlook <select id="sensitivity"><option value="central" ${state.sensitivity === "central" ? "selected" : ""}>Central</option><option value="cautious" ${state.sensitivity === "cautious" ? "selected" : ""}>Cautious business & wealth receipts</option></select></label></div><div class="mobile-balance"><span>Borrowing <strong>${money(result.years[n].borrowing)}</strong></span><strong class="${budget.gap > 1e-8 ? "negative" : "positive"}">${budget.gap > 1e-8 ? `${money(budget.gap)} to fund` : `${money(Math.max(0, budget.headroom))} headroom`}</strong></div></main>${footer()}`;
}
function review() {
  const result = current(),
    n = state.decisions.length,
    y = result.years[n];
  if (result.budgets[n].gap > 1e-8) return;
  showDialog(
    `<div class="eyebrow">BEFORE YOU OPEN THE RED BOX</div><h2>Review Budget ${n + 1}</h2><p>These are changes to the previous settlement. Earlier commitments continue.</p><ul>${state.pending.map((id) => `<li>${CARDS.find((c) => c.id === id).title}</li>`).join("")}</ul><div class="review-total"><span>Actual borrowing / ceiling ${money(result.budgets[n].ceiling)}</span><strong>${money(y.borrowing)}</strong><small>${signed(y.delta)}bn against existing plans</small></div><p>Term underlying saving (target £100bn): <strong>${signed(result.termImprovement)}bn</strong>. Year 5 underlying deficit improvement (target £40bn): <strong>${signed(result.annualImprovement)}bn</strong>. Years 6–10 cumulative underlying improvement (target £200bn): <strong>${signed(result.legacyImprovement)}bn</strong>.</p><p>Lowest household score across ten years: ${signed(result.worstPressure)} points. Lowest capacity: ${signed(result.worstService)} points. Capacity floor: −5. Household floors: lowest two income groups −4; others −5. Later investment bills are already included.</p><div class="modal-actions"><button class="secondary" data-action="close">Keep editing</button><button class="primary" data-action="commit">Confirm Budget ${n + 1} →</button></div>`,
  );
}
function recapPage() {
  const n = state.decisions.length - 1,
    game = getGame(false),
    story = budgetStory(game, n),
    result = simulate(game),
    y = result.years[n];
  return `${header()}<main id="main" class="budget-edition"><div class="edition-kicker">THE MORNING AFTER / BUDGET ${n + 1}</div><div class="edition-masthead">The Budget Bulletin</div><div class="edition-meta"><span>YOUR DECISIONS, IN PRINT</span><span>${SHOCKS[state.shock].name.toUpperCase()}</span></div><div class="edition-lead"><section><h1 id="edition-heading" tabindex="-1">${story.headline}</h1><p class="edition-deck">${story.deck}</p></section><div class="box-stage edition-box" aria-label="Your red box opens"><div class="red-box"><span class="handle"></span><span class="box-lock">◆</span><span class="box-label">THE BUDGET<br><b>YOUR CALL.</b></span></div></div></div><div class="edition-numbers"><div><span>NEW SPENDING THIS YEAR</span><strong>${signed(story.cost)}<small>£bn</small></strong></div><div><span>NEW TAX RECEIPTS THIS YEAR</span><strong>${signed(story.revenue)}<small>£bn</small></strong></div><div><span>ACTUAL BORROWING</span><strong>${money(y.borrowing)}</strong></div></div><section class="edition-follow"><div><div class="eyebrow">WHEN THE EFFECTS ARRIVE</div><p>${story.delayed.length ? story.delayed.join(" ") : "Earlier commitments continue. The ten-year ledger includes all remaining ramps and later bills."}</p></div><div><div class="eyebrow">THE WHOLE SETTLEMENT</div><p>Borrowing is ${money(y.borrowing)} against a ceiling of ${money(result.budgets[n].ceiling)}. This includes earlier decisions and interest.</p></div></section><div class="edition-footer"><p>Illustrative training scenario. This headline describes your choices; it is not a news report or a forecast.</p><button class="primary" data-action="continue">${n === 4 ? "Read your full legacy" : "Next Budget"} <span>→</span></button></div></main>${footer()}`;
}
function resultPage() {
  const result = current(),
    last = result.years[4],
    best = result.passed
      ? "You made room. At a price."
      : result.fiscalPass
        ? "A stronger Budget. An unfinished legacy."
        : "The next Chancellor has work to do.";
  return `${header()}<main id="main" class="results"><div class="eyebrow">YOUR TERM IS COMPLETE / ${SHOCKS[state.shock].name.toUpperCase()}</div><h1>${best}</h1><p class="lede">Five Budgets later, here’s what your decisions leave behind.</p><div class="result-summary"><div class="result-main"><span>UNDERLYING DEFICIT IMPROVEMENT IN YEAR 5</span><strong>${signed(result.annualImprovement)}<i>£bn</i></strong><p>Policy spending less tax receipts, before interest, against existing plans.</p></div><div class="score-checks">${[
    [
      result.fundingPass,
      "Every Budget fits its borrowing ceiling",
      "Spending, tax receipts and interest reconciled",
    ],
    [
      result.fiscalPass,
      "At least £40bn underlying improvement",
      `${signed(result.annualImprovement)}bn in year 5`,
    ],
    [
      result.termPass,
      "At least £100bn saved during the term",
      `${signed(result.termImprovement)}bn before interest in years 1–5`,
    ],
    [
      result.legacyPass,
      "Keep £40bn average improvement in legacy",
      `${signed(result.legacyImprovement / 5)}bn a year in years 6–10`,
    ],
    [
      result.servicePass,
      "Public capacity stays above −5",
      `${signed(result.worstService)} points at its lowest`,
    ],
    [
      result.incomePass,
      "Lowest two groups ≥ −4; others ≥ −5",
      `${signed(result.worstPressure)} points at its lowest`,
    ],
  ]
    .map(
      ([pass, title, sub]) =>
        `<div><span class="${pass ? "positive" : "negative"}">${pass ? "✓" : "×"}</span><p><strong>${title}</strong><small>${sub}</small></p></div>`,
    )
    .join(
      "",
    )}</div></div><p class="micro">These are disclosed training-game thresholds, not an economic sustainability assessment. No political score is used.</p><section class="chart-panel">${chart(result, true)}</section><section class="legacy-grid"><div><div class="eyebrow">THE FIVE YEARS AFTER YOU LEAVE</div><h2>Your legacy keeps running.</h2><p>Earlier settlements stay in place. Investment maintenance and catch-up bills arrive. There are no new decisions in years 6–10.</p><div class="legacy-number">${signed(result.legacyImprovement)}<span>£bn cumulative underlying improvement<br>in years 6–10</span></div><p class="micro">Model debt at year 10: ${result.years[9].debtRatio.toFixed(1)}% of GDP; existing plans ${result.years[9].baseDebtRatio.toFixed(1)}%. A simplified debt accumulation, not official PSND.</p></div><div><div class="eyebrow">WHO FEELS IT / YEAR 5</div><h2>Households aren’t an average.</h2><div class="households">${last.pressure.map((v, i) => `<div><span>${["Lowest", "Lower-middle", "Middle", "Upper-middle", "Highest"][i]} income</span><strong class="${v < 0 ? "negative" : "positive"}">${signed(v)} pts</strong></div>`).join("")}</div><p class="micro">Illustrative pressure/relief points. Not estimated disposable income. Points include tax and spending effects. Capacity is also shown separately.</p></div></section>${migrationPanel(state)}<section class="record"><div class="eyebrow">YOUR RECORD</div><h2>Five Budgets, in the books.</h2>${state.decisions.map((ids, i) => `<div><span>0${i + 1}</span><p>${ids.length ? ids.map((id) => CARDS.find((c) => c.id === id).title).join(" · ") : "Kept existing plans"}</p></div>`).join("")}</section><div class="result-actions"><button class="primary" data-action="share">Copy your result link ↗</button><button class="secondary" data-action="newspaper">Download your front page</button><button class="text-button" data-action="download">Download data</button><button class="text-button" data-action="restart">Try another approach →</button></div><p class="micro">Sharing includes all your choices, the scenario, safeguards and model version.</p></main>${footer()}`;
}
function showDialog(html) {
  $("#method-content").innerHTML =
    `<button class="dialog-close" data-action="close" aria-label="Close dialog">×</button>${html}`;
  if (!$("#method").open) $("#method").showModal();
}
function methodology() {
  showDialog(
    `<div class="eyebrow">OPEN BOOKS</div><h2>How the numbers work.</h2><p><strong>${SCENARIO.disclaimer}</strong></p><h3>The challenge</h3><p>Improve the underlying annual deficit (before interest) by £40bn in year 5 against existing plans, and average at least £40bn a year in years 6–10. Save at least £100bn cumulatively before interest in years 1–5. Keep capacity at −5 or above; household floors are −4 for the lowest two income groups and −5 for the others, across ten years. These thresholds are game design choices. There is no electoral prediction or fiscal-rule score.</p><h3>The accounting</h3><p>The envelopes are flat cash baselines with no inflation adjustment; hold does not promise unchanged real services. Baseline borrowing is a separate training path, not derived from a full table of spending and tax receipts. The five starting envelopes total £1,025bn: health and care £240bn, welfare and pensions £320bn, defence £65bn, public investment £100bn, everything else £300bn. These are synthetic non-overlapping funding envelopes, not official departmental totals. Capital is entirely in public investment. Grow and squeeze add changes to the previous settlement; hold adds zero. Tax settings change receipts, not stated tax rates. Each choice has an annual net cost profile. Earlier choices continue. The borrowing setting is a ceiling, never a funding receipt; confirmation is blocked above it. Unspent headroom is not borrowed. The challenge uses underlying changes before interest, so higher rates cannot improve that score. Charts and debt still include interest. Net policy costs plus 3% interest on last year’s accumulated extra debt produce the borrowing change. The rates scenario adds one point to that marginal rate from year 3. No shock reprices the full starting debt stock.</p><p>Baseline borrowing is £130, £118, £105, £93, £80, £76, £72, £68, £64 and £60 billion. Starting model debt is £2,850bn; GDP starts at £3,000bn and grows 4% nominally. This is not an inflation assumption. These are training inputs. Debt is simplified accumulated borrowing, not a reconciliation to PSND or PSNFL.</p><h3>Delayed costs and uncertain delivery</h3><p>Years 6–10 retain each policy’s explicit cost profile. Capacity and household effects activate after a stated lag; points are levels, not changes compounded annually. Welfare changes and business/wealth tax changes phase in over two years. Cautious delivery halves positive business/wealth receipts, preserving their assumed household pressure; tax cuts retain their full cost. An investment grow costs £15bn annually, then £18bn from its fourth year for maintenance. An investment squeeze saves £15bn annually except its fourth year, when a £6bn catch-up bill reduces that saving. Opposite investment steps cancel the newest outstanding step first, including its future maintenance or catch-up bill. Bills already paid are not refunded. A stable package meeting the annual target naturally passes the legacy test; this test screens for future costs. No automatic investment growth dividend is applied.</p><h3>Shocks and territorial scope</h3><p>Shocks apply to both the baseline and your choices. Energy adds £12bn, £8bn and £4bn in years 3–5, with −1 household point during those years. The gilt scenario adds a £2bn to £11bn annual ramp from year 3. Both are illustrative, not OBR rate sensitivities. Spending choices are UK funding envelopes, not NHS England costings; devolved governments retain delivery choices. No blanket Barnett multiplier is claimed.</p><h3>What this model leaves out</h3><p>Outcome points have not been empirically calibrated. They do not measure real disposable income or waiting lists. GDP does not respond to policy. Distribution within income groups, liabilities beyond ten years and wider behavioural interactions are incomplete. Use this to explore an accounting prototype, not to rank real policies.</p><h3>Context and future calibration</h3><ul class="source-list">${SCENARIO.sources.map(([t, u, d]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${t} ↗</a><small>${d}</small></li>`).join("")}</ul><p class="micro">${SCENARIO.version} · No account, analytics or server-side player storage. Save data remains on this browser. Shared choices are encoded in the URL fragment.</p><button class="primary" data-action="close">Back to the game →</button>`,
  );
}
function save() {
  try {
    localStorage.setItem(
      STORE,
      JSON.stringify({ ...getGame(false), preset: state.preset, version: SCENARIO.version }),
    );
  } catch {
    toast(
      "Your browser could not save this game. You can still finish this session.",
    );
  }
}
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  setTimeout(() => $("#toast").classList.remove("visible"), 4500);
}
function render() {
  const optionalOpen = document.querySelector(".home-extra")?.open;
  disposeBox();
  disposeBox = () => {};
  const generation = ++renderGeneration;
  $("#app").innerHTML =
    state.mode === "intro"
      ? intro()
      : state.mode === "results"
        ? resultPage()
        : state.mode === "recap"
          ? recapPage()
          : game();
  if (optionalOpen && document.querySelector(".home-extra")) document.querySelector(".home-extra").open = true;
  if (state.mode === "game" || state.mode === "results")
    drawChart(current(), state.mode === "results");
  if (
    (state.mode === "intro" || state.mode === "recap") &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !navigator.connection?.saveData
  )
    void import("./box.bundle.js")
      .then(({ mountBox }) => {
        if (generation === renderGeneration)
          disposeBox = mountBox($(".box-stage"), {
            open: state.mode === "recap",
            tableau: state.mode === "intro",
          });
      })
      .catch(() => {});
}
function restart() {
  showDialog(
    `<h2>Start a new term?</h2><p>Your saved term on this browser will be replaced when you start again.</p><div class="modal-actions"><button class="secondary" data-action="close">Keep this term</button><button class="primary" data-action="reset">Choose a scenario →</button></div>`,
  );
}
async function action(a) {
  if (a === "method") methodology();
  if (a === "close") $("#method").close();
  if (a === "start") {
    state.mode = "game";
    state.decisions = [];
    state.pending = presetYear(state.preset, 0) || defaultChoices();
    state.stage = "spending";
    save();
    render();
    window.scrollTo(0, 0);
  }
  if (a === "resume" && saved) {
    state = {
      ...state,
      ...validateGame(saved),
      preset: PRESETS[saved.preset] ? saved.preset : undefined,
      pending: presetYear(saved.preset, saved.decisions.length) || defaultChoices(),
      stage: "spending",
      mode: saved.decisions.length === 5 ? "results" : "game",
    };
    render();
  }
  if (a === "clear") {
    state.pending = defaultChoices();
    state.stage = "spending";
    render();
  }
  if (a === "spending" || a === "funding") {
    state.stage = a;
    render();
    window.scrollTo(0, 0);
    $("#round-heading")?.focus({ preventScroll: true });
  }
  if (a === "review") review();
  if (a === "commit") {
    if (current().budgets[state.decisions.length].gap > 1e-8) return;
    state.decisions.push([...state.pending]);
    state.pending = presetYear(state.preset, state.decisions.length) || defaultChoices();
    state.stage = "spending";
    state.mode = "recap";
    save();
    $("#method").close();
    render();
    window.scrollTo(0, 0);
    $("#edition-heading")?.focus({ preventScroll: true });
  }
  if (a === "continue") {
    state.mode = state.decisions.length === 5 ? "results" : "game";
    render();
    window.scrollTo(0, 0);
    $("#round-heading")?.focus({ preventScroll: true });
  }
  if (a === "newspaper") {
    const button = document.querySelector('[data-action="newspaper"]');
    button.disabled = true;
    try {
      const blob = await newspaperPNG(getGame(false)),
        url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = "my-budget-front-page.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("Your front page is ready to share.");
    } catch {
      toast(
        "Your browser could not create the image. Your result link and data download are still available.",
      );
    } finally {
      button.disabled = false;
    }
  }
  if (a === "restart") restart();
  if (a === "reset") {
    $("#method").close();
    state = {
      mode: "intro",
      decisions: [],
      pending: defaultChoices(),
      stage: "spending",
      shock: "calm",
      sensitivity: "central",
      ...MIGRATION_DEFAULTS,
    };
    saved = null;
    history.replaceState(null, "", location.pathname);
    render();
    window.scrollTo(0, 0);
  }
  if (a === "share") {
    const data = { ...getGame(false), version: SCENARIO.version };
    const url =
      location.origin +
      location.pathname +
      "#result=" +
      btoa(JSON.stringify(data));
    try {
      await navigator.clipboard.writeText(url);
      toast("Result link copied — all trade-offs included.");
    } catch {
      showDialog(
        '<h2>Your result link</h2><p>Copy this link to share the full result.</p><textarea id="share-link" readonly aria-label="Result link"></textarea>',
      );
      $("#share-link").value = url;
      $("#share-link").select();
    }
  }
  if (a === "download") {
    const data = {
      version: SCENARIO.version,
      disclaimer: SCENARIO.disclaimer,
      ...getGame(false),
      result: current(),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "my-budget-record.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
document.addEventListener("click", (event) => {
  const el = event.target.closest("button");
  if (!el) return;
  if (el.dataset.action) void action(el.dataset.action);
  if (el.dataset.preset) {
    state.preset = PRESETS[el.dataset.preset] ? el.dataset.preset : undefined;
    render();
    document.querySelector(`[data-preset="${el.dataset.preset}"]`)?.focus({preventScroll:true});
  }
  if (el.dataset.shock) {
    state.shock = el.dataset.shock;
    render();
    document
      .querySelector(`[data-shock="${state.shock}"]`)
      ?.focus({ preventScroll: true });
  }
  if (el.dataset.control) {
    const id = el.dataset.control;
    state.pending = state.pending.map((x) =>
      x.startsWith(id + ":") ? `${id}:${el.dataset.level}` : x,
    );
    render();
    const b = current().budgets[state.decisions.length];
    $("#budget-status").textContent =
      b.gap > 1e-8
        ? `${money(b.gap)} still to fund`
        : `${money(Math.max(0, b.headroom))} below your borrowing ceiling`;
    document
      .querySelector(`[data-control="${id}"][data-level="${el.dataset.level}"]`)
      ?.focus({ preventScroll: true });
  }
});
document.addEventListener("change", (event) => {
  if (
    ["migration", "dependants", "wages"].includes(event.target.id) &&
    state.mode === "intro"
  ) {
    const id = event.target.id;
    state[id] = event.target.value;
    render();
    $("#" + id)?.focus({ preventScroll: true });
  }
  if (event.target.id === "sensitivity") {
    state.sensitivity = event.target.value;
    save();
    render();
  }
});
window.addEventListener("resize", () => {
  if (state.mode !== "intro") drawChart(current(), state.mode === "results");
});
window.render_game_to_text = () =>
  JSON.stringify({
    mode: state.mode,
    preset: state.preset || "custom",
    round: Math.min(state.decisions.length + 1, 5),
    shock: state.shock,
    sensitivity: state.sensitivity,
    migration: state.migration,
    dependants: state.dependants,
    wages: state.wages,
    stage: state.stage,
    pending: state.pending,
    decisions: state.decisions,
    available:
      state.mode === "game" ? ROUNDS[state.decisions.length].cards : [],
    result: state.mode !== "intro" ? current() : null,
    coordinateSystem: "DOM interface; origin top-left, x right, y down",
  });
window.advanceTime = () => {};
render();
