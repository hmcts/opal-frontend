import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacPersonalDetailsAliasState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';

import { IFinesMacPayloadAccountDefendantIndividualDebtorDetailsAlias } from './interfaces/fines-mac-payload-account-defendant-individual-debtor-details-alias.interface';
import { IFinesMacPayloadAccountDefendantIndividualDebtorDetails } from './interfaces/fines-mac-payload-account-defendant-individual-debtor-details.interface';
import { IFinesMacPayloadAccountDefendantIndividual } from './interfaces/fines-mac-payload-account-individual-defendant.interface';

/*
 * Builds an array of individual defendant debtor details aliases from the provided aliases state.
 *
 * @param aliases - An array of alias states containing personal details.
 * @returns An array of individual defendant debtor details aliases.
 */
const buildIndividualDefendantDebtorDetailsAliases = (
  aliases: IFinesMacPersonalDetailsAliasState[],
): IFinesMacPayloadAccountDefendantIndividualDebtorDetailsAlias[] | null => {
  const mappedAliases = aliases.map((alias, index) => {
    const forenameKey = `fm_personal_details_alias_forenames_${index}` as keyof IFinesMacPersonalDetailsAliasState;
    const surnameKey = `fm_personal_details_alias_surname_${index}` as keyof IFinesMacPersonalDetailsAliasState;
    return {
      alias_forenames: alias[forenameKey] ?? null,
      alias_surname: alias[surnameKey] ?? null,
    };
  });

  return mappedAliases.length ? mappedAliases : null;
};

/**
 * Builds the individual defendant debtor details object.
 *
 * @param personalDetailsState - The state containing personal details of the defendant.
 * @param employerDetailsState - The state containing employer details of the defendant.
 * @param languagePreferencesState - The state containing language preferences of the defendant.
 * @returns An object representing the individual defendant debtor details.
 */
const buildIndividualDefendantDebtorDetails = (
  personalDetailsState: IFinesMacPersonalDetailsState,
  employerDetailsState: IFinesMacEmployerDetailsState,
  languagePreferencesState: IFinesMacLanguagePreferencesState,
): IFinesMacPayloadAccountDefendantIndividualDebtorDetails => {
  const {
    fm_personal_details_vehicle_make: vehicle_make,
    fm_personal_details_vehicle_registration_mark: vehicle_registration_mark,
    fm_personal_details_aliases: aliases,
  } = personalDetailsState;

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
    aliases: buildIndividualDefendantDebtorDetailsAliases(aliases),
  };
};

/**
 * Builds an individual defendant object from the provided state objects.
 *
 * @param personalDetailsState - The state containing personal details of the defendant.
 * @param contactDetailsState - The state containing contact details of the defendant.
 * @param employerDetailsState - The state containing employer details of the defendant.
 * @param languagePreferencesState - The state containing language preferences of the defendant.
 * @returns An object representing an individual defendant.
 */
export const finesMacPayloadBuildAccountDefendantIndividual = (
  personalDetailsState: IFinesMacPersonalDetailsState,
  contactDetailsState: IFinesMacContactDetailsState,
  employerDetailsState: IFinesMacEmployerDetailsState,
  languagePreferencesState: IFinesMacLanguagePreferencesState,
): IFinesMacPayloadAccountDefendantIndividual => {
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

  const {
    fm_contact_details_telephone_number_home: telephone_number_home,
    fm_contact_details_telephone_number_business: telephone_number_business,
    fm_contact_details_telephone_number_mobile: telephone_number_mobile,
    fm_contact_details_email_address_1: email_address_1,
    fm_contact_details_email_address_2: email_address_2,
  } = contactDetailsState;

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
    telephone_number_home,
    telephone_number_business,
    telephone_number_mobile,
    email_address_1,
    email_address_2,
    national_insurance_number,
    debtor_detail: buildIndividualDefendantDebtorDetails(
      personalDetailsState,
      employerDetailsState,
      languagePreferencesState,
    ),
  };
};
