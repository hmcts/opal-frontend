import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacFixedPenaltyDetailsState } from './fines-mac-fixed-penalty-details-state.interface';

export type IFinesMacFixedPenaltyDetailsFieldErrors = IAbstractFormBaseFieldErrors & {
  [K in keyof IFinesMacFixedPenaltyDetailsState]: IAbstractFormBaseFieldError;
};
