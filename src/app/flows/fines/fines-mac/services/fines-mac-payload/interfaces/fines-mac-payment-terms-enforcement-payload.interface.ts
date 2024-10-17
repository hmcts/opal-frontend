import { IFinesMacPaymentTermsEnforcementResultResponsePayload } from './fines-mac-payment-terms-enforcement-result-response-payload.interface';

export interface IFinesMacPaymentTermsEnforcementPayload {
  result_id: string | null;
  enforcement_result_responses: IFinesMacPaymentTermsEnforcementResultResponsePayload[] | null;
}
