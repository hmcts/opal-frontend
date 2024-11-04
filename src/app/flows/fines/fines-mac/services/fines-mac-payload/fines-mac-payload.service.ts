import { inject, Injectable } from '@angular/core';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

import { IFinesMacAccountDetailsState } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';

import { IFinesMacPaymentTermsState } from '../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';

import { IFinesMacCourtDetailsState } from '../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacPayloadAccountAccountInitial } from './interfaces/fines-mac-payload-account-initial.interface';

import { buildAccountDefendantPayload } from './utils/fines-mac-payload-account-defendant.utils';
import { buildAccountPaymentTermsPayload } from './utils/fines-mac-payload-account-payment-terms.utils';
import { buildAccountAccountNotesPayload } from './utils/fines-mac-payload-account-account-notes.utils';
import { IFinesMacPayloadAccount } from './interfaces/fines-mac-payload-account.interface';
import { TransformationService } from '@services/transformation-service/transformation.service';
import { FINES_MAC_TRANSFORM_ITEMS_CONFIG } from './constants/fines-mac-transform-items-config.constant';
import { ITransformItem } from '@services/transformation-service/interfaces/transform-item.interface';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';

import { IFinesMacAddAccountPayload } from './interfaces/fines-mac-payload-add-account.interfaces';

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
  private buildAccountInitialPayload(
    accountDetailsState: IFinesMacAccountDetailsState,
    courtDetailsState: IFinesMacCourtDetailsState,
    paymentTermsState: IFinesMacPaymentTermsState,
  ): IFinesMacPayloadAccountAccountInitial {
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
    finesMacPayload: IFinesMacAddAccountPayload,
    transformItemsConfig: ITransformItem[],
  ): IFinesMacAddAccountPayload {
    return this.transformationService.transformObjectValues(finesMacPayload, transformItemsConfig);
  }

  private getBusinessUnitBusinessUserId(businessUnitId: number, sessionUserState: ISessionUserState): string | null {
    const businessUnitUserId = sessionUserState.business_unit_user.find(
      (businessUnit) => businessUnit.business_unit_id === businessUnitId,
    );

    if (businessUnitUserId) {
      return businessUnitUserId.business_unit_user_id;
    }

    return null;
  }

  private buildAccountPayload(finesMacState: IFinesMacState): IFinesMacPayloadAccount {
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
    const initialPayload = this.buildAccountInitialPayload(accountDetailsState, courtDetailsState, paymentTermsState);
    const defendant = buildAccountDefendantPayload(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languageDetailsState,
      companyDetailsState,
      parentGuardianDetailsState,
    );
    const paymentTerms = buildAccountPaymentTermsPayload(paymentTermsState);
    const accountNotes = buildAccountAccountNotesPayload(accountCommentsNotesState);

    // Return our payload object
    return {
      ...initialPayload,
      defendant: defendant,
      offences: null,
      fp_ticket_detail: null,
      payment_terms: paymentTerms,
      account_notes: accountNotes,
    };
  }

  public buildAddAccountPayload(
    finesMacState: IFinesMacState,
    sessionUserState: ISessionUserState,
  ): IFinesMacAddAccountPayload {
    const { formData: accountDetailsState } = finesMacState.accountDetails;
    const { businessUnit } = finesMacState;
    const accountPayload = this.buildAccountPayload(finesMacState);

    // Build the add account payload
    const addAccountPayload: IFinesMacAddAccountPayload = {
      business_unit_id: businessUnit['business_unit_id'],
      submitted_by: this.getBusinessUnitBusinessUserId(businessUnit['business_unit_id'], sessionUserState),
      submitted_by_name: sessionUserState['name'],
      account: accountPayload,
      account_type: accountDetailsState['fm_create_account_account_type'],
      account_status: 'submitted',
      timeline_data: null,
    };

    // Transform the payload, format the dates to the correct format
    return this.transformPayload(addAccountPayload, FINES_MAC_TRANSFORM_ITEMS_CONFIG);
  }

  /**
   * Builds the payload for fines MAC based on the provided state.
   *
   * @param {IFinesMacState} finesMacState - The state containing all the necessary form data.
   * @returns {IFinesMacPayloadAccount} The constructed payload object.
   */
  // public buildPayload(
  //   finesMacState: IFinesMacState,
  //   sessionUserState: ISessionUserState,
  //   type: string,
  // ): IFinesMacPayloadAccount {
  //   const addAccountPayload = this.buildAddAccountPayload(finesMacState, sessionUserState);

  //   return this.transformPayload(addAccountPayload, FINES_MAC_TRANSFORM_ITEMS_CONFIG);
  // }
}
