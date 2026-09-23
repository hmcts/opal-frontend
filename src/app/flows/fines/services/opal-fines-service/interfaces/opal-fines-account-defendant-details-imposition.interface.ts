import { IOpalFinesCompanyName } from './opal-fines-company-name.interface';
import { IOpalFinesIndividualName } from './opal-fines-individual-name.interface';

interface IOpalFinesAccountDefendantDetailsImpositionResult {
  result_id: string | null;
  result_title: string | null;
}

interface IOpalFinesAccountDefendantDetailsImpositionCreditor {
  creditor_account_id: number;
  creditor_account_type: {
    account_type: string;
    display_name?: string | null;
  };
  major_creditor_name?: string | null;
  minor_creditor_organisation_flag?: boolean | null;
  individual_name?: IOpalFinesIndividualName | null;
  company_name?: IOpalFinesCompanyName | null;
  major_creditor_id: number | null;
  minor_creditor_party_id: number | null;
}

interface IOpalFinesAccountDefendantDetailsImpositionOffence {
  offence_id?: number | null;
  cjs_code?: string | null;
  offence_title: string;
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
