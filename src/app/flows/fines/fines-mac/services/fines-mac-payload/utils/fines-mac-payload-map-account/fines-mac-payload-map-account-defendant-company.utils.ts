import { IFinesMacCompanyDetailsAliasState } from '../../../../fines-mac-company-details/interfaces/fines-mac-company-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-complete.interface';

/**
 * Maps an array of `IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete` objects to an array of `IFinesMacCompanyDetailsAliasState` objects.
 * Each alias in the input array is transformed into an object with a key in the format `fm_company_details_alias_organisation_name_<index>`.
 * If the input array is null, an empty array is returned.
 *
 * @param payloadAccountDefendantCompanyDebtorDetailsAliases - The array of `IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete` objects or null.
 * @returns An array of `IFinesMacCompanyDetailsAliasState` objects.
 */
const mapAccountDefendantCompanyDebtorDetailsAliases = (
  payloadAccountDefendantCompanyDebtorDetailsAliases:
    | IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete[]
    | null,
): IFinesMacCompanyDetailsAliasState[] => {
  if (!payloadAccountDefendantCompanyDebtorDetailsAliases) {
    return [];
  }

  return payloadAccountDefendantCompanyDebtorDetailsAliases.map((alias, index) => ({
    [`fm_company_details_alias_organisation_name_${index}`]: alias.alias_company_name,
  }));
};

/**
 * Maps the defendant company debtor details from the payload to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the defendant company debtor details.
 * @returns The updated fines MAC state with the mapped defendant company debtor details.
 */
const mapAccountDefendantCompanyDebtorDetails = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantDebtorDetailComplete,
): IFinesMacState => {
  if (!payload) {
    return mappedFinesMacState;
  }

  // Map aliases
  const aliases = payload.aliases
    ? mapAccountDefendantCompanyDebtorDetailsAliases(payload.aliases)
    : mappedFinesMacState.companyDetails.formData.fm_company_details_aliases;

  // Update company details
  mappedFinesMacState.companyDetails.formData = {
    ...mappedFinesMacState.companyDetails.formData,
    fm_company_details_add_alias: aliases.length > 0,
    fm_company_details_aliases: aliases,
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
 * Maps the payload data of a defendant company to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the defendant company details.
 * @returns The updated fines MAC state with the mapped defendant company details.
 *
 */
export const mapAccountDefendantCompanyPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountDefendantComplete,
): IFinesMacState => {
  const {
    organisation_name,
    address_line_1,
    address_line_2,
    address_line_3,
    post_code,
    telephone_number_home,
    telephone_number_business,
    telephone_number_mobile,
    email_address_1,
    email_address_2,
    debtor_detail,
  } = payload;

  // Update company details
  mappedFinesMacState.companyDetails.formData = {
    ...mappedFinesMacState.companyDetails.formData,
    fm_company_details_organisation_name: organisation_name,
    fm_company_details_address_line_1: address_line_1,
    fm_company_details_address_line_2: address_line_2,
    fm_company_details_address_line_3: address_line_3,
    fm_company_details_postcode: post_code,
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
    return mapAccountDefendantCompanyDebtorDetails(mappedFinesMacState, debtor_detail);
  }

  return mappedFinesMacState;
};
