export interface IOpalFinesSearchDefendantAccount {
  account_no: string;
  name: string;
  date_of_birth: string;
  address_line_1: string;
  balance: number;
  court: string;
  defendant_account_id: number;
}
export interface IOpalFinesSearchDefendantAccounts {
  count: number;
  total_count: number;
  cursor: number;
  page_size: number;
  search_results: IOpalFinesSearchDefendantAccount[];
}
