import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { Validators } from '@angular/forms';
import { amountValidator } from '@hmcts/opal-frontend-common/validators';

export const FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_offence_details_result_id',
    validators: [Validators.required],
  },
  {
    controlName: 'fm_offence_details_amount_imposed',
    validators: [Validators.required, amountValidator(18, 2)],
  },
  {
    controlName: 'fm_offence_details_amount_paid',
    validators: [amountValidator(18, 2)],
  },
  {
    controlName: 'fm_offence_details_balance_remaining',
    validators: [],
  },
  {
    controlName: 'fm_offence_details_needs_creditor',
    validators: [],
  },
  {
    controlName: 'fm_offence_details_creditor',
    validators: [],
  },
  {
    controlName: 'fm_offence_details_major_creditor_id',
    validators: [],
  },
];
