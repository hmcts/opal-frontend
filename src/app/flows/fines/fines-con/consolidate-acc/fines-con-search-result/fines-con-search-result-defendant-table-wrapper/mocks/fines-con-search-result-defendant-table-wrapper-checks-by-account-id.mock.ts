import { IFinesConSearchResultAccountCheck } from '../../interfaces/fines-con-search-result-account-check.interface';

export const FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_CHECKS_BY_ACCOUNT_ID_MOCK: Record<
  number,
  IFinesConSearchResultAccountCheck[]
> = {
  1: [
    {
      reference: 'CON.ER.1',
      severity: 'error',
      message: 'Account status is Consolidated',
    },
  ],
};
