import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { FINES_MCI_CREATE_TILL_COURT_FEE_PAYMENT_DETAILS_FIELD_ERRORS } from '../constants/fines-mci-create-till-court-fee-payment-details-field-errors.constant';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-payment-details-form',
  imports: [GovukErrorSummaryComponent, GovukRadioComponent, GovukRadiosItemComponent, ReactiveFormsModule],
  templateUrl: './fines-mci-create-till-court-fee-payment-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeePaymentDetailsFormComponent extends AbstractFormBaseComponent implements OnInit {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MCI_CREATE_TILL_COURT_FEE_PAYMENT_DETAILS_FIELD_ERRORS,
  };
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  /** Creates the required payer selection and refreshes validation when the user changes it. */
  public override ngOnInit(): void {
    this.form = new FormGroup({
      paymentReceivedFrom: new FormControl<string | null>(null, Validators.required),
    });
    this.setInitialErrorMessages();
    this.form.controls['paymentReceivedFrom'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.formSubmitted = false;
      this.handleErrorMessages();
    });
    super.ngOnInit();
  }
}
