# UK Budget Battle concept brief

Date: 5 September 2026  
Version: 2 following independent review  
Purpose: Define a UK budget simulation for independent critique before development.  
Status: Proposed concept; policy effects, scoring and political reactions are not yet calibrated.

## Recommendation

Create a mobile-first browser game in which the player becomes Chancellor and makes five annual Budgets. The challenge is to improve borrowing relative to the published baseline while sustaining public services and household living standards. Political reactions are optional narrative feedback and do not determine success in version 1. A typical game should take five to eight minutes.

The educational objective is to make the scale, distribution and timing of fiscal trade-offs understandable. Players should be able to pursue different strategies and inspect their consequences. The game should not imply that the lowest deficit is always the best outcome, that all borrowing is harmful, or that one political programme is uniquely correct.

The inspiration is the supplied promotion for the French game La Bataille du Budget. Its live site did not expose readable gameplay during research, so this proposal adapts the promotional premise rather than claiming to reproduce verified mechanics. [S1]

## Evidence and fiscal context

The following are research anchors, not a complete model or a live September fiscal baseline.

| Research finding | Implication for the game | Source |
|---|---|---|
| The OBR March 2026 central forecast projects borrowing falling from 5.2% of GDP in 2024–25 to 1.6% in 2030–31, with debt settling around 95% of GDP in the early 2030s. | The baseline already contains consolidation. Score additional decisions against that baseline; do not credit players for reductions already forecast. | S2 |
| Net debt interest cost £106 billion in 2024–25. | Interest is a major constraint, but savings from lower borrowing should accrue over time rather than instantly repricing the entire debt stock. | S2 |
| The OBR July 2026 long-term assessment says almost all its scenarios eventually put debt on an unsustainable path. | Include long-term pressures and uncertainty without presenting a distant conditional projection as an inevitable near-term crisis. | S3 |
| State pension spending was £138 billion in 2024–25. | Pension decisions matter at national scale. Changes to future uprating must be distinguished from cuts to current cash pensions. | S4 |
| Spending Review 2025 sets departmental settlements and funding consequences for devolved governments. | Respect existing commitments and distinguish English service decisions from UK-wide policy. | S5 |
| HMRC publishes illustrative tax-change revenue estimates. | Use dated official estimates as starting points, checking assumptions, territorial coverage and policy interactions. | S6 |

Forecasts are not outturns. Before implementation, reconcile the chosen forecast with subsequent policy changes and the latest ONS releases; retain one coherent, versioned starting scenario. The original phrase “debt is exploding” should not be used as a description of the March central forecast.

## Audience and experience

The primary audience is curious adults without specialist economic knowledge. Secondary uses include classroom discussion and public-policy engagement. Use plain English, keyboard-accessible controls, readable mobile layouts and text equivalents for charts.

Opening: “You are Chancellor. Borrowing is already forecast to fall under existing plans. Across five Budgets, decide what to change, who pays, and what happens to public services.” Show a grey existing-plans baseline alongside the player path on every fiscal chart. An unchanged package has zero incremental fiscal effect, even when borrowing falls.

Each round lets the player assemble a small package, review its effects, confirm it, and see the next year unfold. Keep facts, estimated economic effects and fictional political reactions visually distinguishable.

## UK policy choices

| Area | Illustrative choice | Consequence to represent |
|---|---|---|
| NHS and social care | Fund additional capacity, stage the increase, or retain baseline spending. | Delivery lags, workforce constraints and interaction between care and hospital capacity. |
| State pensions | Retain the triple lock or change future uprating. | Compounding fiscal effects and household consequences across income groups. |
| Schools and councils | Increase support for special educational needs and care or constrain other budgets. | Spending pressures can shift between institutions rather than disappear. |
| Housing and infrastructure | Protect, expand or defer investment. | Upfront cost, delivery risk and uncertain benefits beyond the game horizon. |
| Defence | Fund a higher spending path or change its timing. | Trade-offs with other commitments and consequences not captured by GDP alone. |
| Taxes | Change rates, thresholds or selected reliefs. | Who pays, behavioural responses, implementation timing and devolved powers. |

These are candidate cards, not endorsed policies or validated costings. Include realistic limits on each lever. Avoid a single “cut waste” or “tax billionaires” button that solves the deficit without scale, delivery or behavioural constraints.

## First decision

Illustrative scenario: “The NHS requests an extra £5 billion a year. What goes in your Budget?”

Offer four routes: raise revenue; reduce another spending line; borrow; or decline or phase the request. The £5 billion is an invented gameplay amount, not a researched estimate of NHS funding needs. Any associated devolved funding consequences must be made explicit when costing it.

