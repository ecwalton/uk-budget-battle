# The Budget Battle

[Play the live prototype](https://uk-budget-battle.openuk-co.workers.dev) · [Independent model handoff](HANDOFF.md) · [Economic model assessment](MODEL-INTEGRATION.md)

A public-facing UK fiscal strategy **prototype** on Cloudflare Workers. Five Budgets with spending envelopes and funding controls, a ten-year ledger, three repeatable scenarios, save/resume, result links, newspaper images and JSON downloads.

## How a Budget works

1. Set health and care, welfare and pensions, defence, public investment, and everything else to **squeeze / hold / grow**.
2. Set income tax, VAT, business and wealth taxes to **cut / hold / raise**, then choose a borrowing allowance. The live ledger reconciles existing borrowing + spending changes − tax receipts + incremental interest. A positive funding gap blocks confirmation.

Changes accumulate: hold adds no new change; another grow adds another recurring commitment. The borrowing allowance is chosen anew each Budget, at £20bn below, equal to, or £30bn above the same-shock baseline. It is a ceiling, not revenue. Unused headroom is not spent. Starting envelopes total £1,025bn of synthetic non-overlapping spending; capital is grouped entirely under investment. The baseline deficit is a separate training input, not calculated from a complete national accounts table.

Welfare and business/wealth changes phase in. Investment brings maintenance or catch-up bills later. Capacity and household effects include service cuts; the fiscal and legacy scores exclude interest to prevent higher rates improving the score. Charts and debt include interest. See [the rewrite response](docs/ENVELOPE-REWRITE.md) for the independent review findings and remaining limitations.

Version `envelopes-2026.09-v2` intentionally rejects earlier card-game saves and shared links. No old result is silently rescored. An incomplete Budget is a draft: only confirmed Budgets are saved.

## Run and deploy

Node.js 22 or later; Cloudflare account for deployment.

```sh
npm ci
npm run build
npm run types
npm run check
npm test
npm run dev
```

Open http://localhost:8787. Deployment uses your Wrangler login:

```sh
npx wrangler deploy --dry-run
npm run deploy
```

No database or external model service is required by this application. Cloudflare hosting terms apply. Never commit authentication files.

## Main files

- `public/scenario.js`: versioned assumptions, policy profiles and thresholds.
- `public/engine.js`: shared pure accounting engine and validation.
- `public/app.js`, `public/style.css`: DOM interface and chart.
- `src/index.ts`: Worker health and bounded simulation API.
- `src/box.js`: decorative Three.js box; `npm run build` generates its optimized bundle and license notice.
- `test/engine.test.js`: accounting invariants, funding constraints, safeguard counterexamples and 3,000 seeded multi-year plans.

## Model limitations

All macro paths, policy costs and outcome points are illustrative training assumptions. OBR, HMRC and Treasury links provide context, not these envelope or tax costings. Household points are not disposable-income estimates. Capacity weights are not empirically calibrated. GDP has no policy feedback. Debt is simplified accumulated borrowing, not an official PSND/PSNFL reconciliation. No electoral or fiscal-rule prediction is made.

The goal is £40bn underlying deficit improvement (before interest) in year 5, £200bn cumulative underlying improvement in years 6–10, and no capacity or household-group score below −5 across ten years. These are disclosed design thresholds, not proof of economic sustainability.

Before describing the game as an evidence-calibrated policy model, replace training values with sourced estimates, validate distributional and service mappings, and commission independent review. Increment `SCENARIO.version` for outcome changes; old shared games must not silently change meaning. See the model-integration assessment supplied alongside the project for the recommended path.

## Visual assets and Budget Bulletin

An original Blender red box opens after each confirmed Budget. A short newspaper-style bulletin describes the actual new spending/tax choices and stated capacity lags, then the player continues. It adds no new score or fictional public reaction. Five matching miniature illustrations identify the spending envelopes. At the end, players can download a 1200×1720 newspaper front page with all five Budgets, the borrowing path, safeguards and model disclosures.

Original Blender source, rendering scripts and the silent 12-second launch trailer are documented in [assets/README.md](assets/README.md). Assets are served locally; the trailer is an optional separate file and never autoplays. Reduced-motion/data-saving users retain the static red box and can continue immediately. The model's short animation can also be skipped immediately. Only confirmed choices are saved, so reloading a bulletin resumes at the next Budget or the final results.

These presentation changes retain `envelopes-2026.09-v2`: numerical rules and existing result links are unchanged.

## Public website design

Local ES modules and system fonts; no frontend framework or third-party browser requests. Three.js and the original GLB load separately on the introduction and Budget Bulletin, skips reduced-motion/data-saving preferences, and leaves a static fallback without WebGL. Rendering is on demand, pauses when hidden, and disposes resources on navigation. Local blob URLs are permitted only for image loading and connections so the GLB’s embedded texture can decode; external asset origins remain disallowed.

Choices save locally. Result URLs contain validated choices in their fragment. No application analytics or server-side player database is used; Cloudflare infrastructure logs may still exist. Core controls are native buttons/dialogs; the canvas chart has a data table. A full accessibility audit and educational user study are still future work.

## API

- `GET /api/health`: health and scenario version.
- `POST /api/simulate`: JSON such as `{ "decisions": [], "shock": "calm", "sensitivity": "central" }` for the baseline. Each submitted Budget must contain exactly one ID for each of nine controls, e.g. `["health:0","welfare:0","defence:0","investment:0","other:0","income:0","vat:0","business:0","borrowing:0"]`. Sizes are −1, 0 or 1. The API can simulate unfunded drafts; `budgets[].gap` and `fundingPass` report feasibility. The browser blocks confirmation of an unfunded Budget.
- 4KB streamed body limit, strict one-size-per-control validation, no external calls or storage. Unknown routes return 404 and unsupported simulation methods 405.

The browser uses the same engine for instant feedback; the API supports verification and future integrations.

## Verification

TypeScript, Worker dry run, accounting tests, full desktop/mobile playthrough, size reversal and blocked unfunded settlement, review cancellation, resume, sensitivity, shock reveal, downloads and shared results. API parity and invalid/oversized requests checked. Reduced-motion and keyboard paths checked. Screenshots reviewed for introduction, Budget and results.


## Independent review and browser reproduction

Give another model `HANDOFF.md` and repository access, or attach the source archive. The handoff includes review priorities, exact commands and the known limits of previous checks. Prior design and review documents are in `docs/`.

With `npm run dev` running in a separate terminal:

```sh
npx playwright install chromium
npm run check:browser
```

`npm run check:live` exercises the deployed website. Screenshots go to the ignored `artifacts/` directory. Both scripts accept `BASE_URL` without a trailing slash. With the local app running, `npm run build:social` regenerates the social preview using the Blender model.

GitHub Actions runs build, type and accounting checks on pushes and pull requests. It does not deploy and requires no Cloudflare secrets.
