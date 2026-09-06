# Budget Battle — a different direction

Live: https://uk-budget-battle.openuk-co.workers.dev

The main site puts the player in the Chancellor's chair: “The red box is yours.” Five decisions cover spending, taxes, business rules, energy and migration. There is no smaller-state slogan on the opening screen.

The first four steps offer two unselected policy options. Consequences appear after a choice, and confirmation is required to continue. Migration uses the existing reference/zero/negative flow presets, now requiring an explicit selection. The final Chancellor's statement is derived from the decisions: a coherent smaller-state route, a mixed spending settlement, protection of the existing programme, or a tax pledge without identified spending savings. The conclusion is a description of the player's programme, not a numerical score.

This is a simplified authored policy scenario, not a calibrated economic forecast. Arrows show intended mechanisms with conditions available alongside them. Migration category splits and the unauthorised-population balance remain explicit stress-test assumptions; see `docs/WALKTHROUGH-MIGRATION.md`. The colourful illustrations and compact five-step structure are retained.

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
