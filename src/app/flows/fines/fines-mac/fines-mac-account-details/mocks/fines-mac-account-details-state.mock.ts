import { FINES_ACCOUNT_TYPES } from '../../../constants/fines-account-types.constant';
import { IFinesMacAccountDetailsState } from '../interfaces/fines-mac-account-details-state.interface';

export const FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK: IFinesMacAccountDetailsState = {
  fm_create_account_account_type: FINES_ACCOUNT_TYPES['Conditional Caution'],
  fm_create_account_business_unit_id: 61,
  fm_create_account_defendant_type: 'adultOrYouthOnly',
};
