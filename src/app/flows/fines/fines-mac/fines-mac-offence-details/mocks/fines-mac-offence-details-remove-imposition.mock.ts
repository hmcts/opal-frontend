import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IAbstractFormArrayControls } from '@hmcts/opal-frontend-common/components/abstract';

const generateFormArrayControl = (index: number): IAbstractFormArrayControls => ({
  fm_offence_details_result_id: {
    inputId: `fm_offence_details_result_id_${index}`,
    inputName: `fm_offence_details_result_id_${index}`,
    controlName: `fm_offence_details_result_id_${index}`,
  },
  fm_offence_details_amount_imposed: {
    inputId: `fm_offence_details_amount_imposed_${index}`,
    inputName: `fm_offence_details_amount_imposed_${index}`,
    controlName: `fm_offence_details_amount_imposed_${index}`,
  },
  fm_offence_details_amount_paid: {
    inputId: `fm_offence_details_amount_paid_${index}`,
    inputName: `fm_offence_details_amount_paid_${index}`,
    controlName: `fm_offence_details_amount_paid_${index}`,
  },
  fm_offence_details_needs_creditor: {
    inputId: `fm_offence_details_needs_creditor_${index}`,
    inputName: `fm_offence_details_needs_creditor_${index}`,
    controlName: `fm_offence_details_needs_creditor_${index}`,
  },
  fm_offence_details_creditor: {
    inputId: `fm_offence_details_creditor_${index}`,
    inputName: `fm_offence_details_creditor_${index}`,
    controlName: `fm_offence_details_creditor_${index}`,
  },
  fm_offence_details_major_creditor_id: {
    inputId: `fm_offence_details_major_creditor_id_${index}`,
    inputName: `fm_offence_details_major_creditor_id_${index}`,
    controlName: `fm_offence_details_major_creditor_id_${index}`,
  },
  fm_offence_details_minor_creditor: {
    inputId: `fm_offence_details_minor_creditor_${index}`,
    inputName: `fm_offence_details_minor_creditor_${index}`,
    controlName: `fm_offence_details_minor_creditor_${index}`,
  },
});

export const FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_MOCK: {
  rowIndex: number;
  formArray: FormArray;
  formArrayControls: IAbstractFormArrayControls[];
} = {
  rowIndex: 0,
  formArray: new FormArray([
    new FormGroup({
      fm_offence_details_result_id_0: new FormControl('FCC'),
      fm_offence_details_amount_imposed_0: new FormControl(200),
      fm_offence_details_amount_paid_0: new FormControl(50),
      fm_offence_details_balance_remaining_0: new FormControl(null),
      fm_offence_details_needs_creditor_0: new FormControl(true),
      fm_offence_details_creditor_0: new FormControl('major'),
      fm_offence_details_major_creditor_id_0: new FormControl(3856),
    }),
    new FormGroup({
      fm_offence_details_result_id_1: new FormControl(null),
      fm_offence_details_amount_imposed_1: new FormControl(0),
      fm_offence_details_amount_paid_1: new FormControl(0),
      fm_offence_details_balance_remaining_0: new FormControl(null),
      fm_offence_details_needs_creditor_1: new FormControl(false),
      fm_offence_details_creditor_1: new FormControl(null),
      fm_offence_details_major_creditor_id_1: new FormControl(null),
    }),
  ]),
  formArrayControls: [generateFormArrayControl(0), generateFormArrayControl(1)],
};
