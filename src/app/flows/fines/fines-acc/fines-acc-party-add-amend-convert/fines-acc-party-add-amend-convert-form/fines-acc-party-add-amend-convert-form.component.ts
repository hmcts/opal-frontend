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
import { IFinesAccPartyAddAmendConvertFieldErrors } from '../interfaces/fines-acc-party-add-amend-convert-field-errors.interface';
import { IFinesAccPartyAddAmendConvertForm } from '../interfaces/fines-acc-party-add-amend-convert-form.interface';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_FIELD_ERRORS } from '../constants/fines-acc-party-add-amend-convert-field-errors.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_ALIAS } from '../constants/fines-acc-party-add-amend-convert-alias.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../constants/fines-acc-party-add-amend-convert-party-types.constant';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { takeUntil } from 'rxjs';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '../../../fines-mac/constants/fines-mac-title-dropdown-options.constant';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
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
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM } from '../constants/fines-acc-party-add-amend-convert-form.constant';
import { employerFieldsValidator } from '../constants/fines-acc-party-add-amend-convert-validators.constant';

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
    GovukHeadingWithCaptionComponent,
    GovukCancelLinkComponent,
    MojDatePickerComponent,
    MojTicketPanelComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-acc-party-add-amend-convert-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPartyAddAmendConvertFormComponent
  extends AbstractFormAliasBaseComponent
  implements OnInit, OnDestroy
{
  private readonly finesAccountStore = inject(FinesAccountStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesAccPartyAddAmendConvertForm>();
  protected readonly dateService = inject(DateService);
  protected readonly finesAccRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  protected readonly showLanguagePreferences = computed(() => this.finesAccountStore.welsh_speaking() === 'Y');
  protected readonly accountStore = this.finesAccountStore;

  @Input({ required: true }) public partyType!: string;
  @Input({ required: false }) public initialFormData: IFinesAccPartyAddAmendConvertForm =
    FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM;
  override fieldErrors: IFinesAccPartyAddAmendConvertFieldErrors = {
    ...FINES_ACC_PARTY_ADD_AMEND_CONVERT_FIELD_ERRORS,
  };
  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  public yesterday!: string;
  public age!: number;
  public ageLabel!: string;
  public readonly partyTypes = FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES;
  public readonly languageOptions: { key: string; value: string }[] = Object.entries(
    FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS,
  ).map(([key, value]) => ({ key, value }));

  /**
   * Sets up the debtor add/amend form structure without populating data.
   */
  private setupDebtorAddAmendForm(): void {
    this.form = new FormGroup({
      facc_party_add_amend_convert_title: new FormControl(null, [Validators.required]),
      facc_party_add_amend_convert_forenames: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
        LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_surname: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_aliases: new FormArray([]),
      facc_party_add_amend_convert_add_alias: new FormControl(null),
      facc_party_add_amend_convert_dob: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      facc_party_add_amend_convert_national_insurance_number: new FormControl(null, [
        nationalInsuranceNumberValidator(),
      ]),
      facc_party_add_amend_convert_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(16),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_post_code: new FormControl(null, [
        optionalMaxLengthValidator(8),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_contact_email_address_1: new FormControl(null, [
        optionalMaxLengthValidator(76),
        EMAIL_ADDRESS_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_contact_email_address_2: new FormControl(null, [
        optionalMaxLengthValidator(76),
        EMAIL_ADDRESS_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_contact_telephone_number_mobile: new FormControl(null, [
        optionalMaxLengthValidator(35),
        optionalPhoneNumberValidator(),
      ]),
      facc_party_add_amend_convert_contact_telephone_number_home: new FormControl(null, [
        optionalMaxLengthValidator(35),
        optionalPhoneNumberValidator(),
      ]),
      facc_party_add_amend_convert_contact_telephone_number_business: new FormControl(null, [
        optionalMaxLengthValidator(35),
        optionalPhoneNumberValidator(),
      ]),
      facc_party_add_amend_convert_vehicle_make: new FormControl(null, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_vehicle_registration_mark: new FormControl(null, [
        optionalMaxLengthValidator(20),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_language_preferences_document_language: new FormControl(null),
      facc_party_add_amend_convert_language_preferences_hearing_language: new FormControl(null),
      facc_party_add_amend_convert_employer_company_name: new FormControl(null, [
        optionalMaxLengthValidator(50),
        employerFieldsValidator,
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_employer_reference: new FormControl(null, [
        optionalMaxLengthValidator(20),
        employerFieldsValidator,
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_employer_email_address: new FormControl(null, [
        optionalMaxLengthValidator(76),
        EMAIL_ADDRESS_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_employer_telephone_number: new FormControl(null, [
        optionalMaxLengthValidator(35),
        optionalPhoneNumberValidator(),
      ]),
      facc_party_add_amend_convert_employer_address_line_1: new FormControl(null, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
        employerFieldsValidator,
      ]),
      facc_party_add_amend_convert_employer_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_employer_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_employer_address_line_4: new FormControl(null, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_employer_address_line_5: new FormControl(null, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_employer_post_code: new FormControl(null, [
        optionalMaxLengthValidator(8),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
    });
  }

  /**
   * Sets up the alias configuration for the debtor add/amend form.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = FINES_ACC_PARTY_ADD_AMEND_CONVERT_ALIAS.map((control) => control.controlName);
    this.aliasControlsValidation = FINES_ACC_PARTY_ADD_AMEND_CONVERT_ALIAS;
  }

  /**
   * Listens for changes in the date of birth control and updates the age and label accordingly.
   */
  private dateOfBirthListener(): void {
    const dobControl = this.form.controls['facc_party_add_amend_convert_dob'];

    // Initial update if the date of birth is already populated
    if (dobControl.value) {
      const ageObject = this.dateService.getAgeObject(dobControl.value);
      this.age = ageObject?.value || 0;
      this.ageLabel = ageObject?.group || '';
    }

    // Subscribe to changes in the date of birth control
    dobControl.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((dateOfBirth) => {
      const ageObject = this.dateService.getAgeObject(dateOfBirth);
      this.age = ageObject?.value || 0;
      this.ageLabel = ageObject?.group || '';
    });
  }

  /**
   * Sets up listeners for employer fields to trigger validation when any employer field changes.
   */
  private setupEmployerFieldsValidation(): void {
    const employerFieldNames = [
      'facc_party_add_amend_convert_employer_company_name',
      'facc_party_add_amend_convert_employer_reference',
      'facc_party_add_amend_convert_employer_email_address',
      'facc_party_add_amend_convert_employer_telephone_number',
      'facc_party_add_amend_convert_employer_address_line_1',
      'facc_party_add_amend_convert_employer_address_line_2',
      'facc_party_add_amend_convert_employer_address_line_3',
      'facc_party_add_amend_convert_employer_address_line_4',
      'facc_party_add_amend_convert_employer_address_line_5',
      'facc_party_add_amend_convert_employer_post_code',
    ];

    const companyNameControl = this.form.get('facc_party_add_amend_convert_employer_company_name');
    const employerReferenceControl = this.form.get('facc_party_add_amend_convert_employer_reference');
    const employerAddressLine1Control = this.form.get('facc_party_add_amend_convert_employer_address_line_1');

    for (const fieldName of employerFieldNames) {
      const control = this.form.get(fieldName);
      if (control) {
        control.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
          // Update validation for all required fields when any employer field changes
          companyNameControl?.updateValueAndValidity({ emitEvent: false });
          employerReferenceControl?.updateValueAndValidity({ emitEvent: false });
          employerAddressLine1Control?.updateValueAndValidity({ emitEvent: false });
        });
      }
    }
  }

  /**
   * Sets up the initial debtor add/amend form.
   */
  private initialDebtorAddAmendSetup(): void {
    this.setupDebtorAddAmendForm();
    this.setupAliasConfiguration();

    // Safe access to aliases array
    const aliasesLength = this.initialFormData?.formData?.facc_party_add_amend_convert_aliases?.length || 0;
    this.setupAliasFormControls([...new Array(aliasesLength).keys()], 'facc_party_add_amend_convert_aliases');

    this.setInitialErrorMessages();
    this.rePopulateForm(this.initialFormData?.formData || null);
    this.setUpAliasCheckboxListener('facc_party_add_amend_convert_add_alias', 'facc_party_add_amend_convert_aliases');
    this.dateOfBirthListener();
    this.setupEmployerFieldsValidation();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  public override ngOnInit(): void {
    // Ensure initialFormData is set with default values if undefined
    if (!this.initialFormData) {
      this.initialFormData = FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM;
    }

    this.initialDebtorAddAmendSetup();
    super.ngOnInit();
  }
}
