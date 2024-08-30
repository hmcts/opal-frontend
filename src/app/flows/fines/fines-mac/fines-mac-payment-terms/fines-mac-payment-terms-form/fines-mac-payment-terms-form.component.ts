import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { AbstractFormBaseComponent } from '@components/abstract';
import { IFinesMacPaymentTermsFieldErrors, IFinesMacPaymentTermsForm } from '../interfaces';
import { FinesService } from '../../../services/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGovUkRadioOptions } from '@interfaces/components/govuk';
import { CommonModule } from '@angular/common';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukErrorSummaryComponent,
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukTextInputPrefixSuffixComponent,
} from '@components/govuk';
import {
  FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION,
  FINES_MAC_PAYMENT_TERMS_OPTIONS,
} from '../constants';
import { ScotgovDatePickerComponent } from '@components/scotgov';
import { FinesMacDefaultDaysComponent } from '../../components';
import { FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS } from '../constants/fines-mac-payment-terms-field-errors';
import { takeUntil } from 'rxjs';
import { DateService } from '@services';

@Component({
  selector: 'app-fines-mac-payment-terms-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukCancelLinkComponent,
    ScotgovDatePickerComponent,
    GovukTextInputPrefixSuffixComponent,
    FinesMacDefaultDaysComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './fines-mac-payment-terms-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacPaymentTermsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly dateService = inject(DateService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  override fieldErrors: IFinesMacPaymentTermsFieldErrors = {
    ...FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS,
  };

  public readonly paymentTerms: IGovUkRadioOptions[] = Object.entries(FINES_MAC_PAYMENT_TERMS_OPTIONS).map(
    ([key, value]) => ({ key, value }),
  );
  public yesterday!: string;

  /**
   * Sets up the payment terms form.
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      paymentTerms: new FormControl(null),
      holdEnforcementOnAccount: new FormControl(null),
      hasDaysInDefault: new FormControl(null),
    });
  }

  /**
   * Sets up the initial payment terms for the fines-mac-payment-terms-form component.
   * This method performs the following tasks:
   * - Sets up the payment terms form.
   * - Adds a listener for changes in the "days in default" field.
   * - Sets the initial error messages.
   * - Repopulates the form with the payment terms data from the fines service.
   */
  private initialPaymentTermsSetup(): void {
    const { paymentTerms } = this.finesService.finesMacState;
    this.setupPaymentTermsForm();
    this.hasDaysInDefaultListener();
    this.setInitialErrorMessages();
    this.rePopulateForm(paymentTerms);
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  /**
   * Listens for changes in the 'hasDaysInDefault' form control and performs actions accordingly.
   * If the value of 'hasDaysInDefault' is true, it creates the necessary form controls.
   * If the value of 'hasDaysInDefault' is false, it removes the unnecessary form controls.
   */
  private hasDaysInDefaultListener(): void {
    const { hasDaysInDefault } = this.form.controls;

    hasDaysInDefault.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (hasDaysInDefault.value === true) {
        FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION.map((control) => {
          this.createControl(control.controlName, control.validators);
        });
      } else {
        FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION.map((control) => {
          this.removeControl(control.controlName);
        });
      }
    });
  }

  public override ngOnInit(): void {
    this.initialPaymentTermsSetup();
    super.ngOnInit();
  }
}
