import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IAbstractFormArrayControls } from '@components/abstract/interfaces/abstract-form-array-controls.interface';

const generateFormArrayControl = (index: number): IAbstractFormArrayControls => ({
  fm_offence_details_result_code: {
    inputId: `fm_offence_details_result_code_${index}`,
    inputName: `fm_offence_details_result_code_${index}`,
    controlName: `fm_offence_details_result_code_${index}`,
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
  fm_offence_details_major_creditor: {
    inputId: `fm_offence_details_major_creditor_${index}`,
    inputName: `fm_offence_details_major_creditor_${index}`,
    controlName: `fm_offence_details_major_creditor_${index}`,
  },
  fm_offence_details_minor_creditor: {
    inputId: `fm_offence_details_minor_creditor_${index}`,
    inputName: `fm_offence_details_minor_creditor_${index}`,
    controlName: `fm_offence_details_minor_creditor_${index}`,
  },
});

const minorCreditorForm = (index: number): FormGroup =>
  new FormGroup({
    [`fm_offence_details_minor_creditor_creditor_type_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_title_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_forenames_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_surname_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_company_name_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_address_line_1_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_address_line_2_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_address_line_3_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_post_code_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_has_payment_details_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_name_on_account_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_sort_code_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_account_number_${index}`]: new FormControl(null),
    [`fm_offence_details_minor_creditor_payment_reference_${index}`]: new FormControl(null),
  });

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
      fm_offence_details_minor_creditor_0: minorCreditorForm(0),
    }),
    new FormGroup({
      fm_offence_details_result_code_1: new FormControl(null),
      fm_offence_details_amount_imposed_1: new FormControl(0),
      fm_offence_details_amount_paid_1: new FormControl(0),
      fm_offence_details_balance_remaining_0: new FormControl(null),
      fm_offence_details_needs_creditor_1: new FormControl(false),
      fm_offence_details_creditor_1: new FormControl(null),
      fm_offence_details_major_creditor_1: new FormControl(null),
      fm_offence_details_minor_creditor_1: minorCreditorForm(1),
    }),
  ]),
  formArrayControls: [generateFormArrayControl(0), generateFormArrayControl(1)],
};
