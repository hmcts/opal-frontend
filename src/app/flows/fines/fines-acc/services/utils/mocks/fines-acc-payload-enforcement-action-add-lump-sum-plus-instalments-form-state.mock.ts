import { IFinesAccEnfActionAddFormState } from '../../../fines-acc-enf-action-add/interfaces/fines-acc-enf-action-add-form-state.interface';
import { FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES } from '../../../fines-acc-enf-action-add/constants/fines-acc-enf-action-add-control-names.constant';

const controlNames = FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES;

export const FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_LUMP_SUM_PLUS_INSTALMENTS_FORM_STATE_MOCK: IFinesAccEnfActionAddFormState =
  {
    'fines-acc-enf-action-add_reason': 'Reason',
    'fines-acc-enf-action-add_reason_cy': 'Rheswm',
    'fines-acc-enf-action-add_hearing_date': '20/05/2026',
    'fines-acc-enf-action-add_empty_note': ' ',
    [controlNames.addPaymentTerms]: true,
    [controlNames.paymentTerms]: 'lumpSumPlusInstalments',
    [controlNames.lumpSumAmount]: '10.00',
    [controlNames.instalmentAmount]: '5.00',
    [controlNames.instalmentPeriod]: 'W',
    [controlNames.startDate]: '21/05/2026',
    [controlNames.daysInDefault]: '7',
    [controlNames.dateDaysInDefaultImposed]: '19/05/2026',
  };
