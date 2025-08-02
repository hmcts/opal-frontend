import { IFinesMacPayloadAccountAccountNote } from '../utils/interfaces/fines-mac-payload-account-account-note.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../utils/interfaces/fines-mac-payload-account-defendant-complete.interface';
import { IFinesMacPayloadAccountAccountInitial } from './fines-mac-payload-account-initial.interface';
import { IFinesMacPayloadAccountPaymentTerms } from '../utils/interfaces/fines-mac-payload-account-payment-terms.interface';
import { IFinesMacPayloadAccountOffences } from '../utils/interfaces/fines-mac-payload-account-offences.interface';
import { IFinesMacPayloadAcountFixedPenaltyDetails } from '../utils/interfaces/fines-mac-payload-fixed-penalty-details-state.interface';

export interface IFinesMacPayloadAccount extends IFinesMacPayloadAccountAccountInitial {
  defendant: IFinesMacPayloadAccountDefendantComplete;
  offences: IFinesMacPayloadAccountOffences[] | null;
  fp_ticket_detail: IFinesMacPayloadAcountFixedPenaltyDetails | null;
  payment_terms: IFinesMacPayloadAccountPaymentTerms;
  account_notes: IFinesMacPayloadAccountAccountNote[] | null;
}
