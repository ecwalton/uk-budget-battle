# UK Budget Battle: independent red team review

Review date: 5 September 2026
Reviewed: `uk-budget-battle-brief.md` (dated 5 September 2026)
Method: read the brief, fetched the French game site, checked six primary sources by web search. The Challenges article was blocked, so I used LCP, Journal du Geek and Le Figaro coverage for the French game instead. Where I could not verify, I say so.

## 1. Verdict

Proceed with conditions.

The brief is unusually careful. It already names most of the traps: baseline credit, double counting, one-off receipts, instant interest repricing. The numbers I checked are correct. The main problems are not errors. They are gaps between the stated rules and the stated experience. The opening line tells the player to "reduce borrowing" while the scoring rule says borrowing is already falling in the baseline. The five-year horizon rewards deferred cost with no counterweight. The baseline is dated March 2026 and will be superseded on 28 October 2026 by a new Chancellor's first Budget. Political support is undefined and can bias the game without anyone noticing.

Ready for a prototype once items 1 to 6 in section 6 are fixed. Not ready for public release until the October 2026 baseline is loaded, the card set passes the symmetry test and one user test shows learning.

## 2. Ranked findings

| ID | Severity | Section | Finding | Evidence or reasoning | Consequence | Smallest useful fix |
|---|---|---|---|---|---|---|
| F1 | High | Audience, Model rule 2 | Opening text and scoring rule conflict. "Five Budgets to reduce borrowing" but rule 2 scores only against baseline. | OBR March 2026: PSNB falls from 5.2% of GDP (2024-25) to 1.6% (2030-31) with no player action. | Player who does nothing sees borrowing fall by two thirds and reads it as success. Or the game penalises them for a fall that was "free". Either way the lesson is wrong. | Change opening to "Borrowing is already forecast to fall. Your job is to decide what changes on top, and who pays." Show a grey "do nothing" line on every chart. |
| F2 | High | Evidence, MVP | Baseline will be stale before launch. | Chancellor John Healey (appointed 20 July 2026) delivers his first Budget on 28 October 2026 with a new OBR EFO. 2025-26 outturn borrowing was £128bn, below the March forecast of £132.7bn. Middle East energy shock since February has changed the rate outlook. | Any number shipped from the March EFO is wrong by the time a player sees it. Credibility cost is high for a "data-led" product. | Make the baseline a versioned data file, not hard-coded. Build on March 2026 numbers. Swap to the October 2026 EFO before release. Print the version on every results screen. |
| F3 | High | Model rule 1, 5-year horizon | Nothing stops end-of-horizon dumping. Five annual Budgets end in year 5. Costs pushed to year 6 or investment cut in year 5 are free. | Brief raises this as an open question but has no mechanism. | The optimal strategy is "cut capital, defer everything, win". That is the opposite of the educational aim. | Add a fixed "legacy" panel: years 6 to 10 projected on the same rules, no new choices. Score includes a capped legacy term. Cheaper alternative: apply year 5 choices as if they persist to year 10 and show the debt path. |
| F4 | High | Evidence table | "Debt interest cost £106 billion" is the net figure. Gross public sector debt interest was about £125bn in 2024-25. | Commons Library: net debt interest £106bn, 3.6% of GDP, 2024-25. HMT PESA: gross public sector debt interest £124.7bn. | Mixed use of net and gross in cards or shocks will double count or under count APF and interest receipts. | Label as "net debt interest, £106bn, 2024-25 (gross about £125bn)". Pick net and use it everywhere. |
| F5 | High | Model rule 6, First decision | English health spending has Barnett consequences that the brief mentions but does not size. | Barnett: change in comparable English spend times population share (Scotland, Wales, NI). Health comparability is near 100%. My working estimate: a £5bn NHS England rise adds of the order of £0.9bn to devolved block grants. Check against the Statement of Funding Policy. | £5bn card costs about £5.9bn. Every England-only service card is underpriced by roughly a fifth. | Tag each spending card as "England only" or "UK wide". Apply a Barnett factor automatically to England-only cards. Show it on the cost line. |
| F6 | Medium | Model rule 1 | Fiscal rules not defined. If scored, the wrong measure will be used. | Current rules: current budget in balance or surplus by 2029-30 (moving to a rolling third year), and public sector net financial liabilities (PSNFL) falling as a share of GDP in 2029-30. OBR now assesses the rules once a year, at the autumn Budget. | A game that tracks PSND "falling" would score the wrong rule. | Either do not score the rules, or score exactly these two with PSNFL, and say the rules can change. |
| F7 | Medium | Scoring | "Political support" is undefined and can smuggle in an ideology. | Brief says reactions are fictional but the score still counts them. | If Card A (tax rise) always costs more support than Card B (spending cut) of equal size, the game teaches that cuts are cheaper politically. No evidence base is cited. | Run the symmetry test (section 4, extra scenario S9). Publish the support function. Consider political support as a display only, not part of win/lose, for version 1. |
| F8 | Medium | Model rule 4 | "Efficiency savings" and "tax compliance" cards have no cost, lag or certainty rating in the brief. | OBR certifies compliance measures with certainty ratings. Yields usually build over years and need HMRC spending. | Painless-button exploit (scenario 2). | Every such card carries a delivery cost, a three-year ramp and a "high uncertainty" flag that widens the range. Cap the total at a stated share of the gap. |
| F9 | Medium | Model rule 3 | Asset sales are treated as one issue. They are two. | Sale of a non-financial asset (land) reduces PSNB once. Sale of a financial asset (shares, loans) does not reduce PSNB at all; it reduces PSND and PSNFL only. | Card could show a "deficit fall" that national accounts would not record. | Two card types. Show the effect on each account. |
| F10 | Medium | Shocks | Interest shock design needs two channels, not one. | OBR ready reckoner: a 1 percentage point gilt rate rise adds rising amounts, about £12bn a year by year 5. A 1 point Bank Rate rise hits the APF stock almost at once then fades. RPI feeds index-linked gilts in-year. | A single "rates up" card will be wrong whichever path it picks. | Model two shocks: gilt yield (slow ramp) and Bank Rate (fast, fading). Use OBR published sensitivities as the starting point. |
| F11 | Medium | Audience | Five to eight minutes, five rounds, 15 to 20 cards, ranges, distributional panels and shocks do not fit. | Roughly 90 seconds a round. | Players skip the uncertainty screens, which are the point. | Three cards offered per round from a rotating pool. One shock per game. Detail panels one tap away, not in the main flow. |
| F12 | Medium | Living standards | "Household living standards" has no definition or data source. | None cited. | Cannot be built or audited. | Define as change in real disposable income by quintile plus a pensioner or working-age split. Source: HMT distributional analysis at each fiscal event and IFS. Nothing finer in version 1. |
| F13 | Low | Recommendation | French game described as unverified. Press coverage now describes it. | LCP, Journal du Geek, Le Figaro (2 to 5 September 2026): six-year term, 200-plus costed measures from left, right and centre, random events, Brussels oversight, rating agencies, parliamentary vote stage, made by Rayan Nezzar in about a month with AI. | No error. But the brief's five-year term and 15 to 20 cards are much smaller than the inspiration. State the difference. | Add one line: the French game has six years and 200-plus measures. Ours is deliberately smaller. Do not copy assets. |
| F14 | Low | Evidence table | "Debt settling around 95% of GDP" is right but the OBR wording is "in the early 2030s". | OBR March 2026 EFO para 1.3. | Minor. | Use OBR wording. |
| F15 | Low | Evidence table | SEND spending pressure is already in the baseline. | March 2026 EFO: £4bn a year departmental increase for SEND in the last three forecast years. | A SEND card that "adds" funding double counts unless it is on top of this. | Card text: "on top of the £4bn a year already planned". |

