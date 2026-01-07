import { IAbstractFormArrayControls } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

export const FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_MOCK: {
  rowIndex: number;
  formArray: Array<Record<string, unknown>>;
  formArrayControls: IAbstractFormArrayControls[];
} = {
  rowIndex: 0,
  formArray: [
    {
      fm_offence_details_result_id_0: 'FCC',
      fm_offence_details_amount_imposed_0: 200,
      fm_offence_details_amount_paid_0: 50,
      fm_offence_details_balance_remaining_0: null,
      fm_offence_details_needs_creditor_0: true,
      fm_offence_details_creditor_0: 'major',
      fm_offence_details_major_creditor_id_0: 3856,
    },
    {
      fm_offence_details_result_id_1: null,
      fm_offence_details_amount_imposed_1: 0,
      fm_offence_details_amount_paid_1: 0,
      fm_offence_details_balance_remaining_0: null,
      fm_offence_details_needs_creditor_1: false,
      fm_offence_details_creditor_1: null,
      fm_offence_details_major_creditor_id_1: null,
    },
  ],
  formArrayControls: [
    {
      fm_offence_details_result_id: {
        inputId: 'fm_offence_details_result_id_0',
        inputName: 'fm_offence_details_result_id_0',
        controlName: 'fm_offence_details_result_id_0',
      },
      fm_offence_details_amount_imposed: {
        inputId: 'fm_offence_details_amount_imposed_0',
        inputName: 'fm_offence_details_amount_imposed_0',
        controlName: 'fm_offence_details_amount_imposed_0',
      },
      fm_offence_details_amount_paid: {
        inputId: 'fm_offence_details_amount_paid_0',
        inputName: 'fm_offence_details_amount_paid_0',
        controlName: 'fm_offence_details_amount_paid_0',
      },
      fm_offence_details_needs_creditor: {
        inputId: 'fm_offence_details_needs_creditor_0',
        inputName: 'fm_offence_details_needs_creditor_0',
        controlName: 'fm_offence_details_needs_creditor_0',
      },
      fm_offence_details_creditor: {
        inputId: 'fm_offence_details_creditor_0',
        inputName: 'fm_offence_details_creditor_0',
        controlName: 'fm_offence_details_creditor_0',
      },
      fm_offence_details_major_creditor_id: {
        inputId: 'fm_offence_details_major_creditor_id_0',
        inputName: 'fm_offence_details_major_creditor_id_0',
        controlName: 'fm_offence_details_major_creditor_id_0',
      },
      fm_offence_details_minor_creditor: {
        inputId: 'fm_offence_details_minor_creditor_0',
        inputName: 'fm_offence_details_minor_creditor_0',
        controlName: 'fm_offence_details_minor_creditor_0',
      },
    },
    {
      fm_offence_details_result_id: {
        inputId: 'fm_offence_details_result_id_1',
        inputName: 'fm_offence_details_result_id_1',
        controlName: 'fm_offence_details_result_id_1',
      },
      fm_offence_details_amount_imposed: {
        inputId: 'fm_offence_details_amount_imposed_1',
        inputName: 'fm_offence_details_amount_imposed_1',
        controlName: 'fm_offence_details_amount_imposed_1',
      },
      fm_offence_details_amount_paid: {
        inputId: 'fm_offence_details_amount_paid_1',
        inputName: 'fm_offence_details_amount_paid_1',
        controlName: 'fm_offence_details_amount_paid_1',
      },
      fm_offence_details_needs_creditor: {
        inputId: 'fm_offence_details_needs_creditor_1',
        inputName: 'fm_offence_details_needs_creditor_1',
        controlName: 'fm_offence_details_needs_creditor_1',
      },
      fm_offence_details_creditor: {
        inputId: 'fm_offence_details_creditor_1',
        inputName: 'fm_offence_details_creditor_1',
        controlName: 'fm_offence_details_creditor_1',
      },
      fm_offence_details_major_creditor_id: {
        inputId: 'fm_offence_details_major_creditor_id_1',
        inputName: 'fm_offence_details_major_creditor_id_1',
        controlName: 'fm_offence_details_major_creditor_id_1',
      },
      fm_offence_details_minor_creditor: {
        inputId: 'fm_offence_details_minor_creditor_1',
        inputName: 'fm_offence_details_minor_creditor_1',
        controlName: 'fm_offence_details_minor_creditor_1',
      },
    },
  ],
};
