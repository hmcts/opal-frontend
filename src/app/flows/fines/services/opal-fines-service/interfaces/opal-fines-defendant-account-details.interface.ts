export interface IOpalFinesDefendantAccountDetails {
  defendant_account_id: number;
  account_number: string;
  full_name: string;
  account_ct: string;
  business_unit_id: number;
  address: string;
  post_code: string;
  dob: string | null;
  details_changed: string;
  last_court_app_and_court_code: string;
  last_movement: string;
  comment_field: string[] | null;
  pcr: string;
  payment_details: string | null;
  lump_sum: null | number;
  commencing: string | null;
  days_in_default: number | null;
  sentenced_date: string | null;
  last_enforcement: string;
  override: string;
  enforcer: number;
  enforcement_court: number;
  imposed: number;
  amount_paid: number;
  balance: number;
}
