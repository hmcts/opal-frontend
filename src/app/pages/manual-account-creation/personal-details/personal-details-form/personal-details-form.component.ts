import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  CustomAddressBlockComponent,
  CustomDateOfBirthComponent,
  CustomNationalInsuranceNumberComponent,
  FormAliasBaseComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukErrorSummaryComponent,
  GovukSelectComponent,
  GovukTextInputComponent,
  ScotgovDatePickerComponent,
} from '@components';
import {
  ADDRESS_LINE_ONE_FIELD_ERRORS,
  ADDRESS_LINE_THREE_FIELD_ERRORS,
  ADDRESS_LINE_TWO_FIELD_ERRORS,
  CUSTOM_ADDRESS_FIELD_IDS,
  DATE_OF_BIRTH_FIELD_ERRORS,
  MANUAL_ACCOUNT_CREATION_NESTED_ROUTES,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FIELD_ERROR,
  NATIONAL_INSURANCE_FIELD_ERRORS,
  POST_CODE_FIELD_ERRORS,
  TITLE_DROPDOWN_OPTIONS,
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors, IGovUkSelectOptions, IManualAccountCreationPersonalDetailsForm } from '@interfaces';
import { DateTime } from 'luxon';
import {
  alphabeticalTextValidator,
  dateOfBirthValidator,
  nationalInsuranceNumberValidator,
  optionalMaxLengthValidator,
  optionalValidDateValidator,
  specialCharactersValidator,
} from 'src/app/validators';

@Component({
  selector: 'app-personal-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    ScotgovDatePickerComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukSelectComponent,
    GovukCancelLinkComponent,
    CustomAddressBlockComponent,
    CustomDateOfBirthComponent,
    CustomNationalInsuranceNumberComponent,
  ],
  templateUrl: './personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDetailsFormComponent extends FormAliasBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationPersonalDetailsForm>();

  public readonly customAddressFieldIds = CUSTOM_ADDRESS_FIELD_IDS;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly manualAccountCreationNestedRoutes = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES;

  override fieldErrors: IFieldErrors = {
    ...MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FIELD_ERROR,
    ...DATE_OF_BIRTH_FIELD_ERRORS,
    ...NATIONAL_INSURANCE_FIELD_ERRORS,
    ...ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...POST_CODE_FIELD_ERRORS,
  };

  public readonly titleOptions: IGovUkSelectOptions[] = TITLE_DROPDOWN_OPTIONS;
  public yesterday: string = DateTime.now().minus({ days: 1 }).setLocale('en-gb').toLocaleString();

  /**
   * Sets up the personal details form.
   *
   * This method initializes the form group and its form controls with the necessary validators.
   *
   * @returns void
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      Title: new FormControl(null, [Validators.required]),
      Forenames: new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
      Surname: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      AddAlias: new FormControl(null),
      Aliases: new FormArray([]),
      DOB: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      NationalInsuranceNumber: new FormControl(null, [nationalInsuranceNumberValidator()]),
      AddressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      AddressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      AddressLine3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
      Postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
      VehicleMake: new FormControl(null, [optionalMaxLengthValidator(30)]),
      VehicleRegistrationMark: new FormControl(null, [optionalMaxLengthValidator(11)]),
    });
  }

  /**
   * Sets up the alias configuration for the personal details form.
   * The alias configuration includes the alias fields and controls validation.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = ['AliasForenames', 'AliasSurname'];
    this.aliasControlsValidation = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS;
  }

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   * @returns void
   */
  public handleFormSubmit(event: SubmitEvent): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      const nestedFlow = event.submitter ? event.submitter.className.includes('nested-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, nestedFlow: nestedFlow });
    }
  }

  /**
   * Performs the initial setup for the personal details form component.
   * This method sets up the personal details form, alias configuration, aliases,
   * initial error messages, nested route, form population, and alias checkbox listener.
   */
  private initialSetup(): void {
    const { personalDetails } = this.macStateService.manualAccountCreation;
    this.setupPersonalDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls([...Array(personalDetails.Aliases.length).keys()], 'Aliases');
    this.setInitialErrorMessages();
    this.rePopulateForm(personalDetails);
    this.setUpAliasCheckboxListener('AddAlias', 'Aliases');
  }

  public override ngOnInit(): void {
    this.initialSetup();
    super.ngOnInit();
  }
}
