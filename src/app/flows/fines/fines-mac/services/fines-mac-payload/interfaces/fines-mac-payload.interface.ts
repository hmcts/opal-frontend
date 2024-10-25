import { IFinesMacPayloadAccountNote } from '../utils/interfaces/fines-mac-payload-account-note.interface';
import { IFinesMacPayloadDefendantComplete } from '../utils/interfaces/fines-mac-payload-defendant-complete.interface';
import { IFinesMacPayloadInitial } from './fines-mac-payload-initial.interface';
import { IFinesMacPaymentTermsPayload } from '../utils/interfaces/fines-mac-payment-terms-payload.interface';

export interface IFinesMacPayload extends IFinesMacPayloadInitial {
  defendant: IFinesMacPayloadDefendantComplete;
  offences: null;
  fp_ticket_detail: null;
  payment_terms: IFinesMacPaymentTermsPayload;
  account_notes: IFinesMacPayloadAccountNote[] | null;
}
