import { IOpalFinesCreditorAccount } from './opal-fines-creditor-account.interface';

export interface IOpalFinesCreditorAccountResponse {
  count: number;
  creditor_accounts: IOpalFinesCreditorAccount[];
}
