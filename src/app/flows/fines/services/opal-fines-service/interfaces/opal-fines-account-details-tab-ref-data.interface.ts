export interface IOpalFinesAccountDetailsAtAGlanceTabRefData {
  version: number | undefined;
  defendant_account_id: string;
  account_number: string;
  debtor_detail: {
    debtor_type: string;
    organisation: boolean;
    address_line_1: string;
    address_line_2: string | null;
    address_line_3: string | null;
    address_line_4: string | null;
    address_line_5: string | null;
    post_code: string;
    document_language: string;
    hearing_language: string;
    // organisation flag true
    organisation_name: string | null;
    organisation_aliases:
      | {
          alias_id: string;
          sequence_number: number;
          organisation_name: string | null;
        }[]
      | null;
    // organisation flag false
    title: string | null;
    first_names: string | null;
    surname: string | null;
    date_of_birth: string | null;
    national_insurance_number: string | null;
    individual_aliases:
      | {
          alias_id: string;
          sequence_number: number;
          surname: string | null;
          forenames: string | null;
        }[]
      | null;
  };
  payment_terms: {
    payment_terms_summary: string | null;
    payment_terms_type_code: 'By date' | 'Paid' | 'Instalments';
    effective_date: string | null;
    instalment_period: 'Weekly' | 'Fortnightly' | 'Monthly' | null;
    lump_sum_amount: number | null;
    instalment_amount: number | null;
    last_payment_date: string | null;
    next_payment_date: string | null;
  };
  enforcement_status: {
    last_enforcement_action: string | null;
    last_enforcement_action_title: string | null;
    collection_order_made: boolean;
    default_days_in_jail: number | null;
    enforcement_override_id: string | null;
    enforcement_override_title: string | null;
    last_movement_date: string | null;
  };
  account_notes: {
    account_comment: string | null;
    free_text_note_1: string | null;
    free_text_note_2: string | null;
    free_text_note_3: string | null;
  };
}