## 3. Claim audit

| Claim in brief | Status | Source and date | Corrected wording if needed |
|---|---|---|---|
| PSNB 5.2% of GDP 2024-25 to 1.6% 2030-31 | Verified | OBR EFO March 2026, para 1.3 | Add: "This will be superseded by the 28 October 2026 EFO." |
| Debt settling around 95% of GDP | Verified with nuance | OBR EFO March 2026; Commons Library CBP-10495 (PSND 93% end 2024-25, 96% by 2028-29, about 95% by 2030-31) | "Debt rises to about 96% then settles near 95% in the early 2030s." |
| Debt interest £106bn 2024-25 | Verified as net | Commons Library SN06167, updated July 2026 | "Net debt interest £106bn (gross about £125bn)." |
| OBR July 2026 FRS: almost all scenarios unsustainable | Verified | OBR FRS July 2026, published 7 July 2026 | Add OBR's own caveat: these are not forecasts and the unsustainable path starts around the 2040s in the central case. |
| State pension £138bn 2024-25 | Verified | OBR FRS July 2025, para 2.1 | Note: Great Britain figure; NI is separate. Some sources show £145.6bn for 2025-26. |
| Spending Review 2025 sets settlements | Verified, not re-read | HMT SR2025 | No change. |
| HMRC illustrative tax changes | Not re-read | HMRC ready reckoner | Confirm the release used and the April 2027 implementation year before any number is used. |
| Fiscal rules | Not stated in brief | OBR EFO November 2025 and March 2026 | Current budget balance 2029-30; PSNFL falling in 2029-30. Assessed once a year. |
| Political context | Missing | Press, July to September 2026 | New PM (Burnham, July 2026), new Chancellor (Healey, 20 July 2026), first Budget 28 October 2026. Manifesto pledge on main rates of income tax, NI and VAT restated. |
| French game gameplay | Was unverified, now partly verified | LCP 5 Sept 2026, Journal du Geek 4 Sept 2026 | See F13. |

