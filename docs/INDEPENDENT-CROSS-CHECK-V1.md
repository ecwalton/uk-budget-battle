# CROSS-CHECK.md: Budget Battle independent review

## 1. Scope

- Source: `budget-battle-source.zip` (no `.git`, so `git rev-parse HEAD` was not possible). The handoff names local commit `9f077fe6`. I cannot confirm it.
- Deployment match: all ten SHA-256 hashes in `docs/DEPLOYMENT-SNAPSHOT.json` match the archive. `npm run build` reproduces `public/box.bundle.js` byte for byte. Local source and the recorded deployment `29d994ce` are the same code. Scenario `training-2026.09-v1`.
- Environment: Ubuntu 24, Node 22.22.2, npm ci from the lockfile, three 0.185.1.
- Commands run: `npm ci`, `npm run build`, `npm run check`, `npm test` (12 pass), `npx wrangler deploy --dry-run` (ok, ASSETS binding only), plus a custom enumeration of all 32,768 packages under 3 shocks and 2 sensitivities (196,608 games).
- Not performed: `npm run check:browser` and `npm run check:live`. Playwright could not download Chromium (sandbox network) and the sandbox has no route to `workers.dev`. No screenshots exist from this review. Accessibility, touch targets, WebGL fallback and clipboard fallback are reviewed from code only.
- Date: 5 September 2026.

## 2. Verdicts

**Training prototype: fit to share, with two wording changes first.** The accounting is sound. Baseline is neutral, one-offs are one-off, deferrals return, interest is marginal. Input validation is tight. Disclaimers are everywhere.

**Calibrated policy game: not ready.** Not for lack of data. The safeguard design is one-sided, so the game currently teaches one lesson it did not intend: spending cuts are free, taxes always hurt, and you cannot win without a tax rise. Details in F1 to F4.

## 3. Ranked findings

Severity: Critical (misleading model), High (material error or exploit), Medium (design weakness), Low (minor). Status: Confirmed (reproduced), Hypothesis, Design judgment.

### F1. High. Confirmed. The public capacity floor can never trigger.

`public/scenario.js` cards. `serviceFloor: -5`. Only two cards carry negative capacity: `capital` (−2) and `defer` (−2). Worst reachable capacity is −4.

Reproduction: enumerate all 196,608 games. Games failing on the service floor alone: **0**. Games failing on the household floor alone: 16,318.

Observed: the results screen shows "Public capacity stays above −5 ✓" for every possible game. Expected: a floor that a player can breach.

Consequence: the game says spending cuts have a safeguard. They do not. Cutting investment appears in 75% of winning packages. `[income, capital, pensions]` wins with £15.4bn and a −2 capacity score. This is not a policy preference question. A displayed safeguard that cannot bind is a misleading model.

Smallest fix: either raise the floor to −3 so capital plus defer breaches it, or add a small negative capacity to `procurement` and `compliance` in their cost years (staff and systems diverted), or drop the capacity check from the win condition and show it as information only. Pick one and disclose it.

### F2. High. Design judgment, confirmed by enumeration. Household pressure is one-sided.

Every tax card carries negative household points in every group and every year. No cut card carries any negative household points except `pensions`. `capital` −5bn a year: zero household effect. `defer`: zero. `procurement`, `compliance`: zero. Spending cards give almost nothing back: `health` +3 capacity but 0 household points, `schools` 0, `defence` 0.

Reproduction: a tax-and-spend package `[health,income,procurement],[schools,thresholds],[compliance,pensions],[vat,land],[care,reliefs]` reaches £16.6bn in year 5 and fails on household floor (−6.0). A cut-and-tax package `[procurement],[capital,thresholds],[compliance],[],[defer]` reaches £18.0bn and passes (household −1.5).

Consequence: the household floor punishes progressive tax stacks (income + thresholds + reliefs + pensions puts the top quintile at −5.2) while a capital cut of the same fiscal size costs nothing anywhere. That is a covert lean towards cuts. It is disclosed as "toy points" but the win logic still uses it.

