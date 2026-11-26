import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukTextInputPrefixSuffixComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input-prefix-suffix';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { amountValidator } from '@hmcts/opal-frontend-common/validators/amount';
import { nonNegativeValueValidator } from '@hmcts/opal-frontend-common/validators/non-negative-value';
import { FINES_AEC_AMEND_VALUES_FIELD_ERRORS } from '../constants/fines-aec-amend-values-field-errors.constant';
import { FINES_AEC_AMEND_VALUES_FORM_STATE } from '../constants/fines-aec-amend-values-form-state.constant';
import { FINES_AEC_AMEND_VALUES_VALIDATION } from '../constants/fines-aec-amend-values-validation.constant';
import { IFinesAecAmendValuesFormState } from '../interfaces/fines-aec-amend-values-form-state.interface';
import { finesAecMinimumHighValueValidator } from '../validators/fines-aec-amend-values-minimum-high-value.validator';

@Component({
  selector: 'app-fines-aec-amend-values-form',
  imports: [
    ReactiveFormsModule,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
    GovukTextInputPrefixSuffixComponent,
    GovukButtonDirective,
  ],
  templateUrl: './fines-aec-amend-values-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecAmendValuesFormComponent extends AbstractFormBaseComponent implements OnChanges {
  protected override fieldErrors = FINES_AEC_AMEND_VALUES_FIELD_ERRORS;

  @Input() public initialValues: IFinesAecAmendValuesFormState = { ...FINES_AEC_AMEND_VALUES_FORM_STATE };
  @Input() public contextKey: unknown;
  @Input() public accountTypeName = '';
  @Input() public pending = false;
  @Output() public override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAecAmendValuesFormState>>();
  @Output() public readonly cancelRequested = new EventEmitter<void>();

  public override readonly form = new FormGroup(
    {
      minimum_balance: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          amountValidator(
            FINES_AEC_AMEND_VALUES_VALIDATION.minimumBalanceIntegerDigits,
            FINES_AEC_AMEND_VALUES_VALIDATION.decimalPlaces,
          ),
          nonNegativeValueValidator(),
        ],
      }),
      high_value: new FormControl('', {
        nonNullable: true,
        validators: [
          amountValidator(
            FINES_AEC_AMEND_VALUES_VALIDATION.highValueIntegerDigits,
            FINES_AEC_AMEND_VALUES_VALIDATION.decimalPlaces,
          ),
          nonNegativeValueValidator(),
        ],
      }),
    },
    { validators: [finesAecMinimumHighValueValidator()] },
  );

  /**
   * Compares current values with the saved baseline, including after a failed save.
   * @returns Whether either amount differs from its initial value.
   */
  protected override hasUnsavedChanges(): boolean {
    const values = this.form.getRawValue();
    return (
      values.minimum_balance !== this.initialValues.minimum_balance ||
      values.high_value !== this.initialValues.high_value
    );
  }

  /**
   * Reinitialises values and errors when the resolved account type changes.
   * @param changes - Updated form inputs and account context.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValues'] || changes['contextKey']) {
      this.form.reset(this.initialValues, { emitEvent: false });
      this.formSubmitted = false;
      this.setInitialErrorMessages();
      this.unsavedChanges.emit(this.hasUnsavedChanges());
    }
  }

  /** Initialises empty field errors before subscribing to form changes. */
  public override ngOnInit(): void {
    this.setInitialErrorMessages();
    super.ngOnInit();
  }

  /**
   * Validates and emits values unless a save is already pending.
   * @param event - Native form submission to prevent before emitting validated data.
   */
  public override handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.pending) super.handleFormSubmit(event);
  }
}
