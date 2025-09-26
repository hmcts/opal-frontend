import { IOpalFinesDefendantAccountAlias } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

export interface IOpalFinesAccountDefendantDetailsHeader {
  version: string | null;
  account_number: string;
  defendant_party_id: string;
  parent_guardian_party_id: string | null;
  account_status_reference: {
    account_status_code: string;
    account_status_display_name: string;
  };
  account_type: string | null;
  prosecutor_case_reference: string | null;
  fixed_penalty_ticket_number: string | null;
  business_unit_summary: {
    business_unit_id: string;
    business_unit_name: string;
    welsh_speaking: string;
  };
  payment_state_summary: {
    imposed_amount: number;
    arrears_amount: number;
    paid_amount: number;
    account_balance: number;
  };
  party_details: {
    party_id: string;
    organisation_flag: boolean;
    organisation_details: {
      organisation_name: string;
      organisation_aliases: IOpalFinesDefendantAccountAlias[] | null;
    } | null;
    individual_details: {
      title: string | null;
      forenames: string | null;
      surname: string;
      date_of_birth: string | null;
      age: string | null;
      national_insurance_number: string | null;
      individual_aliases: IOpalFinesDefendantAccountAlias[] | null;
    } | null;
  };
  is_youth: boolean; // not in response
  debtor_type: 'Defendant' | 'Parent/Guardian';
}
