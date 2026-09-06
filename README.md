# Budget Battle — a different direction

Live: https://uk-budget-battle.openuk-co.workers.dev

The main site is now a short guided reform argument, replacing the increasingly complex calculator experience.

Five connected steps: smaller state → lower taxes → fewer regulatory barriers → ending net-zero mandates in favour of energy affordability → lower or negative net migration, with prosperity per person as the objective. Each screen contains a proposal, a three-part mechanism, a connection to the next screen and expandable assumptions. The final page brings the package together.

This is explicitly advocacy, not a neutral policy comparison or a calibrated economic forecast. Arrows indicate intended mechanisms, not guaranteed causal effects. No scores, numerical growth estimates or fiscal controls appear in the main journey. The migration step has four people-flow scenarios, including net outflow of 250,000 per year, with an explicit assumed unauthorised-population balance. These are stress tests, not forecasts; see `docs/WALKTHROUGH-MIGRATION.md`. Sources and counterevidence sit alongside the relevant claims.

## Development

```sh
npm ci
npm run dev
```

The current interface is `public/walkthrough.js`, `public/walkthrough.css`, `public/reform-art.js`, `public/migration-path.js` and `public/index.html`. It uses native HTML and system fonts, without a framework, external assets, analytics or saved player data. `npm run build:social` regenerates its preview image using Playwright.

```sh
npm run build
npm run check
npm test
npm run check:browser
npm run check:live
```

Browser checks exercise every screen, back/restart, evidence disclosures, sources modal, keyboard controls and phone/desktop overflow. `npm test` runs 27 tests: 26 retained calculator tests and one migration-flow test. These do not verify economic claims or the new walkthrough UI. Browser screenshots are in `artifacts/walkthrough/`.

## Earlier calculator

The previous simulator remains at `/explorer.html` for reference. Its implementation, accounting API, model version and tests are unchanged. It is not linked into the main walkthrough. Earlier design documents and `docs/HANDOFF-CALCULATOR-V4.md` describe that version, not the current main experience. Old root result fragments redirect to `/explorer.html` to preserve existing shared links.

## Deployment

Cloudflare Worker `uk-budget-battle`; deploy with `npm run deploy`. GitHub CI checks the build, TypeScript and Node tests; it does not automatically deploy. `docs/DEPLOYMENT-SNAPSHOT.json` records deployed file hashes.
