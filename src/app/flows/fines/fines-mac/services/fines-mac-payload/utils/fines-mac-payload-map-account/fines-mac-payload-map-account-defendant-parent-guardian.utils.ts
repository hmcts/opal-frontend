import { IFinesMacParentGuardianDetailsAliasState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-complete.interface';
import { IFinesMacPayloadAccountDefendantParentGuardianComplete } from '../interfaces/fines-mac-payload-account-defendant-parent-guardian-complete.interface';

const mapAccountDefendantParentGuardianDebtorDetailsAliases = (
  payloadAccountDefendantParentGuardianDebtorDetails:
    | IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete[]
    | null,
): IFinesMacParentGuardianDetailsAliasState[] => {
  return payloadAccountDefendantParentGuardianDebtorDetails
    ? payloadAccountDefendantParentGuardianDebtorDetails.map((alias, index) => {
        return {
          [`fm_parent_guardian_details_alias_forenames_${index}`]: alias.alias_forenames,
          [`fm_parent_guardian_details_alias_surname_${index}`]: alias.alias_surname,
        };
      })
    : [];
};

const mapAccountDefendantParentGuardianDetailsPayloadDebtorDetailsToFinesMacState = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantDebtorDetailComplete,
): IFinesMacState => {
  const aliases = payload?.aliases
    ? mapAccountDefendantParentGuardianDebtorDetailsAliases(payload?.aliases)
    : mappedFinesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases;

  mappedFinesMacState.parentGuardianDetails.formData = {
    ...mappedFinesMacState.parentGuardianDetails.formData,
    fm_parent_guardian_details_vehicle_make: payload?.vehicle_make ?? null,
    fm_parent_guardian_details_vehicle_registration_mark: payload?.vehicle_registration_mark ?? null,
    fm_parent_guardian_details_add_alias: aliases.length > 0,
    fm_parent_guardian_details_aliases: aliases,
  };

  mappedFinesMacState.employerDetails.formData = {
    ...mappedFinesMacState.employerDetails.formData,
    fm_employer_details_employer_reference: payload?.employee_reference ?? null,
    fm_employer_details_employer_company_name: payload?.employer_company_name ?? null,
    fm_employer_details_employer_address_line_1: payload?.employer_address_line_1 ?? null,
    fm_employer_details_employer_address_line_2: payload?.employer_address_line_2 ?? null,
    fm_employer_details_employer_address_line_3: payload?.employer_address_line_3 ?? null,
    fm_employer_details_employer_address_line_4: payload?.employer_address_line_4 ?? null,
    fm_employer_details_employer_address_line_5: payload?.employer_address_line_5 ?? null,
    fm_employer_details_employer_post_code: payload?.employer_post_code ?? null,
    fm_employer_details_employer_telephone_number: payload?.employer_telephone_number ?? null,
    fm_employer_details_employer_email_address: payload?.employer_email_address ?? null,
  };

  mappedFinesMacState.languagePreferences.formData = {
    ...mappedFinesMacState.languagePreferences.formData,
    fm_language_preferences_document_language: payload?.document_language ?? null,
    fm_language_preferences_hearing_language: payload?.hearing_language ?? null,
  };

  return mappedFinesMacState;
};

const mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantParentGuardianComplete,
): IFinesMacState => {
  mappedFinesMacState.parentGuardianDetails.formData = {
    ...mappedFinesMacState.parentGuardianDetails.formData,
    fm_parent_guardian_details_surname: payload?.surname ?? null,
    fm_parent_guardian_details_forenames: payload?.forenames ?? null,
    fm_parent_guardian_details_dob: payload?.dob ?? null,
    fm_parent_guardian_details_national_insurance_number: payload?.national_insurance_number ?? null,
    fm_parent_guardian_details_address_line_1: payload?.address_line_1 ?? null,
    fm_parent_guardian_details_address_line_2: payload?.address_line_2 ?? null,
    fm_parent_guardian_details_address_line_3: payload?.address_line_3 ?? null,
    fm_parent_guardian_details_post_code: payload?.post_code ?? null,
  };

  mappedFinesMacState.contactDetails.formData = {
    ...mappedFinesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: payload?.telephone_number_home ?? null,
    fm_contact_details_telephone_number_business: payload?.telephone_number_business ?? null,
    fm_contact_details_telephone_number_mobile: payload?.telephone_number_mobile ?? null,
    fm_contact_details_email_address_1: payload?.email_address_1 ?? null,
    fm_contact_details_email_address_2: payload?.email_address_2 ?? null,
  };

  if (payload?.debtor_detail) {
    return mapAccountDefendantParentGuardianDetailsPayloadDebtorDetailsToFinesMacState(
      mappedFinesMacState,
      payload.debtor_detail,
    );
  } else {
    return mappedFinesMacState;
  }
};

export const mapAccountDefendantParentGuardianPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantComplete,
): IFinesMacState => {
  mappedFinesMacState.personalDetails.formData = {
    ...mappedFinesMacState.personalDetails.formData,
    fm_personal_details_title: payload.title,
    fm_personal_details_surname: payload.surname,
    fm_personal_details_forenames: payload.forenames,
    fm_personal_details_dob: payload.dob,
    fm_personal_details_address_line_1: payload.address_line_1,
    fm_personal_details_address_line_2: payload.address_line_2,
    fm_personal_details_address_line_3: payload.address_line_3,
    fm_personal_details_post_code: payload.post_code,
    fm_personal_details_national_insurance_number: payload.national_insurance_number,
  };

  if (payload.parent_guardian) {
    return mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState(mappedFinesMacState, payload.parent_guardian);
  } else {
    return mappedFinesMacState;
  }
};
