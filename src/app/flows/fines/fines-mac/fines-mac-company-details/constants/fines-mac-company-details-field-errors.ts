import { IFinesMacCompanyDetailsFieldErrors } from '../interfaces/fines-mac-company-details-field-errors.interface';

export const FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS: IFinesMacCompanyDetailsFieldErrors = {
  fm_company_details_company_name: {
    required: {
      message: `Enter company name`,
      priority: 1,
    },
    maxlength: {
      message: `Company name must be 50 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesDotPattern: {
      message: `Company name must only contain letters`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_0: {
    required: {
      message: `Enter alias 1 company name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 1 company name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesDotPattern: {
      message: `Alias 1 company name must only contain letters`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_1: {
    required: {
      message: `Enter alias 2 company name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 2 company name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesDotPattern: {
      message: `Alias 2 company name must only contain letters`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_2: {
    required: {
      message: `Enter alias 3 company name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 3 company name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesDotPattern: {
      message: `Alias 3 company name must only contain letters`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_3: {
    required: {
      message: `Enter alias 4 company name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 4 company name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesDotPattern: {
      message: `Alias 4 company name must only contain letters`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_4: {
    required: {
      message: `Enter alias 5 company name`,
      priority: 1,
    },
    maxlength: {
      message: `Alias 5 company name must be 30 characters or fewer`,
      priority: 2,
    },
    lettersWithSpacesDotPattern: {
      message: `Alias 5 company name must only contain letters`,
      priority: 3,
    },
  },
  fm_company_details_address_line_1: {
    required: {
      message: 'Enter address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    alphanumericTextPattern: {
      message: 'Address line 1 must only contain letters or numbers',
      priority: 3,
    },
  },
  fm_company_details_address_line_2: {
    maxlength: {
      message: 'Address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Address line 2 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_company_details_address_line_3: {
    maxlength: {
      message: `Address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Address line 3 must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_company_details_postcode: {
    maxlength: {
      message: `Postcode must be 8 characters or fewer`,
      priority: 1,
    },
    alphanumericTextPattern: {
      message: `The postcode must only contain letters or numbers`,
      priority: 2,
    },
  },
};
