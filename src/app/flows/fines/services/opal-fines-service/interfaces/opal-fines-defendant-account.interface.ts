export interface IOpalFinesDefendantAccountAlias {
  alias_number: number | null;
  organisation_name: string | null;
  surname: string | null;
  forenames: string | null;
}

export interface IOpalFinesDefendantAccount {
  defendant_account_id: number | null;
  account_number: string | null;
  organisation_flag: boolean | null;
  aliases: IOpalFinesDefendantAccountAlias[] | null;
  address_line_1: string | null;
  postcode: string | null;
  business_unit_name: string | null;
  business_unit_id: string | null;
  prosecutor_case_reference: string | null;
  last_enforcement_action: string | null;
  account_balance: number | null;
  organisation_name: string | null;
  defendant_title: string | null;
  defendant_firstnames: string | null;
  defendant_surname: string | null;
  birth_date: string | null;
  national_insurance_number: string | null;
  parent_guardian_surname: string | null;
  parent_guardian_firstnames: string | null;
}

export interface IOpalFinesDefendantAccountResponse {
  count: number;
  defendant_accounts: IOpalFinesDefendantAccount[];
}

export interface IOpalFinesDefendantAccountOrganisationAlias {
  alias_id: string;
  sequence_number: number;
  organisation_name: string;
}

export interface IOpalFinesDefendantAccountIndividualAlias {
  alias_id: string;
  sequence_number: number;
  surname: string;
  forenames: string | null;
}

export interface IOpalFinesDefendantAccountIndividualDetails {
  title: string | null;
  forenames: string | null;
  surname: string;
  date_of_birth: string | null;
  age: string | null;
  national_insurance_number: string | null;
  individual_aliases: IOpalFinesDefendantAccountIndividualAlias[] | null;
}

export interface IOpalFinesDefendantAccountOrganisationDetails {
  organisation_name: string;
  organisation_aliases: IOpalFinesDefendantAccountOrganisationAlias[] | null;
}

export interface IOpalFinesDefendantAccountAddress {
  address_line_1: string;
  address_line_2: string | null;
  address_line_3: string | null;
  address_line_4: string | null;
  address_line_5: string | null;
  postcode: string | null;
}

export interface IOpalFinesDefendantAccountLanguagePreferences {
  document_language_preference: IOpalFinesDefendantAccountLanguagePreference | null;
  hearing_language_preference: IOpalFinesDefendantAccountLanguagePreference | null;
}

export interface IOpalFinesDefendantAccountLanguagePreference {
  language_code: 'CY' | 'EN';
  language_display_name: 'Welsh and English' | 'English only';
}

export interface IOpalFinesDefendantAccountInstalmentPeriod {
  instalment_period_code: 'W' | 'M' | 'F';
  instalment_period_display_name: 'Weekly' | 'Monthly' | 'Fortnightly';
}

export interface IOpalFinesDefendantAccountEnforcer {
  enforcer_id: number;
  enforcer_name: string;
}

export interface IOpalFinesDefendantAccountLja {
  lja_id: number | null;
  lja_name: string | null;
}

export interface IOpalFinesDefendantAccountEnforcementOverrideResult {
  enforcement_override_result_id: string;
  enforcement_override_result_title: string;
}

export interface IOpalFinesDefendantAccountEnforcementOverride {
  enforcement_override_result: IOpalFinesDefendantAccountEnforcementOverrideResult;
  enforcer: IOpalFinesDefendantAccountEnforcer | null;
  lja: IOpalFinesDefendantAccountLja | null;
}

export interface IOpalFinesDefendantAccountNotes {
  account_comment: string | null;
  free_text_note_1: string | null;
  free_text_note_2: string | null;
  free_text_note_3: string | null;
}

export interface IOpalFinesDefendantAccountEnforcementAction {
  last_enforcement_action_id: string;
  last_enforcement_action_title: string;
}

export interface IOpalFinesDefendantAccountEnforcementStatus {
  last_enforcement_action: IOpalFinesDefendantAccountEnforcementAction | null;
  collection_order_made: boolean;
  default_days_in_jail: number | null;
  enforcement_override: IOpalFinesDefendantAccountEnforcementOverride | null;
  last_movement_date: string | null;
}

export interface IOpalFinesDefendantAccountPartyDetails {
  party_id: string;
  organisation_flag: boolean;
  organisation_details: IOpalFinesDefendantAccountOrganisationDetails | null;
  individual_details: IOpalFinesDefendantAccountIndividualDetails | null;
}

export interface IOpalFinesDefendantAccountPaymentTermsType {
  payment_terms_type_code: 'B' | 'P' | 'I';
  payment_terms_type_display_name: 'By date' | 'Paid' | 'Instalments';
}

export interface IOpalFinesDefendantAccountPaymentTermsSummary {
  payment_terms_type: IOpalFinesDefendantAccountPaymentTermsType;
  effective_date: string | null;
  instalment_period: IOpalFinesDefendantAccountInstalmentPeriod | null;
  lump_sum_amount: number | null;
  instalment_amount: number | null;
}

