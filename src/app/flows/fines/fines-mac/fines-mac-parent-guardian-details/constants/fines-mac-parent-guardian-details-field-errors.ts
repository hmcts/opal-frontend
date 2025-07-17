import { IFinesMacParentGuardianDetailsFieldErrors } from '../interfaces/fines-mac-parent-guardian-details-field-errors.interface';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_FIELD_ERRORS: IFinesMacParentGuardianDetailsFieldErrors = {
  fm_parent_guardian_details_forenames: {
    required: {
      message: `Enter parent or guardian's first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `The parent or guardian's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    patternInvalid: {
      message: `The parent or guardian's first name(s) must only contain alphabetical text`,
      priority: 2,
    },
  },
  fm_parent_guardian_details_surname: {
    required: {
      message: `Enter parent or guardian's last name`,
      priority: 1,
    },
    maxlength: {
      message: `The parent or guardian's last name must be 30 characters or fewer`,
      priority: 2,
    },
    patternInvalid: {
      message: `The parent or guardian's last name must only contain alphabetical text`,
      priority: 2,
    },
  },
  fm_parent_guardian_details_alias_forenames_0: {
    required: {
      message: `Enter first name(s) for alias 1`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 1`,
      priority: 2,
    },
    patternInvalid: {
      message: `The first name(s) must only contain alphabetical text for alias 1`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_surname_0: {
    required: {
      message: `Enter last name for alias 1`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 1`,
      priority: 2,
    },
    patternInvalid: {
      message: `The last name must only contain alphabetical text for alias 1`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_forenames_1: {
    required: {
      message: `Enter first name(s) for alias 2`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 2`,
      priority: 2,
    },
    patternInvalid: {
      message: `The first name(s) must only contain alphabetical text for alias 2`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_surname_1: {
    required: {
      message: `Enter last name for alias 2`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 2`,
      priority: 2,
    },
    patternInvalid: {
      message: `The last name must only contain alphabetical text for alias 2`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_forenames_2: {
    required: {
      message: `Enter first name(s) for alias 3`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 3`,
      priority: 2,
    },
    patternInvalid: {
      message: `The first name(s) must only contain alphabetical text for alias 3`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_surname_2: {
    required: {
      message: `Enter last name for alias 3`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 3`,
      priority: 2,
    },
    patternInvalid: {
      message: `The last name must only contain alphabetical text for alias 3`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_forenames_3: {
    required: {
      message: `Enter first name(s) for alias 4`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 4`,
      priority: 2,
    },
    patternInvalid: {
      message: `The first name(s) must only contain alphabetical text for alias 4`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_surname_3: {
    required: {
      message: `Enter last name for alias 4`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 4`,
      priority: 2,
    },
    patternInvalid: {
      message: `The last name must only contain alphabetical text for alias 4`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_forenames_4: {
    required: {
      message: `Enter first name(s) for alias 5`,
      priority: 1,
    },
    maxlength: {
      message: `The first name(s) must be 20 characters or fewer for alias 5`,
      priority: 2,
    },
    patternInvalid: {
      message: `The first name(s) must only contain alphabetical text for alias 5`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_alias_surname_4: {
    required: {
      message: `Enter last name for alias 5`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 30 characters or fewer for alias 5`,
      priority: 2,
    },
    patternInvalid: {
      message: `The last name must only contain alphabetical text for alias 5`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_dob: {
    invalidDateFormat: {
      message: `Enter date of birth in the format DD/MM/YYYY`,
      priority: 1,
    },
    invalidDate: {
      message: `Enter a valid date of birth`,
      priority: 2,
    },
    invalidDateOfBirth: {
      message: `Enter a valid date of birth in the past`,
      priority: 3,
    },
  },
  fm_parent_guardian_details_national_insurance_number: {
    nationalInsuranceNumberPattern: {
      message: `Enter a National Insurance number in the format AANNNNNNA`,
      priority: 1,
    },
  },
  fm_parent_guardian_details_address_line_1: {
    required: {
      message: 'Enter address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'The address line 1 must be 25 characters or fewer',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'The address line 1 must not contain special characters',
      priority: 3,
    },
  },
  fm_parent_guardian_details_address_line_2: {
    maxlength: {
      message: 'The address line 2 must be 25 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 2 must not contain special characters',
      priority: 2,
    },
  },
  fm_parent_guardian_details_address_line_3: {
    maxlength: {
      message: `The address line 3 must be 13 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 3 must not contain special characters',
      priority: 2,
    },
  },
  fm_parent_guardian_details_post_code: {
    maxlength: {
      message: `The postcode must be 8 characters or fewer`,
      priority: 1,
    },
  },
  fm_parent_guardian_details_vehicle_make: {
    maxlength: {
      message: `The make of car must be 30 characters or fewer`,
      priority: 1,
    },
  },
  fm_parent_guardian_details_vehicle_registration_mark: {
    maxlength: {
      message: `The registration number must be 11 characters or fewer`,
      priority: 1,
    },
  },
};
