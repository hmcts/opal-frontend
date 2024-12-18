import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { IFinesMacPayloadBuildAccountDefendantComplete } from '../utils/fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-complete.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS } from './fines-mac-payload-account-defendant-debtor-details.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN } from './fines-mac-payload-account-defendant-parent-guardian.constant';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT: IFinesMacPayloadBuildAccountDefendantComplete = {
  ...FINES_DRAFT_STATE.account.defendant,
  debtor_detail: FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS,
  parent_guardian: FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN,
};
