# Current Form Infrastructure Overview

## AbstractFormBaseComponent (legacy reactive form)

- Extends Angular `Component` with an empty template; consumer components inherit to access shared form utilities.
- Maintains an internal `FormGroup` instance and orchestrates:
  - Error summary composition via `formErrors`, `formErrorSummaryMessage`, and `formControlErrorMessages`.
  - Unsaved-change detection by monitoring `form.valueChanges` and comparing `dirty`/`formSubmitted`.
  - Submission handling (`handleFormSubmit`) that validates, applies nested-flow detection, emits `formSubmit`, and triggers error summary focus when invalid.
  - Scroll helpers and control management helpers (add/update/remove controls, patching records, clearing errors).
- Emits `formSubmit` (`EventEmitter<IAbstractFormBaseForm<any>>`) and `unsavedChanges` events for parent components/guards.

## AbstractFormParentBaseComponent (legacy reactive form)

- Provides routing helpers (`routerNavigate`) using injected Angular Router.
- Tracks `stateUnsavedChanges` flag and surfaces `canDeactivate` for the shared guard.
- Offers utility `hasFormValues` for downstream checks.
- Agnostic of implementation detail (reactive vs signal), relying only on `stateUnsavedChanges`.

## GOV.UK Form Components Used in MAC Comments/Notes

| Component | Key Inputs | Behaviour expectations |
| --------- | ---------- | ---------------------- |
| `opal-lib-govuk-text-area` | `labelText`, `inputId`, `inputName`, `control` (`AbstractControl`), `characterCountEnabled`, `maxCharacterLimit`, `errors` | Renders textarea with GOV.UK classes, optional character count messaging, binds Angular `AbstractControl` for validation state. |
| `opal-lib-govuk-button` | `buttonId`, `type`, optional classes | Styled submit buttons. |
| `opal-lib-govuk-cancel-link` | Emits `linkClickEvent` | Standard cancel navigation link. |
| `opal-lib-govuk-error-summary` | `errors`, `errorClick` | Displays error summary list and surfaces click events for scrolling. |

The comments/notes form exclusively binds `AbstractControl` instances into the GOV.UK controls; migrating to signal forms requires compatible APIs or adapters.
