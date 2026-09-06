# Two-product review handoff

The Budget Battle envelope game is restored at https://uk-budget-battle.openuk-co.workers.dev/ . The GBTT programme walkthrough is at /programme.html, with reciprocal links and a /?preset=gbtt entry to the game. /explorer.html remains a compatible game URL.

Three editable five-year presets: GBTT plan, Revenue first, Invest and tax. Every Budget remains subject to review, funding ceilings, selected shocks and the unchanged engine/safeguards. Preset allocations are explicit in public/presets.js and docs/PRESETS.md, with a complete 18-case result matrix. The £52bn spending/£30bn tax GBTT translation fails annual and legacy targets; the investment draft fails the household floor under the energy shock. No engine changes reward any programme.

Check commands cover unit accounting, original game browser regressions, all presets on desktop/mobile, and the programme walkthrough. Shared result hashes and the old explorer URL remain supported. The timing study is still outstanding. No new random shock or parliamentary mechanic is claimed.

Homepage visual update: larger interactive Blender Treasury desk, clearer start action, three illustrated play instructions, numbered plan/conditions setup and expandable migration assumptions. Source model is assets/treasury-desk.blend; generator scripts/create-treasury-desk.py; GLB and rendered PNG fallback in public/assets. Recap animation and the economic engine are preserved. Homepage-specific checks exercise mobile text geometry, selections, optional-control continuity and reduced-motion fallback.

Interior graphics: ten original Blender props in `public/assets/interiors/`, with editable `.blend` sources in `assets/interiors/` and generator `scripts/create-interior-art.py`. Spending/funding headers, all tax/borrowing cards, funding status, shock notices, Budget Bulletin and final legacy use the assets. Screen-entry and selected-card motion is brief and disabled for reduced motion. `scripts/interior-check.mjs` checks all five Budgets, image loading and phone/desktop layouts. No economic model changes.
