import { IFinesMacParentGuardianDetailsAliasState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';

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
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendantParentGuardianDebtorDetails = payload.account.defendant.parent_guardian?.debtor_detail;

  const aliases = payloadAccountDefendantParentGuardianDebtorDetails?.aliases
    ? mapAccountDefendantParentGuardianDebtorDetailsAliases(payloadAccountDefendantParentGuardianDebtorDetails?.aliases)
    : mappedFinesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases;

  mappedFinesMacState.parentGuardianDetails.formData = {
    ...mappedFinesMacState.parentGuardianDetails.formData,
    fm_parent_guardian_details_vehicle_make: payloadAccountDefendantParentGuardianDebtorDetails?.vehicle_make ?? null,
    fm_parent_guardian_details_vehicle_registration_mark:
      payloadAccountDefendantParentGuardianDebtorDetails?.vehicle_registration_mark ?? null,
    fm_parent_guardian_details_add_alias: aliases.length > 0,
    fm_parent_guardian_details_aliases: aliases,
  };

  mappedFinesMacState.employerDetails.formData = {
    ...mappedFinesMacState.employerDetails.formData,
    fm_employer_details_employer_reference:
      payloadAccountDefendantParentGuardianDebtorDetails?.employee_reference ?? null,
    fm_employer_details_employer_company_name:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_company_name ?? null,
    fm_employer_details_employer_address_line_1:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_address_line_1 ?? null,
    fm_employer_details_employer_address_line_2:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_address_line_2 ?? null,
    fm_employer_details_employer_address_line_3:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_address_line_3 ?? null,
    fm_employer_details_employer_address_line_4:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_address_line_4 ?? null,
    fm_employer_details_employer_address_line_5:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_address_line_5 ?? null,
    fm_employer_details_employer_post_code:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_post_code ?? null,
    fm_employer_details_employer_telephone_number:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_telephone_number ?? null,
    fm_employer_details_employer_email_address:
      payloadAccountDefendantParentGuardianDebtorDetails?.employer_email_address ?? null,
  };

  mappedFinesMacState.languagePreferences.formData = {
    ...mappedFinesMacState.languagePreferences.formData,
    fm_language_preferences_document_language:
      payloadAccountDefendantParentGuardianDebtorDetails?.document_language ?? null,
    fm_language_preferences_hearing_language:
      payloadAccountDefendantParentGuardianDebtorDetails?.hearing_language ?? null,
  };

  return mappedFinesMacState;
};

const mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendantParentGuardian = payload.account.defendant.parent_guardian;

  mappedFinesMacState.parentGuardianDetails.formData = {
    ...mappedFinesMacState.parentGuardianDetails.formData,
    fm_parent_guardian_details_surname: payloadAccountDefendantParentGuardian?.surname ?? null,
    fm_parent_guardian_details_forenames: payloadAccountDefendantParentGuardian?.forenames ?? null,
    fm_parent_guardian_details_dob: payloadAccountDefendantParentGuardian?.dob ?? null,
    fm_parent_guardian_details_national_insurance_number:
      payloadAccountDefendantParentGuardian?.national_insurance_number ?? null,
    fm_parent_guardian_details_address_line_1: payloadAccountDefendantParentGuardian?.address_line_1 ?? null,
    fm_parent_guardian_details_address_line_2: payloadAccountDefendantParentGuardian?.address_line_2 ?? null,
    fm_parent_guardian_details_address_line_3: payloadAccountDefendantParentGuardian?.address_line_3 ?? null,
    fm_parent_guardian_details_post_code: payloadAccountDefendantParentGuardian?.post_code ?? null,
  };

  mappedFinesMacState.contactDetails.formData = {
    ...mappedFinesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: payloadAccountDefendantParentGuardian?.telephone_number_home ?? null,
    fm_contact_details_telephone_number_business:
      payloadAccountDefendantParentGuardian?.telephone_number_business ?? null,
    fm_contact_details_telephone_number_mobile: payloadAccountDefendantParentGuardian?.telephone_number_mobile ?? null,
    fm_contact_details_email_address_1: payloadAccountDefendantParentGuardian?.email_address_1 ?? null,
    fm_contact_details_email_address_2: payloadAccountDefendantParentGuardian?.email_address_2 ?? null,
  };

  return mapAccountDefendantParentGuardianDetailsPayloadDebtorDetailsToFinesMacState(mappedFinesMacState, payload);
};

export const mapAccountDefendantParentGuardianPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendant = payload.account.defendant;

  mappedFinesMacState.personalDetails.formData = {
    ...mappedFinesMacState.personalDetails.formData,
    fm_personal_details_title: payloadAccountDefendant.title,
    fm_personal_details_surname: payloadAccountDefendant.surname,
    fm_personal_details_forenames: payloadAccountDefendant.forenames,
    fm_personal_details_dob: payloadAccountDefendant.dob,
    fm_personal_details_address_line_1: payloadAccountDefendant.address_line_1,
    fm_personal_details_address_line_2: payloadAccountDefendant.address_line_2,
    fm_personal_details_address_line_3: payloadAccountDefendant.address_line_3,
    fm_personal_details_post_code: payloadAccountDefendant.post_code,
    fm_personal_details_national_insurance_number: payloadAccountDefendant.national_insurance_number,
  };

  return mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState(mappedFinesMacState, payload);
};
