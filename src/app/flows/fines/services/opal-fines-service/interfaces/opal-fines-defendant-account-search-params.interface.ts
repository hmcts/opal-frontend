import { IOpalFinesDefendantAccountSearchParamsDefendant } from './opal-fines-defendant-account-search-params-defendant.interface';
import { IOpalFinesDefendantAccountSearchParamsReference } from './opal-fines-defendant-account-search-params-reference.interface';

export interface IOpalFinesDefendantAccountSearchParams {
  active_accounts_only: boolean | null;
  business_unit_ids: number[] | null;
  reference_number: IOpalFinesDefendantAccountSearchParamsReference | null;
  defendant: IOpalFinesDefendantAccountSearchParamsDefendant | null;
}
