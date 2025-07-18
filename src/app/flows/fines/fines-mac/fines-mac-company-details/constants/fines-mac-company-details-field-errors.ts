import { IFinesMacCompanyDetailsFieldErrors } from '../interfaces/fines-mac-company-details-field-errors.interface';

export const FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS: IFinesMacCompanyDetailsFieldErrors = {
  fm_company_details_company_name: {
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
  fm_company_details_alias_company_name_0: {
    required: {
      message: `Enter company name for alias 1`,
      priority: 1,
    },
    maxlength: {
      message: `The company name must be 30 characters or fewer for alias 1`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The company name must only contain alphabetical text for alias 1`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_1: {
    required: {
      message: `Enter company name for alias 2`,
      priority: 1,
    },
    maxlength: {
      message: `The company name must be 30 characters or fewer for alias 2`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The company name must only contain alphabetical text for alias 2`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_2: {
    required: {
      message: `Enter company name for alias 3`,
      priority: 1,
    },
    maxlength: {
      message: `The company name must be 30 characters or fewer for alias 3`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The company name must only contain alphabetical text for alias 3`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_3: {
    required: {
      message: `Enter company name for alias 4`,
      priority: 1,
    },
    maxlength: {
      message: `The company name must be 30 characters or fewer for alias 4`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The company name must only contain alphabetical text for alias 4`,
      priority: 3,
    },
  },
  fm_company_details_alias_company_name_4: {
    required: {
      message: `Enter company name for alias 5`,
      priority: 1,
    },
    maxlength: {
      message: `The company name must be 30 characters or fewer for alias 5`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The company name must only contain alphabetical text for alias 5`,
      priority: 3,
    },
  },
  fm_company_details_address_line_1: {
    required: {
      message: 'Enter address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'The address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'The address line 1 must not contain special characters',
      priority: 3,
    },
  },
  fm_company_details_address_line_2: {
    maxlength: {
      message: 'The address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 2 must not contain special characters',
      priority: 2,
    },
  },
  fm_company_details_address_line_3: {
    maxlength: {
      message: `The address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 3 must not contain special characters',
      priority: 2,
    },
  },
  fm_company_details_postcode: {
    maxlength: {
      message: `The postcode must be 8 characters or fewer`,
      priority: 1,
    },
    alphabeticalTextPattern: {
      message: `The postcode must only contain alphabetical text`,
      priority: 3,
    },
  },
};
