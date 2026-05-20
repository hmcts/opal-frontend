import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountDefendantDetailsImpositionResult {
  result_id: string | null;
  result_title: string | null;
}

export interface IOpalFinesAccountDefendantDetailsImpositionCreditor {
  creditor_account_id: number;
  account_type: string;
  display_name: string;
  major_creditor_id: number | null;
  minor_creditor_party_id: number | null;
  name: string;
}

export interface IOpalFinesAccountDefendantDetailsImpositionOffence {
  id: number | null;
  code: string | null;
  title: string;
}

export interface IOpalFinesAccountDefendantDetailsImpositionCourt {
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

export interface IOpalFinesAccountDefendantDetailsImpositionsTabRefData extends IOpalFinesVersion {
  impositions: IOpalFinesAccountDefendantDetailsImposition[];
}
