export interface IOpalFinesDraftAccountParams {
  businessUnitIds: number[] | null;
  statuses: string[] | null;
  submittedBy: string[] | null;
  notSubmittedBy: string[] | null;
  accountStatusDateFrom: string[] | null;
  accountStatusDateTo: string[] | null;
}
