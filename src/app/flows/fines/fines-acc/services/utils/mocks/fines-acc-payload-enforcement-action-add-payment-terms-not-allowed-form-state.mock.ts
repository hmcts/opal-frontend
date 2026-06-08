import { IFinesAccEnfActionAddFormState } from '../../../fines-acc-enf-action-add/interfaces/fines-acc-enf-action-add-form-state.interface';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_NO_PAYMENT_TERMS_FORM_STATE_MOCK } from './fines-acc-payload-enforcement-action-add-no-payment-terms-form-state.mock';

export const FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_NOT_ALLOWED_FORM_STATE_MOCK: IFinesAccEnfActionAddFormState =
  {
    ...FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_NO_PAYMENT_TERMS_FORM_STATE_MOCK,
    'fines-acc-enf-action-add_add_payment_terms': true,
  };
