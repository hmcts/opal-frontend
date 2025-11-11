import { IFinesSaSearchAccountFormMajorCreditorsFieldErrors } from '../interfaces/fines-sa-search-account-form-major-creditors-field-errors.interface';

export const FINES_SA_SEARCH_ACCOUNT_FORM_MAJOR_CREDITORS_FIELD_ERRORS: IFinesSaSearchAccountFormMajorCreditorsFieldErrors =
  {
    fsa_search_account_major_creditors_major_creditor_id: {
      required: {
        message: 'Enter a major creditor name or code',
        priority: 1,
      },
    },
  };