export interface IOpalFinesDefendantAccountContactDetails {
  primary_email_address: string | null;
  secondary_email_address: string | null;
  mobile_telephone_number: string | null;
  home_telephone_number: string | null;
  work_telephone_number: string | null;
}

export interface IOpalFinesDefendantAccountVehicleDetails {
  vehicle_registration: string | null;
  vehicle_make_and_model: string | null;
}

export interface IOpalFinesDefendantAccountEmployerDetails {
  employer_name: string | null;
  employer_reference: string | null;
  employer_email_address: string | null;
  employer_telephone_number: string | null;
  employer_address: IOpalFinesDefendantAccountAddress | null;
}

export interface IOpalFinesDefendantAccountOrganisationAlias {
  alias_id: string;
  sequence_number: number;
  organisation_name: string;
}

export interface IOpalFinesDefendantAccountIndividualAlias {
  alias_number: string;
  sequence_number: number;
  alias_surname: string;
  alias_forenames: string | null;
}

export interface IOpalFinesDefendantAccountIndividualDetails {
  title: string | null;
  forenames: string | null;
  surname: string;
  date_of_birth: string | null;
  age: string | null;
  national_insurance_number: string | null;
  individual_aliases: IOpalFinesDefendantAccountIndividualAlias[] | null;
}

export interface IOpalFinesDefendantAccountOrganisationDetails {
  organisation_name: string;
  organisation_aliases: IOpalFinesDefendantAccountOrganisationAlias[] | null;
}

export interface IOpalFinesDefendantAccountAddress {
  address_line_1: string;
  address_line_2: string | null;
  address_line_3: string | null;
  address_line_4: string | null;
  address_line_5: string | null;
  postcode: string | null;
}

export interface IOpalFinesDefendantAccountLanguagePreferences {
  document_language_preference: IOpalFinesDefendantAccountLanguagePreference | null;
  hearing_language_preference: IOpalFinesDefendantAccountLanguagePreference | null;
}

export interface IOpalFinesDefendantAccountLanguagePreference {
  language_code: 'CY' | 'EN';
  language_display_name: 'Welsh and English' | 'English only';
}

export interface IOpalFinesDefendantAccountInstalmentPeriod {
  instalment_period_code: 'W' | 'M' | 'F';
  instalment_period_display_name: 'Weekly' | 'Monthly' | 'Fortnightly';
}

export interface IOpalFinesDefendantAccountEnforcer {
  enforcer_id: number;
  enforcer_name: string;
}

export interface IOpalFinesDefendantAccountLja {
  lja_id: number | null;
  lja_name: string | null;
}

export interface IOpalFinesDefendantAccountEnforcementOverrideResult {
  enforcement_override_result_id: string;
  enforcement_override_result_title: string;
}

export interface IOpalFinesDefendantAccountEnforcementOverride {
  enforcement_override_result: IOpalFinesDefendantAccountEnforcementOverrideResult;
  enforcer: IOpalFinesDefendantAccountEnforcer | null;
  lja: IOpalFinesDefendantAccountLja | null;
}

export interface IOpalFinesDefendantAccountNotes {
  account_comment: string | null;
  free_text_note_1: string | null;
  free_text_note_2: string | null;
  free_text_note_3: string | null;
}

export interface IOpalFinesDefendantAccountEnforcementAction {
  last_enforcement_action_id: string;
  last_enforcement_action_title: string;
}

export interface IOpalFinesDefendantAccountEnforcementStatus {
  last_enforcement_action: IOpalFinesDefendantAccountEnforcementAction | null;
  collection_order_made: boolean;
  default_days_in_jail: number | null;
  enforcement_override: IOpalFinesDefendantAccountEnforcementOverride | null;
  last_movement_date: string | null;
}

export interface IOpalFinesDefendantAccountPartyDetails {
  party_id: string;
  organisation_flag: boolean;
  organisation_details: IOpalFinesDefendantAccountOrganisationDetails | null;
  individual_details: IOpalFinesDefendantAccountIndividualDetails | null;
}

export interface IOpalFinesDefendantAccountPaymentTermsType {
  payment_terms_type_code: 'B' | 'P' | 'I';
  payment_terms_type_display_name: 'By date' | 'Paid' | 'Instalments';
}

export interface IOpalFinesDefendantAccountPaymentTermsSummary {
  payment_terms_type: IOpalFinesDefendantAccountPaymentTermsType;
  effective_date: string | null;
  instalment_period: IOpalFinesDefendantAccountInstalmentPeriod | null;
  lump_sum_amount: number | null;
  instalment_amount: number | null;
}

export interface IOpalFinesDefendantAccountContactDetails {
  primary_email_address: string | null;
  secondary_email_address: string | null;
  mobile_telephone_number: string | null;
  home_telephone_number: string | null;
  work_telephone_number: string | null;
}

export interface IOpalFinesDefendantAccountVehicleDetails {
  vehicle_registration: string | null;
  vehicle_make_and_model: string | null;
}

export interface IOpalFinesDefendantAccountEmployerDetails {
  employer_name: string | null;
  employer_reference: string | null;
  employer_email_address: string | null;
  employer_telephone_number: string | null;
  employer_address: IOpalFinesDefendantAccountAddress | null;
}