Before confirmation, show the annual effect, the five-year cumulative effect, who is affected, implementation timing and uncertainty. A tax-funded option must identify a specific measure rather than assume that all tax changes have the same consequences.

## Model and scoring requirements

1. **Maintain separate accounts.** Show annual borrowing and the debt stock separately, in pounds and relative to GDP. Explain that current budget balance and overall borrowing differ because investment is included in the latter. If fiscal-rule compliance is scored, use the correct dated rule and debt measure.
2. **Use one baseline.** Apply policy changes relative to existing plans. Distinguish cash increases from inflation-adjusted or per-person changes, and recurring flows from one-off receipts.
3. **Avoid double counting.** Track overlapping tax measures, policy reversals, interactions and implementation dates. Asset sales are not recurring revenue; lower borrowing does not automatically translate one-for-one into every debt measure.
4. **Separate evidence from assumptions.** Display sourced fiscal estimates and their years. Label service, growth and political effects as model assumptions unless empirically supported. Use ranges or scenarios when precision is not justified.
5. **Represent delays and uncertainty.** Investment and service reforms need time. Spending cuts and tax increases can affect demand and receipts. Do not assume reforms fund themselves, or that every spending increase produces immediate output.
6. **Preserve institutional realism.** The Chancellor cannot set Bank of England interest rates or directly administer all devolved services. Model departmental and devolved funding appropriately.

Display borrowing, service performance and household living standards. Keep optional fictional political reactions outside the success calculation. Offer debt and distributional details on demand. Do not collapse everything into a single unexplained score. A plausible dashboard should reveal whether aggregate gains hide losses for particular households or regions.

Success should require a fiscal improvement alongside explicit service and living-standard safeguards. Exact thresholds remain a design decision for calibration and red-team review. Do not treat missing a fiscal rule as automatic insolvency. Do not model political defeat in version 1. Publish the normative service and income safeguards separately from the accounting results.

Use optional shocks such as recession, energy prices or borrowing-cost changes. Allow fixed scenarios or repeatable random seeds so players can compare policies under the same conditions. Distinguish a strategy's performance from good or bad luck.

## Minimum viable version

- Five rounds, three offered cards per round from a pool of 15–20, at most one shock per game, and an undo step before confirmation. Ensure fixed scenarios offer comparable choices.
- A transparent accounting model; precomputed scenarios are acceptable if their limitations are clear.
- A source and assumptions panel for every card, plus a dated methodology page.
- A results screen showing annual borrowing changes against baseline, debt trajectory, distributional effects and major sacrifices.
- An optional share card with the scenario version and a link to the full result. Do not expose personal information or reduce the result to a misleading victory badge.

Exclude detailed macroeconomic forecasting, individual tax advice, real election prediction and multiplayer negotiation from the first version. Use an original name, writing and visual design rather than copying the French game's assets.

## Implementation decisions following review

**Baseline and release policy.** Store assumptions, source dates, fiscal years, units, territorial scope and baseline policies in versioned data. Preserve historical scenarios. A dated March 2026 scenario remains valid as a historical exercise; a current-policy release must reconcile the latest available forecast, policy announcements and outturns without silently splicing incompatible series. Do not make release depend unconditionally on an unpublished forecast.

**Legacy beyond year five.** Add a years 6–10 panel with no extra player decisions. Carry recurring commitments, explicit expiries, deferred costs and delivery lags forward under published persistence assumptions. Show ranges and longer-lived liabilities that fall beyond year 10. Check legacy service and income safeguards as well as year-five outcomes. Do not add an arbitrary penalty designed to force investment-cutting strategies to lose. Unknown long-term effects must remain visibly uncertain; missing material effects block a success badge.

**Card data contract.** Each card needs a baseline reference, policy start and end dates, annual gross cost and yield, delivery costs, territorial coverage, current/capital classification, financial/non-financial asset classification where relevant, recurring/one-off status, interactions, distributional coverage, uncertainty and source. Each card must specify which fiscal measures it changes. Exclude measures whose core effects cannot be responsibly represented.

**Devolution.** Cost the illustrative NHS card as an additional £5 billion of NHS England spending plus separately calculated funding consequences. Use the applicable population proportions, programme comparability and relevant funding adjustments for each administration and year. Do not hard-code a universal 18% or 20% supplement. The review's roughly £5.9 billion total is a working estimate awaiting validation, not a published card price. Block grants do not require matching devolved spending on health. [S7]

