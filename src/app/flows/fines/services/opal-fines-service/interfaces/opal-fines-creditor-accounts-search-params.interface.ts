import { IOpalFinesCreditorAccountsSearchParamsCreditor } from './opal-fines-creditor-accounts-search-params-creditor.interface';

export interface IOpalFinesCreditorAccountsSearchParams {
  business_unit_ids: number[] | null;
  active_accounts_only: boolean | null;
  account_number: string | null;
  creditor: IOpalFinesCreditorAccountsSearchParamsCreditor | null;
}
