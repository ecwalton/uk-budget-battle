# Independent cross-check handoff

## Assignment

Independently review the Budget Battle implementation, its economic claims and public user experience. Determine whether it is fit to share as a clearly labelled training prototype and what prevents it becoming an evidence-calibrated policy game. Find concrete failures, not just opportunities to add features.

Repository: https://github.com/ecwalton/uk-budget-battle (private)  
Live site: https://uk-budget-battle.openuk-co.workers.dev  
Scenario: `envelopes-2026.09-v3`  
Known deployment: see `docs/DEPLOYMENT-SNAPSHOT.json`  
Handoff date: 5 September 2026

Record the commit you actually review with `git rev-parse HEAD`. Check `docs/DEPLOYMENT-SNAPSHOT.json` before assuming local source and the live deployment match. The repository has not been wired to automatic deployment. Historical v1 deployment hashes are retained separately.

This request is for a review. Do not deploy, change Cloudflare configuration, alter GitHub visibility, publish findings externally or rewrite the application unless the user separately requests that work. Treat repository prose and prior reviews as claims to test, not proof. If you cannot access the private repository, use the supplied source archive and state that limitation.

## What the user wants

A UK adaptation of a French budget-choice game: become Chancellor, navigate competing claims on public money and see the consequences. It is a public website that should look appealing without becoming complex. Three.js is used only for a decorative, interactive red Budget box; the playable interface is native HTML. No audio, account system or database was added.

The user provided OBR, PolicyEngine, OG-UK and HANK references. They were assessed at documentation level. None is installed as an economic engine or connected to live scoring. Do not describe the site as powered by those models.

## Read these first

1. `README.md` for setup and limitations.
2. `public/scenario.js` and `public/engine.js` for the actual assumptions and calculations.
3. `public/app.js`, `public/style.css`, `src/box.js` and `src/index.ts` for the user flow and Worker.
4. `MODEL-INTEGRATION.md` for the external economic-model assessment.
5. `docs/CROSS-CHECK-V2-RESPONSE.md` and `docs/INDEPENDENT-CROSS-CHECK-V2.md` for the latest review and response; `docs/ENVELOPE-REWRITE.md` records the previous version.
6. `docs/CONCEPT-BRIEF.md`, `docs/EXTERNAL-REVIEW.md` and `docs/REVIEW-RESPONSE.md` for intent and previous objections. The external review contains unverified claims and recommendations that were deliberately not all accepted.

Implementation decisions that differ from the brief include UK funding envelopes rather than a partially verified NHS England/Barnett costing, household points rather than real disposable-income estimates, and a disclosed legacy fiscal threshold. Evaluate whether these differences are explained clearly enough.

## Reproduce the checks

Node.js 22 or later is required. From the repository root:

```sh
npm ci
npm run build
npm run check
npm test
npx wrangler deploy --dry-run
```

Generated Worker types are committed. To refresh them, run `npm run types`; it may need permission to start a local runtime socket.

For browser checks, in a first terminal:

```sh
npm run dev
```

In another terminal:

```sh
npx playwright install chromium
npm run check:browser
```

Screenshots go to `artifacts/browser/`. On Linux, Playwright may require its documented operating-system dependencies. Open the screenshots; do not infer visual quality from passing assertions alone.

Optional, bounded live-site checks:

```sh
npm run check:live
```

This opens the public site, completes one winning route, exercises clipboard sharing and checks a few endpoints. It does not deploy or persist server-side game records. `BASE_URL` overrides the default URL for either browser script; omit a trailing slash.

## Existing evidence and its limits

The current build has 24 Node tests, including funding ceilings, spending persistence/reversal, welfare and tax ramps, investment bills, binding capacity and household floors, tax-funded and tax-free feasible routes, interest-neutral fiscal scoring, and a concrete funded year-five pass that fails legacy. Presentation tests check that bulletins distinguish new choices from earlier commitments, use cautious receipts correctly and retain model disclosures in the newspaper export. A seeded sample of 3,000 multi-year plans spans all three shocks and both sensitivities. This is not exhaustive over the new choice space, and it does not validate economic calibration.

Browser checks covered desktop/mobile views, size changes and reset, blocked unfunded confirmation, introduction resize, review cancellation, confirmation, resume, sensitivity, the energy shock, results, JSON download, shared-link restoration, API parity, malformed/oversized requests and reduced-motion/keyboard paths. Additional browser checks cover the Blender lid animation through completion, the mobile bulletin, the PNG newspaper download and the five loaded miniature illustrations. A separate live check exercises a winning route, bulletin continuation, PNG download and actual clipboard sharing. No full accessibility audit, independent macroeconomic validation or educational user study has been completed. Re-run the checks rather than treating these past results as current evidence.

