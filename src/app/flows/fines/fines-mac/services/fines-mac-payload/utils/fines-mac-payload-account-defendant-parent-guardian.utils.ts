import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsAliasState } from '../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-alias-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { IFinesMacState } from '../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacPayloadAccountDefendantIndividualDebtorDetailsAlias } from './interfaces/fines-mac-payload-account-defendant-individual-debtor-details-alias.interface';
import { IFinesMacPayloadAccountDefendantIndividualDebtorDetails } from './interfaces/fines-mac-payload-account-defendant-individual-debtor-details.interface';
import { IFinesMacPayloadAccountDefendantParentGuardianParentGuardian } from './interfaces/fines-mac-payload-account-defendant-parent-guardian-parent-guardian.interface';
import { IFinesMacPayloadAccountDefendantParentGuardian } from './interfaces/fines-mac-payload-account-defendant-parent-guardian.interface';

/**
 * Builds an array of parent or guardian debtor details aliases based on the provided state objects.
 *
 * @param aliases - The state array containing alias details.
 * @returns An array of objects representing the parent or guardian debtor details aliases.
 */
const buildParentGuardianDebtorDetailsAliases = (
  aliases: IFinesMacParentGuardianDetailsAliasState[],
): IFinesMacPayloadAccountDefendantIndividualDebtorDetailsAlias[] | null => {
  const mappedAliases = aliases.map((alias, index) => {
    const forenameKey =
      `fm_parent_guardian_details_alias_forenames_${index}` as keyof IFinesMacParentGuardianDetailsAliasState;
    const surnameKey =
      `fm_parent_guardian_details_alias_surname_${index}` as keyof IFinesMacParentGuardianDetailsAliasState;
    return {
      alias_forenames: alias[forenameKey] ?? null,
      alias_surname: alias[surnameKey] ?? null,
    };
  });

  return mappedAliases.length ? mappedAliases : null;
};

/**
 * Builds a parent or guardian debtor details object based on the provided state objects.
 *
 * @param parentGuardianDetailsState - The state object containing parent or guardian details.
 * @param employerDetailsState - The state object containing employer details.
 * @param languagePreferencesState - The state object containing language preferences.
 * @returns An object representing the parent or guardian debtor details.
 */
const buildParentGuardianDebtorDetails = (
  parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
  employerDetailsState: IFinesMacEmployerDetailsState,
  languagePreferencesState: IFinesMacLanguagePreferencesState,
): IFinesMacPayloadAccountDefendantIndividualDebtorDetails => {
  const {
    fm_parent_guardian_details_vehicle_make: vehicle_make,
    fm_parent_guardian_details_vehicle_registration_mark: vehicle_registration_mark,
    fm_parent_guardian_details_aliases: aliases,
  } = parentGuardianDetailsState;

  const {
    fm_employer_details_employer_reference: employee_reference,
    fm_employer_details_employer_company_name: employer_company_name,
    fm_employer_details_employer_address_line_1: employer_address_line_1,
    fm_employer_details_employer_address_line_2: employer_address_line_2,
    fm_employer_details_employer_address_line_3: employer_address_line_3,
    fm_employer_details_employer_address_line_4: employer_address_line_4,
    fm_employer_details_employer_address_line_5: employer_address_line_5,
    fm_employer_details_employer_post_code: employer_post_code,
    fm_employer_details_employer_telephone_number: employer_telephone_number,
    fm_employer_details_employer_email_address: employer_email_address,
  } = employerDetailsState;

  const {
    fm_language_preferences_document_language: document_language,
    fm_language_preferences_hearing_language: hearing_language,
  } = languagePreferencesState;

  return {
    vehicle_make,
    vehicle_registration_mark,
    document_language,
    hearing_language,
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
    aliases: buildParentGuardianDebtorDetailsAliases(aliases),
  };
};

/**
 * Builds a parent or guardian defendant object based on the provided state objects.
 *
 * @param parentGuardianDetailsState - The state object containing parent or guardian details.
 * @param contactDetailsState - The state object containing contact details.
 * @param employerDetailsState - The state object containing employer details.
 * @param languagePreferencesState - The state object containing language preferences.
 * @returns An object representing the parent or guardian defendant.
 */
const buildParentGuardian = (
  parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
  contactDetailsState: IFinesMacContactDetailsState,
  employerDetailsState: IFinesMacEmployerDetailsState,
  languagePreferencesState: IFinesMacLanguagePreferencesState,
): IFinesMacPayloadAccountDefendantParentGuardianParentGuardian => {
  const {
    fm_parent_guardian_details_surname: surname,
    fm_parent_guardian_details_forenames: forenames,
    fm_parent_guardian_details_dob: dob,
    fm_parent_guardian_details_national_insurance_number: nationalInsuranceNumber,
    fm_parent_guardian_details_address_line_1: addressLine1,
    fm_parent_guardian_details_address_line_2: addressLine2,
    fm_parent_guardian_details_address_line_3: addressLine3,
    fm_parent_guardian_details_post_code: postCode,
  } = parentGuardianDetailsState;

  const {
    fm_contact_details_telephone_number_home: telephoneNumberHome,
    fm_contact_details_telephone_number_business: telephoneNumberBusiness,
    fm_contact_details_telephone_number_mobile: telephoneNumberMobile,
    fm_contact_details_email_address_1: emailAddress1,
    fm_contact_details_email_address_2: emailAddress2,
  } = contactDetailsState;

  return {
    company_flag: false,
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
    debtor_detail: buildParentGuardianDebtorDetails(
      parentGuardianDetailsState,
      employerDetailsState,
      languagePreferencesState,
    ),
  };
};

