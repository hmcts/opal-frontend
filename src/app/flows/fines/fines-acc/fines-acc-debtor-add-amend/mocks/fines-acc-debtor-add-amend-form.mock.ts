import {
  IFinesAccDebtorAddAmendForm,
  IFinesAccDebtorAddAmendFormData,
} from '../interfaces/fines-acc-debtor-add-amend-form.interface';

export const FINES_ACC_DEBTOR_ADD_AMEND_FORM_MOCK: IFinesAccDebtorAddAmendForm = {
  facc_debtor_add_amend_title: null,
  facc_debtor_add_amend_forenames: null,
  facc_debtor_add_amend_surname: null,
  facc_debtor_add_amend_aliases: [],
  facc_debtor_add_amend_add_alias: null,
  facc_debtor_add_amend_dob: null,
  facc_debtor_add_amend_national_insurance_number: null,
  facc_debtor_add_amend_address_line_1: null,
  facc_debtor_add_amend_address_line_2: null,
  facc_debtor_add_amend_address_line_3: null,
  facc_debtor_add_amend_post_code: null,
  facc_debtor_add_amend_contact_email_address_1: null,
  facc_debtor_add_amend_contact_email_address_2: null,
  facc_debtor_add_amend_contact_telephone_number_mobile: null,
  facc_debtor_add_amend_contact_telephone_number_home: null,
  facc_debtor_add_amend_contact_telephone_number_business: null,
  facc_debtor_add_amend_vehicle_make: null,
  facc_debtor_add_amend_vehicle_registration_mark: null,
  facc_debtor_add_amend_language_preferences_document_language: null,
  facc_debtor_add_amend_language_preferences_hearing_language: null,
  facc_debtor_add_amend_employer_details_employer_company_name: null,
  facc_debtor_add_amend_employer_details_employer_reference: null,
  facc_debtor_add_amend_employer_details_employer_email_address: null,
  facc_debtor_add_amend_employer_details_employer_telephone_number: null,
  facc_debtor_add_amend_employer_details_employer_address_line_1: null,
  facc_debtor_add_amend_employer_details_employer_address_line_2: null,
  facc_debtor_add_amend_employer_details_employer_address_line_3: null,
  facc_debtor_add_amend_employer_details_employer_address_line_4: null,
  facc_debtor_add_amend_employer_details_employer_address_line_5: null,
  facc_debtor_add_amend_employer_details_employer_post_code: null,
};

export const MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA: IFinesAccDebtorAddAmendFormData = {
  formData: {
    facc_debtor_add_amend_title: 'Mr',
    facc_debtor_add_amend_forenames: 'John',
    facc_debtor_add_amend_surname: 'Doe',
    facc_debtor_add_amend_aliases: [],
    facc_debtor_add_amend_add_alias: false,
    facc_debtor_add_amend_dob: '1990-01-01',
    facc_debtor_add_amend_national_insurance_number: 'AB123456C',
    facc_debtor_add_amend_address_line_1: '123 Test Street',
    facc_debtor_add_amend_address_line_2: null,
    facc_debtor_add_amend_address_line_3: null,
    facc_debtor_add_amend_post_code: 'TE5T 1NG',
    facc_debtor_add_amend_contact_email_address_1: 'john@example.com',
    facc_debtor_add_amend_contact_email_address_2: null,
    facc_debtor_add_amend_contact_telephone_number_mobile: '07123456789',
    facc_debtor_add_amend_contact_telephone_number_home: null,
    facc_debtor_add_amend_contact_telephone_number_business: null,
    facc_debtor_add_amend_vehicle_make: 'Toyota Corolla',
    facc_debtor_add_amend_vehicle_registration_mark: 'ABC123',
    facc_debtor_add_amend_language_preferences_document_language: null,
    facc_debtor_add_amend_language_preferences_hearing_language: null,
    facc_debtor_add_amend_employer_details_employer_company_name: 'Test Company',
    facc_debtor_add_amend_employer_details_employer_reference: 'EMP123',
    facc_debtor_add_amend_employer_details_employer_email_address: 'hr@company.com',
    facc_debtor_add_amend_employer_details_employer_telephone_number: '01234567890',
    facc_debtor_add_amend_employer_details_employer_address_line_1: '456 Business Park',
    facc_debtor_add_amend_employer_details_employer_address_line_2: null,
    facc_debtor_add_amend_employer_details_employer_address_line_3: null,
    facc_debtor_add_amend_employer_details_employer_address_line_4: null,
    facc_debtor_add_amend_employer_details_employer_address_line_5: null,
    facc_debtor_add_amend_employer_details_employer_post_code: 'BU5 1NE',
  },
  nestedFlow: false,
};

export const MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA_WITH_ALIASES: IFinesAccDebtorAddAmendFormData = {
  formData: {
    ...MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA.formData,
    facc_debtor_add_amend_aliases: [
      {
        facc_debtor_add_amend_alias_forenames: 'Johnny',
        facc_debtor_add_amend_alias_surname: 'Doe',
      },
    ],
  },
  nestedFlow: false,
};

export const MOCK_EMPTY_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA: IFinesAccDebtorAddAmendFormData = {
  formData: {
    ...FINES_ACC_DEBTOR_ADD_AMEND_FORM_MOCK,
    facc_debtor_add_amend_add_alias: false,
  },
  nestedFlow: false,
};
