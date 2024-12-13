import { IFinesMacPersonalDetailsAliasState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadBuildAccountDefendantComplete } from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-complete.interface';
import { IFinesMacPayloadBuildAccountDefendantDebtorDetailAliasComplete } from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-debtor-detail-alias-complete.interface';
import { IFinesMacPayloadBuildAccountDefendantDebtorDetailComplete } from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-debtor-detail-complete.interface';

/**
 * Maps an array of defendant debtor detail aliases to an array of personal details alias states.
 *
 * @param payloadAccountDefendantIndividualDebtorDetailsAliases - An array of complete debtor detail aliases or null.
 * @returns An array of personal details alias states. If the input is null, returns an empty array.
 */
const mapAccountDefendantIndividualDebtorDetailsAliases = (
  payloadAccountDefendantIndividualDebtorDetailsAliases:
    | IFinesMacPayloadBuildAccountDefendantDebtorDetailAliasComplete[]
    | null,
): IFinesMacPersonalDetailsAliasState[] => {
  if (!payloadAccountDefendantIndividualDebtorDetailsAliases) {
    return [];
  }

  return payloadAccountDefendantIndividualDebtorDetailsAliases.map((alias, index) => ({
    [`fm_personal_details_alias_forenames_${index}`]: alias.alias_forenames,
    [`fm_personal_details_alias_surname_${index}`]: alias.alias_surname,
  }));
};

/**
 * Maps the defendant individual debtor details from the payload to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the defendant individual debtor details.
 * @returns The updated fines MAC state with the mapped defendant individual debtor details.
 *
 */
const mapAccountDefendantIndividualDebtorDetails = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadBuildAccountDefendantDebtorDetailComplete,
): IFinesMacState => {
  if (!payload) {
    return mappedFinesMacState;
  }

  // Map aliases
  const aliases = payload.aliases
    ? mapAccountDefendantIndividualDebtorDetailsAliases(payload.aliases)
    : mappedFinesMacState.personalDetails.formData.fm_personal_details_aliases;

  // Update personal details
  mappedFinesMacState.personalDetails.formData = {
    ...mappedFinesMacState.personalDetails.formData,
    fm_personal_details_vehicle_make: payload.vehicle_make ?? null,
    fm_personal_details_vehicle_registration_mark: payload.vehicle_registration_mark ?? null,
    fm_personal_details_add_alias: aliases.length > 0,
    fm_personal_details_aliases: aliases,
  };

  // Update employer details
  mappedFinesMacState.employerDetails.formData = {
    ...mappedFinesMacState.employerDetails.formData,
    fm_employer_details_employer_reference: payload.employee_reference ?? null,
    fm_employer_details_employer_company_name: payload.employer_company_name ?? null,
    fm_employer_details_employer_address_line_1: payload.employer_address_line_1 ?? null,
    fm_employer_details_employer_address_line_2: payload.employer_address_line_2 ?? null,
    fm_employer_details_employer_address_line_3: payload.employer_address_line_3 ?? null,
    fm_employer_details_employer_address_line_4: payload.employer_address_line_4 ?? null,
    fm_employer_details_employer_address_line_5: payload.employer_address_line_5 ?? null,
    fm_employer_details_employer_post_code: payload.employer_post_code ?? null,
    fm_employer_details_employer_telephone_number: payload.employer_telephone_number ?? null,
    fm_employer_details_employer_email_address: payload.employer_email_address ?? null,
  };

  // Update language preferences
  mappedFinesMacState.languagePreferences.formData = {
    ...mappedFinesMacState.languagePreferences.formData,
    fm_language_preferences_document_language: payload.document_language ?? null,
    fm_language_preferences_hearing_language: payload.hearing_language ?? null,
  };

  return mappedFinesMacState;
};

/**
 * Maps the payload data of an individual defendant to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the individual defendant's account details.
 * @returns The updated fines MAC state with the individual defendant's details.
 *
 */
export const finesMacPayloadMapAccountDefendantIndividualPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadBuildAccountDefendantComplete,
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
    telephone_number_home,
    telephone_number_business,
    telephone_number_mobile,
    email_address_1,
    email_address_2,
    debtor_detail,
  } = payload;

  // Update personal details
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

  // Update contact details
  mappedFinesMacState.contactDetails.formData = {
    ...mappedFinesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: telephone_number_home,
    fm_contact_details_telephone_number_business: telephone_number_business,
    fm_contact_details_telephone_number_mobile: telephone_number_mobile,
    fm_contact_details_email_address_1: email_address_1,
    fm_contact_details_email_address_2: email_address_2,
  };

  // Handle debtor detail if available
  if (debtor_detail) {
    return mapAccountDefendantIndividualDebtorDetails(mappedFinesMacState, debtor_detail);
  }

  return mappedFinesMacState;
};
