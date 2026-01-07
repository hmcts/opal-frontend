import { IOpalFinesDefendantAccount } from './opal-fines-defendant-account.interface';

export interface IOpalFinesDefendantAccountResponse {
  count: number;
  defendant_accounts: IOpalFinesDefendantAccount[];
}
