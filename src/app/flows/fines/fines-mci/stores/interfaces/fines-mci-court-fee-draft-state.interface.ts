import { IFinesMciCourtFeeDraft, FinesMciJourney } from './fines-mci.interface';
import { IFinesMciCourtFeePaymentDetails } from './fines-mci-court-fee-payment-details.interface';
import { FinesMciCourtFeePaymentOrigin } from '../types/fines-mci-court-fee-payment-origin.type';

export interface IFinesMciCourtFeeDraftState {
  draftJourney: FinesMciJourney | null;
  courtFeeDraft: IFinesMciCourtFeeDraft | null;
  courtFeePaymentDetails: IFinesMciCourtFeePaymentDetails | null;
  courtFeePaymentOrigin: FinesMciCourtFeePaymentOrigin | null;
  courtFeeSuspenseNote: string;
  editingCourtFeePaymentId: string | null;
}
