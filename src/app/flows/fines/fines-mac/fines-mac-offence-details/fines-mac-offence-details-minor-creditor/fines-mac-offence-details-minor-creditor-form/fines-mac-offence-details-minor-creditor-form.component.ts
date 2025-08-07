import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE } from '../constants/fines-mac-offence-details-minor-creditor-creditor-type.constant';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '../../../constants/fines-mac-title-dropdown-options.constant';
import { takeUntil } from 'rxjs';

import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_ERRORS } from '../constants/fines-mac-offence-details-minor-creditor-field-errors.constant';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FinesMacOffenceDetailsStore } from '../../stores/fines-mac-offence-details.store';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  LETTERS_WITH_SPACES_PATTERN,
  SPECIAL_CHARACTERS_PATTERN,
  NUMERIC_PATTERN,
} from '@hmcts/opal-frontend-common/constants';

const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'alphabeticalTextPattern');
const SPECIAL_CHARACTERS_PATTERN_VALIDATOR = patternValidator(SPECIAL_CHARACTERS_PATTERN, 'specialCharactersPattern');
const NUMERIC_PATTERN_VALIDATOR = patternValidator(NUMERIC_PATTERN, 'numericalTextPattern');

@Component({
  selector: 'app-fines-mac-offence-details-minor-creditor-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukSelectComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukErrorSummaryComponent,
    GovukButtonComponent,
    GovukTextInputComponent,
    GovukCancelLinkComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-mac-offence-details-minor-creditor-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsMinorCreditorFormComponent extends AbstractFormBaseComponent implements OnInit {
  private readonly finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacOffenceDetailsMinorCreditorForm>();
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  public readonly creditorTypesOptions = FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE;
  public readonly creditorTypes: IGovUkRadioOptions[] = Object.entries(this.creditorTypesOptions).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );
  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  public override fieldErrors: IAbstractFormBaseFieldErrors = {
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
        SPECIAL_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      fm_offence_details_minor_creditor_address_line_2: new FormControl(null, [
        Validators.maxLength(30),
        SPECIAL_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      fm_offence_details_minor_creditor_address_line_3: new FormControl(null, [
        Validators.maxLength(16),
        SPECIAL_CHARACTERS_PATTERN_VALIDATOR,
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
    const impositionPosition = this.finesMacOffenceDetailsStore.removeMinorCreditor();
    if (impositionPosition !== null) {
      const minorCreditors = this.finesMacOffenceDetailsStore.offenceDetailsDraft()[0].childFormData!;
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
      fm_offence_details_minor_creditor_title: title,
      fm_offence_details_minor_creditor_forenames: forenames,
      fm_offence_details_minor_creditor_surname: surname,
    } = this.form.controls;
    title.setValidators([Validators.required]);
    forenames.setValidators([Validators.required, Validators.maxLength(20), LETTERS_WITH_SPACES_PATTERN_VALIDATOR]);
    surname.setValidators([Validators.required, Validators.maxLength(30), LETTERS_WITH_SPACES_PATTERN_VALIDATOR]);
  }

  /**
   * Sets the validators for the company name form control.
   */
  private setCompanyValidators(): void {
    const { fm_offence_details_minor_creditor_company_name: companyName } = this.form.controls;
    companyName.setValidators([Validators.required, Validators.maxLength(50), LETTERS_WITH_SPACES_PATTERN_VALIDATOR]);
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

    nameOnAccount.setValidators([Validators.required, Validators.maxLength(18), LETTERS_WITH_SPACES_PATTERN_VALIDATOR]);
    sortCode.setValidators([Validators.required, Validators.maxLength(6), NUMERIC_PATTERN_VALIDATOR]);
    accountNumber.setValidators([Validators.required, Validators.maxLength(8), NUMERIC_PATTERN_VALIDATOR]);
    paymentReference.setValidators([
      Validators.required,
      Validators.maxLength(18),
      LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
    ]);
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
    title.clearValidators();
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
      fm_offence_details_minor_creditor_title: title,
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
      title.updateValueAndValidity();
      forenames.updateValueAndValidity();
      surname.updateValueAndValidity();
    });
  }

  public override ngOnInit(): void {
    this.initialMinorCreditorSetup();
    super.ngOnInit();
  }
}
