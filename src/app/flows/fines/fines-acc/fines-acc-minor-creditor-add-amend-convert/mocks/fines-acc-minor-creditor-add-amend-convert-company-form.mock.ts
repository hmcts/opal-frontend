import { IFinesAccMinorCreditorAddAmendConvertForm } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-form.interface';

export const MOCK_FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_FORM: IFinesAccMinorCreditorAddAmendConvertForm =
  {
    formData: {
      facc_minor_creditor_creditor_type: 'company',
      facc_minor_creditor_title: null,
      facc_minor_creditor_forenames: null,
      facc_minor_creditor_surname: null,
      facc_minor_creditor_company_name: 'Test Organisation',
      facc_minor_creditor_address_line_1: '123 Main Street',
      facc_minor_creditor_address_line_2: 'Apt 4',
      facc_minor_creditor_address_line_3: null,
      facc_minor_creditor_address_line_4: null,
      facc_minor_creditor_address_line_5: null,
      facc_minor_creditor_post_code: 'AB12 3CD',
      facc_minor_creditor_pay_by_bacs: true,
      facc_minor_creditor_bank_account_name: 'Test Account',
      facc_minor_creditor_bank_sort_code: '123456',
      facc_minor_creditor_bank_account_number: '12345678',
      facc_minor_creditor_bank_account_reference: 'REF-001',
    },
    nestedFlow: false,
  };
