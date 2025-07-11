export interface IOpalFinesDraftAccountsResponse {
  count: number;
  summaries: IOpalFinesDraftAccountsSummary[];
}
export interface IOpalFinesDraftAccountsSummary {
  draft_account_id: number;
  created_at: string;
  submitted_by: string;
  business_unit_id: number;
  account_snapshot: IOpalFinesAccountSnapshot;
  account_type: string;
  account_status: string;
  account_status_date: string;
  account_number: string;
}

interface IOpalFinesAccountSnapshot {
  account_type: string;
  created_date: string;
  submitted_by: string;
  defendant_name: string;
  submitted_by_name: string;
  business_unit_name: string;
  date_of_birth: string | null;
}
