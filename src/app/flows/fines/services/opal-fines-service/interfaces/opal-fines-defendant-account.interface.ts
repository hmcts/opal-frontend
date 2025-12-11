import type { AddressDetailsCommon } from './generated/opal-fines-address-details-common.interface';
import type { CommentsAndNotesCommon } from './generated/opal-fines-comments-and-notes-common.interface';
import type { ContactDetailsCommon } from './generated/opal-fines-contact-details-common.interface';
import type { EmployerDetailsCommon } from './generated/opal-fines-employer-details-common.interface';
import type { EnforcementOverrideCommon } from './generated/opal-fines-enforcement-override-common.interface';
import type { EnforcementOverrideResultReferenceCommon } from './generated/opal-fines-enforcement-override-result-reference-common.interface';
import type { EnforcementStatusSummaryCommon } from './generated/opal-fines-enforcement-status-summary-common.interface';
import type { EnforcerReferenceCommon } from './generated/opal-fines-enforcer-reference-common.interface';
import type { IndividualAliasCommon } from './generated/opal-fines-individual-alias-common.interface';
import type { IndividualDetailsCommon } from './generated/opal-fines-individual-details-common.interface';
import type { InstalmentPeriodCommon } from './generated/opal-fines-instalment-period-common.interface';
import type { LanguagePreferenceCommon } from './generated/opal-fines-language-preference-common.interface';
import type { LanguagePreferencesCommon } from './generated/opal-fines-language-preferences-common.interface';
import type { LastEnforcementActionCommon } from './generated/opal-fines-last-enforcement-action-common.interface';
import type { LjaReferenceCommon } from './generated/opal-fines-lja-reference-common.interface';
import type { OrganisationAliasCommon } from './generated/opal-fines-organisation-alias-common.interface';
import type { OrganisationDetailsCommon } from './generated/opal-fines-organisation-details-common.interface';
import type { PartyDetailsCommon } from './generated/opal-fines-party-details-common.interface';
import type { PaymentTermsSummaryCommon } from './generated/opal-fines-payment-terms-summary-common.interface';
import type { PaymentTermsTypeCommon } from './generated/opal-fines-payment-terms-type-common.interface';
import type { VehicleDetailsCommon } from './generated/opal-fines-vehicle-details-common.interface';
import type { InstalmentPeriodCommonInstalmentPeriodCodeEnum } from '../types/opal-fines-instalment-period-common-instalment-period-code-enum.type';
import type { PaymentTermsTypeCommonPaymentTermsTypeCodeEnum } from '../types/opal-fines-payment-terms-type-common-payment-terms-type-code-enum.type';

export interface IOpalFinesDefendantAccountAlias {
  alias_id?: string;
  sequence_number?: number;
  alias_number?: number | null;
  organisation_name?: string | null;
  surname?: string | null;
  forenames?: string | null;
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

export type IOpalFinesDefendantAccountOrganisationAlias = OrganisationAliasCommon;

export type IOpalFinesDefendantAccountIndividualAlias = IndividualAliasCommon;

export type IOpalFinesDefendantAccountIndividualDetails = IndividualDetailsCommon;

export type IOpalFinesDefendantAccountOrganisationDetails = OrganisationDetailsCommon;

export type IOpalFinesDefendantAccountAddress = AddressDetailsCommon;

export interface IOpalFinesDefendantAccountLanguagePreference extends LanguagePreferenceCommon {
  language_display_name: 'Welsh and English' | 'English only';
}

export interface IOpalFinesDefendantAccountLanguagePreferences extends LanguagePreferencesCommon {
  document_language_preference: IOpalFinesDefendantAccountLanguagePreference | null;
  hearing_language_preference: IOpalFinesDefendantAccountLanguagePreference | null;
}

export interface IOpalFinesDefendantAccountInstalmentPeriod extends InstalmentPeriodCommon {
  instalment_period_code: (typeof InstalmentPeriodCommonInstalmentPeriodCodeEnum)[keyof typeof InstalmentPeriodCommonInstalmentPeriodCodeEnum];
  instalment_period_display_name: 'Weekly' | 'Monthly' | 'Fortnightly';
}

export type IOpalFinesDefendantAccountEnforcer = EnforcerReferenceCommon;

export type IOpalFinesDefendantAccountLja = LjaReferenceCommon;

export interface IOpalFinesDefendantAccountEnforcementOverrideResult extends EnforcementOverrideResultReferenceCommon {
  enforcement_override_result_title: string;
}

export interface IOpalFinesDefendantAccountEnforcementOverride
  extends Omit<EnforcementOverrideCommon, 'enforcement_override_result' | 'enforcer' | 'lja'> {
  enforcement_override_result: IOpalFinesDefendantAccountEnforcementOverrideResult;
  enforcer: IOpalFinesDefendantAccountEnforcer | null;
  lja: IOpalFinesDefendantAccountLja | null;
}

export type IOpalFinesDefendantAccountNotes = CommentsAndNotesCommon;

export type IOpalFinesDefendantAccountEnforcementAction = LastEnforcementActionCommon;

export interface IOpalFinesDefendantAccountEnforcementStatus
  extends Omit<EnforcementStatusSummaryCommon, 'enforcement_override'> {
  enforcement_override: IOpalFinesDefendantAccountEnforcementOverride | null;
}

export type IOpalFinesDefendantAccountPartyDetails = PartyDetailsCommon;

export interface IOpalFinesDefendantAccountPaymentTermsType extends PaymentTermsTypeCommon {
  payment_terms_type_code: (typeof PaymentTermsTypeCommonPaymentTermsTypeCodeEnum)[keyof typeof PaymentTermsTypeCommonPaymentTermsTypeCodeEnum];
  payment_terms_type_display_name: 'By date' | 'Paid' | 'Instalments';
}

export interface IOpalFinesDefendantAccountPaymentTermsSummary
  extends Omit<PaymentTermsSummaryCommon, 'payment_terms_type' | 'instalment_period'> {
  payment_terms_type: IOpalFinesDefendantAccountPaymentTermsType;
  instalment_period: IOpalFinesDefendantAccountInstalmentPeriod | null;
}

export type IOpalFinesDefendantAccountContactDetails = ContactDetailsCommon;

export type IOpalFinesDefendantAccountVehicleDetails = VehicleDetailsCommon;

export interface IOpalFinesDefendantAccountEmployerDetails extends Omit<EmployerDetailsCommon, 'employer_address'> {
  employer_address: IOpalFinesDefendantAccountAddress | null;
}
