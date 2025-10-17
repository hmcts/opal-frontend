import { IFinesAccDebtorAddAmendFieldErrors } from '../interfaces/fines-acc-debtor-add-amend-field-errors.interface';

export const FINES_ACC_DEBTOR_ADD_AMEND_FIELD_ERRORS: IFinesAccDebtorAddAmendFieldErrors = {
  facc_debtor_add_amend_title: {
    required: {
      message: 'Select a title',
      priority: 1,
    },
  },
  facc_debtor_add_amend_forenames: {
    required: {
      message: `Enter defendant's first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Defendant's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Defendant's first name(s) must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_surname: {
    required: {
      message: `Enter defendant's last name`,
      priority: 1,
    },
    maxlength: {
      message: `Defendant's last name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Defendant's last name must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_forenames_0: {
    required: {
      message: `Enter alias 1 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 1 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 1 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_surname_0: {
    required: {
      message: `Enter alias 1 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 1 last name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 1 last name must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_forenames_1: {
    required: {
      message: `Enter alias 2 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 2 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 2 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_surname_1: {
    required: {
      message: `Enter alias 2 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 2 last name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 2 last name must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_forenames_2: {
    required: {
      message: `Enter alias 3 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 3 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 3 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_surname_2: {
    required: {
      message: `Enter alias 3 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 3 last name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 3 last name must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_forenames_3: {
    required: {
      message: `Enter alias 4 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 4 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 4 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_surname_3: {
    required: {
      message: `Enter alias 4 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 4 last name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 4 last name must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_forenames_4: {
    required: {
      message: `Enter alias 5 first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 5 first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 5 first name(s) must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_alias_surname_4: {
    required: {
      message: `Enter alias 5 last name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 5 last name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesPattern: {
      message: `Alias 5 last name must only contain letters`,
      priority: 3,
    },
  },
  facc_debtor_add_amend_dob: {
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
  facc_debtor_add_amend_national_insurance_number: {
    nationalInsuranceNumberPattern: {
      message: `Enter a National Insurance number in the format AANNNNNNA`,
      priority: 1,
    },
  },
  facc_debtor_add_amend_address_line_1: {
    required: {
      message: 'Enter address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    alphanumericTextPattern: {
      message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
  facc_debtor_add_amend_address_line_2: {
    maxlength: {
      message: 'Address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Address line 2 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_address_line_3: {
    maxlength: {
      message: `Address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Address line 3 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_post_code: {
    maxlength: {
      message: `Postcode must be 8 characters or fewer`,
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_contact_email_address_1: {
    maxlength: {
      message: 'Primary email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter primary email address in the correct format, like name@example.com',
      priority: 2,
    },
  },
  facc_debtor_add_amend_contact_email_address_2: {
    maxlength: {
      message: 'Secondary email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter secondary email address in the correct format, like name@example.com',
      priority: 2,
    },
  },
  facc_debtor_add_amend_contact_telephone_number_mobile: {
    maxlength: {
      message: 'Enter a valid mobile telephone number, like 07700 900 982',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a valid mobile telephone number, like 07700 900 982',
      priority: 2,
    },
  },
  facc_debtor_add_amend_contact_telephone_number_home: {
    maxlength: {
      message: 'Enter a valid home telephone number, like 01632 960 001',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a valid home telephone number, like 01632 960 001',
      priority: 2,
    },
  },
  facc_debtor_add_amend_contact_telephone_number_business: {
    maxlength: {
      message: 'Enter a valid work telephone number, like 01632 960 001 or 07700 900 982',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a valid work telephone number, like 01632 960 001 or 07700 900 982',
      priority: 2,
    },
  },
  facc_debtor_add_amend_vehicle_make: {
    maxlength: {
      message: `Make and model must be 30 characters or fewer`,
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Vehicle make and model must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_vehicle_registration_mark: {
    maxlength: {
      message: `Vehicle registration must be 20 characters or fewer`,
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Vehicle registration must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_language_preferences_document_language: {},
  facc_debtor_add_amend_language_preferences_hearing_language: {},
  facc_debtor_add_amend_employer_details_employer_company_name: {
    required: {
      message: 'Enter employer name',
      priority: 1,
    },
    maxlength: {
      message: 'Employer name must be 50 characters or fewer',
      priority: 2,
    },
    alphanumericTextPattern: {
      message: 'Employer name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
  facc_debtor_add_amend_employer_details_employer_reference: {
    required: {
      message: 'Enter employee reference or National Insurance number',
      priority: 1,
    },
    maxlength: {
      message: 'Employee reference must be 20 characters or fewer',
      priority: 2,
    },
    alphanumericTextPattern: {
      message: 'Employer reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
  facc_debtor_add_amend_employer_details_employer_email_address: {
    maxlength: {
      message: 'Employer email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter employer email address in the correct format, like name@example.com',
      priority: 2,
    },
  },
  facc_debtor_add_amend_employer_details_employer_telephone_number: {
    maxlength: {
      message: 'Enter a valid employer telephone number in the correct format, like 07700 900 982 or 01263 766122',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a valid employer telephone number in the correct format, like 07700 900 982 or 01263 766122',
      priority: 2,
    },
  },
  facc_debtor_add_amend_employer_details_employer_address_line_1: {
    required: {
      message: 'Enter address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    alphanumericTextPattern: {
      message: 'Employer address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
  facc_debtor_add_amend_employer_details_employer_address_line_2: {
    maxlength: {
      message: 'Address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Employer address line 2 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_employer_details_employer_address_line_3: {
    maxlength: {
      message: 'Address line 3 must be 30 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Employer address line 3 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_employer_details_employer_address_line_4: {
    maxlength: {
      message: 'Address line 4 must be 30 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Employer address line 4 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_employer_details_employer_address_line_5: {
    maxlength: {
      message: 'Address line 5 must be 30 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Employer address line 5 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  facc_debtor_add_amend_employer_details_employer_post_code: {
    maxlength: {
      message: 'Postcode must be 8 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Employer postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
};
