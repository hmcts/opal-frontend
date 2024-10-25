import { IFinesMacCompanyDetailsAliasState } from '../../../fines-mac-company-details/interfaces/fines-mac-company-details-alias-state.interface';
import { IFinesMacCompanyDetailsState } from '../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacDefendantCompanyDebtorDetailsAliasPayload } from '../interfaces/fines-mac-defendant-company-debtor-details-alias-payload.interface';
import { IFinesMacDefendantCompanyDebtorDetailsPayload } from '../interfaces/fines-mac-defendant-company-debtor-details-payload.interface';
import { IFinesMacDefendantCompanyPayload } from '../interfaces/fines-mac-defendant-company.interface';

/**
 * Builds an array of company defendant debtor details aliases from the provided aliases state.
 *
 * @param aliases - An array of company details alias states.
 * @returns An array of company defendant debtor details aliases.
 */
const buildCompanyDefendantDebtorDetailsAliases = (
  aliases: IFinesMacCompanyDetailsAliasState[],
): IFinesMacDefendantCompanyDebtorDetailsAliasPayload[] | null => {
  const mappedAliases = aliases.map((alias, index) => {
    const companyNameKey =
      `fm_company_details_alias_organisation_name_${index}` as keyof IFinesMacCompanyDetailsAliasState;
    return {
      alias_company_name: alias[companyNameKey] ?? null,
    };
  });

  return mappedAliases.length ? mappedAliases : null;
};

/**
 * Builds the company defendant debtor details object.
 *
 * @param companyDetailsState - The state containing company details.
 * @param languagePreferencesState - The state containing language preferences.p
 * @returns An object containing the document language, hearing language, and aliases.
 * */
const buildCompanyDefendantDebtorDetails = (
  companyDetailsState: IFinesMacCompanyDetailsState,
  languagePreferencesState: IFinesMacLanguagePreferencesState,
): IFinesMacDefendantCompanyDebtorDetailsPayload => {
  const { fm_language_preferences_document_language, fm_language_preferences_hearing_language } =
    languagePreferencesState;
  const { fm_company_details_aliases } = companyDetailsState;

  return {
    document_language: fm_language_preferences_document_language,
    hearing_language: fm_language_preferences_hearing_language,
    aliases: buildCompanyDefendantDebtorDetailsAliases(fm_company_details_aliases),
  };
};

/**
 * Builds a company defendant object based on the provided state objects.
 *
 * @param companyDetailsState - The state object containing company details.
 * @param contactDetailsState - The state object containing contact details.
 * @param languagePreferencesState - The state object containing language preferences.
 * @returns An object representing the company defendant.
 */
export const buildDefendantCompanyPayload = (
  companyDetailsState: IFinesMacCompanyDetailsState,
  contactDetailsState: IFinesMacContactDetailsState,
  languagePreferencesState: IFinesMacLanguagePreferencesState,
): IFinesMacDefendantCompanyPayload => {
  const {
    fm_company_details_organisation_name: organisation_name,
    fm_company_details_address_line_1: address_line_1,
    fm_company_details_address_line_2: address_line_2,
    fm_company_details_address_line_3: address_line_3,
    fm_company_details_postcode: post_code,
  } = companyDetailsState;

  const {
    fm_contact_details_telephone_number_home: telephone_number_home,
    fm_contact_details_telephone_number_business: telephone_number_business,
    fm_contact_details_telephone_number_mobile: telephone_number_mobile,
    fm_contact_details_email_address_1: email_address_1,
    fm_contact_details_email_address_2: email_address_2,
  } = contactDetailsState;

  return {
    company_flag: true,
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
    debtor_detail: buildCompanyDefendantDebtorDetails(companyDetailsState, languagePreferencesState),
  };
};
