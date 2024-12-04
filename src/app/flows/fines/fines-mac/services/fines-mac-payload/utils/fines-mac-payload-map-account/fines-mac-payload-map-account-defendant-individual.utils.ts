import { IFinesMacPersonalDetailsAliasState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-complete.interface';

const mapAccountDefendantIndividualDebtorDetailsAliases = (
  payloadAccountDefendantIndividualDebtorDetailsAliases:
    | IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete[]
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

const mapAccountDefendantIndividualDebtorDetails = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantDebtorDetailComplete,
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

export const mapAccountDefendantIndividualPayload = (
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
