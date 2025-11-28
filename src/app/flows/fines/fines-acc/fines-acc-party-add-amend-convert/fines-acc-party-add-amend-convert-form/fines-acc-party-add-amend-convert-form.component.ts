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
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_COMPANY_ALIAS } from '../constants/fines-acc-party-add-amend-convert-company-alias.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../constants/fines-acc-party-add-amend-convert-party-types.constant';
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
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { nationalInsuranceNumberValidator } from '@hmcts/opal-frontend-common/validators/national-insurance-number';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { optionalPhoneNumberValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-telephone';
import {
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  LETTERS_WITH_SPACES_PATTERN,
  EMAIL_ADDRESS_PATTERN,
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
} from '@hmcts/opal-frontend-common/constants';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM } from '../constants/fines-acc-party-add-amend-convert-form.constant';
import { employerFieldsValidator } from '../constants/fines-acc-party-add-amend-convert-validators.constant';
import { FinesAccPartyAddAmendConvertEd } from './components/fines-acc-party-add-amend-convert-ed/fines-acc-party-add-amend-convert-ed.component';
import { FinesAccPartyAddAmendConvertPartyDetails } from './components/fines-acc-party-add-amend-convert-party-details/fines-acc-party-add-amend-convert-party-details.component';
import { FinesAccPartyAddAmendConvertLp } from './components/fines-acc-party-add-amend-convert-lp/fines-acc-party-add-amend-convert-lp.component';
import { FinesAccPartyAddAmendConvertAddress } from './components/fines-acc-party-add-amend-convert-address/fines-acc-party-add-amend-convert-address.component';
import { FinesAccPartyAddAmendConvertCd } from './components/fines-acc-party-add-amend-convert-cd/fines-acc-party-add-amend-convert-cd.component';
import { FinesAccPartyAddAmendConvertVd } from './components/fines-acc-party-add-amend-convert-vd/fines-acc-party-add-amend-convert-vd.component';
import { FinesAccPartyAddAmendConvertDobNi } from './components/fines-acc-party-add-amend-convert-dob-ni/fines-acc-party-add-amend-convert-dob-ni.component';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';

