import { IFinesConSearchAccountFormIndividualsFieldErrors } from '../interfaces/fines-con-search-account-form-individuals-field-errors.interface';

/**
 * Field error messages specific to the Individuals tab.
 */
export const FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS: Partial<IFinesConSearchAccountFormIndividualsFieldErrors> =
  {
    fcon_search_account_individuals_last_name: {
      lettersWithSpacesPattern: 'Last name must only contain letters and spaces',
      maxlength: 'Last name must be 30 characters or less',
    },
    fcon_search_account_individuals_first_names: {
      lettersWithSpacesPattern: 'First names must only contain letters and spaces',
      maxlength: 'First names must be 20 characters or less',
    },
    fcon_search_account_individuals_date_of_birth: {
      invalidDate: 'Enter a valid date in the format DD/MM/YYYY',
      dateOfBirthInvalid: 'Date of birth must be in the past',
    },
  };
