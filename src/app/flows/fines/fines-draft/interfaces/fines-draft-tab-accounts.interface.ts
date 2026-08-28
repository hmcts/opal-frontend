import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';

export interface IFinesDraftTabAccounts {
  tab: string;
  response: IOpalFinesDraftAccountsResponse;
}
