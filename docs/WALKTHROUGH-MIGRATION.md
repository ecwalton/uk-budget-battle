# Migration flow scenarios in the simplified walkthrough

Reference: ONS provisional year ending December 2025 long-term immigration 813,000, emigration 642,000, net 171,000. Verified 6 September 2026 at https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/internationalmigration/bulletins/longterminternationalmigrationprovisional/yearendingdecember2025 . This reference is frozen for comparison, not forecast forward by ONS.

| Policy preset | Fewer lower-paid arrivals | Fewer non-working arrivals | Additional qualifying removals | Resulting annual net flow |
|---|---:|---:|---:|---:|
| Reference | 0 | 0 | 0 | +171,000 |
| Zero net | 40,000 | 100,000 | 31,000 | 0 |
| Negative | 50,000 | 150,000 | 71,000 | −100,000 |
| Deeper negative | 60,000 | 250,000 | 111,000 | −250,000 |

The Chancellor walkthrough initially displays the observed reference for comparison, but requires the player to click a preset before confirming a migration decision. All policy splits are constructed stress-test assumptions. They are not estimates of current eligible populations, delivery feasibility or fiscal savings. Lower pay is not equivalent to lower skill. Non-working is not a visa-route synonym. Group membership is assumed non-overlapping. There is no verified category baseline from which to assert absolute net flows separately for each worker/non-worker group.

Additional removals are assumed to concern long-term residents without permission to stay, qualify as emigration and be additional to ONS reference departures. Their effect on total migration is counted exactly once. There is no separate irregular-inflow adjustment added to the ONS total. Real returns and migration data do not map exactly.

The separate unauthorised-population illustration takes a user-selected hypothetical annual net stock change before additional removals (default +20,000; alternatives −50,000, 0, +50,000, +100,000). It includes all entry, overstay, existing exit and status-change effects in that single baseline balance. Additional removals are subtracted to show when the stock change becomes negative. This is not a current stock estimate or an assertion that unlimited removals are possible.

The five-year net figure repeats each year's total flow mechanically. Births, deaths, policy response, changing departures, eligible-population depletion and income effects are not simulated. No lifetime care-route cost is assigned to these wider groups. Wage and GDP-per-person gains remain conditional in the explanatory text, not calculated outcomes.

Unit tests reconcile every preset, verify that removals enter once, test the assumed unauthorised balance, and reject invalid values. Browser checks select every preset on phone and desktop, vary the stock-change assumption, and check summary persistence and layout.
