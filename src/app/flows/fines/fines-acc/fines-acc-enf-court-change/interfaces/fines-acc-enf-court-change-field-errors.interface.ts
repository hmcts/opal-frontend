import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccEnfCourtChangeFormState } from './fines-acc-enf-court-change-form-state.interface';

export type IFinesAccEnfCourtChangeFieldErrors = IAbstractFormBaseFieldErrors & {
  [K in keyof IFinesAccEnfCourtChangeFormState]: IAbstractFormBaseFieldError;
};
