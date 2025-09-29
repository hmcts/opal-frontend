import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormAliasBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-alias-base';
import { IFinesAccDebtorAddAmendFieldErrors } from '../interfaces/fines-acc-debtor-add-amend-field-errors.interface';
import {
  IFinesAccDebtorAddAmendFormData,
  IFinesAccDebtorAddAmendAlias,
} from '../interfaces/fines-acc-debtor-add-amend-form.interface';
import { FINES_ACC_DEBTOR_ADD_AMEND_FIELD_ERRORS } from '../constants/fines-acc-debtor-add-amend-field-errors.constant';
import { FINES_ACC_DEBTOR_ADD_AMEND_ALIAS } from '../constants/fines-acc-debtor-add-amend-alias.constant';
import { FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES } from '../constants/fines-acc-debtor-add-amend-party-types.constant';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { takeUntil } from 'rxjs';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '../../../fines-mac/constants/fines-mac-title-dropdown-options.constant';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { nationalInsuranceNumberValidator } from '@hmcts/opal-frontend-common/validators/national-insurance-number';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { optionalPhoneNumberValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-telephone';
import {
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  LETTERS_WITH_SPACES_PATTERN,
  EMAIL_ADDRESS_PATTERN,
} from '@hmcts/opal-frontend-common/constants';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';

// regex pattern validators for the form controls
const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'lettersWithSpacesPattern');
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
const EMAIL_ADDRESS_PATTERN_VALIDATOR = patternValidator(EMAIL_ADDRESS_PATTERN, 'emailPattern');

