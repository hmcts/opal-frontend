import { IOpalFinesEnforcementAccountTypesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-types-response.interface';
import { FINES_AEC_ACCOUNT_TYPES } from '../../constants/fines-aec-account-types.constant';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';

/**
 * Pairs each supported account type's low (L) and high (H) paths without modifying the response.
 * Rows follow COL, A, Y, CO order; types without a low path are omitted and absent balances remain null.
 * Each row uses the low path's ID/version and retains references to both original path records where present.
 * @param response - National enforcement account types returned by the API.
 * @returns Ordered table rows with threshold values and path metadata for subsequent amendments.
 */
export function transformAccountTypesForView(
  response: IOpalFinesEnforcementAccountTypesResponse,
): IFinesAecAccountTypeRow[] {
  return FINES_AEC_ACCOUNT_TYPES.flatMap(({ accountType, accountTypeName }) => {
    const lowValueAccountType = response.enforcement_account_types.find(
      (record) => record.account_type === accountType && record.path === 'L',
    );

    if (!lowValueAccountType) {
      return [];
    }

    const highValueAccountType =
      response.enforcement_account_types.find((record) => record.account_type === accountType && record.path === 'H') ??
      null;

    return [
      {
        id: lowValueAccountType.id,
        version: lowValueAccountType.version,
        accountType,
        accountTypeName,
        minimumBalance: lowValueAccountType.minimum_balance ?? null,
        highValue: highValueAccountType?.minimum_balance ?? null,
        lowValueAccountType,
        highValueAccountType,
      },
    ];
  });
}
