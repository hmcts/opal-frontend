import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  FormBaseComponent,
  GovukBackLinkComponent,
  GovukButtonComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukErrorSummaryComponent,
  GovukSelectComponent,
  GovukTextInputComponent,
  ScotgovDatePickerComponent,
} from '@components';
import {
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS_FIELD_ERROR,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FIELD_ERROR,
  TITLE_DROPDOWN_OPTIONS,
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors, IGovUkSelectOptions, IManualAccountCreationPersonalAlias } from '@interfaces';
import { DateTime } from 'luxon';
import { IManualAccountCreationPersonalDetailsState } from 'src/app/interfaces/manual-account-creation-personal-details-state.interface';
import {
  alphabeticalTextValidator,
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
    GovukBackLinkComponent,
    GovukErrorSummaryComponent,
    ScotgovDatePickerComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukSelectComponent,
  ],
  templateUrl: './personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationPersonalDetailsState>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FIELD_ERROR;
  private aliasBaseErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS_FIELD_ERROR;

  public readonly titleOptions: IGovUkSelectOptions[] = TITLE_DROPDOWN_OPTIONS;
  public yesterday: string = DateTime.now().minus({ days: 1 }).setLocale('en-gb').toLocaleString();

  public aliasControls: IManualAccountCreationPersonalAlias[] = [];

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      firstNames: new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
      lastName: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      addAlias: new FormControl(null),
      aliases: new FormArray([]),
      dateOfBirth: new FormControl(null, [optionalValidDateValidator()]),
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

    this.addAliases(0);
  }

  /**
   * Adds aliases to the form.
   *
   * @param index - The index of the aliases.
   */
  public addAliases(index: number): void {
    const aliases = this.form.get('aliases') as FormArray;
    const aliasesFormGroup = new FormGroup({});

    // Create our controls...
    const controls = {
      firstName: {
        inputId: `firstName_${index}`,
        inputName: `firstName_${index}`,
        controlName: `firstName_${index}`,
      },
      lastName: {
        inputId: `lastName_${index}`,
        inputName: `lastName_${index}`,
        controlName: `lastName_${index}`,
      },
    };

    // Add the controls to the aliasControls array
    this.aliasControls.push(controls);

    // Add the controls to the form group
    aliasesFormGroup.addControl(controls.firstName.controlName, new FormControl(null, [Validators.required]));
    aliasesFormGroup.addControl(controls.lastName.controlName, new FormControl(null, [Validators.required]));

    // Add the form group to the form array
    aliases.push(aliasesFormGroup);

    // Add field errors for the new controls
    const fieldErrors = {
      [controls.firstName.controlName]: {
        ...this.aliasBaseErrors['firstName'],
      },
      [controls.lastName.controlName]: {
        ...this.aliasBaseErrors['lastName'],
      },
    };

    // Add the new field errors to the existing field errors
    this.fieldErrors = {
      ...this.fieldErrors,
      ...fieldErrors,
    };
  }

  /**
   * Removes an alias from the form.
   * @param index - The index of the alias to remove.
   */
  public removeAlias(index: number): void {
    const aliases = this.form.get('aliases') as FormArray;
    aliases.removeAt(index);

    // Remove the field errors for the removed controls
    delete this.fieldErrors[`${this.aliasControls[index].firstName.controlName}`];
    delete this.fieldErrors[`${this.aliasControls[index].lastName.controlName}`];

    // Remove the controls from the aliasControls array
    this.aliasControls.splice(index, 1);
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit(this.form.value);
    }
  }

  public override ngOnInit(): void {
    this.setupPersonalDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.stateService.manualAccountCreation.personalDetails);
    super.ngOnInit();
  }
}