@Component({
  selector: 'app-fines-acc-debtor-add-amend-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukSelectComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukTextInputComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukCancelLinkComponent,
    MojDatePickerComponent,
    MojTicketPanelComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-acc-debtor-add-amend-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDebtorAddAmendFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  private readonly finesAccountStore = inject(FinesAccountStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesAccDebtorAddAmendFormData>();
  protected readonly dateService = inject(DateService);
  protected readonly finesAccRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;

  @Input() public partyType!: string;
  @Input() public initialFormData?: IFinesAccDebtorAddAmendFormData;
  override fieldErrors: IFinesAccDebtorAddAmendFieldErrors = {
    ...FINES_ACC_DEBTOR_ADD_AMEND_FIELD_ERRORS,
  };
  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  public yesterday!: string;
  public age!: number;
  public ageLabel!: string;
  public readonly partyTypes = FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES;
  protected readonly showLanguagePreferences = computed(() => this.finesAccountStore.welsh_speaking() === 'Y');
  public readonly languageOptions: { key: string; value: string }[] = Object.entries(
    FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS,
  ).map(([key, value]) => ({ key, value }));

  /**
   * Sets up the debtor add/amend form.
   */
  private setupDebtorAddAmendForm(): void {
    const formData = this.initialFormData?.formData;

    this.form = new FormGroup({
      facc_debtor_add_amend_title: new FormControl(formData?.facc_debtor_add_amend_title, [Validators.required]),
      facc_debtor_add_amend_forenames: new FormControl(formData?.facc_debtor_add_amend_forenames, [
        Validators.required,
        Validators.maxLength(20),
        LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_debtor_add_amend_surname: new FormControl(formData?.facc_debtor_add_amend_surname, [
        Validators.required,
        Validators.maxLength(30),
        LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_debtor_add_amend_aliases: new FormArray([]),
      facc_debtor_add_amend_add_alias: new FormControl(null),
      facc_debtor_add_amend_dob: new FormControl(formData?.facc_debtor_add_amend_dob, [
        optionalValidDateValidator(),
        dateOfBirthValidator(),
      ]),
      facc_debtor_add_amend_national_insurance_number: new FormControl(
        formData?.facc_debtor_add_amend_national_insurance_number,
        [nationalInsuranceNumberValidator()],
      ),
      facc_debtor_add_amend_address_line_1: new FormControl(formData?.facc_debtor_add_amend_address_line_1, [
        Validators.required,
        Validators.maxLength(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_debtor_add_amend_address_line_2: new FormControl(formData?.facc_debtor_add_amend_address_line_2, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_debtor_add_amend_address_line_3: new FormControl(formData?.facc_debtor_add_amend_address_line_3, [
        optionalMaxLengthValidator(16),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_debtor_add_amend_post_code: new FormControl(formData?.facc_debtor_add_amend_post_code, [
        optionalMaxLengthValidator(8),
      ]),
      facc_debtor_add_amend_contact_email_address_1: new FormControl(
        formData?.facc_debtor_add_amend_contact_email_address_1,
        [optionalMaxLengthValidator(76), EMAIL_ADDRESS_PATTERN_VALIDATOR],
      ),
      facc_debtor_add_amend_contact_email_address_2: new FormControl(
        formData?.facc_debtor_add_amend_contact_email_address_2,
        [optionalMaxLengthValidator(76), EMAIL_ADDRESS_PATTERN_VALIDATOR],
      ),
      facc_debtor_add_amend_contact_telephone_number_mobile: new FormControl(
        formData?.facc_debtor_add_amend_contact_telephone_number_mobile,
        [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()],
      ),
      facc_debtor_add_amend_contact_telephone_number_home: new FormControl(
        formData?.facc_debtor_add_amend_contact_telephone_number_home,
        [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()],
      ),
      facc_debtor_add_amend_contact_telephone_number_business: new FormControl(
        formData?.facc_debtor_add_amend_contact_telephone_number_business,
        [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()],
      ),
      facc_debtor_add_amend_vehicle_make: new FormControl(formData?.facc_debtor_add_amend_vehicle_make, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_debtor_add_amend_vehicle_registration_mark: new FormControl(
        formData?.facc_debtor_add_amend_vehicle_registration_mark,
        [optionalMaxLengthValidator(20), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR],
      ),
      facc_debtor_add_amend_language_preferences_document_language: new FormControl(
        formData?.facc_debtor_add_amend_language_preferences_document_language,
      ),
      facc_debtor_add_amend_language_preferences_hearing_language: new FormControl(
        formData?.facc_debtor_add_amend_language_preferences_hearing_language,
      ),
      facc_debtor_add_amend_employer_details_employer_company_name: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_company_name,
        [optionalMaxLengthValidator(50)],
      ),
      facc_debtor_add_amend_employer_details_employer_reference: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_reference,
        [optionalMaxLengthValidator(20)],
      ),
      facc_debtor_add_amend_employer_details_employer_email_address: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_email_address,
        [optionalMaxLengthValidator(76), EMAIL_ADDRESS_PATTERN_VALIDATOR],
      ),
      facc_debtor_add_amend_employer_details_employer_telephone_number: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_telephone_number,
        [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()],
      ),
      facc_debtor_add_amend_employer_details_employer_address_line_1: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_address_line_1,
        [optionalMaxLengthValidator(30)],
      ),
      facc_debtor_add_amend_employer_details_employer_address_line_2: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_address_line_2,
        [optionalMaxLengthValidator(30)],
      ),
      facc_debtor_add_amend_employer_details_employer_address_line_3: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_address_line_3,
        [optionalMaxLengthValidator(30)],
      ),
      facc_debtor_add_amend_employer_details_employer_address_line_4: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_address_line_4,
        [optionalMaxLengthValidator(30)],
      ),
      facc_debtor_add_amend_employer_details_employer_address_line_5: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_address_line_5,
        [optionalMaxLengthValidator(30)],
      ),
      facc_debtor_add_amend_employer_details_employer_post_code: new FormControl(
        formData?.facc_debtor_add_amend_employer_details_employer_post_code,
        [optionalMaxLengthValidator(8), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR],
      ),
    });
  }

  /**
   * Sets up the alias configuration for the debtor add/amend form.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = FINES_ACC_DEBTOR_ADD_AMEND_ALIAS.map((control) => control.controlName);
    this.aliasControlsValidation = FINES_ACC_DEBTOR_ADD_AMEND_ALIAS;
  }

  /**
   * Listens for changes in the date of birth control and updates the age and label accordingly.
   */
  private dateOfBirthListener(): void {
    const dobControl = this.form.controls['facc_debtor_add_amend_dob'];

    // Initial update if the date of birth is already populated
    if (dobControl.value) {
      this.age = this.dateService.getAgeObject(dobControl.value)?.value!;
      this.ageLabel = this.dateService.getAgeObject(dobControl.value)?.group!;
    }

    // Subscribe to changes in the date of birth control
    dobControl.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((dateOfBirth) => {
      this.age = this.dateService.getAgeObject(dateOfBirth)?.value!;
      this.ageLabel = this.dateService.getAgeObject(dateOfBirth)?.group!;
    });
  }

  /**
   * Sets up the initial debtor add/amend form.
   */
  private initialDebtorAddAmendSetup(): void {
    this.setupDebtorAddAmendForm();
    this.setupAliasConfiguration();
    const existingAliases = this.initialFormData?.formData?.facc_debtor_add_amend_aliases || [];
    this.setupAliasFormControls([...Array(existingAliases.length).keys()], 'facc_debtor_add_amend_aliases');
    this.populateAliasFormArray(existingAliases);
    this.setInitialErrorMessages();
    this.setUpAliasCheckboxListener('facc_debtor_add_amend_add_alias', 'facc_debtor_add_amend_aliases');
    this.dateOfBirthListener();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  /**
   * Populates the alias FormArray with existing alias data.
   * @param aliases - Array of existing alias data to populate
   */
  private populateAliasFormArray(aliases: IFinesAccDebtorAddAmendAlias[]): void {
    const aliasFormArray = this.form.get('facc_debtor_add_amend_aliases') as FormArray;

    aliases.forEach((alias, index) => {
      const aliasFormGroup = aliasFormArray.at(index) as FormGroup;
      if (aliasFormGroup) {
        aliasFormGroup.patchValue({
          [`facc_debtor_add_amend_alias_forenames_${index}`]: alias.facc_debtor_add_amend_alias_forenames,
          [`facc_debtor_add_amend_alias_surname_${index}`]: alias.facc_debtor_add_amend_alias_surname,
        });
      }
    });

    if (aliases.length > 0) {
      this.form.get('facc_debtor_add_amend_add_alias')?.setValue(true);
    }
  }

  public override ngOnInit(): void {
    this.initialDebtorAddAmendSetup();
    super.ngOnInit();
  }
}
