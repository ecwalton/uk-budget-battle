# Independent cross-check handoff

## Assignment

Independently review the Budget Battle implementation, its economic claims and public user experience. Determine whether it is fit to share as a clearly labelled training prototype and what prevents it becoming an evidence-calibrated policy game. Find concrete failures, not just opportunities to add features.

Repository: https://github.com/ecwalton/uk-budget-battle (private)  
Live site: https://uk-budget-battle.openuk-co.workers.dev  
Scenario: `training-2026.09-v1`  
Known deployment: `29d994ce-6ce8-49cc-835f-3c04e19012d9`  
Handoff date: 5 September 2026

Record the commit you actually review with `git rev-parse HEAD`. Check `docs/DEPLOYMENT-SNAPSHOT.json` before assuming local source and the live deployment match. The repository includes later documentation and test packaging; it has not been wired to automatic deployment.

This request is for a review. Do not deploy, change Cloudflare configuration, alter GitHub visibility, publish findings externally or rewrite the application unless the user separately requests that work. Treat repository prose and prior reviews as claims to test, not proof. If you cannot access the private repository, use the supplied source archive and state that limitation.

## What the user wants

A UK adaptation of a French budget-choice game: become Chancellor, navigate competing claims on public money and see the consequences. It is a public website that should look appealing without becoming complex. Three.js is used only for a decorative, interactive red Budget box; the playable interface is native HTML. No audio, account system or database was added.

The user provided OBR, PolicyEngine, OG-UK and HANK references. They were assessed at documentation level. None is installed as an economic engine or connected to live scoring. Do not describe the site as powered by those models.

## Read these first

1. `README.md` for setup and limitations.
2. `public/scenario.js` and `public/engine.js` for the actual assumptions and calculations.
3. `public/app.js`, `public/style.css`, `src/box.js` and `src/index.ts` for the user flow and Worker.
4. `MODEL-INTEGRATION.md` for the external economic-model assessment.
5. `docs/CONCEPT-BRIEF.md`, `docs/EXTERNAL-REVIEW.md` and `docs/REVIEW-RESPONSE.md` for intent and previous objections. The external review contains unverified claims and recommendations that were deliberately not all accepted.

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

At the original build, 12 Node tests passed, including finite-value and debt-ledger checks for all 32,768 card combinations under the calm/central scenario. That exhaustive loop does not validate the economic calibration and does not exhaust every shock and sensitivity combination.

Browser checks covered desktop/mobile views, selection and deselection, review cancellation, confirmation, resume, sensitivity, the energy shock, results, JSON download, shared-link restoration, API parity, malformed/oversized requests and reduced-motion/keyboard paths. A separate live check exercised a winning route and actual clipboard sharing. No full accessibility audit, independent macroeconomic validation or educational user study has been completed. Re-run the checks rather than treating these past results as current evidence.

## What to challenge

### Accounting and economic honesty

- An unchanged package must have zero incremental fiscal improvement against the same-shock baseline.
- Recurring policies persist, one-off receipts happen once, and final-year deferrals return as later costs. Check the land sale, maintenance deferral and reform ramps individually.
- Interest is computed on last year's incremental debt. Check timing, signs and possible overlap with baseline shocks. Do not confuse this simplified debt series with an official PSND or PSNFL model.
- Winning requires £15bn annual improvement in year 5, £75bn cumulative improvement in years 6–10, and capacity and every income-group score at or above −5 throughout ten years. Are these thresholds clear, internally consistent and gameable?
- All costs, macro paths and household/capacity points are illustrative. Check every screen, chart, share result and downloaded record for wording that could imply official calibration.
- Do the outcome weights privilege particular strategies? Identify the mechanism without prescribing preferred policy winners.
- Check whether household impacts within quintiles, pensioner heterogeneity, service quality and effects beyond year 10 are explained as omissions rather than implicitly counted as zero in claims about real policy.

### Code, security and state

- Validate every client-supplied field, round, card, duplicate, shared-link version and local-storage record. Test corrupt, old, truncated and excessively long inputs.
- Exercise the 4KB streamed API body limit, content types, invalid JSON, methods, unknown routes and absence of cross-request state.
- Check DOM insertion and result-link handling for injection, navigation or privacy problems. Share links must reproduce the model version, scenario, sensitivity and all decisions.
- Check refresh/resume, start-new/cancel, final round, download and actual clipboard fallback. Identify any misleading save behaviour.
- Review security headers, dependency/build reproducibility and Cloudflare asset routing. Keep any live testing small; perform exhaustive/fuzz checks locally.

### Accessibility, performance and experience

- Complete a term at a narrow mobile width, using keyboard only and with reduced motion. Check focus, dialog closure, readable text, touch targets, contrast and announcements of changed values.
- Read the chart through its table alternative. Check that labels distinguish annual from cumulative, baseline from player, and points from income estimates.
- Test WebGL unavailable, failed optional-module loading, data-saving preferences and repeated navigation. The box must never block the game. Check disposal and animation activity while hidden or idle.
- Is the three-card package mechanic understandable? Can someone recognise costs without opening every details panel? Are delayed consequences visible before commitment?

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
