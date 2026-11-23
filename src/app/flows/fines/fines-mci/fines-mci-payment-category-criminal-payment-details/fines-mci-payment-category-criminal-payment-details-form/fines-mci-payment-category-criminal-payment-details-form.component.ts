import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { amountValidator } from '@hmcts/opal-frontend-common/validators/amount';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { IFinesMciCriminalPayment } from '../../stores/interfaces/fines-mci.interface';
import { FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_PAYMENT_DETAILS_FIELD_ERRORS } from './constants/fines-mci-payment-category-criminal-payment-details-field-errors.constant';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { formatPounds } from '../../fines-mci-create-till/utils/fines-mci-court-fee-payment.utils';

const NON_WHITESPACE_PATTERN_VALIDATOR = patternValidator(/\S/, 'required');

@Component({
  selector: 'app-fines-mci-payment-category-criminal-payment-details-form',
  imports: [
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosConditionalComponent,
    GovukRadiosItemComponent,
    ReactiveFormsModule,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
  ],
  templateUrl: './fines-mci-payment-category-criminal-payment-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent
  extends AbstractFormBaseComponent
  implements OnInit
{
  @Output() protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesMciCriminalPayment>>();
  @Output() protected cancelRequested = new EventEmitter<void>();
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_PAYMENT_DETAILS_FIELD_ERRORS,
  };
  @Input() public initialValue: IFinesMciCriminalPayment | null = null;
  @Input() public accountBalance: number | null = null;
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  /** Builds the criminal payment form using any saved values and applies the initial conditional validators. */
  private initialiseForm(): void {
    const initial = this.initialValue ?? {
      amount: '',
      payerType: null,
      methodOfPayment: null,
      paymentReferencePostalOrder: '',
      paymentReferenceCheque: '',
      paymentReferenceCreditTransfer: '',
      source: null,
      thirdPartyName: '',
    };
    this.form = new FormGroup({
      amount: new FormControl(initial.amount, [
        Validators.required,
        Validators.pattern(/^-?\d*(?:\.\d*)?$/),
        amountValidator(18, 2),
      ]),
      payerType: new FormControl<IFinesMciCriminalPayment['payerType']>(initial.payerType, Validators.required),
      methodOfPayment: new FormControl<IFinesMciCriminalPayment['methodOfPayment']>(
        initial.methodOfPayment,
        Validators.required,
      ),
      paymentReferencePostalOrder: new FormControl(initial.paymentReferencePostalOrder),
      paymentReferenceCheque: new FormControl(initial.paymentReferenceCheque),
      paymentReferenceCreditTransfer: new FormControl(initial.paymentReferenceCreditTransfer),
      source: new FormControl(initial.source),
      thirdPartyName: new FormControl(initial.thirdPartyName),
    });
    this.updateConditionalValidators();
  }

  /** Applies reference, source, and third-party name validators only when their fields are relevant. */
  private updateConditionalValidators(): void {
    const method = this.form.controls['methodOfPayment'].value;
    const referenceValidators = [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\- '\u2019]*$/)];
    const postalOrderReference = this.form.controls['paymentReferencePostalOrder'];
    const chequeReference = this.form.controls['paymentReferenceCheque'];
    const creditTransferReference = this.form.controls['paymentReferenceCreditTransfer'];
    postalOrderReference.setValidators(method === 'postalOrder' ? referenceValidators : []);
    chequeReference.setValidators(method === 'cheque' ? referenceValidators : []);
    creditTransferReference.setValidators(method === 'creditTransfer' ? referenceValidators : []);
    this.form.controls['source'].setValidators(method === 'creditTransfer' ? [Validators.required] : []);
    this.form.controls['thirdPartyName'].setValidators(
      this.form.controls['payerType'].value === 'thirdParty'
        ? [Validators.required, NON_WHITESPACE_PATTERN_VALIDATOR, ...referenceValidators]
        : [],
    );
    postalOrderReference.updateValueAndValidity({ emitEvent: false });
    chequeReference.updateValueAndValidity({ emitEvent: false });
    creditTransferReference.updateValueAndValidity({ emitEvent: false });
    this.form.controls['source'].updateValueAndValidity({ emitEvent: false });
    this.form.controls['thirdPartyName'].updateValueAndValidity({ emitEvent: false });
  }

  /** Calculates the overpayment in whole pence, preserving all 18 allowed integer digits. */
  protected get overpayment(): string | null {
    const control = this.form.controls['amount'];
    const amount = String(control.value ?? '');
    if (control.invalid || this.accountBalance === null || !Number.isFinite(this.accountBalance)) return null;
    const [pounds, pence = ''] = amount.replace('-', '').split('.');
    const paid = (BigInt(pounds) * 100n + BigInt(pence.padEnd(2, '0'))) * (amount.startsWith('-') ? -1n : 1n);
    const difference = paid - BigInt(Math.round(this.accountBalance * 100));
    return difference > 0n ? formatPounds(difference, 2) : null;
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
    this.setInitialErrorMessages();
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateConditionalValidators();
    });
    super.ngOnInit();
  }

  /** Marks the form as submitted before delegating validation and error handling to the base form. */
  public submitForm(event: SubmitEvent): void {
    this.formSubmitted = true;
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

    if (selectedMethod !== 'creditTransfer') this.form.controls['source'].setValue(null, { emitEvent: false });
    if (this.form.controls['payerType'].value !== 'thirdParty') {
      this.form.controls['thirdPartyName'].setValue('', { emitEvent: false });
    }
    this.handleFormSubmit(event);
  }
}
