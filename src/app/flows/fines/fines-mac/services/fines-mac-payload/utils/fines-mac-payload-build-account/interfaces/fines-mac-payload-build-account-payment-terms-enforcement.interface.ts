import { IFinesMacPayloadBuildAccountPaymentTermsEnforcementResultResponse } from './fines-mac-payload-build-account-payment-terms-enforcement-result-response.interface';

export interface IFinesMacPayloadBuildAccountPaymentTermsEnforcement {
  result_id: string | null;
  enforcement_result_responses: IFinesMacPayloadBuildAccountPaymentTermsEnforcementResultResponse[] | null;
}
