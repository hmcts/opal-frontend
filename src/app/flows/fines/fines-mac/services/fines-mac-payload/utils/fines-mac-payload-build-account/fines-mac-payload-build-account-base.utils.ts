import { IFinesMacAccountDetailsState } from '../../../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { IFinesMacCourtDetailsState } from '../../../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacOffenceDetailsState } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-state.interface';
import { IFinesMacPaymentTermsState } from '../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { IFinesMacPayloadAccountAccountInitial } from '../../interfaces/fines-mac-payload-account-initial.interface';

/**
 * Sorts an array of offence details by the date of sentence.
 *
 * This function takes an array of offence details state objects and sorts them
 * in ascending order based on the `fm_offence_details_date_of_sentence` property.
 * If the date is missing or invalid, the corresponding object is moved to the end
 * of the array.
 *
 * @param offenceDetailsState - An array of offence details state objects to be sorted.
 * @returns A new array of offence details state objects sorted by the date of sentence.
 */
const sortOffenceDetailsByDate = (
  offenceDetailsState: IFinesMacOffenceDetailsState[],
): IFinesMacOffenceDetailsState[] => {
  return structuredClone(offenceDetailsState).sort((offenceDetailsStateA, offenceDetailsStateB) => {
    // Validate dates
    const dateA = offenceDetailsStateA.fm_offence_details_date_of_sentence
      ? new Date(offenceDetailsStateA.fm_offence_details_date_of_sentence)
      : null;
    const dateB = offenceDetailsStateB.fm_offence_details_date_of_sentence
      ? new Date(offenceDetailsStateB.fm_offence_details_date_of_sentence)
      : null;

    // Check if the dates are valid
    const isDateAInvalid = !dateA || isNaN(dateA.getTime());
    const isDateBInvalid = !dateB || isNaN(dateB.getTime());

    // Handle missing or invalid dates
    if (isDateAInvalid && isDateBInvalid) return 0; // Both dates are invalid, maintain current order
    if (isDateAInvalid) return 1; // Move `a` to the end if its date is invalid
    if (isDateBInvalid) return -1; // Move `b` to the end if its date is invalid

    // Compare valid dates
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Builds the initial payload for fines MAC based on the provided state objects.
 *
 * @param accountDetailsState - The state object containing account details.
 * @param courtDetailsState - The state object containing court details.
 * @param paymentTermsState - The state object containing payment terms.
 * @returns The initial payload for fines MAC.
 */
export const finesMacPayloadBuildAccountBase = (
  accountDetailsState: IFinesMacAccountDetailsState,
  courtDetailsState: IFinesMacCourtDetailsState,
  paymentTermsState: IFinesMacPaymentTermsState,
  offenceDetailsState: IFinesMacOffenceDetailsState[],
): IFinesMacPayloadAccountAccountInitial => {
  const earliestDateOfSentence = sortOffenceDetailsByDate(offenceDetailsState)[0].fm_offence_details_date_of_sentence;

  const { fm_create_account_account_type: account_type, fm_create_account_defendant_type: defendant_type } =
    accountDetailsState;

  const {
    fm_court_details_originator_name: originator_name,
    fm_court_details_originator_id: originator_id,
    fm_court_details_prosecutor_case_reference: prosecutor_case_reference,
    fm_court_details_imposing_court_id: enforcement_court_id,
  } = courtDetailsState;

  const {
    fm_payment_terms_collection_order_made: collection_order_made,
    fm_payment_terms_collection_order_made_today: collection_order_made_today,
    fm_payment_terms_collection_order_date: collection_order_date,
    fm_payment_terms_suspended_committal_date: suspended_committal_date,
    fm_payment_terms_payment_card_request: payment_card_request,
  } = paymentTermsState;

  return {
    account_type,
    defendant_type,
    originator_name,
    originator_id,
    prosecutor_case_reference,
    enforcement_court_id,
    collection_order_made: collection_order_made ?? null,
    collection_order_made_today: collection_order_made_today ?? null,
    collection_order_date: collection_order_date ?? null,
    suspended_committal_date: suspended_committal_date ?? null,
    payment_card_request: payment_card_request ?? null,
    account_sentence_date: earliestDateOfSentence,
  };
};
