import { IFinesMacPayloadBuildAccountAccountNote } from '../utils/fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-account-note.interface';
import { IFinesMacPayloadBuildAccountDefendantComplete } from '../utils/fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-complete.interface';
import { IFinesMacPayloadAccountAccountInitial } from './fines-mac-payload-account-initial.interface';
import { IFinesMacPayloadBuildAccountPaymentTerms } from '../utils/fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-payment-terms.interface';
import { IFinesMacPayloadAccountOffences } from '../utils/fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-offences.interface';

export interface IFinesMacPayloadAccount extends IFinesMacPayloadAccountAccountInitial {
  defendant: IFinesMacPayloadBuildAccountDefendantComplete;
  offences: IFinesMacPayloadAccountOffences[] | null;
  fp_ticket_detail: null;
  payment_terms: IFinesMacPayloadBuildAccountPaymentTerms;
  account_notes: IFinesMacPayloadBuildAccountAccountNote[] | null;
}
