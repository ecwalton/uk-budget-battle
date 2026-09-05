import { SCENARIO, SHOCKS, ROUNDS, CARDS } from "./scenario.js";
import { simulate, validateGame, policyCost } from "./engine.js";
const $ = (s) => document.querySelector(s),
  money = (n) => `£${Math.abs(n).toFixed(1)}bn`,
  signed = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}`;
const STORE = "budget-battle-v1";
let disposeBox = () => {},
  renderGeneration = 0;
let state = {
    mode: "intro",
    decisions: [],
    pending: [],
    shock: "calm",
    sensitivity: "central",
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
  return `${header()}<main id="main" class="intro"><div class="hero"><section><div class="eyebrow"><span class="red-dot"></span> THE RED BOX IS YOURS</div><h1>Everyone wants<br>more.<br><em>You do the maths.</em></h1><p class="lede">Five Budgets. Fifteen decisions. A country of competing priorities. Step into the Treasury and find out what you’re willing to trade.</p><p class="training-label">Illustrative training scenario · not an official forecast</p><div class="hero-actions"><button class="primary" id="start-btn" data-action="start">Take the red box <span>→</span></button>${saved ? '<button class="secondary" data-action="resume">Resume your term</button>' : ""}</div><p class="micro">5–8 minutes <span>·</span> No sign-up <span>·</span> Your choices stay in your browser</p></section><aside class="dossier"><div class="file-tab">YOUR FIRST BRIEFING</div><div class="dossier-top"><span>HM TREASURY / TRAINING EXERCISE</span><span>01</span></div><div class="box-stage"><div class="red-box"><span class="handle"></span><span class="box-lock">◆</span><span class="box-label">THE BUDGET<br><b>YOUR CALL.</b></span></div></div><h2>There is no painless Budget.</h2><p>Borrowing is already falling in the baseline. Your challenge: improve it by <strong>£15bn a year</strong> by Budget 5, sustain that average over the next five years, and avoid breaching the game’s service or household safeguards.</p><div class="briefing-stats"><div><strong>5</strong><span>Budgets to deliver</span></div><div><strong>10</strong><span>years of consequences</span></div></div><span class="stamp">EVERY CHOICE HAS A COST</span></aside></div><section class="scenario-picker"><div><div class="eyebrow">CHOOSE YOUR ECONOMIC BACKDROP</div><p>Same choices. Different conditions.</p></div><div class="scenario-options">${Object.entries(
    SHOCKS,
  )
    .map(
      ([id, s], i) =>
        `<button class="scenario ${state.shock === id ? "active" : ""}" data-shock="${id}" aria-pressed="${state.shock === id}"><span class="scenario-num">0${i + 1}</span><strong>${s.name}</strong><small>${s.subtitle}</small></button>`,
    )
    .join(
      "",
    )}</div></section><div class="intro-bottom"><p><strong>A game about trade-offs, not a forecast.</strong> All financial paths and outcome points here are illustrative training assumptions. Read the model, challenge it, and try another approach.</p>${building()}</div></main>${footer()}`;
}
function getGame(includePending = true) {
  return {
    decisions:
      includePending && state.decisions.length < 5
        ? [...state.decisions, state.pending]
        : state.decisions,
    shock: state.shock,
    sensitivity: state.sensitivity,
  };
}
function current() {
  return simulate(getGame());
}
function metrics(result, index) {
  const y = result.years[index];
  return `<section class="metrics" aria-label="Budget indicators"><div><span>ANNUAL BORROWING <small>BUDGET ${index + 1}</small></span><strong>${money(y.borrowing)}</strong><small>Existing plans: ${money(y.baseline)}</small></div><div><span>CHANGE VS EXISTING PLANS</span><strong class="${y.delta <= 0 ? "positive" : "negative"}">${signed(y.delta)}<i>bn</i></strong><small>${y.delta === 0 ? "No change in" : y.delta < 0 ? "Less" : "More"} borrowing this year</small></div><div><span>PUBLIC CAPACITY</span><strong>${signed(y.service)}<i>pts</i></strong><small>Illustrative change · floor −5</small></div><div><span>LOWEST HOUSEHOLD SCORE</span><strong>${signed(Math.min(...y.pressure))}<i>pts</i></strong><small>Across income groups · floor −5</small></div></section>`;
}
function cardHTML(c) {
  const active = state.pending.includes(c.id),
    cost = policyCost(c, 0, state.sensitivity),
    last = policyCost(c, 4, state.sensitivity);
  return `<article class="policy ${active ? "selected" : ""}"><div class="policy-top"><span class="eyebrow">${c.category}</span><span class="selection-mark" aria-hidden="true">${active ? "✓" : "+"}</span></div><h3>${c.title}</h3><p>${c.note}</p><div class="policy-cost"><span>${cost <= 0 ? "RELEASES" : "COSTS"} IN FIRST YEAR</span><strong class="${cost <= 0 ? "positive" : ""}">${money(cost)}</strong></div><div class="policy-meta"><span>${c.oneOff ? "One-off / later costs" : "Continuing commitment"}</span><span>${c.lag ? "Effects lag " + c.lag + " yr" : "Effects start now"}</span></div><details><summary>See the assumptions</summary><div class="assumptions"><p>${c.scope}. ${c.certainty}; no official costing is claimed.</p><p>Annual net cost after five years: ${signed(last)}bn. Capacity: ${signed(c.service)} points after the lag. Household points, lowest to highest income: ${c.pressure.map(signed).join(", ")}.</p>${c.uncertain ? "<p>Cautious delivery halves net savings after implementation; upfront costs remain.</p>" : ""}</div></details><button class="${active ? "chosen" : "secondary"} choose" data-card="${c.id}" aria-pressed="${active}">${active ? "✓ In your Budget" : "Add to your Budget"}</button></article>`;
}
function chart(result, full = false) {
  const yrs = full ? result.years : result.years.slice(0, 5);
  return `<div class="chart-head"><div><div class="eyebrow">THE BORROWING PATH</div><h3>${full ? "Your term, and what comes after." : "Your choices change the trajectory."}</h3></div><div class="legend"><span><i class="base-dot"></i>Existing plans</span><span><i class="player-dot"></i>Your Budgets</span></div></div><canvas id="trajectory" width="950" height="220" role="img" aria-label="Annual borrowing in billions, your plan versus existing plans. Exact figures in the table below."></canvas><details class="chart-data"><summary>Read chart values as a table</summary><div class="table-scroll"><table><thead><tr><th>Budget year</th><th>Existing plans £bn</th><th>Your plan £bn</th><th>Model debt % GDP</th></tr></thead><tbody>${yrs.map((y) => `<tr><th>${y.year}${y.year > 5 ? " · legacy" : ""}</th><td>${y.baseline.toFixed(1)}</td><td>${y.borrowing.toFixed(1)}</td><td>${y.debtRatio.toFixed(1)}</td></tr>`).join("")}</tbody></table></div></details>`;
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
    r = ROUNDS[n],
    result = current(),
    committed = simulate(getGame(false));
  return `${header()}<main id="main" class="game"><div class="game-top"><div class="eyebrow">YOUR TERM AT THE TREASURY</div><button class="text-button" data-action="restart">Start a new term ↺</button></div><ol class="steps">${ROUNDS.map((r, i) => `<li class="${i === n ? "now" : i < n ? "done" : ""}" ${i === n ? 'aria-current="step"' : ""}><span>${i < n ? "✓" : i + 1}</span><div>Budget ${i + 1}<small>${r.label}</small></div></li>`).join("")}</ol>${metrics(result, n)}<div class="round-title"><section><div class="eyebrow">BUDGET ${n + 1} OF 5 <span> / </span> ${r.label.toUpperCase()}</div><h1 tabindex="-1" id="round-heading">${r.title}</h1><p>${r.text}</p></section><blockquote>${r.voice}<cite>— ${r.speaker} · fictional</cite></blockquote></div>${n === 2 && state.shock !== "calm" ? `<aside class="shock-banner"><strong>ECONOMIC UPDATE / ${SHOCKS[state.shock].name}</strong><span>The shock now affects both your plan and the comparator. ${money(SHOCKS[state.shock].borrowing[n])} extra baseline borrowing this year.</span></aside>` : ""}<div class="policy-grid">${r.cards.map((id) => cardHTML(CARDS.find((c) => c.id === id))).join("")}</div><div class="decision-bar"><div><strong>${state.pending.length ? state.pending.length + " measure" + (state.pending.length === 1 ? "" : "s") + " in this Budget" : "Keep existing plans, or make a change."}</strong><span>New package this year: ${signed(result.years[n].primary - committed.years[n].primary)}bn · Choices stay editable until you confirm.</span></div><div class="decision-actions"><button class="text-button" data-action="clear" ${!state.pending.length ? "disabled" : ""}>Clear choices</button><button class="primary" data-action="review">Review Budget ${n + 1} <span>→</span></button></div></div><section class="chart-panel">${chart(result)}</section><div class="game-note"><span>Training assumptions · no official policy costings</span><label>Delivery outlook <select id="sensitivity"><option value="central" ${state.sensitivity === "central" ? "selected" : ""}>Central</option><option value="cautious" ${state.sensitivity === "cautious" ? "selected" : ""}>Cautious reform delivery</option></select></label></div></main>${footer()}`;
}
function review() {
  const result = current(),
    n = state.decisions.length,
    y = result.years[n];
  showDialog(
    `<div class="eyebrow">BEFORE YOU OPEN THE RED BOX</div><h2>Review Budget ${n + 1}</h2><p>${state.pending.length ? "You are committing to these measures:" : "You are keeping existing plans this year. Earlier commitments continue."}</p><ul>${state.pending.map((id) => `<li>${CARDS.find((c) => c.id === id).title}</li>`).join("")}</ul><div class="review-total"><span>Borrowing this year</span><strong>${money(y.borrowing)}</strong><small>${signed(y.delta)}bn against existing plans</small></div><p>Year 5 annual improvement (target £15bn): <strong>${signed(result.annualImprovement)}bn</strong>. Years 6–10 cumulative improvement (target £75bn): <strong>${signed(result.legacyImprovement)}bn</strong>.</p>${state.pending.some((id) => CARDS.find((c) => c.id === id).oneOff) ? '<p class="warning">One-off savings do not fund continuing commitments. Later costs are included in your legacy.</p>' : ""}<p>Lowest household score across ten years: ${signed(result.worstPressure)} points. Lowest capacity: ${signed(result.worstService)} points. Both game floors are −5.</p><div class="modal-actions"><button class="secondary" data-action="close">Keep editing</button><button class="primary" data-action="commit">Confirm Budget ${n + 1} →</button></div>`,
  );
}
function resultPage() {
  const result = current(),
    last = result.years[4],
    best = result.passed
      ? "You made room. At a price."
      : result.fiscalPass
        ? "A stronger Budget. An unfinished legacy."
        : "The next Chancellor has work to do.";
  return `${header()}<main id="main" class="results"><div class="eyebrow">YOUR TERM IS COMPLETE / ${SHOCKS[state.shock].name.toUpperCase()}</div><h1>${best}</h1><p class="lede">Five Budgets later, here’s what your decisions leave behind.</p><div class="result-summary"><div class="result-main"><span>ANNUAL BORROWING IMPROVEMENT IN YEAR 5</span><strong>${signed(result.annualImprovement)}<i>£bn</i></strong><p>Against the same economic backdrop, under existing plans.</p></div><div class="score-checks">${[
    [
      result.fiscalPass,
      "At least £15bn annual improvement",
      `${signed(result.annualImprovement)}bn in year 5`,
    ],
    [
      result.legacyPass,
      "Keep £15bn average improvement in legacy",
      `${signed(result.legacyImprovement / 5)}bn a year in years 6–10`,
    ],
    [
      result.servicePass,
      "Public capacity stays above −5",
      `${signed(result.worstService)} points at its lowest`,
    ],
    [
      result.incomePass,
      "Every income group stays above −5",
      `${signed(result.worstPressure)} points at its lowest`,
    ],
  ]
    .map(
      ([pass, title, sub]) =>
        `<div><span class="${pass ? "positive" : "negative"}">${pass ? "✓" : "×"}</span><p><strong>${title}</strong><small>${sub}</small></p></div>`,
    )
    .join(
      "",
    )}</div></div><p class="micro">These are disclosed training-game thresholds, not an economic sustainability assessment. No political score is used.</p><section class="chart-panel">${chart(result, true)}</section><section class="legacy-grid"><div><div class="eyebrow">THE FIVE YEARS AFTER YOU LEAVE</div><h2>Your legacy keeps running.</h2><p>Recurring policies stay in place. Deferred bills arrive. There are no new decisions in years 6–10.</p><div class="legacy-number">${signed(result.legacyImprovement)}<span>£bn cumulative borrowing improvement<br>in years 6–10</span></div><p class="micro">Model debt at year 10: ${result.years[9].debtRatio.toFixed(1)}% of GDP; existing plans ${result.years[9].baseDebtRatio.toFixed(1)}%. A simplified debt accumulation, not official PSND.</p></div><div><div class="eyebrow">WHO FEELS IT / YEAR 5</div><h2>Households aren’t an average.</h2><div class="households">${last.pressure.map((v, i) => `<div><span>${["Lowest", "Lower-middle", "Middle", "Upper-middle", "Highest"][i]} income</span><strong class="${v < 0 ? "negative" : "positive"}">${signed(v)} pts</strong></div>`).join("")}</div><p class="micro">Illustrative pressure/relief points. Not estimated disposable income. Public services are shown separately.</p></div></section><section class="record"><div class="eyebrow">YOUR RECORD</div><h2>Five Budgets, in the books.</h2>${state.decisions.map((ids, i) => `<div><span>0${i + 1}</span><p>${ids.length ? ids.map((id) => CARDS.find((c) => c.id === id).title).join(" · ") : "Kept existing plans"}</p></div>`).join("")}</section><div class="result-actions"><button class="primary" data-action="share">Copy your result link ↗</button><button class="secondary" data-action="download">Download your record</button><button class="text-button" data-action="restart">Try another approach →</button></div><p class="micro">Sharing includes all your choices, the scenario, safeguards and model version.</p></main>${footer()}`;
}
function showDialog(html) {
  $("#method-content").innerHTML =
    `<button class="dialog-close" data-action="close" aria-label="Close dialog">×</button>${html}`;
  if (!$("#method").open) $("#method").showModal();
}
function methodology() {
  showDialog(
    `<div class="eyebrow">OPEN BOOKS</div><h2>How the numbers work.</h2><p><strong>${SCENARIO.disclaimer}</strong></p><h3>The challenge</h3><p>Improve annual borrowing by £15bn in year 5 against existing plans, and average at least £15bn a year in years 6–10. Keep capacity and all household-group scores at −5 or above across ten years. These thresholds are game design choices. There is no electoral prediction or fiscal-rule score.</p><h3>The accounting</h3><p>Each policy has an annual net cost profile. Earlier choices continue. Net policy costs plus 3% interest on last year’s accumulated extra debt produce the borrowing change. The rates scenario adds one point to that marginal rate from year 3. No shock reprices the full starting debt stock.</p><p>Baseline borrowing is £130, £118, £105, £93, £80, £76, £72, £68, £64 and £60 billion. Starting model debt is £2,850bn; GDP starts at £3,000bn and grows 4% nominally. These are training inputs. Debt is simplified accumulated borrowing, not a reconciliation to PSND or PSNFL.</p><h3>Delayed costs and uncertain delivery</h3><p>Years 6–10 retain each policy’s explicit cost profile. Capacity and household effects activate after a stated lag; points are levels, not changes compounded annually. Cautious delivery halves net procurement and compliance savings. No extra tax haircut or automatic investment growth dividend is applied.</p><h3>Shocks and territorial scope</h3><p>Shocks apply to both the baseline and your choices. Energy adds £12bn, £8bn and £4bn in years 3–5, with −1 household point during those years. The gilt scenario adds a £2bn to £11bn annual ramp from year 3. Both are illustrative, not OBR rate sensitivities. Health, education and care cards are UK funding envelopes, not NHS England costings; devolved governments retain delivery choices. No blanket Barnett multiplier is claimed.</p><h3>What this model leaves out</h3><p>Outcome points have not been empirically calibrated. They do not measure real disposable income or waiting lists. GDP does not respond to policy. Distribution within income groups, liabilities beyond ten years and wider behavioural interactions are incomplete. Use this to explore an accounting prototype, not to rank real policies.</p><h3>Context and future calibration</h3><ul class="source-list">${SCENARIO.sources.map(([t, u, d]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${t} ↗</a><small>${d}</small></li>`).join("")}</ul><p class="micro">${SCENARIO.version} · No account, analytics or server-side player storage. Save data remains on this browser. Shared choices are encoded in the URL fragment.</p><button class="primary" data-action="close">Back to the game →</button>`,
  );
}
function save() {
  try {
    localStorage.setItem(
      STORE,
      JSON.stringify({ ...getGame(false), version: SCENARIO.version }),
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
  disposeBox();
  disposeBox = () => {};
  const generation = ++renderGeneration;
  $("#app").innerHTML =
    state.mode === "intro"
      ? intro()
      : state.mode === "results"
        ? resultPage()
        : game();
  if (state.mode !== "intro") drawChart(current(), state.mode === "results");
  else if (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !navigator.connection?.saveData
  )
    void import("./box.bundle.js")
      .then(({ mountBox }) => {
        if (generation === renderGeneration)
          disposeBox = mountBox($(".box-stage"));
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
    state.pending = [];
    save();
    render();
    window.scrollTo(0, 0);
  }
  if (a === "resume" && saved) {
    state = {
      ...state,
      ...validateGame(saved),
      pending: [],
      mode: saved.decisions.length === 5 ? "results" : "game",
    };
    render();
  }
  if (a === "clear") {
    state.pending = [];
    render();
  }
  if (a === "review") review();
  if (a === "commit") {
    state.decisions.push([...state.pending]);
    state.pending = [];
    state.mode = state.decisions.length === 5 ? "results" : "game";
    save();
    $("#method").close();
    render();
    window.scrollTo(0, 0);
    $("#round-heading")?.focus({ preventScroll: true });
  }
  if (a === "restart") restart();
  if (a === "reset") {
    $("#method").close();
    state = {
      mode: "intro",
      decisions: [],
      pending: [],
      shock: "calm",
      sensitivity: "central",
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
  if (el.dataset.shock) {
    state.shock = el.dataset.shock;
    render();
    document
      .querySelector(`[data-shock="${state.shock}"]`)
      ?.focus({ preventScroll: true });
  }
  if (el.dataset.card) {
    const id = el.dataset.card;
    state.pending = state.pending.includes(id)
      ? state.pending.filter((x) => x !== id)
      : [...state.pending, id];
    render();
    document
      .querySelector(`[data-card="${id}"]`)
      ?.focus({ preventScroll: true });
  }
});
document.addEventListener("change", (event) => {
  if (event.target.id === "sensitivity") {
    state.sensitivity = event.target.value;
    save();
    render();
  }
});
window.addEventListener("resize", () => {
  if (state.mode !== "intro") drawChart(current(), state.mode === "results");
  else if (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !navigator.connection?.saveData
  )
    void import("./box.bundle.js")
      .then(({ mountBox }) => {
        if (generation === renderGeneration)
          disposeBox = mountBox($(".box-stage"));
      })
      .catch(() => {});
});
window.render_game_to_text = () =>
  JSON.stringify({
    mode: state.mode,
    round: Math.min(state.decisions.length + 1, 5),
    shock: state.shock,
    sensitivity: state.sensitivity,
    pending: state.pending,
    decisions: state.decisions,
    available:
      state.mode === "game" ? ROUNDS[state.decisions.length].cards : [],
    result: state.mode !== "intro" ? current() : null,
    coordinateSystem: "DOM interface; origin top-left, x right, y down",
  });
window.advanceTime = () => {};
render();
