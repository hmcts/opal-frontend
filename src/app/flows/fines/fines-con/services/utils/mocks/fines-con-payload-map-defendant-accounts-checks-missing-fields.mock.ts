import { IFinesConSearchResultDefendantAccount } from '../../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';

export const FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_CHECKS_MISSING_FIELDS_MOCK: IFinesConSearchResultDefendantAccount[] =
  [
    {
      defendant_account_id: 31,
      checks: {
        errors: [{ reference: '', message: 'Error text' }],
        warnings: [{ reference: 'CON.WN.9', message: '' }],
      },
    } as IFinesConSearchResultDefendantAccount,
  ];
