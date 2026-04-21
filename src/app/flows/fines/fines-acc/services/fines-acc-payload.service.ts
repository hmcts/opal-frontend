import { inject, Injectable } from '@angular/core';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { IFinesAccAddNoteForm } from '../fines-acc-note-add/interfaces/fines-acc-note-add-form.interface';
import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { IFinesAccAddCommentsFormState } from '../fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';
import { IOpalFinesUpdateDefendantAccountPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-update-defendant-account.interface';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { FINES_ACC_BUILD_TRANSFORM_ITEMS_CONFIG } from './constants/fines-acc-transform-items-config.constant';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-party-details.interface';
import { IFinesAccPartyAddAmendConvertState } from '../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-state.interface';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';
import { transformDefendantAccountPartyPayload } from './utils/fines-acc-payload-transform-defendant-data.utils';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { IFinesAccPaymentTermsAmendState } from '../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-state.interface';
import { IFinesAccPaymentTermsAmendForm } from '../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-form.interface';
import { transformPaymentTermsData } from './utils/fines-acc-payload-transform-payment-terms-data.utils';
import { IOpalFinesAmendPaymentTermsPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-amend-payment-terms-payload.interface';
import { buildPaymentTermsAmendPayloadUtil } from './utils/fines-acc-payload-build-payment-terms-amend.utils';
import { buildAccountPartyFromFormState } from './utils/fines-acc-payload-build-defendant-data.utils';
import { IOpalFinesAccountMinorCreditorDetailsHeader } from '../fines-acc-minor-creditor-details/interfaces/fines-acc-minor-creditor-details-header.interface';
import { IFinesAccEnfOverrideAddChangeFormState } from '../fines-acc-enf-override-add-change/interfaces/fines-acc-enf-override-add-change-form-state.interface';
import { IFinesAccEnfCourtChangeFormState } from '../fines-acc-enf-court-change/interfaces/fines-acc-enf-court-change-form-state.interface';
import { IOpalFinesUpdateDefendantAccountCollectionOrder } from '@services/fines/opal-fines-service/interfaces/opal-fines-update-defendant-account-collection-order.interface';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccEnfColloChangeFormState } from '../fines-acc-enf-collo-change/interfaces/fines-acc-enf-collo-change-form-state.interface';
import { FINES_ACC_COLLECTION_ORDER_PAYLOAD_DEFAULTS } from './constants/fines-acc-collection-order-payload-defaults.constant';
import { IOpalFinesUpdateMinorCreditorAccountPayload } from '../../services/opal-fines-service/interfaces/opal-fines-update-minor-creditor-account-payload.interface';
import { IOpalFinesAccountMinorCreditorAtAGlance } from '../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesAccPayloadService {
  private readonly transformationService = inject(TransformationService);
  private readonly payloadService = inject(FinesMacPayloadService);
  private readonly globalStore = inject(GlobalStore);
  private readonly finesAccStore = inject(FinesAccountStore);

  /**
   * Constructs the payload for adding a note.
   *
   * This method collects necessary data from the finesAccStore as well as the form input to build the
   * payload required for adding a new note to the account. It gathers the account version, the associated
   * record's type and ID, the note type (hardcoded as 'AA'), and the note text from the form data.
   *
   * @param form - The form containing note data for the fines account.
   * @returns The payload object conforming to the IOpalFinesAddNotePayload interface.
   */
  public buildAddNotePayload(form: IFinesAccAddNoteForm): IOpalFinesAddNotePayload {
    return {
      activity_note: {
        record_type: 'defendant_accounts',
        record_id: this.finesAccStore.account_id()!,
        note_text: form.formData.facc_add_notes!,
        note_type: 'AA',
      },
    };
  }

  /**
   * Transforms the given IOpalFinesAccountDefendantDetailsHeader into IFinesAccountState for the store
   * @param account_id The account ID for which the header data was fetched. This is needed to set the account_id in the store state, as the header data does not contain the account_id field.
   * @param headingData The heading data as either IOpalFinesAccountDefendantDetailsHeader
   * @returns The transformed account state to be set in the store.
   */
  public transformDefendantAccountHeaderForStore(
    account_id: number,
    headingData: IOpalFinesAccountDefendantDetailsHeader,
  ): IFinesAccountState {
    const party_name = headingData.party_details.organisation_flag
      ? (headingData.party_details.organisation_details?.organisation_name ?? '')
      : [
          headingData.party_details.individual_details?.title,
          headingData.party_details.individual_details?.forenames,
          headingData.party_details.individual_details?.surname
            ? headingData.party_details.individual_details.surname.toUpperCase()
            : undefined,
        ]
          .filter(Boolean)
          .join(' ');

    const business_unit_user_id = this.payloadService.getBusinessUnitBusinessUserId(
      Number(headingData.business_unit_summary.business_unit_id),
      this.globalStore.userState(),
    );

    return {
      account_number: headingData.account_number,
      account_id: Number(account_id),
      pg_party_id: headingData.parent_guardian_party_id,
      party_id: headingData.defendant_account_party_id,
      party_type: headingData.debtor_type,
      party_name,
      base_version: headingData.version,
      business_unit_id: headingData.business_unit_summary.business_unit_id,
      business_unit_user_id,
      welsh_speaking: headingData.business_unit_summary.welsh_speaking,
    };
  }

  /**
   * Transforms the given IOpalFinesAccountMinorCreditorDetailsHeader into IFinesAccountState for the store
   * @param account_id The account ID for which the header data was fetched. This is needed to set the account_id in the store state, as the header data does not contain the account_id field.
   * @param headingData The heading data as either IOpalFinesAccountMinorCreditorDetailsHeader
   * @returns The transformed account state to be set in the store.
   */
  public transformMinorCreditorAccountHeaderForStore(
    account_id: number,
    headingData: IOpalFinesAccountMinorCreditorDetailsHeader,
  ): IFinesAccountState {
    const party_name = headingData.party.organisation_flag
      ? (headingData.party.organisation_details?.organisation_name ?? '')
      : [
          headingData.party.individual_details?.title,
          headingData.party.individual_details?.forenames,
          headingData.party.individual_details?.surname
            ? headingData.party.individual_details.surname.toUpperCase()
            : undefined,
        ]
          .filter(Boolean)
          .join(' ');

    const business_unit_user_id = this.payloadService.getBusinessUnitBusinessUserId(
      Number(headingData.business_unit.business_unit_id),
      this.globalStore.userState(),
    );

    return {
      account_number: headingData.creditor.account_number,
      account_id: Number(account_id),
      pg_party_id: null,
      party_id: headingData.party.party_id,
      party_type: 'Minor Creditor',
      party_name,
      base_version: headingData.version,
      business_unit_id: headingData.business_unit.business_unit_id,
      business_unit_user_id,
      welsh_speaking: headingData.business_unit.welsh_speaking,
    };
  }

  /**

   * Transforms the given IOpalFinesAccountDefendantAtAGlance into IFinesAccAddCommentsFormState for the Comments Add form
   *
   * @param atAGlanceData - The at-a-glance data from the API.
   * @returns The transformed form state object for comments add form.
   */
  public transformAtAGlanceDataToCommentsForm(
    atAGlanceData: IOpalFinesAccountDefendantAtAGlance,
  ): IFinesAccAddCommentsFormState {
    const { comments_and_notes } = atAGlanceData;
    return {
      facc_add_comment: comments_and_notes?.account_comment || '',
      facc_add_free_text_1: comments_and_notes?.free_text_note_1 || '',
      facc_add_free_text_2: comments_and_notes?.free_text_note_2 || '',
      facc_add_free_text_3: comments_and_notes?.free_text_note_3 || '',
    };
  }

  /**
   * Transforms the given IFinesAccAddCommentsFormState into an update payload
   * for the defendant account API.
   *
   * @param formState - The form state containing the comment and note data
   * @returns The transformed payload for updating the defendant account
   */
  public buildCommentsFormPayload(formState: IFinesAccAddCommentsFormState): IOpalFinesUpdateDefendantAccountPayload {
    return {
      comment_and_notes: {
        account_comment: formState.facc_add_comment || null,
        free_text_note_1: formState.facc_add_free_text_1 || null,
        free_text_note_2: formState.facc_add_free_text_2 || null,
        free_text_note_3: formState.facc_add_free_text_3 || null,
      },
    };
  }

  /**
   * Transforms the given collection order form into an update payload
   * for the defendant account API.
   *
   * @param form - The submitted collection order form
   * @returns The transformed payload for updating the defendant account
   */
  public buildCollectionOrderPayload(
    form: IAbstractFormBaseForm<IFinesAccEnfColloChangeFormState>,
  ): IOpalFinesUpdateDefendantAccountPayload {
    const collectionOrderFlag = form.formData.facc_enf_collection_order_made as boolean;

    const collectionOrder: IOpalFinesUpdateDefendantAccountCollectionOrder = {
      ...FINES_ACC_COLLECTION_ORDER_PAYLOAD_DEFAULTS,
      collection_order_flag: collectionOrderFlag,
    };

    return {
      collection_order: collectionOrder,
    };
  }

  /**
   * Transforms the given IFinesAccEnfOverrideAddChangeFormState into an update payload
   * for the defendant account API.
   *
   * @param formState - The form state containing the enforcement override data
   * @returns The transformed payload for updating the defendant account
   */
  public buildEnforcementOverrideFormPayload(
    formState: IFinesAccEnfOverrideAddChangeFormState,
  ): IOpalFinesUpdateDefendantAccountPayload {
    const {
      fenf_account_enforcement_action: enforcement_override_result_id,
      fenf_account_enforcement_enforcer: enforcer_id,
      fenf_account_enforcement_lja: lja_id,
    } = formState;
    return {
      enforcement_override: {
        enforcement_override_result: enforcement_override_result_id
          ? {
              enforcement_override_result_id,
            }
          : null,
        enforcer: enforcer_id
          ? {
              enforcer_id,
            }
          : null,
        lja: lja_id
          ? {
              lja_id,
            }
          : null,
      },
    };
  }

  /**
   * Transforms the given IFinesAccEnfCourtChangeFormState into an update payload
   * for the defendant account API.
   *
   * @param formState - The form state containing the enforcement court data
   * @returns The transformed payload for updating the defendant account
   */
  public buildEnforcementCourtFormPayload(
    formState: IFinesAccEnfCourtChangeFormState,
  ): IOpalFinesUpdateDefendantAccountPayload {
    return {
      enforcement_court: {
        court_id: Number(formState.facc_enf_court),
      },
    };
  }

  /**

   * Transforms the given finesMacPayload object by applying the transformations
   * defined in the FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG.
   *
   * @param finesAccPayload - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public transformPayload<T extends { [key: string]: any }>(
    finesAccPayload: T,
    transformItemsConfig: ITransformItem[],
  ): T {
    return this.transformationService.transformObjectValues(finesAccPayload, transformItemsConfig);
  }

  /**
   * Transforms the given IOpalFinesAccountDefendantAccountParty into IFinesAccPartyAddAmendConvertState for the party Amend form
   *
   * @param defendantData - The defendant tab data from the API.
   * @param partyType - The party type (company, individual, parentGuardian) to determine which fields to return
   * @returns The transformed form state object for debtor add/amend form.
   */
  public mapDebtorAccountPartyPayload(
    defendantData: IOpalFinesAccountDefendantAccountParty,
    partyType: string,
    isDebtor: boolean,
  ): IFinesAccPartyAddAmendConvertState {
    return transformDefendantAccountPartyPayload(defendantData, partyType, isDebtor);
  }

  /**
   * Transforms payment terms data from API response format to form data format.
   * Combines payment terms latest data with enforcement action result data.
   *
   * @param paymentTermsData - The payment terms latest data from the API
   * @param resultData - The enforcement action result data from the API (optional)
   * @returns Transformed data in the form structure format
   */
  public transformPaymentTermsPayload(
    paymentTermsData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest,
    resultData: IOpalFinesResultRefData | null,
  ): IFinesAccPaymentTermsAmendForm {
    const formData = transformPaymentTermsData(paymentTermsData, resultData);
    return {
      formData,
      nestedFlow: false,
    };
  }

  /**
   * Builds the payload for amending payment terms on a defendant account.
   * Transforms form data into the API payload format required for payment terms amendment.
   *
   * @param formData - The payment terms form data from the component
   * @returns The payload object conforming to the IOpalFinesAmendPaymentTermsPayload interface
   */
  public buildPaymentTermsAmendPayload(formData: IFinesAccPaymentTermsAmendState): IOpalFinesAmendPaymentTermsPayload {
    return this.transformPayload(buildPaymentTermsAmendPayloadUtil(formData), FINES_ACC_BUILD_TRANSFORM_ITEMS_CONFIG);
  }

  /**
   * This is the reverse transformation of mapDebtorAccountPartyPayload.
   *
   * @param formState - The form state containing party add/amend/convert data
   * @param partyType - The party type (company, individual, parentGuardian)
   * @param isDebtor - Whether this is a debtor party
   * @returns The transformed payload object for updating party details
   */
  public buildAccountPartyPayload(
    formState: IFinesAccPartyAddAmendConvertState,
    partyType: string,
    isDebtor: boolean,
    partyId: string,
  ): IOpalFinesAccountPartyDetails {
    return this.transformPayload(
      buildAccountPartyFromFormState(formState, partyType, isDebtor, partyId),
      FINES_ACC_BUILD_TRANSFORM_ITEMS_CONFIG,
    );
  }

  /**
   * Builds the base payload for updating a minor creditor account.
   * @param data - The minor creditor account at a glance data
   * @returns The payload object conforming to the IOpalFinesUpdateMinorCreditorAccountPayload interface
   */
  public buildMinorCreditorAccountUpdatePayload(
    data: IOpalFinesAccountMinorCreditorAtAGlance,
  ): IOpalFinesUpdateMinorCreditorAccountPayload {
    return {
      creditor_account_id: data.creditor_account_id,
      party_details: data.party,
      address: data.address,
      payment: {
        account_name: null,
        sort_code: null,
        account_number: null,
        account_reference: null,
        pay_by_bacs: data.payment.is_bacs,
        hold_payment: data.payment.hold_payment,
      },
    };
  }
}
