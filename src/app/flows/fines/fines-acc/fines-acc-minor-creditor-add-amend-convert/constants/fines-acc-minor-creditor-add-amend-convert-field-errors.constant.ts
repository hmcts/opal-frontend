import { IFinesAccMinorCreditorAddAmendConvertFieldErrors } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-field-errors.interface';

export const FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FIELD_ERRORS: IFinesAccMinorCreditorAddAmendConvertFieldErrors =
  {
    facc_minor_creditor_creditor_type: {
      required: {
        message: 'Select whether minor creditor is an individual or company',
        priority: 1,
      },
      minorCreditorDetailsMissing: {
        message: 'Add minor creditor details',
        priority: 2,
      },
    },
    facc_minor_creditor_title: {
      required: {
        message: 'Select minor creditor’s title',
        priority: 1,
      },
    },
    facc_minor_creditor_forenames: {
      required: {
        message: 'Enter minor creditor’s first name',
        priority: 1,
      },
      maxlength: {
        message: 'Minor creditor’s first name must be 20 characters or fewer',
        priority: 2,
      },
      singleAsciiCharacters: {
        message:
          'Minor creditor’s first name must only include letters a to z, numbers 0-9 and certain special characters',
        priority: 3,
      },
    },
    facc_minor_creditor_surname: {
      required: {
        message: 'Enter minor creditor’s last name',
        priority: 1,
      },
      maxlength: {
        message: 'Minor creditor’s last name must be 30 characters or fewer',
        priority: 2,
      },
      singleAsciiCharacters: {
        message:
          'Minor creditor’s last name must only include letters a to z, numbers 0-9 and certain special characters',
        priority: 3,
      },
    },
    facc_minor_creditor_company_name: {
      required: {
        message: 'Enter minor creditor company name',
        priority: 1,
      },
      maxlength: {
        message: 'Minor creditor company name must be 50 characters or fewer',
        priority: 2,
      },
      singleAsciiCharacters: {
        message:
          'Minor creditor company name must only include letters a to z, numbers 0-9 and certain special characters',
        priority: 3,
      },
    },
    facc_minor_creditor_address_line_1: {
      maxlength: {
        message: 'Address line 1 must be 30 characters or fewer',
        priority: 1,
      },
      singleAsciiCharacters: {
        message: 'Address line 1 must only include letters a to z, numbers 0-9 and certain special characters',
        priority: 2,
      },
    },
    facc_minor_creditor_address_line_2: {
      maxlength: {
        message: 'Address line 2 must be 30 characters or fewer',
        priority: 1,
      },
      singleAsciiCharacters: {
        message: 'Address line 2 must only include letters a to z, numbers 0-9 and certain special characters',
        priority: 2,
      },
    },
    facc_minor_creditor_address_line_3: {
      maxlength: {
        message: 'Address line 3 must be 16 characters or fewer',
        priority: 1,
      },
      singleAsciiCharacters: {
        message: 'Address line 3 must only include letters a to z, numbers 0-9 and certain special characters',
        priority: 2,
      },
    },
    facc_minor_creditor_post_code: {
      maxlength: {
        message: 'Postcode must be 8 characters or fewer',
        priority: 1,
      },
      alphanumericTextPattern: {
        message: 'Postcode must only include letters a to z and numbers 0-9',
        priority: 2,
      },
    },
    facc_minor_creditor_bank_account_name: {
      required: {
        message: 'Enter name on account',
        priority: 1,
      },
      maxlength: {
        message: 'Name on account must be 18 characters or fewer',
        priority: 2,
      },
      singleAsciiCharacters: {
        message: 'Name on account must only include letters a to z, numbers 0-9 and certain special characters',
        priority: 3,
      },
    },
    facc_minor_creditor_bank_sort_code: {
      required: {
        message: 'Enter sort code',
        priority: 1,
      },
      minlength: {
        message: 'Enter a valid sort code like 309430',
        priority: 2,
      },
      maxlength: {
        message: 'Enter a valid sort code like 309430',
        priority: 2,
      },
      numericalTextPattern: {
        message: 'Enter a valid sort code like 309430',
        priority: 3,
      },
    },
    facc_minor_creditor_bank_account_number: {
      required: {
        message: 'Enter account number',
        priority: 1,
      },
      minlength: {
        message: 'Account number must be between 6 and 8 digits long',
        priority: 2,
      },
      maxlength: {
        message: 'Account number must be between 6 and 8 digits long',
        priority: 2,
      },
      numericalTextPattern: {
        message: 'Enter a valid account number like 00733445',
        priority: 3,
      },
    },
    facc_minor_creditor_bank_account_reference: {
      required: {
        message: 'Enter payment reference',
        priority: 1,
      },
      maxlength: {
        message: 'Payment reference must be 18 characters or fewer',
        priority: 2,
      },
      alphanumericTextPattern: {
        message: 'Payment reference must only include letters a to z and numbers 0-9',
        priority: 3,
      },
    },
  };
