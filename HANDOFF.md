# Chancellor walkthrough review handoff

Latest user correction: restore “be the Chancellor”; the smaller-state message should emerge from choices, not be the opening premise.

Main site: https://uk-budget-battle.openuk-co.workers.dev . Inspect `public/walkthrough.js`, `public/reform-art.js` and `public/walkthrough.css`.

The opening gives the player a brief and a red-box invitation. Four binary decisions are initially unselected; migration also requires an explicit preset selection. Each policy choice shows intended consequences. Confirmation is disabled until a choice is made. Back preserves choices; a new term clears them. The final statement changes for a full reform route, a mixed route, the existing spending programme or a tax commitment without identified spending savings. Check that alternative paths do not receive the predetermined smaller-state conclusion.

There are no numerical economic forecasts or player scores. The migration stress-test scope and sources are unchanged, and documented in `docs/WALKTHROUGH-MIGRATION.md`. The previous calculator remains separately at `/explorer.html`; old root result links redirect there.

Run `npm run check:browser` locally and `npm run check:live` for production. Browser checks cover the reform route, alternative route, unfunded tax route, explicit-choice gates, restart/back, source modal, keyboard, every migration preset and phone/desktop layout. Node tests cover retained accounting and migration-flow arithmetic. No human comprehension study has been completed.

Winston's earlier feedback is recorded in `docs/WINSTON-RESPONSE.md`. The historical 1997-to-now idea is a separate unbuilt concept in `docs/1997-TO-NOW-CONCEPT.md`.
