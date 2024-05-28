import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FIELD_ERROR, TITLE_DROPDOWN_OPTIONS } from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors, IGovUkSelectOptions } from '@interfaces';
import { DateTime } from 'luxon';
import { IManualAccountCreationPersonalDetailsState } from 'src/app/interfaces/manual-account-creation-personal-details-state.interface';
import { alphabeticalTextValidator, nationalInsuranceNumberValidator, optionalMaxLengthValidator, optionalValidDateValidator, specialCharactersValidator } from 'src/app/validators';

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
})
export class PersonalDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationPersonalDetailsState>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FIELD_ERROR;

  public readonly titleOptions: IGovUkSelectOptions[] = TITLE_DROPDOWN_OPTIONS;
  public today: string = DateTime.now().setLocale('en-gb').toLocaleString();

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      firstNames: new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
      lastName: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      addAlias: new FormControl(null),
      aliases: new FormGroup({
        firstNames1: new FormControl(null),
        lastName1: new FormControl(null),
      }),
      dateOfBirth: new FormControl(null, [optionalValidDateValidator()]),
      nationalInsuranceNumber: new FormControl(null, [nationalInsuranceNumberValidator()]),
      addressLine1: new FormControl(null, [Validators.required, Validators.maxLength(30), specialCharactersValidator()]),
      addressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      addressLine3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
      postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
      makeOfCar: new FormControl(null, [optionalMaxLengthValidator(30)]),
      registrationNumber: new FormControl(null, [optionalMaxLengthValidator(11)]),
    });
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      //this.formSubmit.emit(this.form.value);
    }
  }

  public override ngOnInit(): void {
    this.setupPersonalDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.stateService.manualAccountCreation.personalDetails);
    super.ngOnInit();
  }
}
