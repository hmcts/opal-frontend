import { IOpalFinesDefendantAccountSearchParams } from '../interfaces/opal-fines-defendant-account-search-params.interface';

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS: IOpalFinesDefendantAccountSearchParams = {
  active_accounts_only: false,
  business_unit_ids: null,
  reference_number: null,
  defendant: null,
};
