import { IFinesAccDebtorAddAmendAliasState } from './fines-acc-debtor-add-amend-alias-state.interface';

export interface IFinesAccDebtorAddAmendState {
  facc_debtor_add_amend_title: string | null;
  facc_debtor_add_amend_forenames: string | null;
  facc_debtor_add_amend_surname: string | null;
  facc_debtor_add_amend_aliases: IFinesAccDebtorAddAmendAliasState[];
  facc_debtor_add_amend_add_alias: boolean | null;
  facc_debtor_add_amend_dob: string | null;
  facc_debtor_add_amend_national_insurance_number: string | null;
  facc_debtor_add_amend_address_line_1: string | null;
  facc_debtor_add_amend_address_line_2: string | null;
  facc_debtor_add_amend_address_line_3: string | null;
  facc_debtor_add_amend_post_code: string | null;
  facc_debtor_add_amend_contact_email_address_1: string | null;
  facc_debtor_add_amend_contact_email_address_2: string | null;
  facc_debtor_add_amend_contact_telephone_number_mobile: string | null;
  facc_debtor_add_amend_contact_telephone_number_home: string | null;
  facc_debtor_add_amend_contact_telephone_number_business: string | null;
  facc_debtor_add_amend_vehicle_make: string | null;
  facc_debtor_add_amend_vehicle_registration_mark: string | null;
  facc_debtor_add_amend_language_preferences_document_language: string | null;
  facc_debtor_add_amend_language_preferences_hearing_language: string | null;
  facc_debtor_add_amend_employer_details_employer_company_name: string | null;
  facc_debtor_add_amend_employer_details_employer_reference: string | null;
  facc_debtor_add_amend_employer_details_employer_email_address: string | null;
  facc_debtor_add_amend_employer_details_employer_telephone_number: string | null;
  facc_debtor_add_amend_employer_details_employer_address_line_1: string | null;
  facc_debtor_add_amend_employer_details_employer_address_line_2: string | null;
  facc_debtor_add_amend_employer_details_employer_address_line_3: string | null;
  facc_debtor_add_amend_employer_details_employer_address_line_4: string | null;
  facc_debtor_add_amend_employer_details_employer_address_line_5: string | null;
  facc_debtor_add_amend_employer_details_employer_post_code: string | null;
}
