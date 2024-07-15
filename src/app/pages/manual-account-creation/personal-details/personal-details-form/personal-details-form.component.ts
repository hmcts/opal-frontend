import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  CustomAddressBlockComponent,
  CustomDateOfBirthComponent,
  CustomNationalInsuranceNumberComponent,
  FormBaseComponent,
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
import {
  IFieldErrors,
  IFormArrayControlValidation,
  IFormArrayControls,
  IGovUkSelectOptions,
  IManualAccountCreationPersonalDetailsForm,
} from '@interfaces';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
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
export class PersonalDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationPersonalDetailsForm>();

  public readonly customAddressFieldIds = CUSTOM_ADDRESS_FIELD_IDS;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly manualAccountCreationNestedRoutes = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES;

  public aliasControls: IFormArrayControls[] = [];
  public aliasControlsValidation: IFormArrayControlValidation[] = [];
  public aliasFields: string[] = [];

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

  private addAliasListener!: Subscription | undefined;

  /**
   * Sets up the personal details form.
   *
   * This method initializes the form group and its form controls with the necessary validators.
   *
   * @returns void
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      firstNames: new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
      lastName: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      addNameAlias: new FormControl(null),
      nameAliases: new FormArray([]),
      dateOfBirth: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      nationalInsuranceNumber: new FormControl(null, [nationalInsuranceNumberValidator()]),
      addressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      addressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      addressLine3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
      postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
      makeOfCar: new FormControl(null, [optionalMaxLengthValidator(30)]),
      registrationNumber: new FormControl(null, [optionalMaxLengthValidator(11)]),
    });
  }

  /**
   * Sets up the alias configuration for the personal details form.
   * The alias configuration includes the alias fields and controls validation.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = ['firstNames', 'lastName'];
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
      const continueFlow = event.submitter ? event.submitter.className.includes('continue-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, continueFlow: continueFlow });
    }
  }

  /**
   * Sets up the listener for the alias checkbox.
   * This method ensures any existing subscription is cleared to avoid memory leaks.
   * It subscribes to the value changes of the 'addAlias' control in the form,
   * and updates the alias controls based on the value of the checkbox.
   */
  private setUpAliasCheckboxListener(): void {
    // Ensure any existing subscription is cleared to avoid memory leaks
    this.addAliasListener?.unsubscribe();

    const addAliasControl = this.form.get('addNameAlias');
    if (!addAliasControl) {
      return;
    }

    this.addAliasListener = addAliasControl.valueChanges.subscribe((shouldAddAlias) => {
      this.aliasControls = shouldAddAlias
        ? this.buildFormArrayControls([0], 'nameAliases', this.aliasFields, this.aliasControlsValidation)
        : this.removeAllFormArrayControls(this.aliasControls, 'nameAliases', this.aliasFields);
    });
  }

  /**
   * Adds an alias to the aliasControls form array.
   *
   * @param index - The index at which to add the alias.
   */
  public addAlias(index: number): void {
    this.aliasControls.push(
      this.addFormArrayControls(index, 'nameAliases', this.aliasFields, this.aliasControlsValidation),
    );
  }

  /**
   * Removes an alias from the aliasControls array.
   *
   * @param index - The index of the alias to remove.
   */
  public removeAlias(index: number): void {
    this.aliasControls = this.removeFormArrayControls(index, 'nameAliases', this.aliasControls, this.aliasFields);
  }

  /**
   * Sets up the aliases for the personal details form.
   * Re-populates the alias controls if there are any aliases.
   */
  private setupAliasFormControls(): void {
    const aliases = this.macStateService.manualAccountCreation.personalDetails.nameAliases;
    // Re-populate the alias controls if there are any aliases
    if (aliases.length) {
      this.aliasControls = this.buildFormArrayControls(
        [...Array(aliases.length).keys()],
        'nameAliases',
        this.aliasFields,
        this.aliasControlsValidation,
      );
    }
  }

  /**
   * Performs the initial setup for the personal details form component.
   * This method sets up the personal details form, alias configuration, aliases,
   * initial error messages, nested route, form population, and alias checkbox listener.
   */
  private initialSetup(): void {
    this.setupPersonalDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.personalDetails);
    this.setUpAliasCheckboxListener();
  }

  public override ngOnInit(): void {
    this.initialSetup();
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.addAliasListener?.unsubscribe();
    super.ngOnDestroy();
  }
}
