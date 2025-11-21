import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import {
  IOpalFinesDefendantAccountAddress,
  IOpalFinesDefendantAccountContactDetails,
  IOpalFinesDefendantAccountVehicleDetails,
  IOpalFinesDefendantAccountEmployerDetails,
  IOpalFinesDefendantAccountLanguagePreferences,
  IOpalFinesDefendantAccountIndividualDetails,
  IOpalFinesDefendantAccountOrganisationDetails,
  IOpalFinesDefendantAccountIndividualAlias,
  IOpalFinesDefendantAccountOrganisationAlias,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IFinesAccPartyAddAmendConvertState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-state.interface';
import { IFinesAccPartyAddAmendConvertIndividualAliasState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-individual-alias-state.interface';
import { IFinesAccPartyAddAmendConvertOrganisationAliasState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-organisation-alias-state.interface';

/**
 * Maps an array of individual aliases to the array structure used by the party add/amend form
 */
const mapIndividualAliasesToArrayStructure = (
  aliases: IOpalFinesDefendantAccountIndividualAlias[],
): IFinesAccPartyAddAmendConvertIndividualAliasState[] => {
  const result: IFinesAccPartyAddAmendConvertIndividualAliasState[] = [];

  for (const [index, alias] of aliases.entries()) {
    if (index < 5) {
      const aliasObject: IFinesAccPartyAddAmendConvertIndividualAliasState = {};
      (aliasObject as Record<string, unknown>)[`facc_party_add_amend_convert_alias_forenames_${index}`] =
        alias.forenames || null;
      (aliasObject as Record<string, unknown>)[`facc_party_add_amend_convert_alias_surname_${index}`] =
        alias.surname || null;
      (aliasObject as Record<string, unknown>)[`facc_party_add_amend_convert_alias_id_${index}`] =
        alias.alias_id || null;

      result.push(aliasObject);
    }
  }

  return result;
};

/**
 * Maps an array of organisation aliases to the array structure used by the party add/amend form
 */
const mapOrganisationAliasesToArrayStructure = (
  aliases: IOpalFinesDefendantAccountOrganisationAlias[],
): IFinesAccPartyAddAmendConvertOrganisationAliasState[] => {
  const result: IFinesAccPartyAddAmendConvertOrganisationAliasState[] = [];

  for (const [index, alias] of aliases.entries()) {
    if (index < 5) {
      const aliasObject: IFinesAccPartyAddAmendConvertOrganisationAliasState = {};
      (aliasObject as Record<string, unknown>)[`facc_party_add_amend_convert_alias_organisation_name_${index}`] =
        alias.organisation_name || null;
      (aliasObject as Record<string, unknown>)[`facc_party_add_amend_convert_alias_id_${index}`] =
        alias.alias_id || null;

      result.push(aliasObject);
    }
  }

  return result;
};

/**
 * Creates the base state object with common fields for all party types
 */
const createBaseState = (
  address: IOpalFinesDefendantAccountAddress,
  contact_details: IOpalFinesDefendantAccountContactDetails | null,
  vehicle_details: IOpalFinesDefendantAccountVehicleDetails | null,
  language_preferences: IOpalFinesDefendantAccountLanguagePreferences | null,
): IFinesAccPartyAddAmendConvertState => ({
  facc_party_add_amend_convert_organisation_name: null,
  facc_party_add_amend_convert_title: null,
  facc_party_add_amend_convert_forenames: null,
  facc_party_add_amend_convert_surname: null,
  facc_party_add_amend_convert_dob: null,
  facc_party_add_amend_convert_national_insurance_number: null,
  facc_party_add_amend_convert_individual_aliases: [],
  facc_party_add_amend_convert_organisation_aliases: [],
  facc_party_add_amend_convert_add_alias: false,
  facc_party_add_amend_convert_address_line_1: address?.address_line_1 || null,
  facc_party_add_amend_convert_address_line_2: address?.address_line_2 || null,
  facc_party_add_amend_convert_address_line_3: address?.address_line_3 || null,
  facc_party_add_amend_convert_post_code: address?.postcode || null,
  facc_party_add_amend_convert_contact_email_address_1: contact_details?.primary_email_address || null,
  facc_party_add_amend_convert_contact_email_address_2: contact_details?.secondary_email_address || null,
  facc_party_add_amend_convert_contact_telephone_number_mobile: contact_details?.mobile_telephone_number || null,
  facc_party_add_amend_convert_contact_telephone_number_home: contact_details?.home_telephone_number || null,
  facc_party_add_amend_convert_contact_telephone_number_business: contact_details?.work_telephone_number || null,
  facc_party_add_amend_convert_vehicle_make: vehicle_details?.vehicle_make_and_model || null,
  facc_party_add_amend_convert_vehicle_registration_mark: vehicle_details?.vehicle_registration || null,
  facc_party_add_amend_convert_language_preferences_document_language:
    language_preferences?.document_language_preference?.language_code || null,
  facc_party_add_amend_convert_language_preferences_hearing_language:
    language_preferences?.hearing_language_preference?.language_code || null,
  facc_party_add_amend_convert_employer_company_name: null,
  facc_party_add_amend_convert_employer_reference: null,
  facc_party_add_amend_convert_employer_email_address: null,
  facc_party_add_amend_convert_employer_telephone_number: null,
  facc_party_add_amend_convert_employer_address_line_1: null,
  facc_party_add_amend_convert_employer_address_line_2: null,
  facc_party_add_amend_convert_employer_address_line_3: null,
  facc_party_add_amend_convert_employer_address_line_4: null,
  facc_party_add_amend_convert_employer_address_line_5: null,
  facc_party_add_amend_convert_employer_post_code: null,
});

/**
 * Gets company party state with company-specific fields only
 */
const getCompanyParty = (
  baseState: IFinesAccPartyAddAmendConvertState,
  organisationDetails: IOpalFinesDefendantAccountOrganisationDetails | null,
  organisationAliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[],
  hasAliases: boolean,
): IFinesAccPartyAddAmendConvertState => ({
  ...baseState,
  facc_party_add_amend_convert_organisation_name: organisationDetails?.organisation_name || null,
  facc_party_add_amend_convert_organisation_aliases: organisationAliases,
  facc_party_add_amend_convert_add_alias: hasAliases,
});

/**
 * Gets individual or parent/guardian party state with all fields except organisation-specific ones
 */
const getIndividualOrParentGuardianParty = (
  baseState: IFinesAccPartyAddAmendConvertState,
  individualDetails: IOpalFinesDefendantAccountIndividualDetails | null,
  individualAliases: IFinesAccPartyAddAmendConvertIndividualAliasState[],
  hasAliases: boolean,
  employer_details: IOpalFinesDefendantAccountEmployerDetails | null,
): IFinesAccPartyAddAmendConvertState => ({
  ...baseState,
  facc_party_add_amend_convert_title: individualDetails?.title || null,
  facc_party_add_amend_convert_forenames: individualDetails?.forenames || null,
  facc_party_add_amend_convert_surname: individualDetails?.surname || null,
  facc_party_add_amend_convert_dob: individualDetails?.date_of_birth || null,
  facc_party_add_amend_convert_national_insurance_number: individualDetails?.national_insurance_number || null,
  facc_party_add_amend_convert_individual_aliases: individualAliases,
  facc_party_add_amend_convert_add_alias: hasAliases,
  facc_party_add_amend_convert_employer_company_name: employer_details?.employer_name || null,
  facc_party_add_amend_convert_employer_reference: employer_details?.employer_reference || null,
  facc_party_add_amend_convert_employer_email_address: employer_details?.employer_email_address || null,
  facc_party_add_amend_convert_employer_telephone_number: employer_details?.employer_telephone_number || null,
  facc_party_add_amend_convert_employer_address_line_1: employer_details?.employer_address?.address_line_1 || null,
  facc_party_add_amend_convert_employer_address_line_2: employer_details?.employer_address?.address_line_2 || null,
  facc_party_add_amend_convert_employer_address_line_3: employer_details?.employer_address?.address_line_3 || null,
  facc_party_add_amend_convert_employer_address_line_4: employer_details?.employer_address?.address_line_4 || null,
  facc_party_add_amend_convert_employer_address_line_5: employer_details?.employer_address?.address_line_5 || null,
  facc_party_add_amend_convert_employer_post_code: employer_details?.employer_address?.postcode || null,
});

/**
 * Gets individual debtor party state with fields from title to address postcode only (no employer details)
 */
const getIndividualDebtorParty = (
  baseState: IFinesAccPartyAddAmendConvertState,
  individualDetails: IOpalFinesDefendantAccountIndividualDetails | null,
  individualAliases: IFinesAccPartyAddAmendConvertIndividualAliasState[],
  hasAliases: boolean,
): IFinesAccPartyAddAmendConvertState => ({
  ...baseState,
  facc_party_add_amend_convert_title: individualDetails?.title || null,
  facc_party_add_amend_convert_forenames: individualDetails?.forenames || null,
  facc_party_add_amend_convert_surname: individualDetails?.surname || null,
  facc_party_add_amend_convert_dob: individualDetails?.date_of_birth || null,
  facc_party_add_amend_convert_national_insurance_number: individualDetails?.national_insurance_number || null,
  facc_party_add_amend_convert_individual_aliases: individualAliases,
  facc_party_add_amend_convert_add_alias: hasAliases,
  // Contact details are explicitly set to null for individual debtor
  facc_party_add_amend_convert_contact_email_address_1: null,
  facc_party_add_amend_convert_contact_email_address_2: null,
  facc_party_add_amend_convert_contact_telephone_number_mobile: null,
  facc_party_add_amend_convert_contact_telephone_number_home: null,
  facc_party_add_amend_convert_contact_telephone_number_business: null,
  // Vehicle details are explicitly set to null for individual debtor
  facc_party_add_amend_convert_vehicle_make: null,
  facc_party_add_amend_convert_vehicle_registration_mark: null,
  // Language preferences are explicitly set to null for individual debtor
  facc_party_add_amend_convert_language_preferences_document_language: null,
  facc_party_add_amend_convert_language_preferences_hearing_language: null,
  // Employer details are explicitly set to null for individual debtor
  facc_party_add_amend_convert_employer_company_name: null,
  facc_party_add_amend_convert_employer_reference: null,
  facc_party_add_amend_convert_employer_email_address: null,
  facc_party_add_amend_convert_employer_telephone_number: null,
  facc_party_add_amend_convert_employer_address_line_1: null,
  facc_party_add_amend_convert_employer_address_line_2: null,
  facc_party_add_amend_convert_employer_address_line_3: null,
  facc_party_add_amend_convert_employer_address_line_4: null,
  facc_party_add_amend_convert_employer_address_line_5: null,
  facc_party_add_amend_convert_employer_post_code: null,
});

/**
 * Transforms defendant account party data from the API into the party add/amend form state.
 *
 * @param defendantData - The defendant account party data from the API
 * @param partyType - The party type (company, individual, parentGuardian) to determine which fields to return
 * @param isDebtor - Whether this is a debtor (if false, employer details are excluded for individual party type)
 * @returns The transformed form state object for party add/amend form
 */
export const transformDefendantAccountPartyPayload = (
  defendantData: IOpalFinesAccountDefendantAccountParty,
  partyType: string,
  isDebtor: boolean,
): IFinesAccPartyAddAmendConvertState => {
  const { defendant_account_party } = defendantData;
  const { party_details, address, contact_details, vehicle_details, employer_details, language_preferences } =
    defendant_account_party;

  const { organisation_flag } = party_details;
  const individualDetails = party_details.individual_details;
  const organisationDetails = party_details.organisation_details;

  // Handle aliases based on party type
  let individualAliases: IFinesAccPartyAddAmendConvertIndividualAliasState[] = [];
  let organisationAliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[] = [];
  let hasAliases = false;

  if (organisation_flag && organisationDetails?.organisation_aliases) {
    organisationAliases = mapOrganisationAliasesToArrayStructure(organisationDetails.organisation_aliases);
    hasAliases = organisationDetails.organisation_aliases.length > 0;
  } else if (!organisation_flag && individualDetails?.individual_aliases) {
    individualAliases = mapIndividualAliasesToArrayStructure(individualDetails.individual_aliases);
    hasAliases = individualDetails.individual_aliases.length > 0;
  }

  const isCompany = partyType === 'company';
  const isIndividual = partyType === 'individual';

  // Create base state with common fields
  const baseState = createBaseState(address, contact_details, vehicle_details, language_preferences);

  if (isCompany || organisation_flag) {
    return getCompanyParty(baseState, organisationDetails, organisationAliases, hasAliases);
  } else if (isIndividual && !isDebtor) {
    // For individual party type that is not a debtor, only show fields from title to address postcode
    return getIndividualDebtorParty(baseState, individualDetails, individualAliases, hasAliases);
  } else {
    // For parent/guardian or individual debtor, show all fields including employer details
    return getIndividualOrParentGuardianParty(
      baseState,
      individualDetails,
      individualAliases,
      hasAliases,
      employer_details,
    );
  }
};
