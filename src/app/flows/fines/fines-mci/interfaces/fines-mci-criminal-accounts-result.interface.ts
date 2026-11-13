import { IFinesMciCriminalAccountsResponse } from './fines-mci-criminal-accounts-response.interface';
import { FinesMciCriminalSearchResults } from '../constants/fines-mci-criminal-search-results.constant';

export interface IFinesMciCriminalAccountsResult {
  results: FinesMciCriminalSearchResults;
  response: IFinesMciCriminalAccountsResponse | null;
}
