import { ValidatorFn } from '@angular/forms';
import { IFinesMacFixedPenaltyDetailsState } from './fines-mac-fixed-penalty-details-state.interface';

export type IFinesMacFixedPenaltyDetailsFormValidators = {
  [K in keyof IFinesMacFixedPenaltyDetailsState]: Array<ValidatorFn> | null;
};
