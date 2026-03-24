import { IFinesConSearchResultDefendantAccount } from '../../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';

export interface IFinesConPayloadRawDefendantAccount extends IFinesConSearchResultDefendantAccount {
  defendantAccountId: number | string | null;
  accountNumber: string | null;
  defendantSurname: string | null;
  defendantFirstnames: string | null;
  birthDate: string | null;
  addressLine1: string | null;
  postCode: string | null;
  collectionOrder: boolean | null;
  has_collection_order: boolean | null;
  hasCollectionOrder: boolean | null;
  lastEnforcement: string | null;
  lastEnforcementAction: string | null;
  accountBalance: number | null;
  hasPayingParentGuardian: boolean | null;
  nationalInsuranceNumber: string | null;
  prosecutorCaseReference: string | null;
}
