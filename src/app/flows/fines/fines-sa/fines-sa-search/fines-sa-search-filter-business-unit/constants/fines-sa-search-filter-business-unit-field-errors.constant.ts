import { IFinesSaSearchFilterBusinessUnitFieldErrors } from '../interfaces/fines-sa-search-filter-business-unit-field-errors.interface';

export const FINES_SA_SEARCH_FILTER_BUSINESS_UNIT_FIELD_ERRORS: IFinesSaSearchFilterBusinessUnitFieldErrors = {
  fsa_search_account_business_unit_codes: {
    required: {
      message: `You must select at least one business unit`,
      priority: 1,
    },
  },
};
