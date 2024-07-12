import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  CustomAddressBlockComponent,
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
  IFormArrayControl,
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
  ],
  templateUrl: './personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationPersonalDetailsForm>();

  public readonly customAddressFieldIds = CUSTOM_ADDRESS_FIELD_IDS;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public nestedRouteButtonText!: string;

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
      addAlias: new FormControl(null),
      aliases: new FormArray([]),
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
   * Retrieves the nested route based on the defendant type and sets the nested route button text accordingly.
   */
  private getNestedRoute(): void {
    const { defendantType } = this.macStateService.manualAccountCreation.accountDetails;
    if (defendantType) {
      const nestedRoute = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES[defendantType]?.['personalDetails'];
      switch (nestedRoute) {
        case ManualAccountCreationRoutes.contactDetails:
          this.nestedRouteButtonText = 'Add contact details';
          break;
        case ManualAccountCreationRoutes.offenceDetails:
          this.nestedRouteButtonText = 'Add offence details';
          break;
        default:
          this.nestedRouteButtonText = '';
          break;
      }
    }
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

    const addAliasControl = this.form.get('addAlias');
    if (!addAliasControl) {
      return;
    }

    this.addAliasListener = addAliasControl.valueChanges.subscribe((shouldAddAlias) => {
      this.aliasControls = shouldAddAlias
        ? this.buildFormArrayControls([0], 'aliases', this.aliasFields, this.aliasControlsValidation)
        : this.removeAllFormArrayControls(this.aliasControls, 'aliases', this.aliasFields);
    });
  }

  /**
   * Adds an alias to the aliasControls form array.
   *
   * @param index - The index at which to add the alias.
   */
  public addAlias(index: number): void {
    this.aliasControls.push(
      this.addFormArrayControls(index, 'aliases', this.aliasFields, this.aliasControlsValidation),
    );
  }

  /**
   * Removes an alias from the aliasControls array.
   *
   * @param index - The index of the alias to remove.
   */
  public removeAlias(index: number): void {
    this.aliasControls = this.removeFormArrayControls(index, 'aliases', this.aliasControls, this.aliasFields);
  }

  public override ngOnInit(): void {
    this.setupPersonalDetailsForm();
    this.setupAliasConfiguration();
    this.aliasControls = this.buildFormArrayControls(
      [...Array(this.macStateService.manualAccountCreation.personalDetails.aliases.length).keys()],
      'aliases',
      this.aliasFields,
      this.aliasControlsValidation,
    );
    this.setInitialErrorMessages();
    this.getNestedRoute();
    this.rePopulateForm(this.macStateService.manualAccountCreation.personalDetails);
    this.setUpAliasCheckboxListener();
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.addAliasListener?.unsubscribe();
    super.ngOnDestroy();
  }
}
