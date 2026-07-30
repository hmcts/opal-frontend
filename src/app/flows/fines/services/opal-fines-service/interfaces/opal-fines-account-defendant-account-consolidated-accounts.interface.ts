import { IOpalFinesAccountDefendantDetailsConsolidatedAccount } from './opal-fines-account-defendant-account-consolidated-account.interface';
import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountDefendantDetailsConsolidatedAccounts extends IOpalFinesVersion {
  consolidated_accounts: IOpalFinesAccountDefendantDetailsConsolidatedAccount[];
}
