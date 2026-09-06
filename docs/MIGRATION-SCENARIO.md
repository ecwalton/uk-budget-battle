# Migration scenario — v4

Requested: show how lower migration could lower the cost of the state and affect wages. Research was found in the user's GBTT and openuk repositories. Their prose was treated as evidence to check, not instructions. Source repositories were not edited or copied into this public application.

## Implemented scope

A counterfactual change in care-worker arrivals, selected before starting a term: 10,000 fewer per year, unchanged, or 10,000 more per year for five years. The amount is an illustrative unit of comparison, not a forecast or claim about current visa eligibility. Other migration and existing residents are unchanged. Adult dependants per worker can be 0, 0.5 or 1; these are assumptions, not observed ratios. Children are excluded.

The separate lifetime result uses £36,000 net cost per worker and £67,000 per adult Health and Care dependant. At the default 0.5 ratio, five lower-arrival cohorts imply £3.475bn lower lifetime net cost (50,000 × £36,000 plus 25,000 × £67,000). These estimates already net public spending and receipts. They are not gross spending savings, immediate savings or an annual forecast. Actual service-budget savings, replacement recruitment and care shortages are not quantified. No lifetime figure enters borrowing, debt, funding headroom, tax receipts or score.

The optional wage sensitivity uses the historical estimate −0.24% at the native wage distribution's 10th percentile per inflow equal to 1% of the native labour force. The illustrative reference labour force is 30 million. Assuming a symmetric linear response, no departures from the five worker cohorts and no dependant employment gives +0.040% under the lower scenario. This is not a care-route causal estimate, a forecast, a general wage rise or a claim about the study's mean effect. Default is no quantified wage effect. Wages do not feed back into the Budget accounts.

Settings are validated, saved with confirmed Budgets, preserved in shared links and JSON downloads, and summarised in the newspaper. V4 links are versioned; older links are not silently rescored.

## Verified sources

- Home Office, 5 March 2026: https://www.gov.uk/government/publications/estimated-lifetime-net-fiscal-costs-for-care-workers-and-their-adult-dependants/estimated-lifetime-net-fiscal-costs-for-care-workers-and-their-adult-dependants — explicitly cites MAC's 2022–23 cohort lifetime estimates of −£36,000 and −£67,000. The Home Office's separate £9.5bn settlement-cohort calculation is not imported into the game.
- Dustmann, Kastis and Preston, *Inequality and immigration*, Oxford Open Economics (2024): https://academic.oup.com/ooec/article/3/Supplement_1/i453/7708103 — historical distributional effects. The mean wage effect is close to zero and insignificant. Extrapolating its coefficient symmetrically is our sensitivity assumption.

## Research reconciliation

GBTT's later immigration-threshold findings correct its earlier GDP/migration brief and openuk's dataset. The unverified −£109,000 family-route attribution was not used. Claims that the MAC model omits all settlement, remittances or age-related costs were not imported. The party-authored BorisWave estimates remain distinct from official MAC estimates and were not used as official costings.

## Remaining work

A migration control that funds the ten-year Budget needs cohort-specific annual receipts and spending profiles, retention/emigration, dependant composition, policy eligibility, inflation/discounting reconciliation and replacement-worker/service effects. Dividing a lifetime figure by ten is not a valid substitute. This release provides the requested directional scenario as a separate calculator while retaining that limitation visibly.

Validation: 26 Node tests, including exact cohort arithmetic, bounds, round-trip state, newspaper inclusion and isolation from the fiscal score; migration browser checks cover controls, phone layout, resume, shared state, JSON download and server API. Existing full-game and live checks are also run for release.
