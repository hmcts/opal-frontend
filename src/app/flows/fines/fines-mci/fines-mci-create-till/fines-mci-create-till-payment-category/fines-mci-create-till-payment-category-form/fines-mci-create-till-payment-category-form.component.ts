import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { FinesMciJourney } from '../../../stores/fines-mci.store';
import { FINES_MCI_CREATE_TILL_PAYMENT_CATEGORY_FIELD_ERRORS } from '../constants/fines-mci-create-till-payment-category-field-errors.constant';
import { IFinesMciCreateTillPaymentCategoryFieldErrors } from '../interfaces/fines-mci-create-till-payment-category-field-errors.interface';
import { IFinesMciCreateTillPaymentCategoryFormState } from '../interfaces/fines-mci-create-till-payment-category-form-state.interface';

@Component({
  selector: 'app-fines-mci-create-till-payment-category-form',
  imports: [
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-payment-category-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillPaymentCategoryFormComponent extends AbstractFormBaseComponent implements OnInit {
  @Output() protected override formSubmit = new EventEmitter<
    IAbstractFormBaseForm<IFinesMciCreateTillPaymentCategoryFormState>
  >();
  @Output() protected cancelRequested = new EventEmitter<void>();
  protected override fieldErrors: IFinesMciCreateTillPaymentCategoryFieldErrors = {
    ...FINES_MCI_CREATE_TILL_PAYMENT_CATEGORY_FIELD_ERRORS,
  };
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  private initialiseForm(): void {
    this.form = new FormGroup({
      paymentCategory: new FormControl<FinesMciJourney | null>(null, Validators.required),
    });
  }

  public override ngOnInit(): void {
    this.initialiseForm();
    this.setInitialErrorMessages();
    this.form.controls['paymentCategory'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.formSubmitted = false;
      this.handleErrorMessages();
    });
    super.ngOnInit();
  }
}