Institutional claims in the brief (Chancellor cannot set Bank Rate, cannot run devolved services, Barnett applies) are correct.

## 4. Adversarial tests

All tests are conceptual. The brief has no model. Tests marked [impl] need a build.

| # | Scenario | Exploit or failure | Safeguard | Test |
|---|---|---|---|---|
| S1 | Cut all investment, win | Capital cuts reduce PSNB fast. Costs land after year 5. | Legacy panel (F3). Investment cuts also reduce the "service" score with a lag and raise year 6 to 10 borrowing through lower growth, using a stated, small elasticity. | [impl] Bot plays "cut all capital". It must not rank in the top third once the legacy term is on. |
| S2 | Every efficiency and compliance card | Free money. | Delivery cost, three-year ramp, uncertainty flag, cap (F8). | [impl] Bot plays all such cards. Combined central yield must be less than half the year 1 gap, with the low end of the range near zero. |
| S3 | Deficit down, concentrated harm | Aggregate score hides a quintile or region losing badly. | Distributional panel is mandatory before confirmation. Success requires no quintile below a stated floor. | [impl] Package of benefit cuts plus fuel duty rise. Results screen must show the bottom quintile loss on the main screen, not behind a tap. |
| S4 | Same package, different luck | Shock decides the outcome. | Fixed seeds. Results show "your choices" and "your luck" as separate lines. | [impl] Run the same package under three seeds. Choice score must be identical. Only the luck line moves. |
| S5 | NHS England £5bn with no Barnett | Card underpriced by about a fifth. | Automatic Barnett factor (F5). | Desk test now: cost line for the NHS card must read about £5.9bn, not £5bn. |
| S6 | Recurring spend funded by asset sale | Year 1 balances. Years 2 to 5 do not. | Cards carry a "recurring or one-off" tag. A one-off cannot be matched against a recurring line in the package check. | [impl] Package: £2bn a year pay rise plus £2bn land sale. Year 2 gap must reappear and the confirm screen must warn. |
| S7 | Rate shock hits whole stock at once | Overstates the cost, teaches panic. | Two channels, gilt ramp and Bank Rate fade (F10). | Desk test: a 1 point gilt shock in year 1 must show a year 5 cost near OBR's published sensitivity, not five times year 1. |
| S8 | Credit for baseline consolidation | Do-nothing player "wins". | Score is delta to baseline only (F1). Grey baseline line on charts. | [impl] Empty package for five rounds must score zero on fiscal, not positive. |
| S9 (extra) | Ideology symmetry | Political cost differs by side, not size. | Support function published. Equal-value tax and spend cards carry equal base political cost, modified only by stated, sourced distribution effects. | Desk test: pair every tax card with a spending card of the same fiscal size. Political cost difference must be explained by a cited source or removed. |
| S10 (extra) | Triple lock switch scored as instant saving | Switch to earnings uprating saves little in year 1 and compounds later. | Card shows year 1 saving and year 5 saving separately and states that current pensions in cash are not cut. | Desk test: year 1 saving must be small (OBR: a 1 point uprating change moves spending by about £0.8bn the next year). |
| S11 (extra) | Year 5 tax rise with no behavioural response | Full static yield in year 5, no cost. | Behavioural haircut and one-year lag on every tax card. | [impl] Year 5 tax rise must score less than the same rise in year 1. |
| S12 (extra) | Share card cherry-picks | Player shares "deficit down 40%" and hides services. | Share card fixed format: fiscal delta, service score, bottom quintile change, version, seed. | Desk test on the template. |

