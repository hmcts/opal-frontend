import { IFinesMciCriminalAccount } from './fines-mci-criminal-account.interface';

export interface IFinesMciCriminalAccountsResponse {
  count: number;
  defendant_accounts: IFinesMciCriminalAccount[];
}
