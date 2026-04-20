import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { IFinesConSearchResultDefendantAccount } from '../interfaces/fines-con-search-result-defendant-account.interface';

export type FinesConSearchResultSource =
  | { type: 'store' }
  | { type: 'payload'; searchPayload: IOpalFinesDefendantAccountSearchParams }
  | { type: 'accounts'; defendantAccounts: IFinesConSearchResultDefendantAccount[] };
