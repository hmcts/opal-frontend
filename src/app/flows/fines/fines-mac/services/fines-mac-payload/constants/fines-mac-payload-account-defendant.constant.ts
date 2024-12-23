import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS } from './fines-mac-payload-account-defendant-debtor-details.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN } from './fines-mac-payload-account-defendant-parent-guardian.constant';
import { IFinesMacPayloadAccountDefendantComplete } from '../utils/interfaces/fines-mac-payload-account-defendant-complete.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT: IFinesMacPayloadAccountDefendantComplete = {
  ...FINES_DRAFT_STATE.account.defendant,
  debtor_detail: FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS,
  parent_guardian: FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN,
};
