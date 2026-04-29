import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccEnfActionSelectFieldErrors extends IAbstractFormBaseFieldErrors {
  facc_enf_action: {
    required: {
      message: string;
      priority: number;
    };
  };
}