Smallest fix: give capital and maintenance cuts a small negative household effect after their lag (the brief's own logic: worse services are a household cost), or remove household points from the win condition and keep them as a display. The current mix, floors on toy points, is the worst of both.

### F3. High. Confirmed. No package can win without a tax card.

Reproduction: best no-tax package `[procurement],[capital],[pensions,compliance],[],[defer]` reaches £13.5bn in year 5. Target is £15bn. Zero of 25,169 winning games lack a tax card. All winning games with two cards are `income + vat`.

Consequence: the game asserts that a spending-cut-only consolidation of £15bn is impossible. That is a contested political claim and it is not disclosed. It is an artefact of card sizing (cuts total £14bn recurring by year 5 minus interest credit), not evidence.

Smallest fix: disclose it in the methodology ("with these cards the target cannot be met by cuts alone"), or resize so a cuts-only route is possible but expensive on capacity. Do not leave it silent.

### F4. Medium. Confirmed. The legacy test is automatic for any persistent package.

`engine.js`: `legacyPass = legacyImprovement >= target * 5`. Year 5 target £15bn. Five years at £15bn is £75bn. Any package that persists unchanged passes legacy the moment it passes year 5, and interest credit on saved debt makes it easier. Only 1,701 games fail on legacy alone, all near the margin with `defer`.

Consequence: the "ten years of consequences" panel is honest as a display, but as a safeguard it only catches `defer` used in round 5 by a player with no margin. Prior review finding F3 (end-of-horizon dumping) is partly addressed: deferrals return, but the test is too weak to matter.

Smallest fix: set the legacy threshold above 5× the annual target (for example 6×, so the player must be still improving), or test year 10 alone against a target, not a cumulative sum.

### F5. Medium. Confirmed. A gilt-yield shock makes winning easier.

Interest is `incrementalDebt * rate`. Saved debt is negative incremental debt, so a saver earns 3% credit, 4% under the rates shock. Under `rates`, 5,470 packages win versus 5,136 under `calm`. Example: `[income,thresholds,capital,housing]` scores £14.75bn calm (fail) and £15.36bn under a gilt shock (pass).

Consequence: the scenario the player expects to be harder is easier for anyone who cuts. It is arithmetically right for the marginal channel but the display has no baseline stress (the shock's extra baseline borrowing is added to both lines and cancels). The rates shock is a free bonus.

Smallest fix: score the year 5 test on primary balance, not primary plus interest, or make the rates shock also add to the player's primary line (higher debt-service pressure on departments). Disclose either.

### F6. Medium. Confirmed. Energy shock decides 2,092 outcomes through toy points, not economics.

The energy shock adds −1 household point in years 3 to 5. 2,092 packages that win under calm fail under energy, all on the household floor. The fiscal test is shock-neutral by design. So the "same choices, different conditions" claim is true fiscally but the shock changes win or lose through the least calibrated part of the model.

Smallest fix: say so on the results screen when the household floor is the failing check under a shock. Or apply shock pressure only to the display.

### F7. Low. Confirmed. Resize handler references an undefined variable.

`public/app.js`, last `window.addEventListener("resize", ...)`: uses `generation`, which is a local of `render()`. On the intro page every resize triggers an import whose `.then` throws `ReferenceError`, swallowed by `.catch`. The box is never remounted on resize, and if it did work it would mount a second box without disposing the first.

Fix: remove the intro branch from the resize handler. The box is already mounted by `render()`.

### F8. Low. Confirmed. Tautological test.

`test/engine.test.js`, "legacy fiscal safeguard requires £75bn": asserts `if (result.passed) legacyImprovement >= 75`. `passed` already includes `legacyPass`, so this can never fail. Replace with a test that a specific persistent package passes year 5 and fails legacy, which today does not exist (see F4).

### F9. Low. Design judgment. The baseline is OBR-shaped while claiming not to be OBR.

`baseline: [130, 118, 105, 93, 80, 76, 72, 68, 64, 60]`, debt 2,850, GDP 3,000 (95% ratio). This tracks the March 2026 OBR path (£133bn to £59bn, debt about 95%) within a few billion. The disclaimer says it is "not the numerical baseline". It is close enough that a reader will assume it is. Either say "rounded from the March 2026 OBR path" or move further away.

### F10. Low. Hypothesis, not tested in a browser. Card cost label.

`cardHTML`: `cost <= 0 ? "RELEASES" : "COSTS"`. A card with zero first-year cost would read "RELEASES £0.0bn". No current card has that, so it is latent only.

What I looked for and did not find: XSS (all DOM strings come from constants; shared-link and localStorage inputs pass `validateGame` before any use; `__proto__` shock rejected by `hasOwn`); prototype pollution; oversized fragment (2,500 char cap, decisions must be exactly 5); Worker body limit (streamed, 4,096 bytes, `Content-Length` untrusted); missing CSP (present, no inline script, single `app.js` module); cross-request state (none); asset sale used as recurring revenue (land only helps year 4 and slightly hurts after; not in the year 5 test); unchanged package credit (zero under all three shocks, tested).

## 4. Test matrix

| Area | Check | Result |
|---|---|---|
| Accounting | Empty package, 3 shocks: delta 0 every year, debt = baseDebt | Pass (test 1) |
| Accounting | Land: −3 once, +0.15 from next year forever | Pass |
| Accounting | Defer in round 5: +5 in year 8, capacity −2 for two years then 0 | Pass |
| Accounting | Interest on prior incremental debt only, not full stock | Pass; but credit on savings, see F5 |
| Accounting | All 32,768 combos, 3 shocks, 2 sensitivities: finite, ledger reconciles | Pass |
| Win logic | Service floor reachable | **Fail**, F1 |
| Win logic | Cuts-only route possible | **Fail**, F3 |
| Win logic | Legacy test independent of year 5 test | **Weak**, F4 |
| State/sharing | Share fragment: version, 5 decisions, shock, sensitivity; invalid → fragment stripped | Pass by code review |
| State/sharing | localStorage version mismatch → ignored | Pass by code review |
| State/sharing | Resume with 5 decisions → results | Pass by code review |
| Security | CSP, nosniff, referrer, permissions headers in `_headers` | Present |
| Security | API: 405 on GET, 415 without JSON type, 413 over 4KB, 400 invalid, 404 other `/api/*` | Pass by code review |
| Build | `npm run build` reproduces snapshot hash | Pass |
| Build | `tsc --noEmit`, wrangler dry run | Pass |
| Browser | Mobile width, keyboard, reduced motion, WebGL off, clipboard fallback | **Not run**, no Chromium |
| Live | Endpoints, winning route, share | **Not run**, no network route |

## 5. Reconciliation with the 5 September red team review

| Prior finding | Status now |
|---|---|
| F1 baseline credit | Fixed. Opening says borrowing already falls. Zero-delta tested. |
| F2 baseline freshness | Intentionally changed. Scenario is versioned. Baseline is hard-coded in `scenario.js`, not a swappable data file, but the version string travels with every share and download. Acceptable for a prototype. |
| F3 end-of-horizon | Partially addressed. Deferrals return and are displayed. The legacy threshold is too weak to bind (F4 above). |
| F4 net vs gross interest | Not applicable. The game uses a marginal rate, not the £106bn figure. |
| F5 Barnett | Intentionally changed. Cards are "UK funding envelopes". Disclosed. Fine. |
| F6 fiscal rules | Fixed by exclusion. No rule scoring. |
| F7 political support | Fixed by exclusion. Fictional voices only. |
| F8 efficiency cards | Fixed. Upfront cost, ramp, cautious mode halves savings. |
| F9 asset sales | Fixed. Land is non-financial, one-off, lost income after. |
| F10 rate channels | Partially. One marginal channel plus baseline ramp. Disclosed as illustrative. F5 above is a new consequence. |
| F11 session length | Fixed. Three cards a round, one shock. |
| F12 living standards | Intentionally changed to toy points. Disclosed. But used in the win condition (F2). |
| S9 symmetry test | Still open. The asymmetry is now in the points, not politics. |

## 6. Blockers and improvements

Release blockers for the training label:
1. F1: make the capacity floor reachable, or remove it from the win condition. Do not ship a safeguard that cannot fire.
2. F3: one sentence in the methodology stating that these cards cannot meet the target without a tax measure.

Before calling it calibrated:
3. F2: symmetric treatment of cuts and taxes in the household points, or take points out of the win logic.
4. F4: legacy threshold that can bind.
5. F5: score year 5 on primary balance, or make the rates shock cost the player something.
6. Load a versioned external baseline file with the 28 October 2026 OBR numbers.

Optional:
7. F7 resize bug, F8 test, F9 wording, F10 label.
8. Run the browser and live checks on a machine with Chromium and internet, and open the screenshots.

## 7. What survives

Sound: baseline neutrality, marginal interest, one-off handling, deferral return, input validation, CSP, no server state, disclaimers on every screen, reproducible build, hash-matched deployment. Rejected criticisms: "the model is too simple" (it is honest about that); "land sale is an exploit" (it is not, it hurts year 5); "the 4KB limit is too small" (largest valid payload is under 300 bytes).

Remaining limits: no browser run, no live run, no `.git` to pin a commit, no user test.