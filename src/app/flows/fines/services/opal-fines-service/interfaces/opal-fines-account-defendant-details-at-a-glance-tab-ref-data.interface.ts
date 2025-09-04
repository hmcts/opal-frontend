interface IOpalFinesDefendantAccountOrganisationAlias {
  alias_id: string;
  sequence_number: number;
  organisation_name: string;
}

interface IOpalFinesDefendantAccountIndividualAlias {
  alias_number: number;
  organisation_name: string;
  alias_surname: string;
  alias_forenames: string | null;
}

interface IOpalFinesDefendantAccountIndividualDetails {
  title: string | null;
  forenames: string | null;
  surname: string;
  date_of_birth: string | null;
  age: string | null;
  national_insurance_number: string | null;
  individual_aliases: IOpalFinesDefendantAccountIndividualAlias[] | null;
}

interface IOpalFinesDefendantAccountOrganisationDetails {
  organisation_name: string;
  organisation_aliases: IOpalFinesDefendantAccountOrganisationAlias[] | null;
}

interface IOpalFinesDefendantAccountAddress {
  address_line_1: string;
  address_line_2: string | null;
  address_line_3: string | null;
  address_line_4: string | null;
  address_line_5: string | null;
  post_code: string | null;
}

interface IOpalFinesDefendantAccountLanguagePreferences {
  document_language: IOpalFinesDefendantAccountLanguagePreference | null;
  hearing_language: IOpalFinesDefendantAccountLanguagePreference | null;
}

interface IOpalFinesDefendantAccountLanguagePreference {
  language_code: 'CY' | 'EN';
  language_display_name: 'Welsh and English' | 'English only';
}

interface IOpalFinesDefendantAccountInstalmentPeriod {
  installment_period_code: 'W' | 'M' | 'F';
  installment_period_display_name: 'Weekly' | 'Monthly' | 'Fortnightly';
}

interface IOpalFinesDefendantAccountEnforcer {
  enforcer_id: number;
  enforcer_name: string;
}

interface IOpalFinesDefendantAccountLja {
  lja_id: number | null;
  lja_name: string | null;
}

interface IOpalFinesDefendantAccountEnforcementOverrideResult {
  enforcement_override_result_id: string;
  enforcement_override_result_title: string;
}

interface IOpalFinesDefendantAccountEnforcementOverride {
  enforcement_override_result: IOpalFinesDefendantAccountEnforcementOverrideResult;
  enforcer: IOpalFinesDefendantAccountEnforcer | null;
  lja: IOpalFinesDefendantAccountLja | null;
}

interface IOpalFinesDefendantAccountNotes {
  account_comment: string | null;
  free_text_note_1: string | null;
  free_text_note_2: string | null;
  free_text_note_3: string | null;
}

interface IOpalFinesDefendantAccountEnforcementAction {
  enforcement_action_id: string;
  enforcement_action_title: string;
}

interface IOpalFinesDefendantAccountEnforcementStatus {
  last_enforcement_action: IOpalFinesDefendantAccountEnforcementAction | null;
  collection_order_made: boolean;
  default_days_in_jail: number | null;
  enforcement_override: IOpalFinesDefendantAccountEnforcementOverride | null;
  last_movement_date: string | null;
}

interface IOpalFinesDefendantAccountPartyDetails {
  party_id: string;
  organisation_flag: boolean;
  organisation_details: IOpalFinesDefendantAccountOrganisationDetails | null;
  individual_details: IOpalFinesDefendantAccountIndividualDetails | null;
}

interface IOpalFinesDefendantAccountPaymentTermsType {
  payment_terms_type_code: 'B' | 'P' | 'I';
  payment_terms_type_display_name: 'By date' | 'Paid' | 'Instalments';
}

interface IOpalFinesDefendantAccountPaymentTermsSummary {
  payment_terms_type: IOpalFinesDefendantAccountPaymentTermsType;
  effective_date: string | null;
  instalment_period: IOpalFinesDefendantAccountInstalmentPeriod | null;
  lump_sum_amount: number | null;
  instalment_amount: number | null;
}

export interface IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData {
  version: number;
  defendant_account_id: string;
  account_number: string;
  debtor_type: string;
  is_youth: boolean;
  party_details: IOpalFinesDefendantAccountPartyDetails;
  address: IOpalFinesDefendantAccountAddress;
  language_preferences: IOpalFinesDefendantAccountLanguagePreferences | null;
  payment_terms: IOpalFinesDefendantAccountPaymentTermsSummary;
  enforcement_status: IOpalFinesDefendantAccountEnforcementStatus;
  comment_and_notes: IOpalFinesDefendantAccountNotes | null;
}
