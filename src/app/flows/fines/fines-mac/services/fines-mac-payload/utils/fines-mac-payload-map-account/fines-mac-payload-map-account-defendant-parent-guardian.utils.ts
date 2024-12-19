import { IFinesMacParentGuardianDetailsAliasState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-complete.interface';
import { IFinesMacPayloadAccountDefendantParentGuardianComplete } from '../interfaces/fines-mac-payload-account-defendant-parent-guardian-complete.interface';

/**
 * Maps the details of aliases for a defendant's parent or guardian debtor from the payload
 * to a state object format.
 *
 * @param payloadAccountDefendantParentGuardianDebtorDetails - An array of alias details or null.
 * @returns An array of objects representing the mapped alias details for the defendant's parent or guardian.
 */
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

/**
 * Maps the payload details of a defendant's parent or guardian to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the defendant's parent or guardian details.
 * @returns The updated fines MAC state with the mapped details.
 *
 */
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

/**
 * Maps the account defendant parent/guardian details payload to the Fines Mac state.
 *
 * @param mappedFinesMacState - The current state of the Fines Mac.
 * @param payload - The payload containing the account defendant parent/guardian details.
 * @returns The updated Fines Mac state with the mapped parent/guardian details and contact details.
 *
 */
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
    fm_parent_guardian_details_surname: surname,
    fm_parent_guardian_details_forenames: forenames,
    fm_parent_guardian_details_dob: dob,
    fm_parent_guardian_details_national_insurance_number: nationalInsuranceNumber,
    fm_parent_guardian_details_address_line_1: addressLine1,
    fm_parent_guardian_details_address_line_2: addressLine2,
    fm_parent_guardian_details_address_line_3: addressLine3,
    fm_parent_guardian_details_post_code: postCode,
  };

  mappedFinesMacState.contactDetails.formData = {
    ...mappedFinesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: telephoneNumberHome,
    fm_contact_details_telephone_number_business: telephoneNumberBusiness,
    fm_contact_details_telephone_number_mobile: telephoneNumberMobile,
    fm_contact_details_email_address_1: emailAddress1,
    fm_contact_details_email_address_2: emailAddress2,
  };

  if (debtorDetail) {
    return mapAccountDefendantParentGuardianDetailsPayloadDebtorDetailsToFinesMacState(
      mappedFinesMacState,
      debtorDetail,
    );
  }

  return mappedFinesMacState;
};

/**
 * Maps the account defendant parent/guardian payload to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the account defendant complete details.
 * @returns The updated fines MAC state with the mapped personal details and parent/guardian details if present.
 */
export const finesMacPayloadMapAccountDefendantParentGuardianPayload = (
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
    fm_personal_details_add_alias: false,
  };

  if (parent_guardian) {
    return mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState(mappedFinesMacState, parent_guardian);
  }

  return mappedFinesMacState;
};
