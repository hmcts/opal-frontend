interface IOpalFinesAccountDefendantDetailsImpositionResult {
  result_id: string | null;
  result_title: string | null;
}

interface IOpalFinesAccountDefendantDetailsImpositionCreditor {
  creditor_account_id: number;
  account_type: string;
  display_name: string;
  major_creditor_id: number | null;
  minor_creditor_party_id: number | null;
  name: string;
}

interface IOpalFinesAccountDefendantDetailsImpositionOffence {
  id: number | null;
  code: string | null;
  title: string;
}

interface IOpalFinesAccountDefendantDetailsImpositionCourt {
  court_id: number;
  court_code: number | null;
  court_name: string;
}

export interface IOpalFinesAccountDefendantDetailsImposition {
  date_added: string | null;
  imposition: IOpalFinesAccountDefendantDetailsImpositionResult;
  creditor: IOpalFinesAccountDefendantDetailsImpositionCreditor;
  imposed_amount: number;
  paid_amount: number;
  balance: number;
  date_imposed: string | null;
  offence: IOpalFinesAccountDefendantDetailsImpositionOffence;
  imposed_by: IOpalFinesAccountDefendantDetailsImpositionCourt | null;
  imposition_id: number;
}
