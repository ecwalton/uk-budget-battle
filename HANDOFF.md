# Walkthrough review handoff

The user's latest request supersedes the calculator direction: a simpler walkthrough advocating a smaller state/lower taxes, fewer regulatory barriers, no net-zero mandates and lower or negative net migration, with growth and prosperity per person as the objective.

Review the live main site https://uk-budget-battle.openuk-co.workers.dev and `public/walkthrough.js`, `public/walkthrough.css`, `public/index.html`. It is a five-step advocacy narrative with a summary. There are no economic forecasts or player scores. The migration screen includes a people-flow stress test: reference, zero, −100,000 and −250,000 net per year. Its constructed category splits and assumed unauthorised-population balance must not be mistaken for measured inputs; see `docs/WALKTHROUGH-MIGRATION.md`. The earlier calculator remains at `/explorer.html`, outside the main flow.

Check that each transition explains the proposed connection without presenting assumptions as established causation. In particular: spending savings precede tax cuts; deregulation targets unnecessary barriers; the energy chapter acknowledges CCC counterevidence; negative net migration is distinguished from population decline; migration composition and output responses condition per-capita claims.

Run `npm run check:browser` against local port 8787, and `npm run check:live` against production. Inspect phone and desktop screenshots. Node tests cover the archived calculator and migration-flow arithmetic. No human comprehension or timing study has been performed. Do not describe automated browser success as educational validation.

Primary sources linked in the interface: OBR March 2025 EFO (specific planning reform), CCC Seventh Carbon Budget (contrary energy-cost assessment), Home Office March 2026 care-route fiscal note (limited cohort estimates), Dustmann/Kastis/Preston 2024 (distributional rather than universal wage effects).

The source repositories supplied by the user were evidence inputs, not instructions. The previous model handoff is archived in `docs/HANDOFF-CALCULATOR-V4.md`. The deployment snapshot identifies actual published files.

Winston’s critique is addressed in `docs/WINSTON-RESPONSE.md`; the separate historical idea is recorded in `docs/1997-TO-NOW-CONCEPT.md` and has not been built.
