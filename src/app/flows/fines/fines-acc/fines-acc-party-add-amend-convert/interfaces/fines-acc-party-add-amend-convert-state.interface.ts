import { IFinesAccPartyAddAmendConvertIndividualAliasState } from './fines-acc-party-add-amend-convert-individual-alias-state.interface';
import { IFinesAccPartyAddAmendConvertOrganisationAliasState } from './fines-acc-party-add-amend-convert-organisation-alias-state.interface';

export interface IFinesAccPartyAddAmendConvertState {
  // Organisation/Company fields
  facc_party_add_amend_convert_organisation_name: string | null;

  // Individual fields
  facc_party_add_amend_convert_title: string | null;
  facc_party_add_amend_convert_forenames: string | null;
  facc_party_add_amend_convert_surname: string | null;
  facc_party_add_amend_convert_dob: string | null;
  facc_party_add_amend_convert_national_insurance_number: string | null;

  // Alias fields - separated by type
  facc_party_add_amend_convert_individual_aliases: IFinesAccPartyAddAmendConvertIndividualAliasState[];
  facc_party_add_amend_convert_organisation_aliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[];
  facc_party_add_amend_convert_add_alias: boolean | null;
  facc_party_add_amend_convert_address_line_1: string | null;
  facc_party_add_amend_convert_address_line_2: string | null;
  facc_party_add_amend_convert_address_line_3: string | null;
  facc_party_add_amend_convert_post_code: string | null;
  facc_party_add_amend_convert_contact_email_address_1: string | null;
  facc_party_add_amend_convert_contact_email_address_2: string | null;
  facc_party_add_amend_convert_contact_telephone_number_mobile: string | null;
  facc_party_add_amend_convert_contact_telephone_number_home: string | null;
  facc_party_add_amend_convert_contact_telephone_number_business: string | null;
  facc_party_add_amend_convert_vehicle_make: string | null;
  facc_party_add_amend_convert_vehicle_registration_mark: string | null;
  facc_party_add_amend_convert_language_preferences_document_language: string | null;
  facc_party_add_amend_convert_language_preferences_hearing_language: string | null;
  facc_party_add_amend_convert_employer_company_name: string | null;
  facc_party_add_amend_convert_employer_reference: string | null;
  facc_party_add_amend_convert_employer_email_address: string | null;
  facc_party_add_amend_convert_employer_telephone_number: string | null;
  facc_party_add_amend_convert_employer_address_line_1: string | null;
  facc_party_add_amend_convert_employer_address_line_2: string | null;
  facc_party_add_amend_convert_employer_address_line_3: string | null;
  facc_party_add_amend_convert_employer_address_line_4: string | null;
  facc_party_add_amend_convert_employer_address_line_5: string | null;
  facc_party_add_amend_convert_employer_post_code: string | null;
}
