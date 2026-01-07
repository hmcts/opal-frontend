import { IOpalFinesMinorCreditorAccount } from './opal-fines-minor-creditor-account.interface';

export interface IOpalFinesMinorCreditorAccountsResponse {
  count: number;
  creditor_accounts: IOpalFinesMinorCreditorAccount[];
}