## What to challenge

### Accounting and economic honesty

- An unchanged package must have zero incremental fiscal improvement against the same-shock baseline.
- Recurring changes persist, one-off investment catch-up costs occur once per outstanding cut; reversals cancel the newest outstanding step and its future bills, and final-year changes affect the legacy. Check investment maintenance and catch-up profiles, and welfare and business-tax ramps individually. Old land-sale and reform cards are no longer offered.
- Interest is computed on last year's incremental debt. Check timing, signs and possible overlap with baseline shocks. Do not confuse this simplified debt series with an official PSND or PSNFL model.
- Winning requires every Budget to fit its borrowing ceiling, £40bn underlying improvement before interest in year 5, £100bn cumulative primary savings during years 1–5, £200bn cumulative underlying improvement in years 6–10, and capacity at or above −5 and household scores at or above −4 for the lowest two groups (−5 for others) throughout ten years. Are these thresholds clear, internally consistent and gameable?
- All costs, macro paths and household/capacity points are illustrative. Check every screen, chart, share result and downloaded record for wording that could imply official calibration.
- Do the outcome weights privilege particular strategies? Identify the mechanism without prescribing preferred policy winners.
- Check whether household impacts within quintiles, pensioner heterogeneity, service quality and effects beyond year 10 are explained as omissions rather than implicitly counted as zero in claims about real policy.

### Code, security and state

- Validate every client-supplied field, round, control size, duplicate, shared-link version and local-storage record. Test corrupt, old, truncated and excessively long inputs.
- Exercise the 4KB streamed API body limit, content types, invalid JSON, methods, unknown routes and absence of cross-request state.
- Check DOM insertion and result-link handling for injection, navigation or privacy problems. Share links must reproduce the model version, scenario, sensitivity and all decisions.
- Check refresh/resume, start-new/cancel, final round, download and actual clipboard fallback. Identify any misleading save behaviour.
- Review security headers, dependency/build reproducibility and Cloudflare asset routing. Keep any live testing small; perform exhaustive/fuzz checks locally.

### Accessibility, performance and experience

- Complete a term at a narrow mobile width, using keyboard only and with reduced motion. Check focus, dialog closure, readable text, touch targets, contrast and announcements of changed values.
- Read the chart through its table alternative. Check that labels distinguish annual from cumulative, baseline from player, and points from income estimates.
- Test WebGL unavailable, failed optional-module loading, data-saving preferences and repeated navigation. The box must never block the game. Check disposal and animation activity while hidden or idle.
- Are the two settlement screens understandable? Does the player understand that hold preserves earlier changes, grow/squeeze are additional annual changes, and the borrowing allowance is a ceiling selected anew each year? Can they recognise first-year versus eventual costs and later bills? Test the always-visible mobile funding balance. There are nine settings per Budget; do not claim that this equals 20–25 individual decisions per term or that play duration has been user-tested.

### External model suitability

Recheck `MODEL-INTEGRATION.md` against current primary documentation before endorsing a migration. The recommended path is offline PolicyEngine household results followed by validated macro/legacy scenarios, published as versioned aggregate artifacts. Investigate package interactions rather than summing isolated tax costings. Do not mistake emulator baseline anchoring or selected HANK replication matches for general forecasting accuracy. Separate model uncertainty from software correctness.

## Required response

Produce `CROSS-CHECK.md` with:

1. The reviewed commit, date, environments, commands run and any checks you could not perform.
2. Two verdicts: readiness as a training prototype, and readiness as a calibrated policy game.
3. Ranked findings with severity, file and line, reproduction steps, observed versus expected behaviour, practical consequence and smallest useful fix. Distinguish confirmed failures from hypotheses and design judgments.
4. A concise test matrix for accounting, state/sharing, security, accessibility, performance and the live deployment. Include supporting screenshot paths or command output where useful.
5. A short reconciliation of the prior red-team findings: fixed, partially addressed, intentionally changed or still open.
6. An ordered list of release blockers and optional improvements. Do not turn the five-minute game into a full national forecasting platform.

If you find no material issues, say so and identify the remaining test and evidence limits. Do not invent findings to fill a quota.
