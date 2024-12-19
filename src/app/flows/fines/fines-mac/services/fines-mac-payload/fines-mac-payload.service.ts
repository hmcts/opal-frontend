import { inject, Injectable } from '@angular/core';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

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
import { finesMacPayloadBuildAccountTimelineData } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-timeline-data.utils';
import { finesMacPayloadMapAccountBase } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-base.utils';

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

  /**
   * Retrieves the business unit user ID associated with a given business unit ID.
   *
   * @param businessUnitId - The ID of the business unit to search for. Can be null.
   * @param sessionUserState - The current session user state containing business unit user information.
   * @returns The business unit user ID if found, otherwise null.
   */
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

  /**
   * Builds the account payload for the fines MAC service.
   *
   * @param {IFinesMacState} finesMacState - The state object containing all the form data for the fines MAC process.
   * @returns {IFinesMacPayloadAccount} The constructed payload object for the account.
   */
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

  /**
   * Builds the payload for adding or replacing an account in the fines MAC system.
   *
   * @param finesMacState - The current state of the fines MAC.
   * @param sessionUserState - The current state of the session user.
   * @param addAccount - A boolean indicating whether to add a new account (true) or replace an existing account (false).
   * @returns The payload for adding or replacing an account.
   */
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

    const timeLineData = finesMacPayloadBuildAccountTimelineData(
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

  /**
   * Builds the payload for adding an account in the fines MAC (Management and Control) system.
   *
   * @param finesMacState - The current state of the fines MAC.
   * @param sessionUserState - The current state of the session user.
   * @returns The payload required to add an account in the fines MAC system.
   */
  public buildAddAccountPayload(
    finesMacState: IFinesMacState,
    sessionUserState: ISessionUserState,
  ): IFinesMacAddAccountPayload {
    return this.buildAddReplaceAccountPayload(structuredClone(finesMacState), sessionUserState, true);
  }

  /**
   * Builds the payload for replacing an account in the fines MAC state.
   *
   * @param finesMacState - The current state of the fines MAC.
   * @param sessionUserState - The current state of the session user.
   * @returns The payload required to add or replace an account in the fines MAC state.
   */
  public buildReplaceAccountPayload(
    finesMacState: IFinesMacState,
    sessionUserState: ISessionUserState,
  ): IFinesMacAddAccountPayload {
    return this.buildAddReplaceAccountPayload(structuredClone(finesMacState), sessionUserState, false);
  }

  /**
   * Checks if the given value is non-empty.
   *
   * This method determines if the provided value is non-empty by:
   * - Checking if the value is an array and has any elements.
   * - Checking if the value is not null.
   *
   * @param value - The value to check.
   * @returns `true` if the value is non-empty, `false` otherwise.
   */
  private hasNonEmptyValue(value: unknown): boolean {
    // If it's an array, check if it has any elements
    // This is for the aliases
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null;
  }

  /**
   * Determines the status of the fines MAC state form based on the provided form data.
   *
   * @template T - The type of the form data object.
   * @param {T} formData - The form data object to evaluate.
   * @returns {string} - The status of the form, either `FINES_MAC_STATUS.NOT_PROVIDED` or `FINES_MAC_STATUS.PROVIDED`.
   */
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

  /**
   * Updates the status of various sections within the provided `mappedFinesMacState` object.
   *
   * @param mappedFinesMacState - The state object containing various sections of fines MAC data.
   *
   * This method iterates over the sections of the `mappedFinesMacState` object and updates their status
   * by calling the `getFinesMacStateFormStatus` method with the respective form data. It handles the following sections:
   * - accountCommentsNotes
   * - accountDetails
   * - companyDetails
   * - contactDetails
   * - courtDetails
   * - employerDetails
   * - parentGuardianDetails
   * - paymentTerms
   * - personalDetails
   *
   * Additionally, it processes nested `offenceDetails` forms and their child forms if they exist, updating their status as well.
   *
   * @returns The updated `mappedFinesMacState` object with updated statuses for each section.
   */
  private setFinesMacStateStatuses(mappedFinesMacState: IFinesMacState) {
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

  /**
   * Maps the provided account payload to the fines MAC state.
   *
   * @param payload - The payload containing account information to be mapped.
   * @returns The updated fines MAC state after mapping the account information.
   */
  public mapAccountPayload(payload: IFinesMacAddAccountPayload) {
    // Convert the values back to the original format
    const transformedPayload = this.transformPayload(structuredClone(payload), FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG);

    // Build the state object...
    let finesMacState: IFinesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState = finesMacPayloadMapAccountBase(finesMacState, transformedPayload);
    finesMacState = finesMacPayloadMapAccountDefendant(finesMacState, transformedPayload.account);
    finesMacState = finesMacPayloadMapAccountPaymentTerms(finesMacState, transformedPayload.account);
    finesMacState = finesMacPayloadMapAccountAccountNotesPayload(
      finesMacState,
      transformedPayload.account.account_notes,
    );

    finesMacState = finesMacPayloadMapAccountOffences(finesMacState, transformedPayload);
    finesMacState = this.setFinesMacStateStatuses(finesMacState);

    return finesMacState;
  }
}
