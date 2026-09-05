# CROSS-CHECK-V2.md: envelopes build

Reviewed commit: `e11bbbec3a77bccf62dd27e308c71f0841e9b564` (main), cloned from github.com/ecwalton/uk-budget-battle on 5 September 2026. All hashes in `docs/DEPLOYMENT-SNAPSHOT.json` match the working tree, so this is deployment `24eda70f`, scenario `envelopes-2026.09-v2`. `npm ci`, `npm test` (18 pass), `npm run build`, `npm run check` all clean. Browser and live checks not run (no Chromium, no route to workers.dev). The earlier `CROSS-CHECK.md` covered `9f077fe` and is superseded on the points below.

## Verdicts

Training prototype: fit to share. The envelope redesign fixes the structural problem. Every pound now competes on one screen and an unfunded Budget cannot be confirmed.

Calibrated policy game: not yet. Four design issues remain, none of them accounting bugs.

## What the rewrite fixed (verified)

- Capacity floor now binds. Squeeze health four times: capacity −5.6, fail.
- Cuts have household effects. Welfare squeeze −1 on the lowest quintile per step.
- Tax-free route exists. Squeeze welfare three times: £48bn, pass.
- Fiscal and legacy tests use primary balance. Rates shock no longer helps.
- Resize bug gone. Tautological test replaced by a real counterexample.
- Validation is tighter: exactly one level per control per round.

## Findings

### V1. High. Confirmed. The year-5 test rewards doing nothing for four Budgets.

Same measures, different timing:

| Package | Year 5 | Term (years 1 to 5) | Pass |
|---|---|---|---|
| Welfare squeeze + income + VAT in Budget 1 | £46bn | £235bn | Yes |
| Hold four Budgets, same measures in Budget 4 and 5 | £46bn | £54bn | Yes |

The results screen reports the term total but does not score it. A player who defers every hard choice to the last Budget gets the same tick, with four years of no household or capacity pain. That is the opposite of the lesson.

Fix: add a term test (for example cumulative years 1 to 5 at or above 2.5× the annual target) or score year 3 as well as year 5.

### V2. Medium. Design judgment. Welfare is the free lever.

Welfare is the only envelope with zero capacity. It is also the biggest step (£16bn). Five squeezes: £80bn a year, capacity 0, lowest quintile exactly −5.00, pass. The household floor is the only brake and it is set so that a 25% welfare cut just clears it. Health has capacity 1.4 per £12bn step, so cutting health £48bn fails. Cutting welfare £80bn passes.

The modelling choice (welfare is a transfer, not a service) is defensible. The calibration is not. Either give welfare a small capacity effect (it funds carers, housing, work) or tighten the household floor for the bottom two quintiles.

### V3. Medium. Confirmed. Reversing an investment decision costs money forever.

Squeeze investment in Budget 1, grow in Budget 2. Net capital unchanged. Primary cost by year: −15, 0, 0, +6, +3, +3, +3, +3, +3, +3. The catch-up bill fires for a cut that was restored, and the maintenance charge runs forever on capital that was never added. Grow then squeeze: +15, 0, 0, +3, +9, +3 forever.

`ENVELOPE-REWRITE.md` discloses that obligations survive reversal. The effect is that any correction is punished harder than the original mistake. Fix: net the levels per year before applying the maintenance and catch-up profiles, or apply the catch-up only if the squeeze is still in force at year four.

### V4. Low. Still open from v1 F4. Legacy test is automatic for persistent packages.

Three tax rises in Budget 1: year 5 £42bn, legacy £210bn. Any package that persists and clears year 5 clears legacy. The counterexample in the tests works because it grows spending in Budget 5. The test catches late spending, not late cuts.

### V5. Low. Design judgment. "Hold" is a real-terms cut and the player will not know.

Envelope bases are flat cash. `ENVELOPE-REWRITE.md` says so. The interface says "No new change". Over five years at the game's 4% nominal growth, "hold" on health is a real cut of about 18%. Label it "Cash freeze" or add the note to the control.

### V6. Low. Observation. 45 settings, all defaulting to hold.

Nine controls times five Budgets. A player who plays it straight makes 45 decisions. The rewrite notes say the five-to-eight-minute target is unverified. It will not survive a user test at this count. Consider three envelopes on screen per Budget, rotating, or fewer Budgets with bigger steps.

## Random-play profile

60,000 random settings, calm, central: 6.75% pass. Of the 4,053 passes, one has no tax rise and 199 have no welfare squeeze. That is what random play looks like, not a strategy claim, but it says the typical win is "cut welfare and raise taxes". Worth knowing before a journalist plays it.

## Security and state

No change in risk. Share fragment and localStorage still pass `validateGame` before use. Newspaper output escapes strings and uses only scenario constants. CSP unchanged in effect. Worker unchanged.

## Blockers before calling it more than a prototype

1. V1 term test.
2. V2 welfare calibration or floor.
3. V3 reversal netting.
4. V5 label.
5. A ten-person timing test.