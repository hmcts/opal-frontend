import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import {
  IOpalFinesDefendantAccountAddress,
  IOpalFinesDefendantAccountContactDetails,
  IOpalFinesDefendantAccountVehicleDetails,
  IOpalFinesDefendantAccountEmployerDetails,
  IOpalFinesDefendantAccountLanguagePreferences,
  IOpalFinesDefendantAccountLanguagePreference,
  IOpalFinesDefendantAccountIndividualDetails,
  IOpalFinesDefendantAccountOrganisationDetails,
  IOpalFinesDefendantAccountIndividualAlias,
  IOpalFinesDefendantAccountOrganisationAlias,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IFinesAccPartyAddAmendConvertState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-state.interface';
import { IFinesAccPartyAddAmendConvertIndividualAliasState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-individual-alias-state.interface';
import { IFinesAccPartyAddAmendConvertOrganisationAliasState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-organisation-alias-state.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';

/**
 * Builds individual aliases array from form state
 * Handles CRUD operations:
 * - If alias_id exists: UPDATE existing alias (keep the ID)
 * - If no alias_id: CREATE new alias (no ID sent)
 * - If alias is removed from form: DELETE (not included in array)
 */
export const buildIndividualAliases = (
  aliases: IFinesAccPartyAddAmendConvertIndividualAliasState[] | null,
): IOpalFinesDefendantAccountIndividualAlias[] | null => {
  if (!aliases || aliases.length === 0) {
    return null;
  }

  const result: IOpalFinesDefendantAccountIndividualAlias[] = [];

  aliases.forEach((alias, index) => {
    const forenames = alias[`facc_party_add_amend_convert_alias_forenames_${index}` as keyof typeof alias] as string;
    const surname = alias[`facc_party_add_amend_convert_alias_surname_${index}` as keyof typeof alias] as string;
    const aliasId = alias[`facc_party_add_amend_convert_alias_id_${index}` as keyof typeof alias] as string | undefined;

    // Only include aliases that have actual data (not empty/undefined)
    if (forenames || surname) {
      const aliasItem: IOpalFinesDefendantAccountIndividualAlias = {
        sequence_number: index + 1,
        surname: surname || '',
        forenames: forenames || null,
        alias_id: '', // Will be set below based on whether it's new or existing
      };

      // If alias_id exists and is not empty, this is an UPDATE (include the ID)
      // If no alias_id or empty, this is a CREATE (send empty string for ID)
      if (aliasId && typeof aliasId === 'string' && aliasId.trim() !== '') {
        aliasItem.alias_id = aliasId;
      }

      result.push(aliasItem);
    }
  });

  return result.length > 0 ? result : null;
};

/**
 * Builds organisation aliases array from form state
 * Handles CRUD operations:
 * - If alias_id exists: UPDATE existing alias (keep the ID)
 * - If no alias_id: CREATE new alias (no ID sent)
 * - If alias is removed from form: DELETE (not included in array)
 */
export const buildOrganisationAliases = (
  aliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[] | null,
): IOpalFinesDefendantAccountOrganisationAlias[] | null => {
  if (!aliases || aliases.length === 0) {
    return null;
  }

  const result: IOpalFinesDefendantAccountOrganisationAlias[] = [];

  aliases.forEach((alias, index) => {
    const organisationName = alias[
      `facc_party_add_amend_convert_alias_organisation_name_${index}` as keyof typeof alias
    ] as string;
    const aliasId = alias[`facc_party_add_amend_convert_alias_id_${index}` as keyof typeof alias] as string | undefined;

    // Only include aliases that have actual data (not empty/undefined)
    if (organisationName) {
      const aliasItem: IOpalFinesDefendantAccountOrganisationAlias = {
        sequence_number: index + 1,
        organisation_name: organisationName,
        alias_id: '', // Will be set below based on whether it's new or existing
      };

      // If alias_id exists and is not empty, this is an UPDATE (include the ID)
      // If no alias_id or empty, this is a CREATE (send empty string for ID)
      if (aliasId && typeof aliasId === 'string' && aliasId.trim() !== '') {
        aliasItem.alias_id = aliasId;
      }

      result.push(aliasItem);
    }
  });

  return result.length > 0 ? result : null;
};

/**
 * Builds individual details from form state
 */
const buildIndividualDetails = (
  formState: IFinesAccPartyAddAmendConvertState,
): IOpalFinesDefendantAccountIndividualDetails => ({
  title: formState.facc_party_add_amend_convert_title,
  forenames: formState.facc_party_add_amend_convert_forenames,
  surname: formState.facc_party_add_amend_convert_surname || '',
  date_of_birth: formState.facc_party_add_amend_convert_dob,
  age: null, // Age is typically calculated server-side
  national_insurance_number: formState.facc_party_add_amend_convert_national_insurance_number,
  individual_aliases: buildIndividualAliases(formState.facc_party_add_amend_convert_individual_aliases),
});

/**
 * Builds organisation details from form state
 */
const buildOrganisationDetails = (
  formState: IFinesAccPartyAddAmendConvertState,
): IOpalFinesDefendantAccountOrganisationDetails => ({
  organisation_name: formState.facc_party_add_amend_convert_organisation_name || '',
  organisation_aliases: buildOrganisationAliases(formState.facc_party_add_amend_convert_organisation_aliases),
});

/**
 * Builds address details from form state
 */
const buildAddressDetails = (formState: IFinesAccPartyAddAmendConvertState): IOpalFinesDefendantAccountAddress => ({
  address_line_1: formState.facc_party_add_amend_convert_address_line_1 || '',
  address_line_2: formState.facc_party_add_amend_convert_address_line_2,
  address_line_3: formState.facc_party_add_amend_convert_address_line_3,
  address_line_4: null, // Not in form interface
  address_line_5: null, // Not in form interface
  postcode: formState.facc_party_add_amend_convert_post_code,
});

/**
 * Builds contact details from form state
 */
const buildContactDetails = (
  formState: IFinesAccPartyAddAmendConvertState,
): IOpalFinesDefendantAccountContactDetails => ({
  primary_email_address: formState.facc_party_add_amend_convert_contact_email_address_1,
  secondary_email_address: formState.facc_party_add_amend_convert_contact_email_address_2,
  mobile_telephone_number: formState.facc_party_add_amend_convert_contact_telephone_number_mobile,
  home_telephone_number: formState.facc_party_add_amend_convert_contact_telephone_number_home,
  work_telephone_number: formState.facc_party_add_amend_convert_contact_telephone_number_business,
});

/**
 * Builds vehicle details from form state (if present)
 */
const buildVehicleDetails = (
  formState: IFinesAccPartyAddAmendConvertState,
): IOpalFinesDefendantAccountVehicleDetails | null => {
  if (!formState.facc_party_add_amend_convert_vehicle_registration_mark) {
    return null;
  }

  return {
    vehicle_registration: formState.facc_party_add_amend_convert_vehicle_registration_mark,
    vehicle_make_and_model: formState.facc_party_add_amend_convert_vehicle_make,
  };
};

/**
 * Builds employer details from form state (if debtor and has employer information)
 */
const buildEmployerDetails = (
  formState: IFinesAccPartyAddAmendConvertState,
  isDebtor: boolean,
): IOpalFinesDefendantAccountEmployerDetails | null => {
  if (!isDebtor || !formState.facc_party_add_amend_convert_employer_company_name) {
    return null;
  }

  return {
    employer_name: formState.facc_party_add_amend_convert_employer_company_name,
    employer_reference: formState.facc_party_add_amend_convert_employer_reference,
    employer_email_address: formState.facc_party_add_amend_convert_employer_email_address,
    employer_telephone_number: formState.facc_party_add_amend_convert_employer_telephone_number,
    employer_address: {
      address_line_1: formState.facc_party_add_amend_convert_employer_address_line_1 || '',
      address_line_2: formState.facc_party_add_amend_convert_employer_address_line_2,
      address_line_3: formState.facc_party_add_amend_convert_employer_address_line_3,
      address_line_4: formState.facc_party_add_amend_convert_employer_address_line_4,
      address_line_5: formState.facc_party_add_amend_convert_employer_address_line_5,
      postcode: formState.facc_party_add_amend_convert_employer_post_code,
    },
  };
};

/**
 * Creates a language preference object with appropriate display name
 */
const createLanguagePreference = (languageCode: string): IOpalFinesDefendantAccountLanguagePreference => {
  const lc = languageCode as keyof typeof FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  return {
    language_code: lc,
    language_display_name: FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS[lc] ?? FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS.EN,
  };
};

/**
 * Builds language preferences from form state
 */
const buildLanguagePreferences = (
  formState: IFinesAccPartyAddAmendConvertState,
): IOpalFinesDefendantAccountLanguagePreferences => ({
  document_language_preference: formState.facc_party_add_amend_convert_language_preferences_document_language
    ? createLanguagePreference(formState.facc_party_add_amend_convert_language_preferences_document_language)
    : null,
  hearing_language_preference: formState.facc_party_add_amend_convert_language_preferences_hearing_language
    ? createLanguagePreference(formState.facc_party_add_amend_convert_language_preferences_hearing_language)
    : null,
});

/**
 * Builds a party payload from the form state for updating defendant account party details.
 * This is the reverse transformation of transformDefendantAccountPartyPayload.
 *
 * @param formState - The form state containing party add/amend/convert data
 * @param partyType - The party type (company, individual, parentGuardian)
 * @param isDebtor - Whether this is a debtor party
 * @param partyId - The unique party identifier
 * @returns The transformed payload object for updating party details
 */
export const buildAccountPartyFromFormState = (
  formState: IFinesAccPartyAddAmendConvertState,
  partyType: string,
  isDebtor: boolean,
  partyId: string,
): IOpalFinesAccountPartyDetails => {
  const isOrganisation = partyType === 'company';

  return {
    defendant_account_party_type: partyType === 'parentGuardian' ? 'Parent/Guardian' : 'Defendant',
    is_debtor: isDebtor,
    party_details: {
      party_id: partyId,
      organisation_flag: isOrganisation,
      organisation_details: isOrganisation ? buildOrganisationDetails(formState) : null,
      individual_details: !isOrganisation ? buildIndividualDetails(formState) : null,
    },
    address: buildAddressDetails(formState),
    contact_details: buildContactDetails(formState),
    vehicle_details: buildVehicleDetails(formState),
    employer_details: buildEmployerDetails(formState, isDebtor),
    language_preferences: buildLanguagePreferences(formState),
  };
};
