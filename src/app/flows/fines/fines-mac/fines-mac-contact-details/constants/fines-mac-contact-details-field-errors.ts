import { IFinesMacContactDetailsFieldErrors } from '../interfaces/fines-mac-contact-details-field-errors.interface';

export const FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS: IFinesMacContactDetailsFieldErrors = {
  fm_contact_details_email_address_1: {
    maxlength: {
      message: 'Primary email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter primary email address in the correct format, like name@example.com',
      priority: 2,
    },
  },
  fm_contact_details_email_address_2: {
    maxlength: {
      message: 'Secondary email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter secondary email address in the correct format, like name@example.com',
      priority: 2,
    },
  },
  fm_contact_details_telephone_number_mobile: {
    maxlength: {
      message: 'Enter a valid mobile telephone number, like 07700 900 982',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a valid mobile telephone number, like 07700 900 982',
      priority: 2,
    },
  },
  fm_contact_details_telephone_number_home: {
    maxlength: {
      message: 'Enter a valid home telephone number, like 01632 960 001',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a valid home telephone number, like 01632 960 001',
      priority: 2,
    },
  },
  fm_contact_details_telephone_number_business: {
    maxlength: {
      message: 'Enter a valid work telephone number, like 01632 960 001 or 07700 900 982',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a valid work telephone number, like 01632 960 001 or 07700 900 982',
      priority: 2,
    },
  },
};
