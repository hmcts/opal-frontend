import { IFinesMacAccountDetailsState } from '../../../../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { FINES_ACCOUNT_TYPES } from 'src/app/flows/fines/constants/fines-account-types.constant';

export const FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK: IFinesMacAccountDetailsState = {
  fm_create_account_account_type: FINES_ACCOUNT_TYPES['Conditional Caution'],
  fm_create_account_business_unit_id: 61,
  fm_create_account_defendant_type: 'adultOrYouthOnly',
};
