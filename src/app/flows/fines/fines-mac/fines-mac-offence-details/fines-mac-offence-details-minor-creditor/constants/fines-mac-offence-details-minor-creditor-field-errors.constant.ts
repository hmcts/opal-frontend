import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export const FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  fm_offence_details_minor_creditor_creditor_type: {
    required: {
      message: 'Select creditor type',
      priority: 1,
    },
  },
  fm_offence_details_minor_creditor_forenames: {
    maxlength: {
      message: `The first name(s) must be 50 characters or fewer`,
      priority: 1,
    },
    alphabeticalTextPattern: {
      message: `The first name(s) must only contain alphabetical text`,
      priority: 2,
    },
  },
  fm_offence_details_minor_creditor_surname: {
    required: {
      message: `Enter last name`,
      priority: 1,
    },
    maxlength: {
      message: `The last name must be 50 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The last name must only contain alphabetical text`,
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_company_name: {
    required: {
      message: `Enter company name`,
      priority: 1,
    },
    maxlength: {
      message: `The company name must be 50 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The company name must only contain alphabetical text`,
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_address_line_1: {
    maxlength: {
      message: 'The address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'The address line 1 must not contain special characters',
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_address_line_2: {
    maxlength: {
      message: 'The address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 2 must not contain special characters',
      priority: 2,
    },
  },
  fm_offence_details_minor_creditor_address_line_3: {
    maxlength: {
      message: `The address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 3 must not contain special characters',
      priority: 2,
    },
  },
  fm_offence_details_minor_creditor_postcode: {
    maxlength: {
      message: `The postcode must be 8 characters or fewer`,
      priority: 1,
    },
  },
  fm_offence_details_minor_creditor_name_on_account: {
    required: {
      message: 'Enter name on the account',
      priority: 1,
    },
    maxLength: {
      message: 'Name on the account must be 18 characters or fewer',
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: 'Name on account must only contain letters',
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_sort_code: {
    required: {
      message: 'Enter sort code',
      priority: 1,
    },
    maxLength: {
      message: 'Sort code must be 6 characters or fewer',
      priority: 2,
    },
    numericalTextPattern: {
      message: 'Sort code must only contain numbers',
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_account_number: {
    required: {
      message: 'Enter account number',
      priority: 1,
    },
    maxLength: {
      message: 'Account number must be 10 characters or fewer',
      priority: 2,
    },
    numericalTextPattern: {
      message: 'Account number must only contain numbers',
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_payment_reference: {
    required: {
      message: 'Enter payment reference',
      priority: 1,
    },
    maxLength: {
      message: 'Payment reference must be 18 characters or fewer',
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: 'Payment reference must only contain letters',
      priority: 3,
    },
  },
};
