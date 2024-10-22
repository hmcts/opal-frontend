import { IFinesMacAccountNotePayload } from './fines-mac-account-note-payload.interface';
import { IFinesMacDefendantCompletePayload } from './fines-mac-defendant-complete-payload.interface';
import { IFinesMacInitialPayload } from './fines-mac-initial-payload.interface';
import { IFinesMacPaymentTermsPayload } from './fines-mac-payment-terms-payload.interface';

export interface IFinesMacPayload extends IFinesMacInitialPayload {
  defendant: IFinesMacDefendantCompletePayload;
  offences: null;
  fp_ticket_detail: null;
  payment_terms: IFinesMacPaymentTermsPayload;
  account_notes: IFinesMacAccountNotePayload[] | null;
}
