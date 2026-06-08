import { IOpalFinesAmendPaymentTerms } from './opal-fines-amend-payment-terms.interface';
import { IOpalFinesAddEnforcementActionResultResponse } from './opal-fines-add-enforcement-action-result-response.interface';

export interface IOpalFinesAddEnforcementActionPayload {
  result_id: string;
  enforcement_result_responses: IOpalFinesAddEnforcementActionResultResponse[];
  payment_terms?: IOpalFinesAmendPaymentTerms;
}
