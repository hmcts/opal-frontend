import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_COMPANY_DETAILS_CONTROLS_COMPANY_NAME as F_M_COMPANY_DETAILS_COMPANY_NAME } from '../constants/controls/fines-mac-company-details-controls-company-name';

export const FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_COMPANY_DETAILS_COMPANY_NAME.controlName]: {
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
  alias_organisation_name_0: {
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
  alias_organisation_name_1: {
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
  alias_organisation_name_2: {
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
  alias_organisation_name_3: {
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
  alias_organisation_name_4: {
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
};
