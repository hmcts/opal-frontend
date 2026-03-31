import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK } from './fines-con-search-result-defendant-accounts-formatting.mock';

export const FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_RESPONSE_MOCK: IOpalFinesDefendantAccountResponse = {
  count: 1,
  defendant_accounts: FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK,
};
