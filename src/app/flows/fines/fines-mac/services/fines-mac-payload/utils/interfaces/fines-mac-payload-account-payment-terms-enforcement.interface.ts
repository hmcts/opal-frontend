import { IFinesMacPayloadAccountPaymentTermsEnforcementResultResponse } from './fines-mac-payload-account-payment-terms-enforcement-result-response.interface';

export interface IFinesMacPayloadAccountPaymentTermsEnforcement {
  result_id: string | null;
  enforcement_result_responses: IFinesMacPayloadAccountPaymentTermsEnforcementResultResponse[] | null;
}
