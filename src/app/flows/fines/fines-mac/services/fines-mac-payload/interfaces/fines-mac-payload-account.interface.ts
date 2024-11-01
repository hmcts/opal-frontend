import { IFinesMacPayloadAccountAccountNote } from '../utils/interfaces/fines-mac-payload-account-note.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../utils/interfaces/fines-mac-payload-defendant-complete.interface';
import { IFinesMacPayloadAccountAccountInitial } from './fines-mac-payload-account-initial.interface';
import { IFinesMacPaymentTermsPayload } from '../utils/interfaces/fines-mac-payment-terms-payload.interface';

export interface IFinesMacPayloadAccount extends IFinesMacPayloadAccountAccountInitial {
  defendant: IFinesMacPayloadAccountDefendantComplete;
  offences: null;
  fp_ticket_detail: null;
  payment_terms: IFinesMacPaymentTermsPayload;
  account_notes: IFinesMacPayloadAccountAccountNote[] | null;
}
