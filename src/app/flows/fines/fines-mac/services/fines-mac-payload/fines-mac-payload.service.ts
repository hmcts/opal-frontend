import { inject, Injectable } from '@angular/core';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

import { IFinesMacAccountDetailsState } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';

import { IFinesMacPaymentTermsState } from '../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';

import { IFinesMacCourtDetailsState } from '../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacPayloadAccountAccountInitial } from './interfaces/fines-mac-payload-account-initial.interface';

import { finesMacPayloadBuildAccountPaymentTerms } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-payment-terms.utils';
import { finesMacPayloadBuildAccountAccountNotes } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-account-notes.utils';
import { IFinesMacPayloadAccount } from './interfaces/fines-mac-payload-account.interface';
import { TransformationService } from '@services/transformation-service/transformation.service';
import {
  FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG,
  FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG,
} from './constants/fines-mac-transform-items-config.constant';
import { ITransformItem } from '@services/transformation-service/interfaces/transform-item.interface';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';

import { IFinesMacAddAccountPayload } from './interfaces/fines-mac-payload-add-account.interfaces';
import { DateService } from '@services/date-service/date.service';
import { IFinesMacAccountTimelineData } from './interfaces/fines-mac-payload-account-timeline-data.interface';
import { FineMacPayloadAccountAccountStatuses } from './enums/fines-mac-payload-account-account-statuses.enum';
import { finesMacPayloadBuildAccountOffences } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-offences.utils';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from './mocks/fines-mac-payload-add-account.mock';
import { mapAccountDefendantPayload } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-defendant.utils';
import { mapAccountPaymentTermsPayload } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-payment-terms.utils';
import { mapAccountAccountNotesPayload } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-account-notes.utils';
import { mapAccountOffencesPayload } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-offences.utils';
import { finesMacPayloadBuildAccountDefendant } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-defendant.utils';

@Injectable({
  providedIn: 'root',
})
export class FinesMacPayloadService {
  private readonly transformationService = inject(TransformationService);
  private readonly dateService = inject(DateService);

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
      account_sentence_date: null, // Derived from the earliest of all offence sentence dates
    };
  }

  /**
   * Transforms the given finesMacPayload object by applying the transformations
   * defined in the FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG.
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

  private buildTimelineDataPayload(
    username: string,
    status: string,
    statusDate: string,
    reasonText: string | null,
    timelineData: IFinesMacAccountTimelineData[] = [],
  ): IFinesMacAccountTimelineData[] {
    timelineData.push({
      username,
      status,
      status_date: statusDate,
      reason_text: reasonText,
    });

    return timelineData;
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

    const offenceDetailsState = finesMacState.offenceDetails;

    // Build the parts of our payload...
    const initialPayload = this.buildAccountInitialPayload(accountDetailsState, courtDetailsState, paymentTermsState);
    const defendant = finesMacPayloadBuildAccountDefendant(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languageDetailsState,
      companyDetailsState,
      parentGuardianDetailsState,
    );
    const paymentTerms = finesMacPayloadBuildAccountPaymentTerms(paymentTermsState);
    const accountNotes = finesMacPayloadBuildAccountAccountNotes(accountCommentsNotesState);
    const offences = finesMacPayloadBuildAccountOffences(offenceDetailsState, courtDetailsState);

    // Return our payload object
    return {
      ...initialPayload,
      defendant: defendant,
      offences: offences,
      fp_ticket_detail: null,
      payment_terms: paymentTerms,
      account_notes: accountNotes,
    };
  }

  private buildAddReplaceAccountPayload(
    finesMacState: IFinesMacState,
    sessionUserState: ISessionUserState,
    addAccount: boolean,
  ): IFinesMacAddAccountPayload {
    const { formData: accountDetailsState } = finesMacState.accountDetails;
    const { businessUnit } = finesMacState;
    const accountPayload = this.buildAccountPayload(finesMacState);
    const storedTimeLineData: IFinesMacAccountTimelineData[] = []; // Replace with stored timeline data when we have it...awaiting edit mode.
    const accountStatus = addAccount
      ? FineMacPayloadAccountAccountStatuses.submitted
      : FineMacPayloadAccountAccountStatuses.resubmitted;

    const timeLineData = this.buildTimelineDataPayload(
      sessionUserState['name'],
      accountStatus,
      this.dateService.toFormat(this.dateService.getDateNow(), 'yyyy-MM-dd'),
      null,
      storedTimeLineData,
    );

    // Build the add account payload
    const addAccountPayload: IFinesMacAddAccountPayload = {
      business_unit_id: businessUnit['business_unit_id'],
      submitted_by: this.getBusinessUnitBusinessUserId(businessUnit['business_unit_id'], sessionUserState),
      submitted_by_name: sessionUserState['name'],
      account: accountPayload,
      account_type: accountDetailsState['fm_create_account_account_type'],
      account_status: accountStatus,
      timeline_data: timeLineData,
    };

    // Transform the payload, format the dates to the correct format
    return this.transformPayload(addAccountPayload, FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG);
  }

  public buildAddAccountPayload(
    finesMacState: IFinesMacState,
    sessionUserState: ISessionUserState,
  ): IFinesMacAddAccountPayload {
    return this.buildAddReplaceAccountPayload(structuredClone(finesMacState), sessionUserState, true);
  }

  public buildReplaceAccountPayload(
    finesMacState: IFinesMacState,
    sessionUserState: ISessionUserState,
  ): IFinesMacAddAccountPayload {
    return this.buildAddReplaceAccountPayload(structuredClone(finesMacState), sessionUserState, false);
  }

  // ***** //

  private mapInitialPayloadToFinesMacState(
    mappedFinesMacState: IFinesMacState,
    payload: IFinesMacAddAccountPayload,
  ): IFinesMacState {
    const { account: payloadAccount, business_unit_id } = payload;

    // Update account details
    mappedFinesMacState.accountDetails.formData = {
      ...mappedFinesMacState.accountDetails.formData,
      fm_create_account_account_type: payloadAccount.account_type,
      fm_create_account_defendant_type: payloadAccount.defendant_type,
      fm_create_account_business_unit: business_unit_id.toString(), // Convert to string
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
  }

  public convertPayloadToFinesMacState(payload: IFinesMacAddAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT) {
    // Convert the values back to the original format
    const transformedPayload = this.transformPayload(structuredClone(payload), FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG);

    // Build the state object...
    let finesMacState: IFinesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState = this.mapInitialPayloadToFinesMacState(finesMacState, transformedPayload);
    finesMacState = mapAccountDefendantPayload(finesMacState, transformedPayload.account);
    finesMacState = mapAccountPaymentTermsPayload(finesMacState, transformedPayload.account);
    finesMacState = mapAccountAccountNotesPayload(finesMacState, transformedPayload.account.account_notes);
    finesMacState = mapAccountOffencesPayload(finesMacState, transformedPayload);
    return finesMacState;
  }
}
