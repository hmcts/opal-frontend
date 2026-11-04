import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
import { IFinesMciSuspensePayment } from '../../../stores/interfaces/fines-mci.interface';
import { FINES_MCI_CREATE_TILL_SUSPENSE_DETAILS_FIELD_ERRORS } from './constants/fines-mci-create-till-suspense-details-field-errors.constant';
import { IFinesMciCreateTillSuspenseDetailsFieldErrors } from './interfaces/fines-mci-create-till-suspense-details-field-errors.interface';

const amountValidator: ValidatorFn = (control: AbstractControl) => {
  const value = String(control.value ?? '');
  if (!value || /[^\d.]/.test(value)) return value ? { validAmount: true } : null;
  return /^\d{1,18}(\.\d{1,2})?$/.test(value) ? null : { amountFormat: true };
};

@Component({
  selector: 'app-fines-mci-create-till-suspense-details-form',
  imports: [
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosConditionalComponent,
    GovukRadiosItemComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-suspense-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillSuspenseDetailsFormComponent extends AbstractFormBaseComponent implements OnInit {
  @Output() protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesMciSuspensePayment>>();
  @Output() protected cancelRequested = new EventEmitter<void>();
  protected override fieldErrors: IFinesMciCreateTillSuspenseDetailsFieldErrors = {
    ...FINES_MCI_CREATE_TILL_SUSPENSE_DETAILS_FIELD_ERRORS,
  };
  @Input() public initialValue: IFinesMciSuspensePayment | null = null;
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

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
      amount: new FormControl(initial.amount, [Validators.required, amountValidator]),
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
    this.updateConditionalValidators();
  }

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
    this.form.controls['relevantDetails'].setValidators(
      this.form.controls['reason'].value === 'unidentified'
        ? [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\- '\u2019]*$/)]
        : [],
    );
    postalOrderReference.updateValueAndValidity({ emitEvent: false });
    chequeReference.updateValueAndValidity({ emitEvent: false });
    creditTransferReference.updateValueAndValidity({ emitEvent: false });
    this.form.controls['source'].updateValueAndValidity({ emitEvent: false });
    this.form.controls['relevantDetails'].updateValueAndValidity({ emitEvent: false });
  }

  protected override hasUnsavedChanges(): boolean {
    return Object.values(this.form.getRawValue()).some(
      (value) => value !== null && value !== undefined && value !== '',
    );
  }

  public override ngOnInit(): void {
    this.initialiseForm();
    this.setInitialErrorMessages();
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateConditionalValidators();
    });
    super.ngOnInit();
  }

  public submitForm(event: SubmitEvent): void {
    this.formSubmitted = true;
    this.handleFormSubmit(event);
  }
}
