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
  if (!payloadAccountDefendantParentGuardianDebtorDetails) {
    return [];
  }

  return payloadAccountDefendantParentGuardianDebtorDetails.map((alias, index) => ({
    [`fm_parent_guardian_details_alias_forenames_${index}`]: alias.alias_forenames,
    [`fm_parent_guardian_details_alias_surname_${index}`]: alias.alias_surname,
  }));
};

const mapAccountDefendantParentGuardianDetailsPayloadDebtorDetailsToFinesMacState = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantDebtorDetailComplete,
): IFinesMacState => {
  // Map aliases
  const aliases = payload?.aliases
    ? mapAccountDefendantParentGuardianDebtorDetailsAliases(payload.aliases)
    : mappedFinesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases;

  // Update parent guardian details
  mappedFinesMacState.parentGuardianDetails.formData = {
    ...mappedFinesMacState.parentGuardianDetails.formData,
    fm_parent_guardian_details_vehicle_make: payload?.vehicle_make ?? null,
    fm_parent_guardian_details_vehicle_registration_mark: payload?.vehicle_registration_mark ?? null,
    fm_parent_guardian_details_add_alias: aliases.length > 0,
    fm_parent_guardian_details_aliases: aliases,
  };

  // Update employer details
  const {
    employee_reference,
    employer_company_name,
    employer_address_line_1,
    employer_address_line_2,
    employer_address_line_3,
    employer_address_line_4,
    employer_address_line_5,
    employer_post_code,
    employer_telephone_number,
    employer_email_address,
  } = payload || {};

  mappedFinesMacState.employerDetails.formData = {
    ...mappedFinesMacState.employerDetails.formData,
    fm_employer_details_employer_reference: employee_reference ?? null,
    fm_employer_details_employer_company_name: employer_company_name ?? null,
    fm_employer_details_employer_address_line_1: employer_address_line_1 ?? null,
    fm_employer_details_employer_address_line_2: employer_address_line_2 ?? null,
    fm_employer_details_employer_address_line_3: employer_address_line_3 ?? null,
    fm_employer_details_employer_address_line_4: employer_address_line_4 ?? null,
    fm_employer_details_employer_address_line_5: employer_address_line_5 ?? null,
    fm_employer_details_employer_post_code: employer_post_code ?? null,
    fm_employer_details_employer_telephone_number: employer_telephone_number ?? null,
    fm_employer_details_employer_email_address: employer_email_address ?? null,
  };

  // Update language preferences
  const { document_language, hearing_language } = payload || {};

  mappedFinesMacState.languagePreferences.formData = {
    ...mappedFinesMacState.languagePreferences.formData,
    fm_language_preferences_document_language: document_language ?? null,
    fm_language_preferences_hearing_language: hearing_language ?? null,
  };

  return mappedFinesMacState;
};

const mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantParentGuardianComplete,
): IFinesMacState => {
  const {
    surname,
    forenames,
    dob,
    national_insurance_number: nationalInsuranceNumber,
    address_line_1: addressLine1,
    address_line_2: addressLine2,
    address_line_3: addressLine3,
    post_code: postCode,
    telephone_number_home: telephoneNumberHome,
    telephone_number_business: telephoneNumberBusiness,
    telephone_number_mobile: telephoneNumberMobile,
    email_address_1: emailAddress1,
    email_address_2: emailAddress2,
    debtor_detail: debtorDetail,
  } = payload || {};

  mappedFinesMacState.parentGuardianDetails.formData = {
    ...mappedFinesMacState.parentGuardianDetails.formData,
    fm_parent_guardian_details_surname: surname ?? null,
    fm_parent_guardian_details_forenames: forenames ?? null,
    fm_parent_guardian_details_dob: dob ?? null,
    fm_parent_guardian_details_national_insurance_number: nationalInsuranceNumber ?? null,
    fm_parent_guardian_details_address_line_1: addressLine1 ?? null,
    fm_parent_guardian_details_address_line_2: addressLine2 ?? null,
    fm_parent_guardian_details_address_line_3: addressLine3 ?? null,
    fm_parent_guardian_details_post_code: postCode ?? null,
  };

  mappedFinesMacState.contactDetails.formData = {
    ...mappedFinesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: telephoneNumberHome ?? null,
    fm_contact_details_telephone_number_business: telephoneNumberBusiness ?? null,
    fm_contact_details_telephone_number_mobile: telephoneNumberMobile ?? null,
    fm_contact_details_email_address_1: emailAddress1 ?? null,
    fm_contact_details_email_address_2: emailAddress2 ?? null,
  };

  if (debtorDetail) {
    return mapAccountDefendantParentGuardianDetailsPayloadDebtorDetailsToFinesMacState(
      mappedFinesMacState,
      debtorDetail,
    );
  }

  return mappedFinesMacState;
};

export const mapAccountDefendantParentGuardianPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantComplete,
): IFinesMacState => {
  const {
    title,
    surname,
    forenames,
    dob,
    address_line_1,
    address_line_2,
    address_line_3,
    post_code,
    national_insurance_number,
    parent_guardian,
  } = payload;

  mappedFinesMacState.personalDetails.formData = {
    ...mappedFinesMacState.personalDetails.formData,
    fm_personal_details_title: title,
    fm_personal_details_surname: surname,
    fm_personal_details_forenames: forenames,
    fm_personal_details_dob: dob,
    fm_personal_details_address_line_1: address_line_1,
    fm_personal_details_address_line_2: address_line_2,
    fm_personal_details_address_line_3: address_line_3,
    fm_personal_details_post_code: post_code,
    fm_personal_details_national_insurance_number: national_insurance_number,
  };

  if (parent_guardian) {
    return mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState(mappedFinesMacState, parent_guardian);
  }

  return mappedFinesMacState;
};