**Asset transactions.** Distinguish financial asset sales from non-financial asset disposals. An ordinary financial asset sale is generally a financial transaction rather than a PSNB receipt. Its PSNFL effect depends on valuation and transaction details; selling an asset for equivalent recognised value generally exchanges assets rather than improving net financial liabilities. Non-financial disposals may affect PSNB through net investment. Validate classification, lost future income and each balance-sheet effect individually. [S8]

**Interest and inflation.** Use a consistent net-interest convention and explicit reconciliation of receipts. Model gilt yields, Bank Rate exposure and index-linked inflation separately where the relevant scenario needs them. Check the coverage of the dated OBR sensitivity before adding channels, to prevent overlap. No universal repricing of the debt stock and no unsupported £12 billion calibration.

**Delivery and tax behaviour.** Use measure-specific costs, lags, capacity limits and uncertainty for efficiency and compliance measures. Do not impose a universal three-year ramp or arbitrary cap. Record whether official tax costings already include behavioural responses; do not apply a second generic haircut or a universal one-year delay.

**Distribution and services.** Target changes in equivalised real disposable household income by income quintile, with pensioner/working-age comparisons where supported. Explain population, weighting and coverage; income does not capture public-service quality. Fiscal-event distributional tables cannot automatically be used as costings for arbitrary new packages. Unsupported policy-level distribution or service effects are release blockers for those cards, not zero effects.

**Shocks and comparisons.** Compare player and baseline under the same shock. Also show the no-shock counterfactual. Policy effects can legitimately change under shocks through interactions; do not require the incremental outcome to stay identical across seeds.

**Fiscal rules.** Version 1 does not score compliance with fiscal rules. If later added, implement the exact dated rule, target year and accounting measure rather than using PSND as a substitute for PSNFL.

## Acceptance criteria

- An unchanged package has zero incremental fiscal effect in every year, under the same scenario and shock.
- One-off proceeds occur once; recurring commitments persist. A £2 billion annual commitment funded by a £2 billion one-off receipt leaves its later costs visible. Warn rather than prohibit the package.
- Deferred commitments appear in the legacy panel. Strategy rankings are examined under alternative assumptions, never forced to meet a preferred political ranking.
- Each England service card reproduces an independently checked funding calculation. Financial asset transactions reconcile across the relevant accounts.
- Interest shocks reproduce the scope and timing of their chosen published sensitivities without overlapping effects.
- Equivalent labels and presentation do not change outcomes. Actual policies may differ; equal fiscal size does not prove equal social or political effects.
- Results and share cards show baseline-relative borrowing, major service and income effects, scenario version and shock identifier. Unquantified material harms cannot disappear behind a positive badge.
- Test comprehension of baseline, deficit and debt, and delayed costs with users. Predefine the learning objective, assess retention or transfer where feasible, and report uncertainty. A small uncontrolled improvement in a repeated quiz is useful formative evidence, not proof of educational effectiveness.

The concept can proceed to an accounting prototype once card definitions and baseline data are complete. Public release additionally requires independent accounting checks, supported outcome mappings, accessible user testing and a published methodology. Numerical outcome thresholds remain to be calibrated and must be disclosed as design judgments.

## Sources

Links consulted during the initial research on 5 September 2026. The reviewer should independently check them and search for superseding information.

- **S1:** [La Bataille du Budget](https://labatailledubudget.netlify.app/). Inspiration; gameplay not verified.
- **S2:** [OBR Economic and fiscal outlook March 2026](https://obr.uk/efo/economic-and-fiscal-outlook-march-2026/). Medium-term borrowing, debt and interest figures.
- **S3:** [OBR Fiscal risks and sustainability publications](https://obr.uk/category/fiscal-risks-and-sustainability/). July 2026 long-term assessment; navigate to the underlying report for detailed verification.
- **S4:** [OBR Fiscal risks and sustainability July 2025](https://obr.uk/frs/fiscal-risks-and-sustainability-july-2025/). State pension spending and fiscal risks.
- **S5:** [HM Treasury Spending Review 2025](https://www.gov.uk/government/publications/spending-review-2025-document/spending-review-2025-html). Departmental settlements and devolution.
- **S6:** [HMRC Direct effects of illustrative tax changes](https://www.gov.uk/government/statistics/direct-effects-of-illustrative-tax-changes). Tax ready reckoner; verify the release and implementation year before using any number.

- **S7:** [HM Treasury Block Grant Transparency October 2025 explanatory note](https://www.gov.uk/government/publications/block-grant-transparency-october-2025/block-grant-transparency-october-2025-explanatory-note). Programme comparability and population-based calculations.
- **S8:** [OBR Fiscal risks and sustainability July 2025](https://obr.uk/frs/fiscal-risks-and-sustainability-july-2025/). Financial assets, transactions and PSNFL.
