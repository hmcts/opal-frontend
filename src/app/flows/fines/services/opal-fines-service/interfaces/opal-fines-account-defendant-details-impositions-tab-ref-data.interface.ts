import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountDefendantDetailsImposition {
  posted_date: string | null;
  result_id: string | null;
  creditor_account_id: number | null;
  creditor_account_type: string | null;
  creditor_name: string | null;
  imposed_amount: number;
  paid_amount: number;
  imposed_date: string | null;
  offence_title: string | null;
  imposing_court_id: number | null;
  imposing_court_name: string | null;
  imposition_id: string;
}

export interface IOpalFinesAccountDefendantDetailsImpositionsTabRefData extends IOpalFinesVersion {
  impositions: IOpalFinesAccountDefendantDetailsImposition[];
}
