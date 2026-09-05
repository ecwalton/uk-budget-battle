import { CARDS, ENVELOPES, TAXES, SHOCKS, SCENARIO } from "./scenario.js";
import { policyCost, simulate } from "./engine.js";
const amount = (n) =>
  `${n < 0 ? "−" : n > 0 ? "+" : ""}£${Math.abs(n).toFixed(1)}bn`;
export function budgetStory(game, index) {
  const selected = game.decisions[index].map((id) =>
    CARDS.find((c) => c.id === id),
  );
  const spending = selected.filter(
    (c) => ENVELOPES.some((e) => e.id === c.group) && c.level !== 0,
  );
  const taxes = selected.filter(
    (c) => TAXES.some((e) => e.id === c.group) && c.level !== 0,
  );
  const lead =
    [...spending].sort(
      (a, b) => Math.abs(policyCost(b, 0)) - Math.abs(policyCost(a, 0)),
    )[0] || taxes[0];
  let headline = "Existing commitments carry the Budget.",
    deck =
      "No new spending or tax changes this year. Previous decisions, phased changes and later bills continue.";
  if (lead) {
    const envelope = ENVELOPES.find((c) => c.id === lead.group),
      tax = TAXES.find((c) => c.id === lead.group);
    if (envelope) {
      headline =
        lead.level > 0
          ? `${envelope.title} gets a larger settlement.`
          : `A tighter settlement for ${envelope.title.toLowerCase()}.`;
      deck = `${envelope.title}: ${amount(lead.level * envelope.step)} in eventual annual funding from this decision. ${envelope.note}`;
    } else {
      headline = `${tax.title} ${lead.level > 0 ? "rises" : "falls"} in your new Budget.`;
      deck = `This decision ${lead.level > 0 ? "raises" : "gives up"} ${amount(Math.abs(policyCost(lead, 0, game.sensitivity)))} of receipts this year. ${tax.note}`;
    }
  }
  const cost = spending.reduce(
      (s, c) => s + policyCost(c, 0, game.sensitivity),
      0,
    ),
    revenue = -taxes.reduce(
      (s, c) => s + policyCost(c, 0, game.sensitivity),
      0,
    );
  const delayed = spending
    .filter((c) => c.lag > 0)
    .map(
      (c) =>
        `${ENVELOPES.find((e) => e.id === c.group).title}: modelled capacity ${c.level > 0 ? "gain" : "loss"} begins in year ${index + c.lag + 1}.`,
    );
  return { headline, deck, cost, revenue: revenue || 0, delayed };
}
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
const wrap = (s, max) => {
  const lines = [];
  let line = "";
  for (const word of s.split(/\s+/)) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines;
};
export function newspaperSVG(game) {
  const result = simulate(game),
    fifth = result.years[4],
    legacy = result.years[9];
  const title = result.passed
    ? "A settlement that holds."
    : result.fiscalPass
      ? "Stronger books. A difficult legacy."
      : "The next Chancellor has work to do.";
  const text = (s, x, y, size = 22, extra = "") =>
    `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(s)}</text>`;
  const paragraph = (s, x, y, max, size = 21, line = 29) =>
    wrap(s, max)
      .map((t, i) => text(t, x, y + i * line, size))
      .join("");
  const rule = (y) => `<path d="M64 ${y}H1136" stroke="#bdb4a5"/>`;
  const years = result.years,
    values = years.flatMap((y) => [y.baseline, y.borrowing]);
  const min = Math.min(0, ...values),
    max = Math.max(...values) + 15;
  const px = (i) => 84 + i * 112,
    py = (v) => 770 - ((v - min) / (max - min)) * 178;
  const path = (key) =>
    years.map((y, i) => `${i ? "L" : "M"}${px(i)} ${py(y[key])}`).join(" ");
  const record = game.decisions
    .map((ids, i) => {
      const changed = ids
        .map((id) => CARDS.find((c) => c.id === id))
        .filter((c) => c.level !== 0 && c.group !== "borrowing");
      const summary = changed.length
        ? changed.map((c) => c.title).join(" · ")
        : "No new spending or tax changes";
      const borrowing = CARDS.find(
        (c) => c.id === ids.find((id) => id.startsWith("borrowing:")),
      ).title;
      return (
        text(
          `0${i + 1}`,
          68,
          908 + i * 110,
          27,
          'fill="#852c37" font-weight="bold"',
        ) +
        paragraph(summary, 125, 899 + i * 110, 91, 19, 25) +
        text(
          `${borrowing} · actual £${result.years[i].borrowing.toFixed(1)}bn`,
          125,
          976 + i * 110,
          15,
          'fill="#666259"',
        )
      );
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1720" viewBox="0 0 1200 1720"><rect width="1200" height="1720" fill="#f7f4eb"/><g fill="#26333d" font-family="Georgia, serif">${text("THE BUDGET BATTLE", 600, 105, 64, 'text-anchor="middle" font-weight="bold"')}${text("YOUR TERM IN PRINT", 600, 142, 17, 'text-anchor="middle" letter-spacing="5"')}${rule(167)}${text("FIVE BUDGETS · TEN YEARS OF CONSEQUENCES", 64, 199, 16)}${text(SHOCKS[game.shock].name.toUpperCase(), 1136, 199, 16, 'text-anchor="end"')}${rule(221)}${paragraph(title, 64, 294, 36, 53, 61)}${text("You allocated the money. Here is the settlement you leave.", 64, 445, 23)}${rule(473)}${text("YEAR 5 UNDERLYING IMPROVEMENT", 64, 512, 15)}${text(amount(result.annualImprovement), 64, 571, 49, 'fill="#852c37"')}${text("ACTUAL YEAR 5 BORROWING", 665, 512, 15)}${text(`£${fifth.borrowing.toFixed(1)}bn`, 665, 571, 49)}<rect x="588" y="594" width="522" height="189" fill="#eae5d9"/>${text("LEGACY YEARS", 620, 620, 14, 'fill="#777267"')}<path d="${path("baseline")}" fill="none" stroke="#979489" stroke-width="3" stroke-dasharray="8 7"/><path d="${path("borrowing")}" fill="none" stroke="#852c37" stroke-width="4"/>${years.map((y, i) => text(`Y${y.year}`, px(i), 801, 14, 'text-anchor="middle"')).join("")}${text("Annual borrowing: burgundy = your plan; dashed = existing plans", 64, 841, 17)}${record}${rule(1470)}${text(`Legacy underlying improvement: ${amount(result.legacyImprovement)} over years 6–10`, 64, 1508, 22)}${text(`Lowest capacity: ${result.worstService.toFixed(1)} pts · Lowest household score: ${result.worstPressure.toFixed(1)} pts`, 64, 1543, 21)}${text(`Model debt in year 10: ${legacy.debtRatio.toFixed(1)}% of GDP · Revenue outlook: ${game.sensitivity}`, 64, 1578, 19)}${rule(1602)}${text("ILLUSTRATIVE TRAINING GAME · NOT AN OFFICIAL FORECAST", 64, 1636, 16, 'fill="#852c37"')}${text("Improvement is before interest; borrowing includes interest. Points are uncalibrated.", 64, 1666, 16)}${text(`uk-budget-battle.openuk-co.workers.dev · ${SCENARIO.version}`, 64, 1693, 14)}</g></svg>`;
}
export async function newspaperPNG(game) {
  const image = new Image();
  image.src =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(newspaperSVG(game));
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1720;
  canvas.getContext("2d").drawImage(image, 0, 0);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Could not create newspaper image")),
      "image/png",
    ),
  );
}
