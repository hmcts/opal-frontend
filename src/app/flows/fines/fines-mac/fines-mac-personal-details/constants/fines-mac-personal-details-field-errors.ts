import { IFinesMacPersonalDetailsFieldErrors } from '../interfaces/fines-mac-personal-details-field-errors.interface';

export const FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS: IFinesMacPersonalDetailsFieldErrors = {
  fm_personal_details_title: {
    required: {
      message: 'Select a title',
      priority: 1,
    },
  },
  fm_personal_details_forenames: {
    required: {
      message: `Enter defendant's first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Defendant's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Defendant's first name(s) must only contain letters`,
      priority: 2,
    },
  },
  fm_personal_details_surname: {
    required: {
      message: `Enter defendant's last name`,
      priority: 1,
    },
    maxlength: {
      message: `Defendant's last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Defendant's last name must only contain letters`,
      priority: 2,
    },
  },
  fm_personal_details_alias_forenames_0: {
    required: {
      message: `Enter alias 1 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 1 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 1 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_surname_0: {
    required: {
      message: `Enter alias 1 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 1 last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 1 last name must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_forenames_1: {
    required: {
      message: `Enter alias 2 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 2 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 2 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_surname_1: {
    required: {
      message: `Enter alias 2 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 2 last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 2 last name must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_forenames_2: {
    required: {
      message: `Enter alias 3 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 3 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 3 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_surname_2: {
    required: {
      message: `Enter alias 3 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 3 last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 3 last name must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_forenames_3: {
    required: {
      message: `Enter alias 4 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 4 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 4 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_surname_3: {
    required: {
      message: `Enter alias 4 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 4 last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 4 last name must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_forenames_4: {
    required: {
      message: `Enter alias 5 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 5 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 5 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_alias_surname_4: {
    required: {
      message: `Enter alias 5 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 5 last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Alias 5 last name must only contain letters`,
      priority: 3,
    },
  },
  fm_personal_details_dob: {
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
  fm_personal_details_national_insurance_number: {
    nationalInsuranceNumberPattern: {
      message: `Enter a National Insurance number in the format AANNNNNNA`,
      priority: 1,
    },
  },
  fm_personal_details_address_line_1: {
    required: {
      message: 'Enter address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'Address line 1 must only contain letters or numbers',
      priority: 3,
    },
  },
  fm_personal_details_address_line_2: {
    maxlength: {
      message: 'Address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'Address line 2 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_personal_details_address_line_3: {
    maxlength: {
      message: `Address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'Address line 3 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_personal_details_post_code: {
    maxlength: {
      message: `Postcode must be 8 characters or fewer`,
      priority: 1,
    },
  },
  fm_personal_details_vehicle_make: {
    maxlength: {
      message: `Make and model must be 30 characters or fewer`,
      priority: 1,
    },
  },
  fm_personal_details_vehicle_registration_mark: {
    maxlength: {
      message: `Registration number must be 11 characters or fewer`,
      priority: 1,
    },
  },
};
