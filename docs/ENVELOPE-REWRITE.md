> Historical v2 design. Investment reversals, scoring and safeguards were updated in v3; see [the v3 response](CROSS-CHECK-V2-RESPONSE.md).

# Spending-envelope rewrite

The original selectable cards could all be taken together and never formed a constrained settlement. Version `envelopes-2026.09-v2` replaces them with two screens in every Budget: five sized spending envelopes, then three sized tax packages and a borrowing allowance. A live ledger shows the whole funding relationship on both screens; an unfunded Budget cannot be confirmed. On mobile the borrowing total and remaining gap stay visible while scrolling.

## Settlement mechanics

All values below are illustrative £bn, not official costings or a reconstruction of actual departmental totals. These synthetic envelopes exclude debt interest. The borrowing baseline remains a separately specified training path; total baseline tax receipts are not modelled. Envelope bases are held flat in cash in this prototype, so “hold” should not be interpreted as maintaining real service provision under inflation.

| Envelope | Starting amount | Increment per squeeze/grow | Timing |
|---|---:|---:|---|
| Health and care | 240 | 12 | Annual cost now; capacity and household effects next year |
| Welfare and pensions | 320 | 16 | Half cost this year, full next year; toy household score changes immediately |
| Defence | 65 | 12 | Annual cost now; capacity next year |
| Public investment | 100 | 15 | Capacity after two years; grow adds £3bn maintenance from its fourth year; squeeze incurs a £6bn catch-up bill in its fourth year |
| Everything else | 300 | 12 | Annual cost now; capacity and household effects next year |

Capital for every service sits in investment, avoiding overlap with the other envelopes. Earlier changes remain: a later hold adds zero, while repeated grows accumulate. Separate investment profiles retain their maintenance/catch-up obligations even when later decisions reverse direction.

Income tax and VAT steps each change annual receipts by £15bn. Business/wealth steps change eventual receipts by £12bn, with half arriving in the first year. Cautious mode halves positive business/wealth receipts; cuts retain their full cost. These are broad revenue packages, not claimed rate equivalents. All toy distribution scores remain explicit in the controls and source.

Borrowing allowances are £20bn below, equal to, or £30bn above the current same-shock baseline. They reset for each Budget. Actual borrowing is baseline + all active spending changes − all active receipt changes + interest on prior incremental debt. The allowance never enters that identity as revenue. A draft exceeding it remains editable but cannot be confirmed. The API intentionally permits simulation of drafts and reports their gaps; an unfunded record cannot achieve a passing result.

The challenge is £40bn underlying deficit improvement in year five and £200bn cumulative underlying improvement in years 6–10, both before interest, with capacity and every household-group score at least −5 throughout. These are game design thresholds, not fiscal rules. Future chart years assume no further choices beyond the current draft. The £40bn target replaces the smaller £15bn challenge; the five spending levers can change eventual recurring funding by a combined £67bn per Budget.

## Response to the independent v1 review

- **F1, non-binding capacity floor:** spending reductions now reduce capacity sufficiently for this safeguard to fail. A direct test demonstrates failure.
- **F2, tax/cut household asymmetry:** all spending envelopes now have disclosed household effects; a squeeze reverses grow's relief. These are still uncalibrated points, not disposable income or a monetary valuation of services.
- **F3, tax-only winning structure:** tests demonstrate both a tax route and a tax-free spending route satisfying every threshold. This does not establish politically neutral or empirically valid weights.
- **F4/F8, weak legacy and tautological test:** phased changes, investment maintenance and catch-up bills continue; a concrete funded plan improves year five by £40bn but only £148bn cumulatively in legacy, failing the £200bn requirement while meeting both other safeguards. This tests an actual counterexample.
- **F5, rates improving the fiscal score:** fiscal and legacy scoring now use primary changes before interest. The debt/borrowing chart retains interest credits and costs. A rate shock cannot improve these two scores; financing headroom may still change with interest as accounting requires.
- **F6, limited energy interaction:** retained and disclosed. Both comparators receive the shock; household pressure can make a previously passing household safeguard fail. This remains a deliberately small shock model, not a behavioural macro simulation.
- **F7, resize import:** removed the duplicate introductory box import and undefined generation reference from the resize handler. The existing box resize observer handles its own canvas. Browser checks resize the introduction and verify one canvas and no errors.
- **F9, baseline wording:** remains explicitly synthetic. OBR provides context, not the baseline numbers.
- **F10, zero release label:** removed with the card interface. Hold is labelled “No new change”; tax figures are labelled revenue changes, not total receipts.

## Verification and remaining limits

15 accounting tests pass, including 3,000 seeded multi-year plans distributed across all shocks and sensitivity modes. Browser checks cover the two screens, blocked unfunded package, changes/reset, review/cancel, save/resume, all five rounds, shocks, cautious mode, desktop/mobile overflow, downloads, sharing, API parity and bounds, keyboard and reduced motion. Screenshots are inspected separately. The live-site check verifies a complete passing route and actual clipboard round-trip after deployment.

Nine controls across five Budgets expose 45 settings, initially set to hold. The five-to-eight-minute duration is a design aim and has not been verified with players. There is no assertion that this is only 20–25 individual choices. Defaults reduce interaction count; player testing should determine whether the size controls or frequency need simplifying.

Old saves and links are rejected by a version change so the new rules cannot silently rescore them. Only confirmed Budgets are persisted; draft choices reset on reload. The ordinary save/resume flow is checked, but there has been no full accessibility audit or educational user study. External models remain unintegrated, GDP has no policy feedback, and the numerical assumptions need independent calibration.
