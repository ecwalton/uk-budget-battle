# Economic models for the Budget Battle

Assessment date: 5 September 2026

Yes, these sources help. The recommended first upgrade is household tax-benefit modelling through PolicyEngine, while retaining a simple public interface. The existing Worker build remains a labelled training prototype; none of these external models has been executed, calibrated or integrated into its scoring.

## Which model to use

| Resource | Recommended role | Important limit |
|---|---|---|
| PolicyEngine UK | First candidate for direct household tax-benefit impacts and distribution across income groups. | Its current README directs population-wide analysis to the managed `policyengine.py` bundle; the country package retains UK rules and household calculations. Follow that migration rather than starting on the deprecated microsimulation route. [1] |
| Official OBR macroeconomic model | Reference for accounting structure, published equations and scenario assumptions. | OBR forecasts incorporate judgments and other models; running the published EViews equations does not reproduce an official forecast or imply endorsement. [2] |
| PolicyEngine OBR emulator | Research sandbox for selected short-term responses after validation. | The README documents severe limitations, including a missing government-investment channel and incomplete second-round effects. Do not use its general outputs to score the game yet. [3] |
| OG-UK | Candidate for long-run fiscal and demographic scenarios and the legacy panel. | Dynamic general-equilibrium results depend on calibration and closure assumptions. Its setup also involves PolicyEngine microdata access. Treat steady-state comparisons separately from transition-year impacts. [4] |
| UK HANK v3 | Optional research comparison for monetary shocks and household transmission. | This is a third-party replication. The headline accuracy claim concerns selected comparisons, not general forecast accuracy; its README reports weaker consumption and exchange-rate matches. Its fiscal feedback can impose spending changes that would need reconciling with player choices. [5] |

These are complementary approaches, not interchangeable engines. None automatically supplies defensible NHS waiting-list outcomes, SEND capacity, or political reactions. Those need separate evidence and clearly defined measures.

## Keep the public website simple

Recommended architecture: run supported economic scenarios offline in Python, review their outputs, and publish compact versioned aggregate JSON files with the Worker. The browser loads results, draws charts and explains consequences. No household microdata belongs in public assets.

Use one master fiscal ledger. Keep direct tax-benefit impacts, secondary macroeconomic feedback, debt interest and distributional outcomes separate. Reconcile units, calendar versus fiscal years, real versus nominal values, population scope and baseline vintage before combining them.

Do not simply add independent tax-card costings. Means-tested benefits, allowances and tax bands interact. For the small card set, evaluate supported combinations or validate an approximation against combined model runs. Unsupported combinations should remain explicitly unsupported, rather than silently reverting to invented effects.

## Recommended sequence

1. Specify two or three concrete tax-benefit policies rather than broad revenue targets. Pin the PolicyEngine bundle, dataset and baseline year; produce direct fiscal and household comparisons.
2. Validate baseline aggregates, signs, population weights and package interactions. Replace only the relevant training cards once their estimates pass review. Keep training and calibrated scenarios visibly separate.
3. Evaluate published OBR assumptions or validated macro responses offline. Compare OG-UK legacy scenarios later. Add HANK only if monetary-transmission detail materially improves the lesson.

Each published result should record model/release or commit, dataset version, baseline, policy parameters, execution date, units, horizon, scope, behavioural assumptions, warnings, source links and validation status. Check code and dataset reuse terms before distributing derived artifacts. Model uncertainty and limitations should survive export into the website.

## Specific cautions from the supplied repositories

The OBR emulator says its anchored fit is achieved through add-factors. That is not independent evidence of predictive skill. It also says published multiplier conventions can be imposed as explicit adjustments, rather than emerging from the model. Those distinctions must remain visible if outputs are used. [3]

The HANK repository compares particular responses to a monetary shock and includes a debt-feedback spending rule. Importing that response unmodified could make the game cut spending without the player choosing it. Audit that interaction before using it as a shock generator. [5]

## Sources

1. [PolicyEngine UK README and migration guidance](https://github.com/PolicyEngine/policyengine-uk/blob/main/README.md)
2. [Official OBR model and guidance](https://obr.uk/forecasts-in-depth/obr-macroeconomic-model/)
3. [PolicyEngine OBR emulator and documented limitations](https://github.com/PolicyEngine/obr-macroeconomic-model)
4. [OG-UK repository and setup](https://github.com/PSLmodels/OG-UK)
5. [UK HANK v3 README and replication comparisons](https://github.com/ChrisRoboMacro/UK_HANK_v3)

Scope: documentation-level suitability assessment. This is not a source-code audit, reproduction of results, or certification of any model.
