import { Injectable } from '@angular/core';
import { IFinesConSearchAccountState } from '../consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { FinesConDefendant } from '../types/fines-con-defendant.type';
import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { buildDefendantAccountsSearchPayload } from './utils/fines-con-payload-build-defendant-accounts-search.utils';
import {
  buildChecksByAccountId,
  extractDefendantAccounts,
  mapDefendantAccounts,
} from './utils/fines-con-payload-map-defendant-accounts.utils';
import { IFinesConSearchResultDefendantAccount } from '../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';
import { IFinesConSearchResultDefendantTableWrapperTableData } from '../consolidate-acc/fines-con-search-result/fines-con-search-result-defendant-table-wrapper/interfaces/fines-con-search-result-defendant-table-wrapper-table-data.interface';
import { IFinesConSearchResultAccountCheck } from '../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-account-check.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesConPayloadService {
  public buildDefendantAccountsSearchPayload(
    formData: IFinesConSearchAccountState,
    businessUnitId: number | null,
    defendantType: FinesConDefendant,
  ): IOpalFinesDefendantAccountSearchParams {
    return buildDefendantAccountsSearchPayload(formData, businessUnitId, defendantType);
  }

  public extractDefendantAccounts(response: unknown): IFinesConSearchResultDefendantAccount[] {
    return extractDefendantAccounts(response);
  }

  public mapDefendantAccounts(
    defendantAccounts: IFinesConSearchResultDefendantAccount[],
  ): IFinesConSearchResultDefendantTableWrapperTableData[] {
    return mapDefendantAccounts(defendantAccounts);
  }

  public buildChecksByAccountId(
    defendantAccounts: IFinesConSearchResultDefendantAccount[],
  ): Record<number, IFinesConSearchResultAccountCheck[]> {
    return buildChecksByAccountId(defendantAccounts);
  }
}
