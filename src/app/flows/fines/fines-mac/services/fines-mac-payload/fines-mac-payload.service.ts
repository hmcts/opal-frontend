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

import { finesMacPayloadMapAccountDefendant } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-defendant.utils';
import { finesMacPayloadMapAccountPaymentTerms } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-payment-terms.utils';
import { finesMacPayloadMapAccountAccountNotesPayload } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-account-notes.utils';
import { finesMacPayloadMapAccountOffences } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-offences.utils';
import { finesMacPayloadBuildAccountDefendant } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-defendant.utils';

import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { finesMacPayloadBuildAccountBase } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-base.utils';
import { finesMacPayloadBuildTimelineData } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-timeline-data';

@Injectable({
  providedIn: 'root',
})
export class FinesMacPayloadService {
  private readonly transformationService = inject(TransformationService);
  private readonly dateService = inject(DateService);

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

  private getBusinessUnitBusinessUserId(
    businessUnitId: number | null,
    sessionUserState: ISessionUserState,
  ): string | null {
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

    const offenceDetailsForms = finesMacState.offenceDetails;
    const offenceDetailsState = offenceDetailsForms.map((offence) => offence.formData);

    // Build the parts of our payload...
    const initialPayload = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );
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
    const offences = finesMacPayloadBuildAccountOffences(offenceDetailsForms, courtDetailsState);

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
    const accountPayload = this.buildAccountPayload(finesMacState);
    const storedTimeLineData: IFinesMacAccountTimelineData[] = []; // Replace with stored timeline data when we have it...awaiting edit mode.
    const accountStatus = addAccount
      ? FineMacPayloadAccountAccountStatuses.submitted
      : FineMacPayloadAccountAccountStatuses.resubmitted;

    const timeLineData = finesMacPayloadBuildTimelineData(
      sessionUserState['name'],
      accountStatus,
      this.dateService.toFormat(this.dateService.getDateNow(), 'yyyy-MM-dd'),
      null,
      storedTimeLineData,
    );

    // Build the add account payload
    const addAccountPayload: IFinesMacAddAccountPayload = {
      business_unit_id: accountDetailsState['fm_create_account_business_unit_id'],
      submitted_by: this.getBusinessUnitBusinessUserId(
        accountDetailsState['fm_create_account_business_unit_id'],
        sessionUserState,
      ),
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

  //TODO: Move to utils
  private hasNonEmptyValue(value: unknown): boolean {
    // If it's an array, check if it has any elements
    // This is for the aliases
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null;
  }

  //TODO: Move to utils
  private getFinesMacStateFormStatus<T extends object>(formData: T): string {
    let newStatus = FINES_MAC_STATUS.NOT_PROVIDED;

    // Check if any of the values are not empty
    Object.entries(formData).forEach(([, value]) => {
      const hasValue = this.hasNonEmptyValue(value);
      // If we have a value and the status is not provided, set it to provided
      if (hasValue && newStatus === FINES_MAC_STATUS.NOT_PROVIDED) {
        newStatus = FINES_MAC_STATUS.PROVIDED;
      }
    });

    return newStatus;
  }

  private mapFinesMacStateStatuses(mappedFinesMacState: IFinesMacState) {
    const getFormStatus = <T extends object>(formData: T) => this.getFinesMacStateFormStatus(formData);

    mappedFinesMacState.accountCommentsNotes.status = getFormStatus(mappedFinesMacState.accountCommentsNotes.formData);
    mappedFinesMacState.accountDetails.status = getFormStatus(mappedFinesMacState.accountDetails.formData);
    mappedFinesMacState.companyDetails.status = getFormStatus(mappedFinesMacState.companyDetails.formData);
    mappedFinesMacState.contactDetails.status = getFormStatus(mappedFinesMacState.contactDetails.formData);
    mappedFinesMacState.courtDetails.status = getFormStatus(mappedFinesMacState.courtDetails.formData);
    mappedFinesMacState.employerDetails.status = getFormStatus(mappedFinesMacState.employerDetails.formData);
    mappedFinesMacState.parentGuardianDetails.status = getFormStatus(
      mappedFinesMacState.parentGuardianDetails.formData,
    );
    mappedFinesMacState.paymentTerms.status = getFormStatus(mappedFinesMacState.paymentTerms.formData);
    mappedFinesMacState.personalDetails.status = getFormStatus(mappedFinesMacState.personalDetails.formData);

    // Loop over the nested offence details forms, and the child forms if they exist
    mappedFinesMacState.offenceDetails.forEach((offence) => {
      offence.status = getFormStatus(offence.formData);
      if (offence.childFormData) {
        offence.childFormData.forEach((childOffence) => {
          childOffence.status = getFormStatus(childOffence.formData);
        });
      }
    });

    return mappedFinesMacState;
  }

  // TODO: Move to utils
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
  }

  public convertPayloadToFinesMacState(payload: IFinesMacAddAccountPayload) {
    // Convert the values back to the original format
    const transformedPayload = this.transformPayload(structuredClone(payload), FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG);

    // Build the state object...
    let finesMacState: IFinesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState = this.mapInitialPayloadToFinesMacState(finesMacState, transformedPayload);
    finesMacState = finesMacPayloadMapAccountDefendant(finesMacState, transformedPayload.account);
    finesMacState = finesMacPayloadMapAccountPaymentTerms(finesMacState, transformedPayload.account);
    finesMacState = finesMacPayloadMapAccountAccountNotesPayload(
      finesMacState,
      transformedPayload.account.account_notes,
    );
    finesMacState = finesMacPayloadMapAccountOffences(finesMacState, transformedPayload);

    // Update the form statuses
    //TODO: Move to utils?
    finesMacState = this.mapFinesMacStateStatuses(finesMacState);

    return finesMacState;
  }
}
