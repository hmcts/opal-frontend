import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesResultRefData } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';

export interface IFinesAccDefendantDetailsPaymentTermsLatestResolverResponse {
  paymentTermsData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest;
  resultData: IOpalFinesResultRefData | null;
}
