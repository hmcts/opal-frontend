export interface IOpalFinesDraftAccountParams {
  source?: 'MAC' | 'CPP' | 'VPFPO';
  businessUnitIds?: number[];
  statuses?: string[];
  submittedBy?: string[];
  notSubmittedBy?: string[];
  accountStatusDateFrom?: string[];
  accountStatusDateTo?: string[];
}
