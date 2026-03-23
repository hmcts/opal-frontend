import { IFinesConSearchResultDefendantAccount } from '../../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';

export const FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_FALLBACK_PROPERTIES_MOCK = [
  {
    defendantAccountId: '99',
    accountNumber: 'ACC099',
    defendantSurname: 'Doe',
    defendantFirstnames: 'John',
    collectionOrder: true,
    hasPayingParentGuardian: false,
  },
] as unknown as IFinesConSearchResultDefendantAccount[];
