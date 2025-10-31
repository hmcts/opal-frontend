import { IFinesAccPartyAddAmendConvertForm } from '../interfaces/fines-acc-party-add-amend-convert-form.interface';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_STATE_MOCK } from './fines-acc-party-add-amend-convert-state.mock';

export const MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA: IFinesAccPartyAddAmendConvertForm = {
  formData: {
    facc_party_add_amend_convert_organisation_name: null,
    facc_party_add_amend_convert_title: 'Mr',
    facc_party_add_amend_convert_forenames: 'John',
    facc_party_add_amend_convert_surname: 'Doe',
    facc_party_add_amend_convert_individual_aliases: [],
    facc_party_add_amend_convert_organisation_aliases: [],
    facc_party_add_amend_convert_add_alias: false,
    facc_party_add_amend_convert_dob: '1990-01-01',
    facc_party_add_amend_convert_national_insurance_number: 'AB123456C',
    facc_party_add_amend_convert_address_line_1: '123 Test Street',
    facc_party_add_amend_convert_address_line_2: null,
    facc_party_add_amend_convert_address_line_3: null,
    facc_party_add_amend_convert_post_code: 'TE5T 1NG',
    facc_party_add_amend_convert_contact_email_address_1: 'john@example.com',
    facc_party_add_amend_convert_contact_email_address_2: null,
    facc_party_add_amend_convert_contact_telephone_number_mobile: '07123456789',
    facc_party_add_amend_convert_contact_telephone_number_home: null,
    facc_party_add_amend_convert_contact_telephone_number_business: null,
    facc_party_add_amend_convert_vehicle_make: 'Toyota Corolla',
    facc_party_add_amend_convert_vehicle_registration_mark: 'ABC123',
    facc_party_add_amend_convert_language_preferences_document_language: null,
    facc_party_add_amend_convert_language_preferences_hearing_language: null,
    facc_party_add_amend_convert_employer_company_name: 'Test Company',
    facc_party_add_amend_convert_employer_reference: 'EMP123',
    facc_party_add_amend_convert_employer_email_address: 'hr@company.com',
    facc_party_add_amend_convert_employer_telephone_number: '01234567890',
    facc_party_add_amend_convert_employer_address_line_1: '456 Business Park',
    facc_party_add_amend_convert_employer_address_line_2: null,
    facc_party_add_amend_convert_employer_address_line_3: null,
    facc_party_add_amend_convert_employer_address_line_4: null,
    facc_party_add_amend_convert_employer_address_line_5: null,
    facc_party_add_amend_convert_employer_post_code: 'BU5 1NE',
  },
  nestedFlow: false,
};

export const MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA_WITH_ALIASES: IFinesAccPartyAddAmendConvertForm = {
  formData: {
    ...MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
    facc_party_add_amend_convert_individual_aliases: [
      {
        facc_party_add_amend_convert_alias_forenames_0: 'Johnny',
        facc_party_add_amend_convert_alias_surname_0: 'Doe',
      },
    ],
    facc_party_add_amend_convert_add_alias: true, // Checkbox should be checked when aliases exist
  },
  nestedFlow: false,
};

export const MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA: IFinesAccPartyAddAmendConvertForm = {
  formData: {
    ...FINES_ACC_PARTY_ADD_AMEND_CONVERT_STATE_MOCK,
    facc_party_add_amend_convert_add_alias: false,
  },
  nestedFlow: false,
};
