import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';

/**
 * Maps the payload data to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of fines MAC.
 * @param payload - The payload containing account details to be mapped.
 * @returns The updated fines MAC state with the new account details.
 *
 * @remarks
 * This function updates the following sections of the fines MAC state:
 * - Account details
 * - Court details
 * - Payment terms
 */
export const finesMacPayloadMapAccountBase = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const { account: payloadAccount, business_unit_id } = payload;

  // Update account details
  mappedFinesMacState.accountDetails.formData = {
    ...mappedFinesMacState.accountDetails.formData,
    fm_create_account_account_type: payloadAccount.account_type,
    fm_create_account_defendant_type: payloadAccount.defendant_type,
    fm_create_account_business_unit_id: business_unit_id,
  };

  // Update court details
  mappedFinesMacState.courtDetails.formData = {
    ...mappedFinesMacState.courtDetails.formData,
    fm_court_details_originator_name: payloadAccount.originator_name,
    fm_court_details_originator_id: payloadAccount.originator_id,
    fm_court_details_prosecutor_case_reference: payloadAccount.prosecutor_case_reference,
    fm_court_details_imposing_court_id: payloadAccount.enforcement_court_id,
  };

  // Update payment terms
  mappedFinesMacState.paymentTerms.formData = {
    ...mappedFinesMacState.paymentTerms.formData,
    fm_payment_terms_collection_order_made: payloadAccount.collection_order_made,
    fm_payment_terms_collection_order_made_today: payloadAccount.collection_order_made_today,
    fm_payment_terms_collection_order_date: payloadAccount.collection_order_date,
    fm_payment_terms_suspended_committal_date: payloadAccount.suspended_committal_date,
    fm_payment_terms_payment_card_request: payloadAccount.payment_card_request,
  };

  return mappedFinesMacState;
};
