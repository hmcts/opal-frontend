import { IFinesAccEnfActionAddFormState } from '../../../fines-acc-enf-action-add/interfaces/fines-acc-enf-action-add-form-state.interface';
import { FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES } from '../../../fines-acc-enf-action-add/constants/fines-acc-enf-action-add-control-names.constant';

const controlNames = FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES;

export const FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_NO_PAYMENT_TERMS_FORM_STATE_MOCK: IFinesAccEnfActionAddFormState =
  {
    'fines-acc-enf-action-add_reason': 'Reason',
    [controlNames.addPaymentTerms]: false,
    [controlNames.paymentTerms]: 'payInFull',
  };
