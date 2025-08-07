import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  fm_offence_details_minor_creditor_creditor_type: {
    required: {
      message: 'Select whether minor creditor is an individual or company',
      priority: 1,
    },
  },
  fm_offence_details_minor_creditor_title: {
    required: {
      message: `Select minor creditor's title`,
      priority: 1,
    },
  },
  fm_offence_details_minor_creditor_forenames: {
    required: {
      message: `Enter minor creditor's first name`,
      priority: 1,
    },
    maxlength: {
      message: `The minor creditor's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The minor creditor's first name(s) must only contain alphabetical text`,
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_surname: {
    required: {
      message: `Enter minor creditor's last name`,
      priority: 1,
    },
    maxlength: {
      message: `The minor creditor's last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The minor creditor's last name must only contain alphabetical text`,
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
    alphanumericTextPattern: {
      message: `The company must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes`,
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
  fm_offence_details_minor_creditor_post_code: {
    maxlength: {
      message: `The postcode must be 8 characters or fewer`,
      priority: 1,
    },
  },
  fm_offence_details_minor_creditor_bank_account_name: {
    required: {
      message: 'Enter name on the account',
      priority: 1,
    },
    maxlength: {
      message: 'Name on the account must be 18 characters or fewer',
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: 'Name on account must only contain letters',
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_bank_sort_code: {
    required: {
      message: 'Enter sort code',
      priority: 1,
    },
    maxlength: {
      message: 'Sort code must be 6 characters or fewer',
      priority: 2,
    },
    numericalTextPattern: {
      message: 'Sort code must only contain numbers',
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_bank_account_number: {
    required: {
      message: 'Enter account number',
      priority: 1,
    },
    maxlength: {
      message: 'Account number must be 8 characters or fewer',
      priority: 2,
    },
    numericalTextPattern: {
      message: 'Account number must only contain numbers',
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_bank_account_ref: {
    required: {
      message: 'Enter payment reference',
      priority: 1,
    },
    maxlength: {
      message: 'Payment reference must be 18 characters or fewer',
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: 'Payment reference must only contain letters',
      priority: 3,
    },
  },
};
