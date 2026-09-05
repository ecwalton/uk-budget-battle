# The Budget Battle

[Play the live prototype](https://uk-budget-battle.openuk-co.workers.dev) · [Independent model handoff](HANDOFF.md) · [Economic model assessment](MODEL-INTEGRATION.md)

A public-facing UK fiscal strategy **prototype** on Cloudflare Workers. Five Budget rounds, 15 policy cards, a ten-year ledger, three repeatable scenarios, save/resume, result links and JSON downloads.

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
- `test/engine.test.js`: accounting invariants and all 32,768 policy combinations.

## Model limitations

All macro paths, policy costs and outcome points are illustrative training assumptions. OBR, HMRC and Treasury links provide context, not these card costings. Household points are not disposable-income estimates. Capacity weights are not empirically calibrated. GDP has no policy feedback. Debt is simplified accumulated borrowing, not an official PSND/PSNFL reconciliation. No electoral or fiscal-rule prediction is made.

The goal is £15bn annual borrowing improvement in year 5, £75bn cumulative improvement in years 6–10, and no capacity or household-group score below −5 across ten years. These are disclosed design thresholds, not proof of economic sustainability.

Before describing the game as an evidence-calibrated policy model, replace training values with sourced estimates, validate distributional and service mappings, and commission independent review. Increment `SCENARIO.version` for outcome changes; old shared games must not silently change meaning. See the model-integration assessment supplied alongside the project for the recommended path.

## Public website design

Local ES modules and system fonts; no frontend framework or third-party browser requests. Three.js loads separately on the introduction, skips reduced-motion/data-saving preferences, and leaves a static fallback without WebGL. Rendering is on demand, pauses when hidden, and disposes resources on navigation.

Choices save locally. Result URLs contain validated choices in their fragment. No application analytics or server-side player database is used; Cloudflare infrastructure logs may still exist. Core controls are native buttons/dialogs; the canvas chart has a data table. A full accessibility audit and educational user study are still future work.

## API

- `GET /api/health`: health and scenario version.
- `POST /api/simulate`: JSON such as `{ "decisions": [[],[],[],[],[]], "shock": "calm", "sensitivity": "central" }`.
- 4KB streamed body limit, strict round/card validation, no external calls or storage. Unknown routes return 404 and unsupported simulation methods 405.

The browser uses the same engine for instant feedback; the API supports verification and future integrations.

## Verification

TypeScript, Worker dry run, accounting tests, full desktop/mobile playthrough, selection reversal, review cancellation, resume, sensitivity, shock reveal, downloads and shared results. API parity and invalid/oversized requests checked. Reduced-motion and keyboard paths checked. Screenshots reviewed for introduction, Budget and results.


## Independent review and browser reproduction

Give another model `HANDOFF.md` and repository access, or attach the source archive. The handoff includes review priorities, exact commands and the known limits of previous checks. Prior design and review documents are in `docs/`.

With `npm run dev` running in a separate terminal:

```sh
npx playwright install chromium
npm run check:browser
```

`npm run check:live` exercises the deployed website. Screenshots go to the ignored `artifacts/` directory. Both scripts accept `BASE_URL` without a trailing slash. `npm run build:social` regenerates the social preview image.

GitHub Actions runs build, type and accounting checks on pushes and pull requests. It does not deploy and requires no Cloudflare secrets.
