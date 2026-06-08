import { IFinesAccMinorCreditorAddAmendConvertForm } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-form.interface';
import { MOCK_FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_FORM } from './fines-acc-minor-creditor-add-amend-convert-company-form.mock';

export const MOCK_FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_FORM: IFinesAccMinorCreditorAddAmendConvertForm =
  {
    formData: {
      ...MOCK_FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_FORM.formData,
      facc_minor_creditor_creditor_type: 'individual',
      facc_minor_creditor_title: 'Mr',
      facc_minor_creditor_forenames: 'John',
      facc_minor_creditor_surname: 'SMITH',
      facc_minor_creditor_company_name: null,
      facc_minor_creditor_pay_by_bacs: false,
      facc_minor_creditor_bank_account_name: null,
      facc_minor_creditor_bank_sort_code: null,
      facc_minor_creditor_bank_account_number: null,
      facc_minor_creditor_bank_account_reference: null,
    },
    nestedFlow: false,
  };
