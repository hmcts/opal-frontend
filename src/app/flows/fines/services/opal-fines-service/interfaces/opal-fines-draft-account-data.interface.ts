import { IOpalFinesDraftAccountsSummary } from './opal-fines-draft-accounts-summary.interface';

export interface IOpalFinesDraftAccountsResponse {
  count: number;
  summaries: IOpalFinesDraftAccountsSummary[];
}
