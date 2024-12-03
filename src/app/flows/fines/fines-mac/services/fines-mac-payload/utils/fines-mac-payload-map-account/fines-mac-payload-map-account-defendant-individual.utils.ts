import { IFinesMacPersonalDetailsAliasState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';

/**
 * Maps an array of defendant debtor detail aliases to an array of personal details alias states.
 *
 * @param payloadAccountDefendantIndividualDebtorDetailsAliases - An array of complete debtor detail aliases or null.
 * @returns An array of personal details alias states. If the input is null, returns an empty array.
 */
const mapAccountDefendantIndividualDebtorDetailsAliases = (
  payloadAccountDefendantIndividualDebtorDetailsAliases:
    | IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete[]
    | null,
): IFinesMacPersonalDetailsAliasState[] => {
  return payloadAccountDefendantIndividualDebtorDetailsAliases
    ? payloadAccountDefendantIndividualDebtorDetailsAliases.map((alias, index) => {
        return {
          [`fm_personal_details_alias_forenames_${index}`]: alias.alias_forenames,
          [`fm_personal_details_alias_surname_${index}`]: alias.alias_surname,
        };
      })
    : [];
};

/**
 * Maps the defendant individual debtor details from the payload to the finesMacState.
 *
 * @param {IFinesMacState} finesMacState - The current state of the fines MAC.
 * @param {IFinesMacAddAccountPayload} payload - The payload containing the account details to be mapped.
 * @returns {IFinesMacState} - The updated finesMacState with the mapped defendant individual debtor details.
 */
const mapAccountDefendantIndividualDebtorDetails = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendantDebtorDetails = payload.account.defendant.debtor_detail;
  const aliases = payloadAccountDefendantDebtorDetails?.aliases
    ? mapAccountDefendantIndividualDebtorDetailsAliases(payloadAccountDefendantDebtorDetails?.aliases)
    : mappedFinesMacState.personalDetails.formData.fm_personal_details_aliases;

  mappedFinesMacState.personalDetails.formData = {
    ...mappedFinesMacState.personalDetails.formData,
    fm_personal_details_vehicle_make: payloadAccountDefendantDebtorDetails?.vehicle_make ?? null,
    fm_personal_details_vehicle_registration_mark:
      payloadAccountDefendantDebtorDetails?.vehicle_registration_mark ?? null,
    fm_personal_details_add_alias: aliases.length > 0,
    fm_personal_details_aliases: aliases,
  };

  mappedFinesMacState.employerDetails.formData = {
    ...mappedFinesMacState.employerDetails.formData,
    fm_employer_details_employer_reference: payloadAccountDefendantDebtorDetails?.employee_reference ?? null,
    fm_employer_details_employer_company_name: payloadAccountDefendantDebtorDetails?.employer_company_name ?? null,
    fm_employer_details_employer_address_line_1: payloadAccountDefendantDebtorDetails?.employer_address_line_1 ?? null,
    fm_employer_details_employer_address_line_2: payloadAccountDefendantDebtorDetails?.employer_address_line_2 ?? null,
    fm_employer_details_employer_address_line_3: payloadAccountDefendantDebtorDetails?.employer_address_line_3 ?? null,
    fm_employer_details_employer_address_line_4: payloadAccountDefendantDebtorDetails?.employer_address_line_4 ?? null,
    fm_employer_details_employer_address_line_5: payloadAccountDefendantDebtorDetails?.employer_address_line_5 ?? null,
    fm_employer_details_employer_post_code: payloadAccountDefendantDebtorDetails?.employer_post_code ?? null,
    fm_employer_details_employer_telephone_number:
      payloadAccountDefendantDebtorDetails?.employer_telephone_number ?? null,
    fm_employer_details_employer_email_address: payloadAccountDefendantDebtorDetails?.employer_email_address ?? null,
  };

  mappedFinesMacState.languagePreferences.formData = {
    ...mappedFinesMacState.languagePreferences.formData,
    fm_language_preferences_document_language: payloadAccountDefendantDebtorDetails?.document_language ?? null,
    fm_language_preferences_hearing_language: payloadAccountDefendantDebtorDetails?.hearing_language ?? null,
  };

  return mappedFinesMacState;
};

/**
 * Maps the defendant individual payload to the fines MAC state.
 *
 * @param finesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the account defendant details.
 * @returns The updated fines MAC state with the defendant individual details mapped.
 */
export const mapAccountDefendantIndividualPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const payloadAccountDefendant = payload.account.defendant;

  mappedFinesMacState.personalDetails.formData = {
    ...mappedFinesMacState.personalDetails.formData,
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

  mappedFinesMacState.contactDetails.formData = {
    ...mappedFinesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: payloadAccountDefendant.telephone_number_home,
    fm_contact_details_telephone_number_business: payloadAccountDefendant.telephone_number_business,
    fm_contact_details_telephone_number_mobile: payloadAccountDefendant.telephone_number_mobile,
    fm_contact_details_email_address_1: payloadAccountDefendant.email_address_1,
    fm_contact_details_email_address_2: payloadAccountDefendant.email_address_2,
  };

  return mapAccountDefendantIndividualDebtorDetails(mappedFinesMacState, payload);
};
