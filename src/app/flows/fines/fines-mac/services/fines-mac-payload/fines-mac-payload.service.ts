import { inject, Injectable } from '@angular/core';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';
import { finesMacPayloadBuildAccountPaymentTerms } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-payment-terms.utils';
import { finesMacPayloadBuildAccountAccountNotes } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-account-notes.utils';
import { IFinesMacPayloadAccount } from './interfaces/fines-mac-payload-account.interface';
import { FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG } from './constants/fines-mac-transform-items-config.constant';
import { FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG } from './constants/fines-mac-map-transform-items-config.constant';
import { IFinesMacAddAccountPayload } from './interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacAddAccountRequestPayload } from './interfaces/fines-mac-payload-add-account-request.interface';
import { IFinesMacReplaceAccountRequestPayload } from './interfaces/fines-mac-payload-replace-account-request.interface';
import { finesMacPayloadBuildAccountOffences } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-offences.utils';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { finesMacPayloadMapAccountDefendant } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-defendant.utils';
import { finesMacPayloadMapAccountPaymentTerms } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-payment-terms.utils';
import { finesMacPayloadMapAccountAccountNotesPayload } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-account-notes.utils';
import { finesMacPayloadMapAccountOffences } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-offences.utils';
import { finesMacPayloadBuildAccountDefendant } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-defendant.utils';
import { finesMacPayloadBuildAccountBase } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-base.utils';
import { finesMacPayloadMapAccountBase } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-base.utils';
import { FINES_MAC_PAYLOAD_STATUSES } from './constants/fines-mac-payload-statuses.constant';
import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-non-snake-case.interface';
import { IOpalFinesOffencesNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-non-snake-case.interface';
import { finesMacPayloadMapBusinessUnit } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-business-unit.utils';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { finesMacPayloadBuildAccountFixedPenalty } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-fixed-penalty.utils';
import { finesMacPayloadMapAccountFixedPenalty } from './utils/fines-mac-payload-map-account/fines-mac-payload-map-account-fixed-penalty.utils';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_ACCOUNT_TYPES } from '../../../constants/fines-account-types.constant';
import { IOpalFinesDraftAccountPatchRequestPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-patch-request-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesMacPayloadService {
  private readonly transformationService = inject(TransformationService);

  /**
   * Transforms the given finesMacPayload object by applying the transformations
   * defined in the FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG.
   *
   * @param finesMacPayload - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  private transformPayload<
    T extends IFinesMacAddAccountPayload | IFinesMacAddAccountRequestPayload | IFinesMacReplaceAccountRequestPayload,
  >(finesMacPayload: T, transformItemsConfig: ITransformItem[]): T {
    return this.transformationService.transformObjectValues(finesMacPayload, transformItemsConfig);
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
    const { formData: originatorTypeState } = finesMacState.originatorType;

    const offenceDetailsForms = finesMacState.offenceDetails;
    const offenceDetailsState = offenceDetailsForms.map((offence) => offence.formData);
    const accountType = accountDetailsState['fm_create_account_account_type'];

    // Build the parts of our payload...
    const initialPayload = finesMacPayloadBuildAccountBase(
      originatorTypeState,
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
      fixedPenaltyDetails,
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
    let fp_ticket_detail = null;
    if (accountDetailsState.fm_create_account_account_type === FINES_ACCOUNT_TYPES['Fixed Penalty']) {
      fp_ticket_detail = finesMacPayloadBuildAccountFixedPenalty(fixedPenaltyDetails);
    }
    const paymentTerms = finesMacPayloadBuildAccountPaymentTerms(paymentTermsState, accountType);
    const accountNotes = finesMacPayloadBuildAccountAccountNotes(accountCommentsNotesState);
    const offences = finesMacPayloadBuildAccountOffences(offenceDetailsForms, fixedPenaltyDetails, accountType);

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
   * Builds the fields shared by add and replace draft-account requests.
   *
   * @param finesMacState - The current state of the fines MAC.
   * @param accountStatus - Status to include in the request.
   * @returns The shared draft-account request payload.
   */
  private buildAccountRequestPayload(
    finesMacState: IFinesMacState,
    accountStatus: string,
  ): IFinesMacReplaceAccountRequestPayload {
    const { formData: accountDetailsState } = finesMacState.accountDetails;
    const accountPayload = this.buildAccountPayload(finesMacState);

    const requestPayload: IFinesMacReplaceAccountRequestPayload = {
      business_unit_id: accountDetailsState['fm_create_account_business_unit_id']!,
      account: accountPayload,
      account_type: accountDetailsState['fm_create_account_account_type']!,
      account_status: accountStatus,
    };

    return this.transformPayload(requestPayload, FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG);
  }

  /**
   * Retrieves the business unit user ID associated with a business unit.
   *
   * @param businessUnitId - Business unit ID to find.
   * @param userState - Current user state containing business unit memberships.
   * @returns The matching business unit user ID, or null when none exists.
   */
  public getBusinessUnitBusinessUserId(businessUnitId: number | null, userState: IOpalUserState): string | null {
    return (
      userState.business_unit_users.find((businessUnitUser) => businessUnitUser.business_unit_id === businessUnitId)
        ?.business_unit_user_id ?? null
    );
  }

  /**
   * Builds the payload for adding an account in the fines MAC (Management and Control) system.
   *
   * @param finesMacState - The current state of the fines MAC.
   * @returns The payload required to add an account in the fines MAC system.
   */
  public buildAddAccountPayload(finesMacState: IFinesMacState): IFinesMacAddAccountRequestPayload {
    return {
      ...this.buildAccountRequestPayload(structuredClone(finesMacState), FINES_MAC_PAYLOAD_STATUSES.submitted),
      status_message: null,
    };
  }

  /**
   * Builds the payload for replacing an account in the fines MAC state.
   *
   * @param finesMacState - The current state of the fines MAC.
   * @returns The payload required to add or replace an account in the fines MAC state.
   */
  public buildReplaceAccountPayload(finesMacState: IFinesMacState): IFinesMacReplaceAccountRequestPayload {
    return this.buildAccountRequestPayload(structuredClone(finesMacState), FINES_MAC_PAYLOAD_STATUSES.resubmitted);
  }

  /**
   * Builds a patch payload for updating a fines account draft.
   *
   * @param draftAccountPayload - The original account payload to be patched.
   * @param status - Status to apply to the draft account.
   * @param reasonText - Reason associated with the status change.
   * @returns The constructed patch payload for the fines account draft.
   */
  public buildPatchAccountPayload(
    draftAccountPayload: IFinesMacAddAccountPayload,
    status: string,
    reasonText: string | null,
  ): IOpalFinesDraftAccountPatchRequestPayload {
    return {
      account_status: status,
      business_unit_id: draftAccountPayload.business_unit_id!,
      reason_text: reasonText,
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
    finesMacState = finesMacPayloadMapAccountFixedPenalty(finesMacState, transformedPayload, offencesRefData);

    if (businessUnitRefData) {
      finesMacState = finesMacPayloadMapBusinessUnit(finesMacState, businessUnitRefData);
    }

    return finesMacState;
  }

  /**
   * Returns the defendant's name based on the defendant type in the provided payload.
   *
   * - If the defendant type is 'adultOrYouthOnly' or 'pgToPay', the name is constructed
   *   from the defendant's forenames and surname.
   * - Otherwise, the company name is returned.
   *
   * @param payload - The payload containing account and defendant information.
   * @returns The defendant's full name or company name as a string.
   */
  public getDefendantName(payload: IFinesMacAddAccountPayload): string {
    if (
      payload.account.defendant_type === FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly ||
      payload.account.defendant_type === FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay
    ) {
      return `${payload.account.defendant.forenames} ${payload.account.defendant.surname}`;
    } else {
      return `${payload.account.defendant.company_name}`;
    }
  }
}
