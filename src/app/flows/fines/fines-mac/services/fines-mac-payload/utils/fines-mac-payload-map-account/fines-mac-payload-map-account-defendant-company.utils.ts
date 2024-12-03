import { IFinesMacCompanyDetailsAliasState } from '../../../../fines-mac-company-details/interfaces/fines-mac-company-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';

const mapAccountDefendantCompanyDebtorDetailsAliases = (
  payloadAccountDefendantCompanyDebtorDetailsAliases:
    | IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete[]
    | null,
): IFinesMacCompanyDetailsAliasState[] => {
  return payloadAccountDefendantCompanyDebtorDetailsAliases
    ? payloadAccountDefendantCompanyDebtorDetailsAliases.map((alias, index) => {
        return {
          [`fm_company_details_alias_organisation_name_${index}`]: alias.alias_company_name,
        };
      })
    : [];
};

const mapAccountDefendantCompanyDebtorDetails = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendantDebtorDetails = payload.account.defendant.debtor_detail;

  const aliases = payloadAccountDefendantDebtorDetails?.aliases
    ? mapAccountDefendantCompanyDebtorDetailsAliases(payloadAccountDefendantDebtorDetails?.aliases)
    : mappedFinesMacState.companyDetails.formData.fm_company_details_aliases;

  mappedFinesMacState.companyDetails.formData = {
    ...mappedFinesMacState.companyDetails.formData,
    fm_company_details_add_alias: aliases.length > 0,
    fm_company_details_aliases: aliases,
  };

  mappedFinesMacState.languagePreferences.formData = {
    ...mappedFinesMacState.languagePreferences.formData,
    fm_language_preferences_document_language: payloadAccountDefendantDebtorDetails?.document_language ?? null,
    fm_language_preferences_hearing_language: payloadAccountDefendantDebtorDetails?.hearing_language ?? null,
  };

  return mappedFinesMacState;
};

export const mapAccountDefendantCompanyPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendant = payload.account.defendant;

  mappedFinesMacState.companyDetails.formData = {
    ...mappedFinesMacState.companyDetails.formData,
    fm_company_details_organisation_name: payloadAccountDefendant.organisation_name,
    fm_company_details_address_line_1: payloadAccountDefendant.address_line_1,
    fm_company_details_address_line_2: payloadAccountDefendant.address_line_2,
    fm_company_details_address_line_3: payloadAccountDefendant.address_line_3,
    fm_company_details_postcode: payloadAccountDefendant.post_code,
  };

  mappedFinesMacState.contactDetails.formData = {
    ...mappedFinesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: payloadAccountDefendant.telephone_number_home,
    fm_contact_details_telephone_number_business: payloadAccountDefendant.telephone_number_business,
    fm_contact_details_telephone_number_mobile: payloadAccountDefendant.telephone_number_mobile,
    fm_contact_details_email_address_1: payloadAccountDefendant.email_address_1,
    fm_contact_details_email_address_2: payloadAccountDefendant.email_address_2,
  };

  return mapAccountDefendantCompanyDebtorDetails(mappedFinesMacState, payload);
};
