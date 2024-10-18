import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IAbstractFormArrayControls } from '@components/abstract/interfaces/abstract-form-array-controls.interface';

export const FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_MOCK: {
  rowIndex: number;
  formArray: FormArray;
  formArrayControls: IAbstractFormArrayControls[];
} = {
  rowIndex: 0,
  formArray: new FormArray([
    new FormGroup({
      fm_offence_details_result_code_0: new FormControl('FCC'),
      fm_offence_details_amount_imposed_0: new FormControl(200),
      fm_offence_details_amount_paid_0: new FormControl(50),
      fm_offence_details_balance_remaining_0: new FormControl(null),
      fm_offence_details_needs_creditor_0: new FormControl(true),
      fm_offence_details_creditor_0: new FormControl('major'),
      fm_offence_details_major_creditor_0: new FormControl('ALDI'),
    }),
    new FormGroup({
      fm_offence_details_result_code_1: new FormControl(null),
      fm_offence_details_amount_imposed_1: new FormControl(0),
      fm_offence_details_amount_paid_1: new FormControl(0),
      fm_offence_details_balance_remaining_0: new FormControl(null),
      fm_offence_details_needs_creditor_1: new FormControl(false),
      fm_offence_details_creditor_1: new FormControl(null),
      fm_offence_details_major_creditor_1: new FormControl(null),
    }),
  ]),
  formArrayControls: [
    {
      fm_offence_details_result_code: {
        inputId: 'fm_offence_details_result_code_0',
        inputName: 'fm_offence_details_result_code_0',
        controlName: 'fm_offence_details_result_code_0',
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
      fm_offence_details_major_creditor: {
        inputId: 'fm_offence_details_major_creditor_0',
        inputName: 'fm_offence_details_major_creditor_0',
        controlName: 'fm_offence_details_major_creditor_0',
      },
    },
    {
      fm_offence_details_result_code: {
        inputId: 'fm_offence_details_result_code_1',
        inputName: 'fm_offence_details_result_code_1',
        controlName: 'fm_offence_details_result_code_1',
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
      fm_offence_details_major_creditor: {
        inputId: 'fm_offence_details_major_creditor_1',
        inputName: 'fm_offence_details_major_creditor_1',
        controlName: 'fm_offence_details_major_creditor_1',
      },
    },
  ],
};
