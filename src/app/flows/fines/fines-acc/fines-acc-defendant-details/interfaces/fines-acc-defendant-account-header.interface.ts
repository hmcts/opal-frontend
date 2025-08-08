export interface IOpalFinesDefendantAccountHeader {
  version: number;
  defendant_account_id: string;
  account_number: string;
  has_parent_guardian: boolean;
  debtor_type: string;
  organisation: boolean;
  account_status_display_name: string;
  account_type: string;
  prosecutor_case_reference: string | null;
  fixed_penalty_ticket_number: string | null;
  business_unit_name: string;
  business_unit_id: string;
  business_unit_code: string;
  imposed: number;
  arrears: number;
  paid: number;
  written_off: number;
  account_balance: number;
  // organisaton = false
  is_youth: boolean | null;
  title: string | null;
  firstnames: string | null;
  surname: string | null;
  // organisation = true
  organisation_name: string | null;
  // attained during resolver
  business_unit_user_id: string | null;
}
