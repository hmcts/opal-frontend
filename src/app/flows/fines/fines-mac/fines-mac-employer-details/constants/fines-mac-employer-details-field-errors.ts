import { IFinesMacEmployerDetailsFieldErrors } from '../interfaces/fines-mac-employer-details-field-errors.interface';

export const FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS: IFinesMacEmployerDetailsFieldErrors = {
  fm_employer_details_employer_company_name: {
    required: {
      message: 'Enter employer name',
      priority: 1,
    },
    maxlength: {
      message: 'Employer name must be 35 characters or fewer',
      priority: 2,
    },
  },
  fm_employer_details_employer_reference: {
    required: {
      message: 'Enter employee reference or National Insurance number',
      priority: 1,
    },
    maxlength: {
      message: 'Employee reference must be 20 characters or fewer',
      priority: 2,
    },
  },
  fm_employer_details_employer_email_address: {
    maxlength: {
      message: 'Employer email address must be 76 characters or fewer',
      priority: 2,
    },
    emailPattern: {
      message: 'Enter employer email address in the correct format, like name@example.com',
      priority: 2,
    },
  },
  fm_employer_details_employer_telephone_number: {
    maxlength: {
      message: 'Enter employer telephone number in the correct format',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter employer telephone number in the correct format',
      priority: 2,
    },
  },
  fm_employer_details_employer_address_line_1: {
    required: {
      message: 'Enter employer address line 1, typically the building and street',
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
  fm_employer_details_employer_address_line_2: {
    maxlength: {
      message: 'Address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'Address line 2 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_employer_details_employer_address_line_3: {
    maxlength: {
      message: 'Address line 3 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'Address line 3 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_employer_details_employer_address_line_4: {
    maxlength: {
      message: 'Address line 4 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'Address line 4 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_employer_details_employer_address_line_5: {
    maxlength: {
      message: 'Address line 5 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'Address line 5 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_employer_details_employer_post_code: {
    maxlength: {
      message: 'Postcode must be 8 characters or fewer',
      priority: 1,
    },
  },
};
