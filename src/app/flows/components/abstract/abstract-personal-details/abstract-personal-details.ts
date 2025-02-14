import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AbstractFormAliasBaseComponent } from '@components/abstract/abstract-form-alias-base/abstract-form-alias-base';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';
import { dateOfBirthValidator } from '@validators/date-of-birth/date-of-birth.validator';
import { nationalInsuranceNumberValidator } from '@validators/national-insurance-number/national-insurance-number.validator';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';

export abstract class AbstractPersonalDetailsComponent extends AbstractFormAliasBaseComponent {
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
