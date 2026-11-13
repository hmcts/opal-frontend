import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { IOpalFinesMapping } from '@services/fines/opal-fines-service/interfaces/opal-fines-mapping.interface';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { FINES_MCI_CREATE_TILL_COURT_FEE_PAYMENT_DETAILS_FIELD_ERRORS } from '../constants/fines-mci-create-till-court-fee-payment-details-field-errors.constant';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-payment-details-form',
  imports: [
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosConditionalComponent,
    GovukRadiosItemComponent,
    GovukTextInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-court-fee-payment-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeePaymentDetailsFormComponent extends AbstractFormBaseComponent implements OnInit {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MCI_CREATE_TILL_COURT_FEE_PAYMENT_DETAILS_FIELD_ERRORS,
  };
  @Input({ required: true }) public paymentMethods: IOpalFinesMapping[] = [];
  @Input({ required: true }) public paymentSources: IOpalFinesMapping[] = [];
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  /** Initialises the payment controls and keeps hidden conditional fields out of validation. */
  public override ngOnInit(): void {
    this.form = new FormGroup({
      paymentReceivedFrom: new FormControl<string | null>(null, Validators.required),
      paymentMethod: new FormControl<string | null>(null, Validators.required),
      paymentSource: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
      paymentReference: new FormControl<string | null>({ value: null, disabled: true }, [
        Validators.pattern(/^[a-zA-Z0-9 '\-]*$/),
        Validators.maxLength(50),
      ]),
    });
    this.setInitialErrorMessages();
    this.form.controls['paymentMethod'].valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((method: string | null) => {
        const source = this.form.controls['paymentSource'];
        const reference = this.form.controls['paymentReference'];
        source.reset(null, { emitEvent: false });
        reference.reset(null, { emitEvent: false });
        if (method === 'CT') source.enable({ emitEvent: false });
        else source.disable({ emitEvent: false });
        if (method === 'PO' || method === 'CQ' || method === 'CT') reference.enable({ emitEvent: false });
        else reference.disable({ emitEvent: false });
      });
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.formSubmitted = false;
      if (this.formErrorSummaryMessage.length) this.handleErrorMessages();
    });
    super.ngOnInit();
  }
}
