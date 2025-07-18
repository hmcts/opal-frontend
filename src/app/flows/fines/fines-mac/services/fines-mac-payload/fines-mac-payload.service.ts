import { inject, Injectable } from '@angular/core';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';
import { finesMacPayloadBuildAccountPaymentTerms } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-payment-terms.utils';
import { finesMacPayloadBuildAccountAccountNotes } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-account-notes.utils';
import { IFinesMacPayloadAccount } from './interfaces/fines-mac-payload-account.interface';
import {
  FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG,
  FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG,
} from './constants/fines-mac-transform-items-config.constant';
import { IFinesMacAddAccountPayload } from './interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacAccountTimelineData } from './interfaces/fines-mac-payload-account-timeline-data.interface';
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
import { FINES_MAC_PAYLOAD_STATUSES } from './constants/fines-mac-payload-statuses.constant';
import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesOffencesNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { finesMacPayloadMapBusinessUnit } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-business-unit.utils';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { IOpalFinesDraftAccountPatchPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account.interface';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { finesMacPayloadBuildAccountFixedPenalty } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-fixed-penalty.utils';

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
   * Converts a date string in 'dd/MM/yyyy' format to an RFC 3339 date string ('YYYY-MM-DD').
   *
   * @param date - The date string in 'dd/MM/yyyy' format or null.
   * @returns The date string in RFC 3339 format ('YYYY-MM-DD') if valid, otherwise null.
   */
  private toRfc3339Date(date: string | null): string | null {
    if (!date) return null;
    const dateTime = this.dateService.getFromFormat(date, 'dd/MM/yyyy');
    return dateTime.isValid ? dateTime.toISODate() : null;
  }

  /**   * Converts a date string in RFC 3339 format ('yyyy-MM-dd') back to 'dd/MM/yyyy' format.
   *
   * @param date - The RFC 3339 date string to convert, or null.
   * @returns The date string in 'dd/MM/yyyy' format, or null if the input is null or invalid.
   */
  private fromRfc3339Date(date: string | null): string | null {
    if (!date) {
      return null;
    }

    const dateTime = this.dateService.getFromFormat(date, 'yyyy-MM-dd');
    return dateTime.isValid ? dateTime.toFormat('dd/MM/yyyy') : null;
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
    const { formData: fixedPenaltyDetails } = finesMacState.fixedPenaltyDetails;

    const offenceDetailsForms = finesMacState.offenceDetails;
    const offenceDetailsState = offenceDetailsForms.map((offence) => offence.formData);

    // Build the parts of our payload...
    const initialPayload = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState
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
    const fp_ticket_detail = finesMacPayloadBuildAccountFixedPenalty(
      fixedPenaltyDetails,
      this.toRfc3339Date.bind(this)
    );
    const paymentTerms = finesMacPayloadBuildAccountPaymentTerms(paymentTermsState);
    const accountNotes = finesMacPayloadBuildAccountAccountNotes(accountCommentsNotesState);
    const offences = finesMacPayloadBuildAccountOffences(
      offenceDetailsForms,
      courtDetailsState,
      this.toRfc3339Date.bind(this),
      fixedPenaltyDetails
    );

    // Return our payload object
    return {
      ...initialPayload,
      defendant: defendant,
      offences: offences,
      fp_ticket_detail: fp_ticket_detail,
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
    draftAccountPayload: IFinesMacAddAccountPayload | null,
    sessionUserState: ISessionUserState,
    addAccount: boolean,
  ): IFinesMacAddAccountPayload {
    const { formData: accountDetailsState } = finesMacState.accountDetails;
    const accountPayload = this.buildAccountPayload(finesMacState);
    const storedTimeLineData: IFinesMacAccountTimelineData[] = draftAccountPayload
      ? draftAccountPayload.timeline_data
      : [];
    const accountStatus = addAccount ? FINES_MAC_PAYLOAD_STATUSES.submitted : FINES_MAC_PAYLOAD_STATUSES.resubmitted;

    const timeLineData = finesMacPayloadBuildAccountTimelineData(
      sessionUserState['name'],
      accountStatus,
      this.dateService.toFormat(this.dateService.getDateNow(), 'yyyy-MM-dd'),
      null,
      storedTimeLineData,
    );

    // Build the add account payload
    const addAccountPayload: IFinesMacAddAccountPayload = {
      draft_account_id: draftAccountPayload ? draftAccountPayload.draft_account_id : null,
      created_at: null,
      account_snapshot: null,
      account_status_date: null,
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
      version: draftAccountPayload ? draftAccountPayload.version : 0,
    };

    // Transform the payload, format the dates to the correct format
    return this.transformPayload(addAccountPayload, FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG);
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
    return this.buildAddReplaceAccountPayload(structuredClone(finesMacState), null, sessionUserState, true);
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
    draftAccountPayload: IFinesMacAddAccountPayload,
    sessionUserState: ISessionUserState,
  ): IFinesMacAddAccountPayload {
    return this.buildAddReplaceAccountPayload(
      structuredClone(finesMacState),
      draftAccountPayload,
      sessionUserState,
      false,
    );
  }

  /**
   * Builds a patch payload for updating a fines account draft.
   *
   * @param draftAccountPayload - The original account payload to be patched.
   * @param newTimelineDataObject - The new timeline data object to append to the timeline.
   * @param sessionUserState - The current session user's state, used for validation information.
   * @returns The constructed patch payload for the fines account draft.
   */
  public buildPatchAccountPayload(
    draftAccountPayload: IFinesMacAddAccountPayload,
    status: string,
    reasonText: string | null,
    sessionUserState: ISessionUserState,
  ): IOpalFinesDraftAccountPatchPayload {
    return {
      account_status: status,
      business_unit_id: draftAccountPayload.business_unit_id!,
      reason_text: reasonText,
      timeline_data: finesMacPayloadBuildAccountTimelineData(
        sessionUserState['name'],
        status,
        this.dateService.toFormat(this.dateService.getDateNow(), 'yyyy-MM-dd'),
        reasonText,
        draftAccountPayload.timeline_data,
      ),
      validated_by:
        status === OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected
          ? null
          : this.getBusinessUnitBusinessUserId(draftAccountPayload.business_unit_id!, sessionUserState)!,
      validated_by_name: status === OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected ? null : sessionUserState['name'],
      version: draftAccountPayload.version!,
    };
  }

  /**
   * Maps the provided account payload to the fines MAC state.
   *
   * @param payload - The payload containing account information to be mapped.
   * @returns The updated fines MAC state after mapping the account information.
   */
  public mapAccountPayload(
    payload: IFinesMacAddAccountPayload,
    businessUnitRefData: IOpalFinesBusinessUnitNonSnakeCase | null,
    offencesRefData: IOpalFinesOffencesNonSnakeCase[] | null,
  ) {
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

    finesMacState = finesMacPayloadMapAccountOffences(finesMacState, transformedPayload, offencesRefData);
    finesMacState.offenceDetails.forEach(
      (offence) =>
        (offence.formData.fm_offence_details_date_of_sentence = this.fromRfc3339Date(
          offence.formData.fm_offence_details_date_of_sentence,
        )),
    );

    if (businessUnitRefData) {
      finesMacState = finesMacPayloadMapBusinessUnit(finesMacState, businessUnitRefData);
    }

    return finesMacState;
  }

  /**
   * Returns the defendant's name based on the defendant type in the provided payload.
   *
   * - If the defendant type is 'adultOrYouthOnly' or 'parentOrGuardianToPay', the name is constructed
   *   from the defendant's forenames and surname.
   * - Otherwise, the company name is returned.
   *
   * @param payload - The payload containing account and defendant information.
   * @returns The defendant's full name or company name as a string.
   */
  public getDefendantName(payload: IFinesMacAddAccountPayload): string {
    if (
      payload.account.defendant_type === FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly ||
      payload.account.defendant_type === FINES_MAC_DEFENDANT_TYPES_KEYS.parentOrGuardianToPay
    ) {
      return `${payload.account.defendant.forenames} ${payload.account.defendant.surname}`;
    } else {
      return `${payload.account.defendant.company_name}`;
    }
  }
}
