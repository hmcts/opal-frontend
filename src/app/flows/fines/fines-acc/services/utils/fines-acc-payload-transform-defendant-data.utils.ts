import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { IFinesAccDebtorAddAmendState } from '../../fines-acc-debtor-add-amend/interfaces/fines-acc-debtor-add-amend-state.interface';
import { IFinesAccDebtorAddAmendAliasState } from '../../fines-acc-debtor-add-amend/interfaces/fines-acc-debtor-add-amend-alias-state.interface';

/**
 * Maps an array of aliases to the array structure used by the debtor add/amend form
 */
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapAliasesToArrayStructure = (aliases: any[]): IFinesAccDebtorAddAmendAliasState[] => {
  const result: IFinesAccDebtorAddAmendAliasState[] = [];

  for (const [index, alias] of aliases.entries()) {
    if (index < 5) {
      const aliasObject: IFinesAccDebtorAddAmendAliasState = {};
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      (aliasObject as any)[`facc_debtor_add_amend_alias_forenames_${index}`] = alias.forenames || null;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      (aliasObject as any)[`facc_debtor_add_amend_alias_surname_${index}`] = alias.surname || null;

      result.push(aliasObject);
    }
  }

  return result;
};

/**
 * Transforms defendant account party data from the API into the debtor add/amend form state.
 *
 * @param defendantData - The defendant account party data from the API
 * @returns The transformed form state object for debtor add/amend form
 */
export const transformDefendantAccountPartyPayload = (
  defendantData: IOpalFinesAccountDefendantAccountParty,
): IFinesAccDebtorAddAmendState => {
  const { defendant_account_party } = defendantData;
  const { party_details, address, contact_details, vehicle_details, employer_details, language_preferences } =
    defendant_account_party;

  const individualDetails = party_details.individual_details;
  const aliases = individualDetails?.individual_aliases || [];

  return {
    facc_debtor_add_amend_title: individualDetails?.title || null,
    facc_debtor_add_amend_forenames: individualDetails?.forenames || null,
    facc_debtor_add_amend_surname: individualDetails?.surname || null,
    facc_debtor_add_amend_aliases: mapAliasesToArrayStructure(aliases),
    facc_debtor_add_amend_add_alias: aliases.length > 0,
    facc_debtor_add_amend_dob: individualDetails?.date_of_birth || null,
    facc_debtor_add_amend_national_insurance_number: individualDetails?.national_insurance_number || null,
    facc_debtor_add_amend_address_line_1: address?.address_line_1 || null,
    facc_debtor_add_amend_address_line_2: address?.address_line_2 || null,
    facc_debtor_add_amend_address_line_3: address?.address_line_3 || null,
    facc_debtor_add_amend_post_code: address?.postcode || null,
    facc_debtor_add_amend_contact_email_address_1: contact_details?.primary_email_address || null,
    facc_debtor_add_amend_contact_email_address_2: contact_details?.secondary_email_address || null,
    facc_debtor_add_amend_contact_telephone_number_mobile: contact_details?.mobile_telephone_number || null,
    facc_debtor_add_amend_contact_telephone_number_home: contact_details?.home_telephone_number || null,
    facc_debtor_add_amend_contact_telephone_number_business: contact_details?.work_telephone_number || null,
    facc_debtor_add_amend_vehicle_make: vehicle_details?.vehicle_make_and_model || null,
    facc_debtor_add_amend_vehicle_registration_mark: vehicle_details?.vehicle_registration || null,
    facc_debtor_add_amend_language_preferences_document_language:
      language_preferences?.document_language_preference?.language_code || null,
    facc_debtor_add_amend_language_preferences_hearing_language:
      language_preferences?.hearing_language_preference?.language_code || null,
    facc_debtor_add_amend_employer_details_employer_company_name: employer_details?.employer_name || null,
    facc_debtor_add_amend_employer_details_employer_reference: employer_details?.employer_reference || null,
    facc_debtor_add_amend_employer_details_employer_email_address: employer_details?.employer_email_address || null,
    facc_debtor_add_amend_employer_details_employer_telephone_number:
      employer_details?.employer_telephone_number || null,
    facc_debtor_add_amend_employer_details_employer_address_line_1:
      employer_details?.employer_address?.address_line_1 || null,
    facc_debtor_add_amend_employer_details_employer_address_line_2:
      employer_details?.employer_address?.address_line_2 || null,
    facc_debtor_add_amend_employer_details_employer_address_line_3:
      employer_details?.employer_address?.address_line_3 || null,
    facc_debtor_add_amend_employer_details_employer_address_line_4:
      employer_details?.employer_address?.address_line_4 || null,
    facc_debtor_add_amend_employer_details_employer_address_line_5:
      employer_details?.employer_address?.address_line_5 || null,
    facc_debtor_add_amend_employer_details_employer_post_code: employer_details?.employer_address?.postcode || null,
  };
};
