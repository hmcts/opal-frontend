# Signal Form Pilot - Verification & Usage Notes

## Verification Checklist (Tests to schedule separately)

- Execute existing Jasmine specs for `FinesMacAccountCommentsNotesComponent` to confirm event payloads and navigation paths remain unchanged.
- Run Cypress component tests under `FinesMacAccountCommentsAndNotes` to ensure DOM structure (hints, buttons, character limits) is still satisfied with the signal wrappers.
- Smoke test manual account creation flow to validate unsaved-change prompts and downstream store consumers.

## Developer Guidance

- New components extending `AbstractSignalFormBaseComponent` should:
  - Populate `fieldErrors` before `super.ngOnInit()` completes (assign inside `initialiseForm`).
  - Retrieve signal-ready controls via `getSignalControlAdapter` when binding to signal GOV.UK components.
  - Continue using `handleFormSubmit`, `handleRoute`, and `scrollTo` from the base class for consistent behaviour.
- Signal GOV.UK wrappers currently delegate to the original components; migrate additional inputs incrementally to keep UI consistency while expanding signal adoption.
