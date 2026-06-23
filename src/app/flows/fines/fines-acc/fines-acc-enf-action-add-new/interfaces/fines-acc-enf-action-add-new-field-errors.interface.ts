import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccEnfActionAddNewFieldErrors extends IAbstractFormBaseFieldErrors {
  facc_enf_action_add_new: {
    required: {
      message: string;
      priority: number;
    };
  };
}
