import { FINES_MAC_ACCOUNT_TYPES } from '../../constants/fines-mac-account-types';
import { IFinesMacAccountDetailsState } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';

export const FINES_MAC_CREATE_ACCOUNT_STATE_MOCK: IFinesMacAccountDetailsState = {
  fm_create_account_account_type: FINES_MAC_ACCOUNT_TYPES['Conditional Caution'],
  fm_create_account_defendant_type: 'adultOrYouthOnly',
  fm_create_account_business_unit_id: 61,
};
