import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukTextInputPrefixSuffixComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input-prefix-suffix';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { amountValidator } from '@hmcts/opal-frontend-common/validators/amount';
import { IFinesMciSuspensePayment } from '../../../stores/interfaces/fines-mci.interface';
import { FINES_MCI_CREATE_TILL_SUSPENSE_DETAILS_FIELD_ERRORS } from './constants/fines-mci-create-till-suspense-details-field-errors.constant';
import { IFinesMciCreateTillSuspenseDetailsFieldErrors } from './interfaces/fines-mci-create-till-suspense-details-field-errors.interface';

@Component({
  selector: 'app-fines-mci-create-till-suspense-details-form',
  imports: [
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukTextInputComponent,
    GovukTextInputPrefixSuffixComponent,
    GovukRadioComponent,
    GovukRadiosConditionalComponent,
    GovukRadiosItemComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-suspense-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillSuspenseDetailsFormComponent extends AbstractFormBaseComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  @Output() protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesMciSuspensePayment>>();
  @Output() protected cancelRequested = new EventEmitter<void>();
  protected override fieldErrors: IFinesMciCreateTillSuspenseDetailsFieldErrors = {
    ...FINES_MCI_CREATE_TILL_SUSPENSE_DETAILS_FIELD_ERRORS,
  };
  @Input() public initialValue: IFinesMciSuspensePayment | null = null;
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  /** Builds the suspense form using any saved values and applies the initial conditional validators. */
  private initialiseForm(): void {
    const initial = this.initialValue ?? {
      amount: '',
      payerType: null,
      methodOfPayment: null,
      paymentReferencePostalOrder: '',
      paymentReferenceCheque: '',
      paymentReferenceCreditTransfer: '',
      source: null,
      reason: null,
      relevantDetails: '',
    };
    this.form = new FormGroup({
      amount: new FormControl(initial.amount, [Validators.required, amountValidator(18, 2)]),
      payerType: new FormControl<IFinesMciSuspensePayment['payerType']>(initial.payerType, Validators.required),
      methodOfPayment: new FormControl<IFinesMciSuspensePayment['methodOfPayment']>(
        initial.methodOfPayment,
        Validators.required,
      ),
      paymentReferencePostalOrder: new FormControl(initial.paymentReferencePostalOrder),
      paymentReferenceCheque: new FormControl(initial.paymentReferenceCheque),
      paymentReferenceCreditTransfer: new FormControl(initial.paymentReferenceCreditTransfer),
      source: new FormControl(initial.source),
      reason: new FormControl<IFinesMciSuspensePayment['reason']>(initial.reason, Validators.required),
      relevantDetails: new FormControl(initial.relevantDetails),
    });
    this.setInitialErrorMessages();
    this.updateConditionalValidators();
  }

  /** Applies reference, source, and additional-detail validators only when their fields are relevant. */
  private updateConditionalValidators(): void {
    const method = this.form.controls['methodOfPayment'].value;
    const referenceValidators = [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\- '\u2019]*$/)];
    this.updateControl('paymentReferencePostalOrder', method === 'postalOrder' ? referenceValidators : []);
    this.updateControl('paymentReferenceCheque', method === 'cheque' ? referenceValidators : []);
    this.updateControl('paymentReferenceCreditTransfer', method === 'creditTransfer' ? referenceValidators : []);
    this.updateControl('source', method === 'creditTransfer' ? [Validators.required] : []);
    this.updateControl(
      'relevantDetails',
      this.form.controls['reason'].value === 'unidentified'
        ? [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\- '\u2019]*$/)]
        : [],
    );
    const inactiveFields = [
      ...(method === 'postalOrder' ? [] : ['paymentReferencePostalOrder']),
      ...(method === 'cheque' ? [] : ['paymentReferenceCheque']),
      ...(method === 'creditTransfer' ? [] : ['paymentReferenceCreditTransfer', 'source']),
      ...(this.form.controls['reason'].value === 'unidentified' ? [] : ['relevantDetails']),
    ];
    for (const field of inactiveFields) {
      this.removeControlErrors(field);
    }
    this.formErrorSummaryMessage =
      this.formErrorSummaryMessage?.filter((error) => !inactiveFields.includes(error.fieldId)) ?? [];
    this.formErrors = this.formErrors?.filter((error) => !inactiveFields.includes(error.fieldId)) ?? [];
    this.changeDetector.markForCheck();
  }

  /** Reports unsaved changes whenever at least one field contains a value. */
  protected override hasUnsavedChanges(): boolean {
    return Object.values(this.form.getRawValue()).some(
      (value) => value !== null && value !== undefined && value !== '',
    );
  }

  /** Initialises the form and refreshes conditional validators when selections change. */
  public override ngOnInit(): void {
    this.initialiseForm();
    this.form.controls['methodOfPayment'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateConditionalValidators();
    });
    this.form.controls['reason'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateConditionalValidators();
    });
    super.ngOnInit();
  }

  /** Clears references for other payment methods before submitting through the base form. */
  public override handleFormSubmit(event: SubmitEvent): void {
    const selectedMethod = this.form.controls['methodOfPayment'].value;
    const referenceFields = [
      { method: 'postalOrder', controlName: 'paymentReferencePostalOrder' },
      { method: 'cheque', controlName: 'paymentReferenceCheque' },
      { method: 'creditTransfer', controlName: 'paymentReferenceCreditTransfer' },
    ] as const;

    for (const referenceField of referenceFields) {
      if (referenceField.method !== selectedMethod) {
        this.form.controls[referenceField.controlName].setValue('', { emitEvent: false });
      }
    }

    super.handleFormSubmit(event);
  }
}
