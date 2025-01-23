import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
import { IGovUkRadioOptions } from '@components/govuk/govuk-radio/interfaces/govuk-radio-options.interface';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE } from '../constants/fines-mac-offence-details-minor-creditor-creditor-type.constant';
import { GovukRadioComponent } from '@components/govuk/govuk-radio/govuk-radio.component';
import { GovukRadiosItemComponent } from '@components/govuk/govuk-radio/govuk-radios-item/govuk-radios-item.component';
import { IGovUkSelectOptions } from '@components/govuk/govuk-select/interfaces/govuk-select-options.interface';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '../../../constants/fines-mac-title-dropdown-options.constant';
import { takeUntil } from 'rxjs';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FinesMacOffenceDetailsService } from '../../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { CommonModule } from '@angular/common';
import { GovukRadiosConditionalComponent } from '@components/govuk/govuk-radio/govuk-radios-conditional/govuk-radios-conditional.component';
import { GovukSelectComponent } from '@components/govuk/govuk-select/govuk-select.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
import { GovukCheckboxesConditionalComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-conditional/govuk-checkboxes-conditional.component';
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';
import { numericalTextValidator } from '@validators/numerical-only/numerical-only.validator';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_ERRORS } from '../constants/fines-mac-offence-details-minor-creditor-field-errors.constant';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';

