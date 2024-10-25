import { IFinesMacPayloadAccountNote } from './fines-mac-payload-account-note.interface';
import { IFinesMacPayloadDefendantComplete } from './fines-mac-payload-defendant-complete.interface';
import { IFinesMacPayloadInitial } from './fines-mac-payload-initial.interface';
import { IFinesMacPaymentTermsPayload } from './fines-mac-payment-terms-payload.interface';

export interface IFinesMacPayload extends IFinesMacPayloadInitial {
  defendant: IFinesMacPayloadDefendantComplete;
  offences: null;
  fp_ticket_detail: null;
  payment_terms: IFinesMacPaymentTermsPayload;
  account_notes: IFinesMacPayloadAccountNote[] | null;
}
