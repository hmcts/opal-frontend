import { IFinesConSearchResultDefendantAccount } from '../../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';

export const FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_CHECKS_MIXED_IDS_MOCK = [
  {
    defendant_account_id: 11,
    checks: { errors: [{ reference: 'CON.ER.1', message: 'Error 1' }] },
  },
  {
    defendantAccountId: 12,
    checks: { warnings: [{ reference: 'CON.WN.1', message: 'Warn 1' }] },
  },
  {
    defendant_account_id: null,
    checks: { errors: [{ reference: 'CON.ER.2', message: 'Error 2' }] },
  },
] as unknown as IFinesConSearchResultDefendantAccount[];
