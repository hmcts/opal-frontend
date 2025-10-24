# AbstractSignalFormBaseComponent Specification

## Goals

- Provide a signal-friendly foundation for form components adopting Angular’s signal patterns.
- Maintain parity with legacy base behaviours (submission pipeline, error orchestration, unsaved-change detection) while exposing signal accessors.
- Enable incremental adoption: components can extend the signal base without affecting existing reactive components.

## Proposed API Surface

```ts
export interface ISignalFormSubmitEvent<TFormData> {
  formData: TFormData;
  nestedFlow: boolean;
}

export abstract class AbstractSignalFormBaseComponent<TFormShape> implements OnInit, OnDestroy {
  /**
   * Raised with transformed form data when submission succeeds.
   */
  @Output() readonly formSubmit = new EventEmitter<ISignalFormSubmitEvent<TFormShape>>();

  /**
   * Emits whenever unsaved-change state flips, supporting parent can-deactivate guards.
   */
  @Output() readonly unsavedChanges = new EventEmitter<boolean>();

  /**
   * Backing `FormGroup` retained for validator reuse and interoperability.
   */
  protected formGroup!: FormGroup<TypedFormControls<TFormShape>>;

  /**
   * Writable signal mirroring the most recent form value snapshot.
   */
  protected readonly formValueSignal: WritableSignal<TFormShape>;

  /**
   * Signal reporting current dirty/submitted status for convenience.
   */
  protected readonly formDirtySignal: Signal<boolean>;

  /**
   * Signal collection of error summary entries, hydrated during submission attempts.
   */
  protected readonly formErrorSummarySignal: WritableSignal<IAbstractFormBaseFormErrorSummaryMessage[]>;

  /**
   * Implementations establish controls, register validators, and seed initial values.
   */
  protected abstract buildForm(): void;

  /**
   * Allows subclasses to provide field-error metadata mapping control keys to message priorities.
   */
  protected abstract fieldErrors(): Record<string, IAbstractFormBaseFieldError>;

  /**
   * Handles `<form (submit)>` events: run validation, emit success payload, or focus summary.
   */
  protected handleFormSubmit(event: SubmitEvent): void;

  /**
   * Utility to emit unsaved-change state downstream and mirror into internal signals.
   */
  protected updateUnsavedChanges(): void;
}
```

### Lifecycle

1. `buildForm()` invoked in `ngOnInit` for control creation.
2. Internally subscribe to `formGroup.valueChanges` (bridged via `toSignal`) to maintain `formValueSignal`.
3. On any change while not submitted, emit `unsavedChanges(true)`; reset to `false` on successful submit or explicit reset.
4. `handleFormSubmit` performs validation, populates error structures from `fieldErrors`, and emits `formSubmit` when valid.
5. `ngOnDestroy` tears down subscriptions/effects.

### Parent Interaction

No new parent base class is required; existing `AbstractFormParentBaseComponent` can continue to manage `stateUnsavedChanges`, since signal forms emit the same event contract.
