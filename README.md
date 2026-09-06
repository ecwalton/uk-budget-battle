# The Budget Battle

Play the five-year envelope game at https://uk-budget-battle.openuk-co.workers.dev/ . The separate GBTT programme walkthrough is at `/programme.html`. `/explorer.html` remains compatible with earlier game links.

The game has nine sized levers, a funding ledger that blocks unaffordable settlements, three selectable economic backdrops, annual Budget Bulletins and ten-year fiscal, capacity and household checks. Its accounting engine and training assumptions are unchanged.

Three editable five-year drafts connect the products: GBTT plan, Revenue first, and Invest and tax. Each loads all nine settings for the next Budget; the player edits and confirms them. See [preset mappings and the full 18-case results](docs/PRESETS.md). The GBTT translation does not pass its own game's annual and legacy targets. No automatic growth or migration savings are booked.

## Development

```sh
npm ci
npm run dev
npm test
npm run check
npm run build
npm run check:browser
npm run check:live
```

Game UI: `public/app.js`, `public/style.css`, `public/index.html`. Presets: `public/presets.js`. Engine: `public/engine.js` and `public/scenario.js`. Programme UI: `public/walkthrough.js`, `public/walkthrough.css`, `public/programme.html`.

29 Node tests cover accounting and policy routes. Browser checks cover the original game, all three presets on desktop/mobile, and the programme. The timing/comprehension study remains outstanding. All game financial paths and outcome points are illustrative; they are not official costings or economic rankings.

## Deployment

Cloudflare Worker `uk-budget-battle`; `npm run deploy`. GitHub CI checks build, types and Node tests but does not automatically deploy. `docs/DEPLOYMENT-SNAPSHOT.json` records the published assets. See [handoff](HANDOFF.md).

## Homepage and Blender assets

The homepage uses an original interactive Treasury desk tableau, three illustrated instructions, and a numbered plan/conditions setup. Advanced migration assumptions are expandable. `assets/treasury-desk.blend` and `scripts/create-treasury-desk.py` are the editable source and reproducible generator. The browser loads `public/assets/treasury-desk.glb`; `treasury-desk.png` is the Blender-rendered fallback for reduced motion, no WebGL or failed model loading. Recap lid animation still uses the original red-box model. `scripts/home-check.mjs` checks the setup/start flow, mobile text geometry and fallback.
