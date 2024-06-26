import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
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
  DATE_OF_BIRTH_FIELD_ERRORS,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FIELD_ERROR,
  NATIONAL_INSURANCE_FIELD_ERRORS,
  POST_CODE_FIELD_ERRORS,
  TITLE_DROPDOWN_OPTIONS,
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors, IGovUkSelectOptions, IManualAccountCreationPersonalAlias } from '@interfaces';
import { IManualAccountCreationPersonalDetailsState } from 'src/app/interfaces/manual-account-creation-personal-details-state.interface';
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
  ],
  templateUrl: './personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationPersonalDetailsState>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

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
   * Builds the alias inputs based on the personal details of the manual account creation.
   * If the addAlias flag is true, it adds the alias inputs based on the number of aliases in the personal details.
   * Otherwise, it adds a single alias input.
   * It also handles the checkbox change event and repopulates the form if necessary.
   */
  private buildAliasInputs(): void {
    const personalDetails = this.macStateService.manualAccountCreation.personalDetails;
    if (personalDetails.addAlias) {
      personalDetails.aliases.map((_, index) => {
        this.addAliases(index);
      });
      this.addAliasCheckboxChange();
      this.rePopulateForm(personalDetails);
    } else {
      this.addAliases(0);
    }
  }

  /**
   * Updates the validators for the controls in the aliasFormGroup based on the value of 'addAlias' control in the form.
   * If 'addAlias' is true, sets the alias validators for each control.
   * If 'addAlias' is false, clears the alias validators for each control.
   *
   * @param aliasFormGroup - The FormGroup containing the controls to update validators for.
   */
  private updateAliasFormGroupValidators(aliasFormGroup: FormGroup): void {
    Object.keys(aliasFormGroup.controls).forEach((key) => {
      if (this.form.controls['addAlias'].value) {
        this.setAliasValidators(aliasFormGroup, key);
      } else {
        this.clearAliasValidators(aliasFormGroup, key);
      }
    });
  }

  /**
   * Sets the validators for the specified alias form control.
   *
   * @param aliasFormGroup - The FormGroup containing the alias form control.
   * @param key - The key of the alias form control.
   */
  private setAliasValidators(aliasFormGroup: FormGroup, key: string): void {
    const validators = key.includes('firstNames')
      ? [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]
      : [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()];

    aliasFormGroup.controls[key].setValidators(validators);
    aliasFormGroup.controls[key].updateValueAndValidity();
  }

  /**
   * Clears the validators for a specific control in the alias form group.
   *
   * @param aliasFormGroup - The alias form group.
   * @param key - The key of the control to clear the validators for.
   */
  private clearAliasValidators(aliasFormGroup: FormGroup, key: string): void {
    aliasFormGroup.controls[key].clearValidators();
    aliasFormGroup.controls[key].updateValueAndValidity();
  }

  /**
   * Creates the form controls for the personal details form.
   *
   * @param index - The index of the form control.
   * @returns An object containing the form controls for the first name and last name.
   */
  private createControls(index: number) {
    return {
      firstName: {
        inputId: `firstNames_${index}`,
        inputName: `firstNames_${index}`,
        controlName: `firstNames_${index}`,
      },
      lastName: {
        inputId: `lastName_${index}`,
        inputName: `lastName_${index}`,
        controlName: `lastName_${index}`,
      },
    };
  }

  /**
   * Adds controls to the form group based on the provided controls object.
   * If the 'addAlias' control is true, it adds controls for first name and last name with required validators.
   * Otherwise, it adds controls for first name and last name without any validators.
   *
   * @param formGroup - The form group to which the controls will be added.
   * @param controls - The object containing the control names for first name and last name.
   */
  private addControlsToFormGroup(formGroup: FormGroup, controls: IManualAccountCreationPersonalAlias): void {
    if (this.form.controls['addAlias'].value) {
      formGroup.addControl(
        controls.firstName.controlName,
        new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
      );
      formGroup.addControl(
        controls.lastName.controlName,
        new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      );
    } else {
      formGroup.addControl(controls.firstName.controlName, new FormControl(null));
      formGroup.addControl(controls.lastName.controlName, new FormControl(null));
    }
  }

  /**
   * Removes the field errors for a specific index in the aliasControls array.
   * @param index - The index of the alias control.
   */
  private removeFieldErrors(index: number): void {
    const alias = this.aliasControls[index];
    delete this.fieldErrors[alias?.firstName?.controlName];
    delete this.fieldErrors[alias?.lastName?.controlName];
  }

  /**
   * Removes the alias control at the specified index from the aliasControls array.
   *
   * @param index - The index of the alias control to remove.
   */
  private removeAliasControls(index: number): void {
    this.aliasControls.splice(index, 1);
  }

  /**
   * Handles the change event of the add alias checkbox.
   * Updates the validators of each alias form group in the aliases form array.
   */
  public addAliasCheckboxChange(): void {
    const aliasesFormArray = this.form.get('aliases') as FormArray;
    const aliasFormGroups = aliasesFormArray.controls as FormGroup[];

    aliasFormGroups.forEach((aliasFormGroup: FormGroup) => {
      this.updateAliasFormGroupValidators(aliasFormGroup);
    });
  }

  /**
   * Adds aliases to the form.
   *
   * @param index - The index of the aliases to add.
   */
  public addAliases(index: number): void {
    const aliases = this.form.get('aliases') as FormArray;
    const aliasesFormGroup = new FormGroup({});

    const controls = this.createControls(index);
    this.aliasControls.push(controls);

    this.addControlsToFormGroup(aliasesFormGroup, controls);

    aliases.push(aliasesFormGroup);
  }

  /**
   * Removes an alias from the form array at the specified index.
   * Also removes any field errors and alias controls associated with the removed alias.
   *
   * @param index - The index of the alias to be removed.
   */
  public removeAlias(index: number): void {
    const aliases = this.form.get('aliases') as FormArray;
    aliases.removeAt(index);

    this.removeFieldErrors(index);
    this.removeAliasControls(index);
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
    this.rePopulateForm(this.macStateService.manualAccountCreation.personalDetails);
    this.buildAliasInputs();
    super.ngOnInit();
  }
}
