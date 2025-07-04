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
      message: `Select title`,
      priority: 1,
    },
  },
  fm_offence_details_minor_creditor_forenames: {
    required: {
      message: `Enter first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `First name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `First name(s) must only contain letters`,
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_surname: {
    required: {
      message: `Enter last name`,
      priority: 1,
    },
    maxlength: {
      message: `Last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Last name must only contain letters`,
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_company_name: {
    required: {
      message: `Enter company name`,
      priority: 1,
    },
    maxlength: {
      message: `Company name must be 50 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Company name must only contain letters`,
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_address_line_1: {
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'Address line 1 must only contain letters or numbers',
      priority: 3,
    },
  },
  fm_offence_details_minor_creditor_address_line_2: {
    maxlength: {
      message: 'Address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'Address line 2 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_offence_details_minor_creditor_address_line_3: {
    maxlength: {
      message: `Address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'Address line 3 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_offence_details_minor_creditor_post_code: {
    maxlength: {
      message: `Postcode must be 8 characters or fewer`,
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