## 5. Sensitivity priorities

1. **Baseline vintage.** March 2026 versus October 2026 EFO. Rerun every bot strategy on both. Compare the ranking of strategies, not the absolute numbers.
2. **Interest pass-through.** Gilt ramp speed and Bank Rate share of stock. Vary between OBR's published sensitivity and half of it. Compare how much a rate shock changes the winner.
3. **Behavioural haircut on tax cards.** Vary from zero to the HMRC or OBR figure for each card. Compare the tax-led strategy against the spend-led strategy.
4. **Service response to spending.** The lag and the size of the effect of a pound of NHS or SEND spend on the service score. Vary the lag from one to three years. Compare "invest early" against "invest late".
5. **Political support weights.** Vary the weight of political support in the win condition from zero to the design value. Compare which strategies become unwinnable. If the set changes a lot, the support function is doing too much work.

A sixth, if time allows: the legacy term weight (years 6 to 10). This decides whether S1 is beaten.

## 6. Minimum revisions

Before a prototype, in order:

1. Rewrite the opening line and add the grey baseline line (F1).
2. Put the baseline in a versioned data file with the EFO date printed on screen (F2).
3. Add the legacy panel or persistence rule for years 6 to 10 (F3).
4. Tag every card: England-only or UK-wide, recurring or one-off, capital or current. Apply Barnett automatically (F5, F9).
5. Give efficiency and compliance cards a cost, a ramp and a cap (F8).
6. Fix debt interest to net and build two rate channels (F4, F10).
7. Cut the round to three offered cards and one shock per game (F11).

Before public release:

8. Load the 28 October 2026 EFO baseline.
9. Pass S9 symmetry test across the full card set. Publish the support function or drop support from the win condition.
10. Define living standards as quintile real income with a sourced distributional table (F12).
11. Run one user test, 20 to 30 people: three-question quiz on deficit versus debt and baseline before and after. Release only if the post-test score rises.
12. Fix the share card template (S12).
13. Methodology page with every card's source, date, range and Barnett factor.

Keep the five-year, five-to-eight-minute format. The legacy panel is a single extra screen, not a sixth round.

## 7. What survives scrutiny

Sound: separate borrowing and debt accounts; scoring against baseline; one-off versus recurring; interest repricing over time; fictional political outcomes; fixed seeds; no single "cut waste" button; keyboard access and text equivalents; the choice not to build a macro model.

Criticisms considered and rejected:

- "Five years is too short." It is short, but the legacy panel fixes the incentive without making the game longer. A ten-year game would lose the audience.
- "Invented £5bn NHS figure is misleading." It is labelled as invented. That is fine for a first decision. It just needs the Barnett line.
- "The French game has 200 measures, this has 20." Scope is a choice. Fewer, better-sourced cards is defensible for a UK audience with a small team.
- "Political support should be removed." Not necessarily. It is the part players enjoy. It just cannot be unexplained.

Unresolved: I have not re-read HMRC's ready reckoner or the SR2025 document in full. I have not seen the OBR October 2026 numbers, which do not exist yet. I have not checked the exact Barnett population shares for 2026-27, so the "about a fifth" factor is an estimate. Evidence that would change the verdict to "rethink": if the team cannot build a versioned baseline, or if the symmetry test shows political costs that cannot be sourced and the team will not drop support from the win condition.