@Component({
  selector: 'app-fines-mac-offence-details-minor-creditor-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukSelectComponent,
    GovukTextInputComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukErrorSummaryComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-offence-details-minor-creditor-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsMinorCreditorFormComponent extends AbstractFormBaseComponent implements OnInit {
  @Output() protected override formSubmit = new EventEmitter<IFinesMacOffenceDetailsMinorCreditorForm>();

  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  public readonly creditorTypesOptions = FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE;
  public readonly creditorTypes: IGovUkRadioOptions[] = Object.entries(this.creditorTypesOptions).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );
  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_ERRORS,
  };

  /**
   * Sets up the form for capturing minor creditor details.
   */
  private setupMinorCreditorForm(): void {
    this.form = new FormGroup({
      fm_offence_details_minor_creditor_creditor_type: new FormControl(null, [Validators.required]),
      fm_offence_details_minor_creditor_title: new FormControl(null),
      fm_offence_details_minor_creditor_forenames: new FormControl(null),
      fm_offence_details_minor_creditor_surname: new FormControl(null),
      fm_offence_details_minor_creditor_company_name: new FormControl(null),
      fm_offence_details_minor_creditor_address_line_1: new FormControl(null, [
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      fm_offence_details_minor_creditor_address_line_2: new FormControl(null, [
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      fm_offence_details_minor_creditor_address_line_3: new FormControl(null, [
        Validators.maxLength(16),
        specialCharactersValidator(),
      ]),
      fm_offence_details_minor_creditor_post_code: new FormControl(null, [Validators.maxLength(8)]),
      fm_offence_details_minor_creditor_pay_by_bacs: new FormControl(null),
      fm_offence_details_minor_creditor_bank_account_name: new FormControl(null),
      fm_offence_details_minor_creditor_bank_sort_code: new FormControl(null),
      fm_offence_details_minor_creditor_bank_account_number: new FormControl(null),
      fm_offence_details_minor_creditor_bank_account_ref: new FormControl(null),
    });
  }

  /**
   * Sets up the initial configuration for the minor creditor form.
   * This method calls other setup methods and listeners to initialize the form.
   */
  private initialMinorCreditorSetup(): void {
    this.setupMinorCreditorForm();
    this.creditorTypeListener();
    this.hasPaymentDetailsListener();
    this.setInitialErrorMessages();

    // The following code is when editing a minor creditor to repopulate the form with the existing data
    const impositionPosition = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor;
    if (impositionPosition !== null) {
      const minorCreditors =
        this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData!;
      const minorCreditor = minorCreditors.find(
        (creditor) => creditor.formData.fm_offence_details_imposition_position === impositionPosition,
      )!;
      if (minorCreditor) {
        this.rePopulateForm(minorCreditor.formData);
      }
    }
  }

  /**
   * Sets individual validators for the forenames and surname form controls.
   * The forenames control is validated with a maximum length of 50 characters and an alphabetical text validator.
   * The surname control is validated as required, with a maximum length of 50 characters, and an alphabetical text validator.
   */
  private setIndividualValidators(): void {
    const {
      fm_offence_details_minor_creditor_forenames: forenames,
      fm_offence_details_minor_creditor_surname: surname,
    } = this.form.controls;
    forenames.setValidators([Validators.maxLength(20), alphabeticalTextValidator()]);
    surname.setValidators([Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]);
  }

  /**
   * Sets the validators for the company name form control.
   */
  private setCompanyValidators(): void {
    const { fm_offence_details_minor_creditor_company_name: companyName } = this.form.controls;
    companyName.setValidators([Validators.required, Validators.maxLength(50), alphabeticalTextValidator()]);
  }

  /**
   * Sets the validators for the payment detail form controls.
   */
  private setPaymentDetailValidators(): void {
    const {
      fm_offence_details_minor_creditor_bank_account_name: nameOnAccount,
      fm_offence_details_minor_creditor_bank_sort_code: sortCode,
      fm_offence_details_minor_creditor_bank_account_number: accountNumber,
      fm_offence_details_minor_creditor_bank_account_ref: paymentReference,
    } = this.form.controls;

    nameOnAccount.setValidators([Validators.required, Validators.maxLength(18), alphabeticalTextValidator()]);
    sortCode.setValidators([Validators.required, Validators.maxLength(6), numericalTextValidator()]);
    accountNumber.setValidators([Validators.required, Validators.maxLength(8), numericalTextValidator()]);
    paymentReference.setValidators([Validators.required, Validators.maxLength(18), alphabeticalTextValidator()]);
  }

  /**
   * Resets the validators for the form controls related to minor creditor details.
   * This method clears the validators and resets the values of the form controls.
   */
  private resetNameValidators(): void {
    const {
      fm_offence_details_minor_creditor_title: title,
      fm_offence_details_minor_creditor_forenames: forenames,
      fm_offence_details_minor_creditor_surname: surname,
      fm_offence_details_minor_creditor_company_name: companyName,
    } = this.form.controls;
    title.reset();
    forenames.reset();
    forenames.clearValidators();
    surname.reset();
    surname.clearValidators();
    companyName.reset();
    companyName.clearValidators();
  }

  /**
   * Resets the validators for the payment detail form controls.
   */
  private resetPaymentDetailValidators(): void {
    const {
      fm_offence_details_minor_creditor_bank_account_name: nameOnAccount,
      fm_offence_details_minor_creditor_bank_sort_code: sortCode,
      fm_offence_details_minor_creditor_bank_account_number: accountNumber,
      fm_offence_details_minor_creditor_bank_account_ref: paymentReference,
    } = this.form.controls;

    nameOnAccount.reset();
    nameOnAccount.clearValidators();
    sortCode.reset();
    sortCode.clearValidators();
    accountNumber.reset();
    accountNumber.clearValidators();
    paymentReference.reset();
    paymentReference.clearValidators();
  }

  /**
   * Listens for changes in the payment details form controls and updates their validity accordingly.
   */
  private hasPaymentDetailsListener(): void {
    const {
      fm_offence_details_minor_creditor_pay_by_bacs: hasPaymentDetails,
      fm_offence_details_minor_creditor_bank_account_name: nameOnAccount,
      fm_offence_details_minor_creditor_bank_sort_code: sortCode,
      fm_offence_details_minor_creditor_bank_account_number: accountNumber,
      fm_offence_details_minor_creditor_bank_account_ref: paymentReference,
    } = this.form.controls;

    hasPaymentDetails.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      this.resetPaymentDetailValidators();

      if (hasPaymentDetails.value) {
        this.setPaymentDetailValidators();
      }
      nameOnAccount.updateValueAndValidity();
      sortCode.updateValueAndValidity();
      accountNumber.updateValueAndValidity();
      paymentReference.updateValueAndValidity();
    });
  }

  /**
   * Listens for changes in the creditor type form control and updates the form validators accordingly.
   * Resets the name validators and sets individual or company validators based on the selected creditor type.
   * Updates the validity of the company name, forenames, and surname form controls.
   */
  private creditorTypeListener(): void {
    const {
      fm_offence_details_minor_creditor_creditor_type: creditorType,
      fm_offence_details_minor_creditor_company_name: companyName,
      fm_offence_details_minor_creditor_forenames: forenames,
      fm_offence_details_minor_creditor_surname: surname,
    } = this.form.controls;

    creditorType.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      this.resetNameValidators();

      switch (creditorType.value) {
        case 'individual':
          this.setIndividualValidators();
          break;
        case 'company':
          this.setCompanyValidators();
          break;
      }

      companyName.updateValueAndValidity();
      forenames.updateValueAndValidity();
      surname.updateValueAndValidity();
    });
  }

  public override ngOnInit(): void {
    this.initialMinorCreditorSetup();
    super.ngOnInit();
  }
}
