import { inject, Injectable } from '@angular/core';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

import { IFinesMacAccountDetailsState } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';

import { IFinesMacPaymentTermsState } from '../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';

import { IFinesMacCourtDetailsState } from '../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacPayloadInitial } from './interfaces/fines-mac-payload-initial.interface';

import { buildDefendantPayload } from './utils/fines-mac-payload-defendant.utils';
import { buildPaymentTermsPayload } from './utils/fines-mac-payload-payment-terms.utils';
import { buildAccountNotesPayload } from './utils/fines-mac-payload-account-notes.utils';
import { IFinesMacPayload } from './interfaces/fines-mac-payload.interface';
import { TransformationService } from '@services/transformation-service/transformation.service';
import { FINES_MAC_TRANSFORM_ITEMS_CONFIG } from './constants/fines-mac-transform-items-config.constant';
import { ITransformItem } from '@services/transformation-service/interfaces/transform-item.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesMacPayloadService {
  private transformationService = inject(TransformationService);

  /**
   * Builds the initial payload for fines MAC based on the provided state objects.
   *
   * @param accountDetailsState - The state object containing account details.
   * @param courtDetailsState - The state object containing court details.
   * @param paymentTermsState - The state object containing payment terms.
   * @returns The initial payload for fines MAC.
   */
  private buildInitialPayload(
    accountDetailsState: IFinesMacAccountDetailsState,
    courtDetailsState: IFinesMacCourtDetailsState,
    paymentTermsState: IFinesMacPaymentTermsState,
  ): IFinesMacPayloadInitial {
    const { fm_create_account_account_type: account_type, fm_create_account_defendant_type: defendant_type } =
      accountDetailsState;

    const {
      fm_court_details_originator_name: originator_name,
      fm_court_details_originator_id: originator_id,
      fm_court_details_prosecutor_case_reference: prosecutor_case_reference,
      fm_court_details_enforcement_court_id: enforcement_court_id,
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
      account_sentence_date: null, // Derived from the earliest of all offence sentence dates
    };
  }

  /**
   * Transforms the given finesMacPayload object by applying the transformations
   * defined in the FINES_MAC_TRANSFORM_ITEMS_CONFIG.
   *
   * @param finesMacPayload - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  private transformPayload(
    finesMacPayload: IFinesMacPayload,
    transformItemsConfig: ITransformItem[],
  ): IFinesMacPayload {
    return this.transformationService.transformObjectValues(finesMacPayload, transformItemsConfig);
  }

  /**
   * Builds the payload for fines MAC based on the provided state.
   *
   * @param {IFinesMacState} finesMacState - The state containing all the necessary form data.
   * @returns {IFinesMacPayload} The constructed payload object.
   */
  public buildPayload(finesMacState: IFinesMacState): IFinesMacPayload {
    const { formData: accountDetailsState } = finesMacState.accountDetails;
    const { formData: courtDetailsState } = finesMacState.courtDetails;
    const { formData: paymentTermsState } = finesMacState.paymentTerms;
    const { formData: personalDetailsState } = finesMacState.personalDetails;
    const { formData: contactDetailsState } = finesMacState.contactDetails;
    const { formData: employerDetailsState } = finesMacState.employerDetails;
    const { formData: languageDetailsState } = finesMacState.languagePreferences;
    const { formData: companyDetailsState } = finesMacState.companyDetails;
    const { formData: parentGuardianDetailsState } = finesMacState.parentGuardianDetails;
    const { formData: accountCommentsNotesState } = finesMacState.accountCommentsNotes;

    // Build the parts of our payload...
    const initialPayload = this.buildInitialPayload(accountDetailsState, courtDetailsState, paymentTermsState);
    const defendant = buildDefendantPayload(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languageDetailsState,
      companyDetailsState,
      parentGuardianDetailsState,
    );
    const paymentTerms = buildPaymentTermsPayload(paymentTermsState);
    const accountNotes = buildAccountNotesPayload(accountCommentsNotesState);

    // Return our payload object
    const finesMacPayload: IFinesMacPayload = {
      ...initialPayload,
      defendant: defendant,
      offences: null,
      fp_ticket_detail: null,
      payment_terms: paymentTerms,
      account_notes: accountNotes,
    };

    return this.transformPayload(finesMacPayload, FINES_MAC_TRANSFORM_ITEMS_CONFIG);
  }
}
