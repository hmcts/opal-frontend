import { inject, Injectable } from '@angular/core';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { IOpalFinesAccountDefendantDetailsDefendantTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-defendant-tab-ref-data.interface';
import { IFinesAccDebtorAddAmendForm } from '../fines-acc-debtor-add-amend/interfaces/fines-acc-debtor-add-amend-form.interface';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';


@Injectable({
  providedIn: 'root',
})
export class FinesAccPayloadService {
  private readonly transformationService = inject(TransformationService);
  private readonly payloadService = inject(FinesMacPayloadService);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Transforms the given IOpalFinesDefendantAccountHeader into IFinesAccountState for the Account Store
   *
   * @param headingData - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  public transformAccountHeaderForStore(
    account_id: number,
    headingData: IOpalFinesAccountDefendantDetailsHeader,
  ): IFinesAccountState {
    let party_name = '';
    if (headingData.party_details.organisation_flag) {
      party_name = headingData.party_details.organisation_details?.organisation_name ?? '';
    } else {
      party_name = `${headingData.party_details.individual_details?.title} ${headingData.party_details.individual_details?.forenames} ${headingData.party_details.individual_details?.surname?.toUpperCase()}`;
    }
    const business_unit_user_id = this.payloadService.getBusinessUnitBusinessUserId(
      Number(headingData.business_unit_summary.business_unit_id),
      this.globalStore.userState(),
    );

    return {
      account_number: headingData.account_number,
      account_id: Number(account_id),
      party_id: headingData.defendant_party_id,
      party_type: headingData.debtor_type,
      party_name: party_name,
      base_version: headingData.version,
      business_unit_id: headingData.business_unit_summary.business_unit_id,
      business_unit_user_id: business_unit_user_id,
      welsh_speaking: headingData.business_unit_summary.welsh_speaking,
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
   * Transforms the given IOpalFinesAccountDefendantDetailsDefendantTabRefData into IFinesAccDebtorAddAmendForm for the Debtor Add/Amend form
   *
   * @param defendantData - The defendant tab data from the API.
   * @returns The transformed form state object for debtor add/amend form.
   */
  public transformDefendantDataToDebtorForm(
    defendantData: IOpalFinesAccountDefendantDetailsDefendantTabRefData,
  ): IFinesAccDebtorAddAmendForm {
    const { defendant_account_party } = defendantData;
    const { party_details, address, contact_details, vehicle_details, employer_details, language_preferences } =
      defendant_account_party;

    const individualDetails = party_details.individual_details;

    return {
      facc_debtor_add_amend_title: individualDetails?.title || null,
      facc_debtor_add_amend_forenames: individualDetails?.forenames || null,
      facc_debtor_add_amend_surname: individualDetails?.surname || null,
      facc_debtor_add_amend_aliases:
        individualDetails?.individual_aliases?.map((alias: any) => ({
          facc_debtor_add_amend_alias_forenames: alias.alias_forenames || null,
          facc_debtor_add_amend_alias_surname: alias.alias_surname || null,
        })) || [],
      facc_debtor_add_amend_add_alias: false,
      facc_debtor_add_amend_dob: individualDetails?.date_of_birth || null,
      facc_debtor_add_amend_national_insurance_number: individualDetails?.national_insurance_number || null,
      facc_debtor_add_amend_address_line_1: address?.address_line_1 || null,
      facc_debtor_add_amend_address_line_2: address?.address_line_2 || null,
      facc_debtor_add_amend_address_line_3: address?.address_line_3 || null,
      facc_debtor_add_amend_post_code: address?.post_code || null,
      facc_debtor_add_amend_contact_email_address_1: contact_details?.primary_email_address || null,
      facc_debtor_add_amend_contact_email_address_2: contact_details?.secondary_email_address || null,
      facc_debtor_add_amend_contact_telephone_number_mobile: contact_details?.mobile_telephone_number || null,
      facc_debtor_add_amend_contact_telephone_number_home: contact_details?.home_telephone_number || null,
      facc_debtor_add_amend_contact_telephone_number_business: contact_details?.work_telephone_number || null,
      facc_debtor_add_amend_vehicle_make: vehicle_details?.vehicle_make_and_model || null,
      facc_debtor_add_amend_vehicle_registration_mark: vehicle_details?.vehicle_registration || null,
      facc_debtor_add_amend_language_preferences_document_language:
        language_preferences?.document_language?.language_code || null,
      facc_debtor_add_amend_language_preferences_hearing_language:
        language_preferences?.hearing_language?.language_code || null,
      facc_debtor_add_amend_employer_details_employer_company_name: employer_details?.employer_name || null,
      facc_debtor_add_amend_employer_details_employer_reference: employer_details?.employer_reference || null,
      facc_debtor_add_amend_employer_details_employer_email_address: employer_details?.employer_email_address || null,
      facc_debtor_add_amend_employer_details_employer_telephone_number:
        employer_details?.employer_telephone_number || null,
      facc_debtor_add_amend_employer_details_employer_address_line_1:
        employer_details?.employer_address?.address_line_1 || null,
      facc_debtor_add_amend_employer_details_employer_address_line_2:
        employer_details?.employer_address?.address_line_2 || null,
      facc_debtor_add_amend_employer_details_employer_address_line_3:
        employer_details?.employer_address?.address_line_3 || null,
      facc_debtor_add_amend_employer_details_employer_address_line_4:
        employer_details?.employer_address?.address_line_4 || null,
      facc_debtor_add_amend_employer_details_employer_address_line_5:
        employer_details?.employer_address?.address_line_5 || null,
      facc_debtor_add_amend_employer_details_employer_post_code: employer_details?.employer_address?.post_code || null,
    };
  }
}
