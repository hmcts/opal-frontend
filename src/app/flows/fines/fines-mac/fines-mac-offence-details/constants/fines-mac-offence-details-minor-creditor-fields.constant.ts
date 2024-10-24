import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

const createControlValidation = (controlName: string): IAbstractFormArrayControlValidation => ({
  controlName,
  validators: [],
});

export const FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELDS: { [key: string]: IAbstractFormArrayControlValidation[] } =
  {
    fm_offence_details_minor_creditor: [
      'fm_offence_details_minor_creditor_creditor_type',
      'fm_offence_details_minor_creditor_title',
      'fm_offence_details_minor_creditor_forenames',
      'fm_offence_details_minor_creditor_surname',
      'fm_offence_details_minor_creditor_company_name',
      'fm_offence_details_minor_creditor_address_line_1',
      'fm_offence_details_minor_creditor_address_line_2',
      'fm_offence_details_minor_creditor_address_line_3',
      'fm_offence_details_minor_creditor_post_code',
      'fm_offence_details_minor_creditor_has_payment_details',
      'fm_offence_details_minor_creditor_name_on_account',
      'fm_offence_details_minor_creditor_sort_code',
      'fm_offence_details_minor_creditor_account_number',
      'fm_offence_details_minor_creditor_payment_reference',
    ].map(createControlValidation),
  };
