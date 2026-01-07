import { FINES_MAC_ACCOUNT_DETAILS_STATE } from '../../fines-mac-account-details/constants/fines-mac-account-details-state';
import { IFinesMacAccountDetailsState } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';

export const FINES_MAC_CREATE_ACCOUNT_STATE: IFinesMacAccountDetailsState = structuredClone(
  FINES_MAC_ACCOUNT_DETAILS_STATE,
);
