import { inject } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { AbstractFormAliasBaseComponent } from '@components/abstract/abstract-form-alias-base/abstract-form-alias-base';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { DateService } from '@services/date-service/date.service';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';
import { dateOfBirthValidator } from '@validators/date-of-birth/date-of-birth.validator';
import { nationalInsuranceNumberValidator } from '@validators/national-insurance-number/national-insurance-number.validator';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';
import { takeUntil } from 'rxjs';

export abstract class AbstractPersonalDetailsComponent extends AbstractFormAliasBaseComponent {
  protected readonly dateService = inject(DateService);
  protected vehicleDetailsFields!: IAbstractFormArrayControlValidation[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected dateOfBirthControl!: AbstractControl<any, any>;

  public age!: number;
  public ageLabel!: string;

  /**
   * Updates the age and age label based on the provided date of birth.
   *
   * @param dateOfBirth - The date of birth in string format.
   */
  protected updateAgeAndLabel(dateOfBirth: string): void {
    if (this.dateService.isValidDate(dateOfBirth)) {
      this.age = this.dateService.calculateAge(dateOfBirth);
      this.ageLabel = this.age >= 18 ? 'Adult' : 'Youth';
    }
  }

  /**
   * Adds vehicle details controls to the form.
   * Iterates over the CONF_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS array and creates a control for each field.
   */
  protected addVehicleDetailsControls(): void {
    this.vehicleDetailsFields.forEach((control) => {
      this.createControl(control.controlName, control.validators);
    });
  }

  /**
   * Listens for changes in the date of birth control and updates the age and label accordingly.
   */
  protected dateOfBirthListener(): void {
    const dobControl = this.dateOfBirthControl;

    // Initial update if the date of birth is already populated
    if (dobControl) {
      if (dobControl.value) {
        this.updateAgeAndLabel(dobControl.value);
      }

      // Subscribe to changes in the date of birth control
      dobControl.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((dateOfBirth) => {
        this.updateAgeAndLabel(dateOfBirth);
      });
    }
  }

  protected setupPersonalDetailsForm(prefix: string): void {
    this.form = new FormGroup({
      [`${prefix}_personal_details_title`]: new FormControl(null, [Validators.required]),
      [`${prefix}_personal_details_forenames`]: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
        alphabeticalTextValidator(),
      ]),
      [`${prefix}_personal_details_surname`]: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        alphabeticalTextValidator(),
      ]),
      [`${prefix}_personal_details_aliases`]: new FormArray([]),
      [`${prefix}_personal_details_add_alias`]: new FormControl(null),
      [`${prefix}_personal_details_dob`]: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      [`${prefix}_personal_details_national_insurance_number`]: new FormControl(null, [
        nationalInsuranceNumberValidator(),
      ]),
      [`${prefix}_personal_details_address_line_1`]: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      [`${prefix}_personal_details_address_line_2`]: new FormControl(null, [
        optionalMaxLengthValidator(30),
        specialCharactersValidator(),
      ]),
      [`${prefix}_personal_details_address_line_3`]: new FormControl(null, [
        optionalMaxLengthValidator(16),
        specialCharactersValidator(),
      ]),
      [`${prefix}_personal_details_post_code`]: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }
}
