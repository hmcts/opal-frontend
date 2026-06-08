import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccEnfActionAddFormState } from '../interfaces/fines-acc-enf-action-add-form-state.interface';

export const FINES_ACC_ENF_ACTION_ADD_SUBMIT_FORM_MOCK: IAbstractFormBaseForm<IFinesAccEnfActionAddFormState> = {
  formData: { 'fines-acc-enf-action-add_reason': 'Reason entered' },
  nestedFlow: false,
};