const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'lettersWithSpacesPattern');
const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);
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
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukTextInputComponent,
    GovukHeadingWithCaptionComponent,
    GovukCancelLinkComponent,
    CapitalisationDirective,
    FinesAccPartyAddAmendConvertPartyDetails,
    FinesAccPartyAddAmendConvertAddress,
    FinesAccPartyAddAmendConvertVd,
    FinesAccPartyAddAmendConvertCd,
    FinesAccPartyAddAmendConvertEd,
    FinesAccPartyAddAmendConvertLp,
    FinesAccPartyAddAmendConvertDobNi,
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

  @Input({ required: true }) public isDebtor!: boolean;
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
  public readonly FINES_ACC_SECTION_BREAK = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES.hr2;

  /**
   * Creates the base form group with fields shared by all party types.
   */
  private createBaseFormGroup(): FormGroup {
    return new FormGroup({
      facc_party_add_amend_convert_add_alias: new FormControl(null),
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
        optionalMaxLengthValidator(11),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      facc_party_add_amend_convert_language_preferences_document_language: new FormControl(null),
      facc_party_add_amend_convert_language_preferences_hearing_language: new FormControl(null),
    });
  }

  /**
   * Adds individual-specific form controls to the base form group.
   */
  private addIndividualFormControls(formGroup: FormGroup): void {
    formGroup.addControl('facc_party_add_amend_convert_title', new FormControl(null, [Validators.required]));
    formGroup.addControl(
      'facc_party_add_amend_convert_forenames',
      new FormControl(null, [Validators.required, Validators.maxLength(20), LETTERS_WITH_SPACES_PATTERN_VALIDATOR]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_surname',
      new FormControl(null, [Validators.required, Validators.maxLength(30), LETTERS_WITH_SPACES_PATTERN_VALIDATOR]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_dob',
      new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_national_insurance_number',
      new FormControl(null, [nationalInsuranceNumberValidator()]),
    );
    formGroup.addControl('facc_party_add_amend_convert_individual_aliases', new FormArray([]));

    formGroup.addControl(
      'facc_party_add_amend_convert_employer_company_name',
      new FormControl(null, [
        optionalMaxLengthValidator(50),
        employerFieldsValidator,
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_reference',
      new FormControl(null, [
        optionalMaxLengthValidator(20),
        employerFieldsValidator,
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_email_address',
      new FormControl(null, [optionalMaxLengthValidator(76), EMAIL_ADDRESS_PATTERN_VALIDATOR]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_telephone_number',
      new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_address_line_1',
      new FormControl(null, [
        optionalMaxLengthValidator(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
        employerFieldsValidator,
      ]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_address_line_2',
      new FormControl(null, [optionalMaxLengthValidator(30), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_address_line_3',
      new FormControl(null, [optionalMaxLengthValidator(30), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_address_line_4',
      new FormControl(null, [optionalMaxLengthValidator(30), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_address_line_5',
      new FormControl(null, [optionalMaxLengthValidator(30), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR]),
    );
    formGroup.addControl(
      'facc_party_add_amend_convert_employer_post_code',
      new FormControl(null, [optionalMaxLengthValidator(8), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR]),
    );
  }

  /**
   * Adds company-specific form controls to the base form group.
   */
  private addCompanyFormControls(formGroup: FormGroup): void {
    formGroup.addControl(
      'facc_party_add_amend_convert_organisation_name',
      new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
      ]),
    );
    formGroup.addControl('facc_party_add_amend_convert_organisation_aliases', new FormArray([]));
  }

  /**
   * Sets up the party add/amend form structure based on party type.
   */
  private setupPartyAddAmendConvertForm(): void {
    this.form = this.createBaseFormGroup();

    if (this.isIndividualPartyType) {
      this.addIndividualFormControls(this.form);
    } else if (this.isCompanyPartyType) {
      this.addCompanyFormControls(this.form);
    }
  }

  /**
   * Sets up the alias configuration for company/individual form.
   */
  private setupAliasConfiguration(): void {
    if (this.isCompanyPartyType) {
      this.aliasFields = FINES_ACC_PARTY_ADD_AMEND_CONVERT_COMPANY_ALIAS.map((control) => control.controlName);
      this.aliasControlsValidation = FINES_ACC_PARTY_ADD_AMEND_CONVERT_COMPANY_ALIAS;
    } else {
      this.aliasFields = FINES_ACC_PARTY_ADD_AMEND_CONVERT_ALIAS.map((control) => control.controlName);
      this.aliasControlsValidation = FINES_ACC_PARTY_ADD_AMEND_CONVERT_ALIAS;
    }
  }

  /**
   * Listens for changes in the date of birth control and updates the age and label accordingly.
   * Only applicable for individual party types.
   */
  private dateOfBirthListener(): void {
    if (!this.isIndividualPartyType) {
      return;
    }
    const dobControl = this.form.controls['facc_party_add_amend_convert_dob'];
    if (!dobControl) {
      return;
    }

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
   * Sets up the initial debtor add/amend form.
   */
  private initialPartyAddAmendConvertSetup(): void {
    this.setupPartyAddAmendConvertForm();
    this.setupAliasConfiguration();
    // Setup alias form controls based on party type
    if (this.isIndividualPartyType) {
      const individualAliasesLength =
        this.initialFormData?.formData?.facc_party_add_amend_convert_individual_aliases?.length || 0;
      this.setupAliasFormControls(
        [...new Array(individualAliasesLength).keys()],
        'facc_party_add_amend_convert_individual_aliases',
      );
    } else if (this.isCompanyPartyType) {
      const organisationAliasesLength =
        this.initialFormData?.formData?.facc_party_add_amend_convert_organisation_aliases?.length || 0;
      this.setupAliasFormControls(
        [...new Array(organisationAliasesLength).keys()],
        'facc_party_add_amend_convert_organisation_aliases',
      );
    }

    this.rePopulateForm(this.initialFormData?.formData || null);
    this.setInitialErrorMessages();
    if (this.isIndividualPartyType) {
      this.setUpAliasCheckboxListener(
        'facc_party_add_amend_convert_add_alias',
        'facc_party_add_amend_convert_individual_aliases',
      );
    } else if (this.isCompanyPartyType) {
      this.setUpAliasCheckboxListener(
        'facc_party_add_amend_convert_add_alias',
        'facc_party_add_amend_convert_organisation_aliases',
      );
    }
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
    this.dateOfBirthListener();
  }

  /**
   * Sets up party-specific error messages for parent/guardian fields.
   */
  private setupPartySpecificErrorMessages(): void {
    if (this.partyType === this.partyTypes.PARENT_GUARDIAN) {
      // Override error messages for parent/guardian fields
      this.fieldErrors['facc_party_add_amend_convert_forenames'] =
        this.fieldErrors['facc_party_add_amend_convert_forenames_parent_guardian'];
      this.fieldErrors['facc_party_add_amend_convert_surname'] =
        this.fieldErrors['facc_party_add_amend_convert_surname_parent_guardian'];
    }
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
    this.dateOfBirthListener();
  }

  /**
   * Returns true if the party type is company.
   */
  public get isCompanyPartyType(): boolean {
    return this.partyType === this.partyTypes.COMPANY;
  }

  /**
   * Returns true if the party type is individual or parent/guardian.
   * Both types use the same form structure with individual-specific fields.
   */
  public get isIndividualPartyType(): boolean {
    return this.partyType === this.partyTypes.INDIVIDUAL || this.partyType === this.partyTypes.PARENT_GUARDIAN;
  }

  /**
   * Returns true if the party type is company or isDebtor.
   */
  public get checkCompanyOrDebtor(): boolean {
    return this.isCompanyPartyType || this.isDebtor;
  }

  /**
   * Returns true if the party type is parent/guardian.
   */
  public get isParentGuardianPartyType(): boolean {
    return this.partyType === this.partyTypes.PARENT_GUARDIAN;
  }

  /**
   * Returns the appropriate heading text based on party type.
   */
  public get headingText(): string {
    if (this.partyType === this.partyTypes.COMPANY) {
      return 'Company details';
    } else if (this.partyType === this.partyTypes.PARENT_GUARDIAN) {
      return 'Parent or guardian details';
    } else {
      return 'Defendant details';
    }
  }

  /**
   * Resolves the defendant-details fragment to use when navigating back from the form.
   */
  public get routeFragment(): string {
    return this.partyType === this.partyTypes.PARENT_GUARDIAN ? 'parent-or-guardian' : 'defendant';
  }

  public override ngOnInit(): void {
    // Ensure initialFormData is set with default values if undefined
    if (!this.initialFormData) {
      this.initialFormData = FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM;
    }

    this.initialPartyAddAmendConvertSetup();
    super.ngOnInit();
    this.setupPartySpecificErrorMessages();
  }
}
