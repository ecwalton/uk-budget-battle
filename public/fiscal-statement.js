// OBR March 2026, 2026–27 forecast: tables A.5, A.7 and A.9.
export function fiscalStatement(choices) {
  const savings = choices[0] === 0 ? 50 : 0;
  const taxRelief = choices[1] === 0 && savings > 0 ? 30 : 0;
  return { savings, taxRelief, deferred: choices[1] === 0 && !savings,
    spending: 1419 - savings, receipts: 1304 - taxRelief,
    borrowing: 115.5 - savings + taxRelief, interest: 109.4,
    borrowingReduction: savings - taxRelief };
}
const money = n => `£${n.toLocaleString('en-GB', {maximumFractionDigits: 1})}bn`;
export function fiscalStatementHTML(choices) {
  const f = fiscalStatement(choices);
  return `<section class="fiscal-statement" aria-label="Your Budget in numbers">
    <div class="eyebrow">YOUR BUDGET IN NUMBERS / 2026–27</div>
    <p class="fiscal-number">${money(f.borrowing)}</p>
    <h2>${f.savings ? 'Annual borrowing if you deliver your targets' : 'Annual borrowing under your settlement'}</h2>
    <p>${f.borrowingReduction ? `${money(f.borrowingReduction)} less borrowing than the baseline. Your ${money(f.savings)} savings target funds ${money(f.taxRelief)} of tax relief; the rest reduces the deficit.` : `Your decisions leave the £115.5bn annual deficit unchanged. Keeping spending and taxes on their existing path still means borrowing about £316m a day.`}</p>
    ${f.deferred ? '<p><strong>Your £30bn tax pledge is on hold.</strong> Without savings, delivering it would increase annual borrowing to £145.5bn.</p>' : ''}
    <div class="fiscal-table"><table><thead><tr><th scope="col">Annual amount</th><th scope="col">Baseline</th><th scope="col">Your Budget</th></tr></thead><tbody>
    ${[['Public spending',1419,f.spending],['Taxes + other receipts',1304,f.receipts],['Borrowing',115.5,f.borrowing],['Debt interest¹',109.4,f.interest]].map(([label,base,value])=>`<tr><th scope="row">${label}</th><td>${money(base)}</td><td>${money(value)}</td></tr>`).join('')}
    </tbody></table></div>
    <p class="fiscal-note">Baseline: <a href="https://assets.publishing.service.gov.uk/media/69a6d7b62e1f4fbda4252208/economic-and-fiscal-outlook-march-2026-web-accessible.pdf#page=116" target="_blank" rel="noopener noreferrer">OBR March 2026 forecast, tables A.5, A.7 and A.9</a>. Spending and receipts are rounded to whole billions in those tables, so their displayed difference differs from borrowing by £0.5bn. ¹Central government interest, net of the Asset Purchase Facility; already included in spending.</p>
    <details class="evidence"><summary>What these numbers assume</summary><p>The £50bn net spending reduction and £30bn tax reduction are illustrative annual targets shown when you choose your policies. They are not OBR policy costings. This is a full-year comparison against the 2026–27 baseline, conditional on delivery, with no transition timetable. If savings fail, the tax cut waits and borrowing remains at the baseline.</p><p>Debt interest stays at £109.4bn in this simple comparison: no immediate refinancing windfall is assumed. Regulation, energy and migration are uncosted here; this does not mean they have no effect. No growth dividend, household income gain or migration saving is booked without a specified policy and model. Borrowing is an annual flow, not the total debt stock.</p></details>
  </section>`;
}