/**
 * Builds a parent or guardian defendant object based on the provided state objects.
 *
 * @param personalDetailsState - The state object containing personal details.
 * @param contactDetailsState - The state object containing contact details.
 * @param employerDetailsState - The state object containing employer details.
 * @param parentGuardianDetailsState - The state object containing parent or guardian details.
 * @param languagePreferencesState - The state object containing language preferences.
 * @returns An object representing the parent or guardian defendant.
 */
export const buildAccountDefendantParentGuardianPayload = (
  personalDetailsState: IFinesMacPersonalDetailsState,
  contactDetailsState: IFinesMacContactDetailsState,
  employerDetailsState: IFinesMacEmployerDetailsState,
  parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
  languagePreferencesState: IFinesMacLanguagePreferencesState,
): IFinesMacPayloadAccountDefendantParentGuardian => {
  const {
    fm_personal_details_title: title,
    fm_personal_details_surname: surname,
    fm_personal_details_forenames: forenames,
    fm_personal_details_dob: dob,
    fm_personal_details_address_line_1: address_line_1,
    fm_personal_details_address_line_2: address_line_2,
    fm_personal_details_address_line_3: address_line_3,
    fm_personal_details_post_code: post_code,
    fm_personal_details_national_insurance_number: national_insurance_number,
  } = personalDetailsState;

  return {
    company_flag: false,
    title,
    surname,
    forenames,
    dob,
    address_line_1,
    address_line_2,
    address_line_3,
    post_code,
    national_insurance_number,
    parent_guardian: buildParentGuardian(
      parentGuardianDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
    ),
  };
};

const mapAccountDefendantParentGuardianDetailsPayloadDebtorDetailsToFinesMacState = (
  finesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendantParentGuardianDebtorDetails = payload.account.defendant.parent_guardian?.debtor_detail;

  const aliases = payloadAccountDefendantParentGuardianDebtorDetails?.aliases
    ? payloadAccountDefendantParentGuardianDebtorDetails.aliases.map((alias, index) => {
        return {
          [`fm_parent_guardian_details_alias_forenames_${index}`]: alias.alias_forenames,
          [`fm_parent_guardian_details_alias_surname_${index}`]: alias.alias_surname,
        };
      })
    : finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases;

  finesMacState.parentGuardianDetails.formData = {
    ...finesMacState.parentGuardianDetails.formData,
    fm_parent_guardian_details_vehicle_make: payloadAccountDefendantParentGuardianDebtorDetails?.vehicle_make ?? null,
    fm_parent_guardian_details_vehicle_registration_mark:
      payloadAccountDefendantParentGuardianDebtorDetails?.vehicle_registration_mark ?? null,
    fm_parent_guardian_details_aliases: aliases,
  };

  finesMacState.employerDetails.formData = {
    ...finesMacState.employerDetails.formData,
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

  finesMacState.languagePreferences.formData = {
    ...finesMacState.languagePreferences.formData,
    fm_language_preferences_document_language:
      payloadAccountDefendantParentGuardianDebtorDetails?.document_language ?? null,
    fm_language_preferences_hearing_language:
      payloadAccountDefendantParentGuardianDebtorDetails?.hearing_language ?? null,
  };

  return finesMacState;
};

const mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState = (
  finesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendantParentGuardian = payload.account.defendant.parent_guardian;

  finesMacState.parentGuardianDetails.formData = {
    ...finesMacState.parentGuardianDetails.formData,
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

  finesMacState.contactDetails.formData = {
    ...finesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: payloadAccountDefendantParentGuardian?.telephone_number_home ?? null,
    fm_contact_details_telephone_number_business:
      payloadAccountDefendantParentGuardian?.telephone_number_business ?? null,
    fm_contact_details_telephone_number_mobile: payloadAccountDefendantParentGuardian?.telephone_number_mobile ?? null,
    fm_contact_details_email_address_1: payloadAccountDefendantParentGuardian?.email_address_1 ?? null,
    fm_contact_details_email_address_2: payloadAccountDefendantParentGuardian?.email_address_2 ?? null,
  };

  return mapAccountDefendantParentGuardianDetailsPayloadDebtorDetailsToFinesMacState(finesMacState, payload);
};

export const mapAccountDefendantParentGuardianPayloadToFinesMacState = (
  finesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendant = payload.account.defendant;

  finesMacState.personalDetails.formData = {
    ...finesMacState.personalDetails.formData,
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

  return mapAccountDefendantParentGuardianDetailsPayloadToFinesMacState(finesMacState, payload);
};
