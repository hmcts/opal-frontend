import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsAliasState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-alias-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';

import { IFinesMacPayloadBuildAccountDefendantIndividualDebtorDetailsAlias } from './interfaces/fines-mac-payload-build-account-defendant-individual-debtor-details-alias.interface';
import { IFinesMacPayloadBuildAccountDefendantIndividualDebtorDetails } from './interfaces/fines-mac-payload-build-account-defendant-individual-debtor-details.interface';
import { IFinesMacPayloadBuildAccountDefendantParentGuardianParentGuardian } from './interfaces/fines-mac-payload-build-account-defendant-parent-guardian-parent-guardian.interface';
import { IFinesMacPayloadBuildAccountDefendantParentGuardian } from './interfaces/fines-mac-payload-build-account-defendant-parent-guardian.interface';

/**
 * Builds an array of parent or guardian debtor details aliases based on the provided state objects.
 *
 * @param aliases - The state array containing alias details.
 * @returns An array of objects representing the parent or guardian debtor details aliases.
 */
const buildParentGuardianDebtorDetailsAliases = (
  aliases: IFinesMacParentGuardianDetailsAliasState[],
): IFinesMacPayloadBuildAccountDefendantIndividualDebtorDetailsAlias[] | null => {
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
): IFinesMacPayloadBuildAccountDefendantIndividualDebtorDetails => {
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
): IFinesMacPayloadBuildAccountDefendantParentGuardianParentGuardian => {
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
export const finesMacPayloadBuildAccountDefendantParentGuardian = (
  personalDetailsState: IFinesMacPersonalDetailsState,
  contactDetailsState: IFinesMacContactDetailsState,
  employerDetailsState: IFinesMacEmployerDetailsState,
  parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
  languagePreferencesState: IFinesMacLanguagePreferencesState,
): IFinesMacPayloadBuildAccountDefendantParentGuardian => {
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
