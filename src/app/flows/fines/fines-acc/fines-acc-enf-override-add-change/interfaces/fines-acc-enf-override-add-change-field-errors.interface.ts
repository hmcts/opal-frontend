import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccEnfOverrideAddChangeFormState } from './fines-acc-enf-override-add-change-form-state.interface';

export type IFinesAccEnfOverrideAddChangeFieldErrors = IAbstractFormBaseFieldErrors & {
  [K in keyof IFinesAccEnfOverrideAddChangeFormState]: IAbstractFormBaseFieldError;
};
