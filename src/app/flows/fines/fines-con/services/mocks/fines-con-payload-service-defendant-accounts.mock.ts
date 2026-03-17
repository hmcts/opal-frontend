import { IFinesConSearchResultDefendantAccount } from '../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';

export const FINES_CON_PAYLOAD_SERVICE_DEFENDANT_ACCOUNTS_MOCK: IFinesConSearchResultDefendantAccount[] = [
  {
    defendant_account_id: 11,
    account_number: 'ACC001',
    defendant_surname: 'Smith',
    defendant_firstnames: 'John',
    checks: {
      errors: [{ reference: 'CON.ER.4', message: 'Account blocked' }],
    },
  } as IFinesConSearchResultDefendantAccount,
];
