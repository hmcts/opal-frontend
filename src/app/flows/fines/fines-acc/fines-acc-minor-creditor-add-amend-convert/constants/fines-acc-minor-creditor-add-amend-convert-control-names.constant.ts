export const FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES = {
  creditorType: 'facc_minor_creditor_creditor_type',
  title: 'facc_minor_creditor_title',
  forenames: 'facc_minor_creditor_forenames',
  surname: 'facc_minor_creditor_surname',
  companyName: 'facc_minor_creditor_company_name',
  addressLine1: 'facc_minor_creditor_address_line_1',
  addressLine2: 'facc_minor_creditor_address_line_2',
  addressLine3: 'facc_minor_creditor_address_line_3',
  postCode: 'facc_minor_creditor_post_code',
  payByBacs: 'facc_minor_creditor_pay_by_bacs',
  bankAccountName: 'facc_minor_creditor_bank_account_name',
  bankSortCode: 'facc_minor_creditor_bank_sort_code',
  bankAccountNumber: 'facc_minor_creditor_bank_account_number',
  bankAccountReference: 'facc_minor_creditor_bank_account_reference',
} as const;

export const FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES = [
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES.title,
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES.forenames,
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES.surname,
] as const;

export const FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES = [
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES.companyName,
] as const;

export const FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_BACS_CONTROL_NAMES = [
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES.bankAccountName,
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES.bankSortCode,
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES.bankAccountNumber,
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES.bankAccountReference,
] as const;
