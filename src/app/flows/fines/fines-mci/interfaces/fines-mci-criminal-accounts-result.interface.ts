import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';
import { FinesMciCriminalSearchResults } from '../constants/fines-mci-criminal-search-results.constant';

export interface IFinesMciCriminalAccountsResult {
  results: FinesMciCriminalSearchResults;
  response: IOpalFinesDefendantAccountResponse | null;
}
