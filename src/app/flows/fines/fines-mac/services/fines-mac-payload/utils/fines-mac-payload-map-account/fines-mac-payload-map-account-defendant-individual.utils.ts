import { IFinesMacPersonalDetailsAliasState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailAliasComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-alias-complete.interface';
import { IFinesMacPayloadAccountDefendantDebtorDetailComplete } from '../interfaces/fines-mac-payload-account-defendant-debtor-detail-complete.interface';

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
  payload: IFinesMacPayloadAccountDefendantDebtorDetailComplete,
): IFinesMacState => {
  const aliases = payload?.aliases
    ? mapAccountDefendantIndividualDebtorDetailsAliases(payload?.aliases)
    : mappedFinesMacState.personalDetails.formData.fm_personal_details_aliases;

  mappedFinesMacState.personalDetails.formData = {
    ...mappedFinesMacState.personalDetails.formData,
    fm_personal_details_vehicle_make: payload?.vehicle_make ?? null,
    fm_personal_details_vehicle_registration_mark: payload?.vehicle_registration_mark ?? null,
    fm_personal_details_add_alias: aliases.length > 0,
    fm_personal_details_aliases: aliases,
  };

  mappedFinesMacState.employerDetails.formData = {
    ...mappedFinesMacState.employerDetails.formData,
    fm_employer_details_employer_reference: payload?.employee_reference ?? null,
    fm_employer_details_employer_company_name: payload?.employer_company_name ?? null,
    fm_employer_details_employer_address_line_1: payload?.employer_address_line_1 ?? null,
    fm_employer_details_employer_address_line_2: payload?.employer_address_line_2 ?? null,
    fm_employer_details_employer_address_line_3: payload?.employer_address_line_3 ?? null,
    fm_employer_details_employer_address_line_4: payload?.employer_address_line_4 ?? null,
    fm_employer_details_employer_address_line_5: payload?.employer_address_line_5 ?? null,
    fm_employer_details_employer_post_code: payload?.employer_post_code ?? null,
    fm_employer_details_employer_telephone_number: payload?.employer_telephone_number ?? null,
    fm_employer_details_employer_email_address: payload?.employer_email_address ?? null,
  };

  mappedFinesMacState.languagePreferences.formData = {
    ...mappedFinesMacState.languagePreferences.formData,
    fm_language_preferences_document_language: payload?.document_language ?? null,
    fm_language_preferences_hearing_language: payload?.hearing_language ?? null,
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
  payload: IFinesMacPayloadAccountDefendantComplete,
): IFinesMacState => {
  mappedFinesMacState.personalDetails.formData = {
    ...mappedFinesMacState.personalDetails.formData,
    fm_personal_details_title: payload.title,
    fm_personal_details_surname: payload.surname,
    fm_personal_details_forenames: payload.forenames,
    fm_personal_details_dob: payload.dob,
    fm_personal_details_address_line_1: payload.address_line_1,
    fm_personal_details_address_line_2: payload.address_line_2,
    fm_personal_details_address_line_3: payload.address_line_3,
    fm_personal_details_post_code: payload.post_code,
    fm_personal_details_national_insurance_number: payload.national_insurance_number,
  };

  mappedFinesMacState.contactDetails.formData = {
    ...mappedFinesMacState.contactDetails.formData,
    fm_contact_details_telephone_number_home: payload.telephone_number_home,
    fm_contact_details_telephone_number_business: payload.telephone_number_business,
    fm_contact_details_telephone_number_mobile: payload.telephone_number_mobile,
    fm_contact_details_email_address_1: payload.email_address_1,
    fm_contact_details_email_address_2: payload.email_address_2,
  };

  if (payload.debtor_detail) {
    return mapAccountDefendantIndividualDebtorDetails(mappedFinesMacState, payload.debtor_detail);
  } else {
    return mappedFinesMacState;
  }
};
