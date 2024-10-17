import { inject, Injectable } from '@angular/core';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

import { IFinesMacAccountDetailsState } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { IFinesMacContactDetailsState } from '../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';

import { IFinesMacPersonalDetailsAliasState } from '../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacCompanyDetailsState } from '../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacCompanyDetailsAliasState } from '../../fines-mac-company-details/interfaces/fines-mac-company-details-alias-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacParentGuardianDetailsAliasState } from '../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-alias-state.interface';

import { FINES_MAC_DEFENDANT_PAYLOAD } from './constants/fines-mac-defendant-payload.constant';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from './constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD } from './constants/fines-mac-defendant-debtor-details-alias-payload.constant';
import { IFinesMacDefendantIndividualPayload } from './interfaces/fines-mac-individual-defendant.interface';
import { IFinesMacDefendantIndividualDebtorDetailsPayload } from './interfaces/fines-mac-defendant-individual-debtor-details-payload.interface';
import { IFinesMacDefendantIndividualDebtorDetailsAliasPayload } from './interfaces/fines-mac-defendant-individual-debtor-details-alias-payload.interface';
import { IFinesMacDefendantCompanyPayload } from './interfaces/fines-mac-defendant-company.interface';
import { IFinesMacDefendantCompanyDebtorDetailsPayload } from './interfaces/fines-mac-defendant-company-debtor-details-payload.interface';
import { IFinesMacDefendantCompanyDebtorDetailsAliasPayload } from './interfaces/fines-mac-defendant-company-debtor-details-alias-payload.interface';
import { IFinesMacDefendantParentGuardianPayload } from './interfaces/fines-mac-defendant-parent-guardian-payload.interface';
import { IFinesMacDefendantParentGuardianParentGuardianPayload } from './interfaces/fines-mac-defendant-parent-guardian-parent-guardian-payload.interface';
import { FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD } from './constants/fines-mac-defendant-parent-guardian-payload.constant';
import { IFinesMacPaymentTermsState } from '../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { FINES_MAC_PAYMENT_TERMS_OPTIONS } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-options';
import { FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-frequency-options';
import { FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-enforcement-action-options';

import { IFinesMacAccountCommentsNotesState } from '../../fines-mac-account-comments-notes/interfaces/fines-mac-account-comments-notes-state.interface';

import { IFinesMacCourtDetailsState } from '../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacInitialPayload } from './interfaces/fines-mac-initial-payload.interface';
import { IFinesMacPaymentTermsPayload } from './interfaces/fines-mac-payment-terms-payload.interface';
import { IFinesMacAccountNotePayload } from './interfaces/fines-mac-account-note-payload.interface';
import { IFinesMacPaymentTermsEnforcementResultResponsePayload } from './interfaces/fines-mac-payment-terms-enforcement-result-response-payload.interface';
import { IFinesMacPaymentTermsEnforcementPayload } from './interfaces/fines-mac-payment-terms-enforcement-payload.interface';
import { IFinesMacDefendantCompletePayload } from './interfaces/fines-mac-defendant-complete-payload.interface';
import { IFinesMacDefendantDebtorDetailAliasCompletePayload } from './interfaces/fines-mac-defendant-debtor-detail-alias-complete-payload.interface';
import { IFinesMacDefendantDebtorDetailCompletePayload } from './interfaces/fines-mac-defendant-debtor-detail-complete-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesMacPayloadService {
  /**
   * Applies base payloads to an individual or company defendant.
   *
   * This method takes a defendant object, which can be either an individual or a company,
   * and merges it with predefined payload templates to create a complete defendant payload.
   *
   * @param defendant - The defendant object, which can be either an individual or a company.
   * @returns The complete defendant payload with base payloads applied.
   */
  private applyBasePayloadsToIndividualOrCompanyDefendant(
    defendant: IFinesMacDefendantIndividualPayload | IFinesMacDefendantCompanyPayload,
  ): IFinesMacDefendantCompletePayload {
    const aliases: IFinesMacDefendantDebtorDetailAliasCompletePayload[] | null =
      defendant.debtor_detail.aliases?.map((alias) => ({
        ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD,
        ...alias,
      })) || null;

    const debtorDetail: IFinesMacDefendantDebtorDetailCompletePayload = {
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
      ...defendant.debtor_detail,
      aliases: aliases,
    };

    return {
      ...FINES_MAC_DEFENDANT_PAYLOAD,
      ...defendant,
      debtor_detail: debtorDetail,
    };
  }

  /**
   * Applies base payloads to the parent guardian defendant.
   *
   * This method takes a `IFinesMacDefendantParentGuardianPayload` object and merges it with predefined
   * payload constants to create a new `IFinesMacDefendantCompletePayload` object. It ensures that the
   * `debtor_detail` and its `aliases` are properly merged with their respective payload constants.
   *
   * @param defendant - The parent guardian defendant object to which the base payloads will be applied.
   * @returns A new `IFinesMacDefendantCompletePayload` object with the base payloads applied.
   */
  private applyBasePayloadsToParentGuardianDefendant(
    defendant: IFinesMacDefendantParentGuardianPayload,
  ): IFinesMacDefendantCompletePayload {
    const parentGuardianDebtorAliases: IFinesMacDefendantDebtorDetailAliasCompletePayload[] | null =
      defendant.parent_guardian.debtor_detail.aliases?.map((alias) => ({
        ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD,
        ...alias,
      })) || null;

    const parentGuardianDebtorDetail: IFinesMacDefendantDebtorDetailCompletePayload = {
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
      ...defendant.parent_guardian.debtor_detail,
      aliases: parentGuardianDebtorAliases,
    };

    return {
      ...FINES_MAC_DEFENDANT_PAYLOAD,
      ...defendant,
      parent_guardian: {
        ...FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD,
        ...defendant.parent_guardian,
        debtor_detail: parentGuardianDebtorDetail,
      },
    };
  }

  /**
   * Builds an array of individual defendant debtor details aliases from the provided aliases state.
   *
   * @param aliases - An array of alias states containing personal details.
   * @returns An array of individual defendant debtor details aliases.
   */
  private buildIndividualDefendantDebtorDetailsAliases(
    aliases: IFinesMacPersonalDetailsAliasState[],
  ): IFinesMacDefendantIndividualDebtorDetailsAliasPayload[] {
    return aliases.map((alias, index) => {
      const forenameKey = `fm_personal_details_alias_forenames_${index}` as keyof IFinesMacPersonalDetailsAliasState;
      const surnameKey = `fm_personal_details_alias_surname_${index}` as keyof IFinesMacPersonalDetailsAliasState;
      return {
        alias_forenames: alias[forenameKey] || null,
        alias_surname: alias[surnameKey] || null,
      };
    });
  }

  /**
   * Builds the individual defendant debtor details object.
   *
   * @param personalDetailsState - The state containing personal details of the defendant.
   * @param employerDetailsState - The state containing employer details of the defendant.
   * @param languagePreferencesState - The state containing language preferences of the defendant.
   * @returns An object representing the individual defendant debtor details.
   */
  private buildIndividualDefendantDebtorDetails(
    personalDetailsState: IFinesMacPersonalDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacDefendantIndividualDebtorDetailsPayload {
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
      aliases: this.buildIndividualDefendantDebtorDetailsAliases(aliases),
    };
  }

  /**
   * Builds an individual defendant object from the provided state objects.
   *
   * @param personalDetailsState - The state containing personal details of the defendant.
   * @param contactDetailsState - The state containing contact details of the defendant.
   * @param employerDetailsState - The state containing employer details of the defendant.
   * @param languagePreferencesState - The state containing language preferences of the defendant.
   * @returns An object representing an individual defendant.
   */
  private buildIndividualDefendant(
    personalDetailsState: IFinesMacPersonalDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacDefendantIndividualPayload {
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
      debtor_detail: this.buildIndividualDefendantDebtorDetails(
        personalDetailsState,
        employerDetailsState,
        languagePreferencesState,
      ),
    };
  }

  /**
   * Builds an array of company defendant debtor details aliases from the provided aliases state.
   *
   * @param aliases - An array of company details alias states.
   * @returns An array of company defendant debtor details aliases.
   */
  private buildCompanyDefendantDebtorDetailsAliases(
    aliases: IFinesMacCompanyDetailsAliasState[],
  ): IFinesMacDefendantCompanyDebtorDetailsAliasPayload[] {
    return aliases.map((alias, index) => {
      const companyNameKey =
        `fm_company_details_alias_organisation_name_${index}` as keyof IFinesMacCompanyDetailsAliasState;
      return {
        alias_company_name: alias[companyNameKey] || null,
      };
    });
  }

  /**
   * Builds the company defendant debtor details object.
   *
   * @param companyDetailsState - The state containing company details.
   * @param languagePreferencesState - The state containing language preferences.p
   * @returns An object containing the document language, hearing language, and aliases.
   * */
  private buildCompanyDefendantDebtorDetails(
    companyDetailsState: IFinesMacCompanyDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacDefendantCompanyDebtorDetailsPayload {
    const { fm_language_preferences_document_language, fm_language_preferences_hearing_language } =
      languagePreferencesState;
    const { fm_company_details_aliases } = companyDetailsState;

    return {
      document_language: fm_language_preferences_document_language,
      hearing_language: fm_language_preferences_hearing_language,
      aliases: this.buildCompanyDefendantDebtorDetailsAliases(fm_company_details_aliases),
    };
  }

  /**
   * Builds a company defendant object based on the provided state objects.
   *
   * @param companyDetailsState - The state object containing company details.
   * @param contactDetailsState - The state object containing contact details.
   * @param languagePreferencesState - The state object containing language preferences.
   * @returns An object representing the company defendant.
   */
  private buildCompanyDefendant(
    companyDetailsState: IFinesMacCompanyDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacDefendantCompanyPayload {
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
      debtor_detail: this.buildCompanyDefendantDebtorDetails(companyDetailsState, languagePreferencesState),
    };
  }

  /**
   * Builds an array of parent or guardian debtor details aliases based on the provided state objects.
   *
   * @param aliases - The state array containing alias details.
   * @returns An array of objects representing the parent or guardian debtor details aliases.
   */
  private buildParentGuardianDebtorDetailsAliases(
    aliases: IFinesMacParentGuardianDetailsAliasState[],
  ): IFinesMacDefendantIndividualDebtorDetailsAliasPayload[] {
    return aliases.map((alias, index) => {
      const forenameKey =
        `fm_parent_guardian_details_alias_forenames_${index}` as keyof IFinesMacParentGuardianDetailsAliasState;
      const surnameKey =
        `fm_parent_guardian_details_alias_surname_${index}` as keyof IFinesMacParentGuardianDetailsAliasState;
      return {
        alias_forenames: alias[forenameKey] || null,
        alias_surname: alias[surnameKey] || null,
      };
    });
  }

  /**
   * Builds a parent or guardian debtor details object based on the provided state objects.
   *
   * @param parentGuardianDetailsState - The state object containing parent or guardian details.
   * @param employerDetailsState - The state object containing employer details.
   * @param languagePreferencesState - The state object containing language preferences.
   * @returns An object representing the parent or guardian debtor details.
   */
  private buildParentGuardianDebtorDetails(
    parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacDefendantIndividualDebtorDetailsPayload {
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
      aliases: this.buildParentGuardianDebtorDetailsAliases(aliases),
    };
  }

  /**
   * Builds a parent or guardian defendant object based on the provided state objects.
   *
   * @param parentGuardianDetailsState - The state object containing parent or guardian details.
   * @param contactDetailsState - The state object containing contact details.
   * @param employerDetailsState - The state object containing employer details.
   * @param languagePreferencesState - The state object containing language preferences.
   * @returns An object representing the parent or guardian defendant.
   */
  private buildParentGuardian(
    parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacDefendantParentGuardianParentGuardianPayload {
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
      debtor_detail: this.buildParentGuardianDebtorDetails(
        parentGuardianDetailsState,
        employerDetailsState,
        languagePreferencesState,
      ),
    };
  }

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
  private buildParentGuardianDefendant(
    personalDetailsState: IFinesMacPersonalDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacDefendantParentGuardianPayload {
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
      parent_guardian: this.buildParentGuardian(
        parentGuardianDetailsState,
        contactDetailsState,
        employerDetailsState,
        languagePreferencesState,
      ),
    };
  }

  // TODO: Remove after https://tools.hmcts.net/jira/browse/PO-909
  private getInstallmentPeriod(installmentPeriod: string | null | undefined): string | null {
    switch (installmentPeriod?.toLocaleLowerCase()) {
      case FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS.weekly.toLowerCase():
        return 'W';
      case FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS.fortnightly.toLowerCase():
        return 'F';
      case FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS.monthly.toLowerCase():
        return 'M';
      default:
        return null;
    }
  }

  /**
   * Builds an enforcement response object for fines MAC payment terms.
   *
   * @param parameterName - The name of the parameter to be included in the response.
   * @param response - The response value, which can be a string or null.
   * @returns An object conforming to the `IFinesMacPaymentTermsEnforcementResultResponse` interface,
   *          containing the parameter name and the response.
   */
  private buildEnforcementResultResponse(
    [parameterName]: string,
    response: string | null,
  ): IFinesMacPaymentTermsEnforcementResultResponsePayload {
    return {
      parameter_name: parameterName,
      response: response || null,
    };
  }

  /**
   * Builds an enforcement object for fines MAC payment terms.
   *
   * @param resultId - The unique identifier for the result.
   * @param enforcementResponses - An array of enforcement result responses or null.
   * @returns An object representing the enforcement details.
   */
  private buildEnforcement(
    resultId: string,
    enforcementResponses: IFinesMacPaymentTermsEnforcementResultResponsePayload[] | null,
  ): IFinesMacPaymentTermsEnforcementPayload {
    return {
      result_id: resultId,
      enforcement_result_responses: enforcementResponses,
    };
  }

  // TODO: Refactor once changes have been made
  // https://tools.hmcts.net/jira/browse/PO-906
  // https://tools.hmcts.net/jira/browse/PO-907
  // https://tools.hmcts.net/jira/browse/PO-908
  //
  private buildPaymentTermEnforcements(
    paymentTermsState: IFinesMacPaymentTermsState,
  ): IFinesMacPaymentTermsEnforcementPayload[] | null {
    let enforcements = [];
    const hasCollectionOrderBeenMade: any = paymentTermsState['fm_payment_terms_collection_order_made'];
    const hasCollectionOrderBeenMadeToday = paymentTermsState['fm_payment_terms_collection_order_made_today'];
    // const addColloEnforcement = !hasCollectionOrderBeenMade && hasCollectionOrderBeenMadeToday;
    // Temporary until value is set to
    const addColloEnforcement = hasCollectionOrderBeenMade === 'no' && hasCollectionOrderBeenMadeToday;
    let resultId = null;
    if (paymentTermsState['fm_payment_terms_enforcement_action']) {
      resultId = paymentTermsState['fm_payment_terms_enforcement_action'] === 'defendantIsInCustody' ? 'PRIS' : 'NOENF';
    }

    if (addColloEnforcement) {
      enforcements.push(this.buildEnforcement('COLLO', null));
    }

    switch (resultId) {
      case 'PRIS':
        enforcements.push(
          this.buildEnforcement('PRIS', [
            this.buildEnforcementResultResponse(
              'earliestreleasedate',
              paymentTermsState['fm_payment_terms_earliest_release_date'] || null,
            ),
            this.buildEnforcementResultResponse(
              'prisonandprisonnumber',
              paymentTermsState['fm_payment_terms_prison_and_prison_number'] || null,
            ),
          ]),
        );
        break;
      case 'NOENF':
        enforcements.push(
          this.buildEnforcement('NOENF', [
            this.buildEnforcementResultResponse(
              'reason',
              paymentTermsState['fm_payment_terms_reason_account_is_on_noenf'] || null,
            ),
          ]),
        );
    }

    return enforcements.length ? enforcements : null;
  }

  /**
   * Builds the payment terms object based on the provided payment terms state.
   *
   * @param paymentTermsState - The state object containing payment terms information.
   * @returns An object representing the payment terms.
   *
   */
  private buildPaymentTerms(paymentTermsState: IFinesMacPaymentTermsState): IFinesMacPaymentTermsPayload {
    const {
      fm_payment_terms_payment_terms,
      fm_payment_terms_pay_by_date,
      fm_payment_terms_start_date,
      fm_payment_instalment_period,
      fm_payment_terms_lump_sum_amount,
      fm_payment_terms_instalment_amount,
      fm_payment_terms_default_days_in_jail,
    } = paymentTermsState;

    let paymentTermsTypeCode = null;
    let effectiveDate = null;

    if (fm_payment_terms_payment_terms) {
      paymentTermsTypeCode = fm_payment_terms_payment_terms === 'payInFull' ? 'B' : 'I';
      effectiveDate = paymentTermsTypeCode === 'B' ? fm_payment_terms_pay_by_date : fm_payment_terms_start_date;
    }

    return {
      payment_terms_type_code: paymentTermsTypeCode,
      effective_date: effectiveDate || null,
      instalment_period: this.getInstallmentPeriod(fm_payment_instalment_period),
      lump_sum_amount: fm_payment_terms_lump_sum_amount || null,
      instalment_amount: fm_payment_terms_instalment_amount || null,
      default_days_in_jail: fm_payment_terms_default_days_in_jail || null,
      enforcements: this.buildPaymentTermEnforcements(paymentTermsState),
    };
  }

  /**
   * Builds an account note object for fines management.
   *
   * @param noteSerial - The serial number of the account note.
   * @param accountNoteText - The text content of the account note. Can be null.
   * @param noteType - The type/category of the note.
   * @returns An object representing the account note.
   */
  private buildAccountNote(
    noteSerial: number,
    accountNoteText: string | null,
    noteType: string,
  ): IFinesMacAccountNotePayload {
    return {
      account_note_serial: noteSerial,
      account_note_text: accountNoteText,
      note_type: noteType,
    };
  }

  /**
   * Builds an array of account notes based on the provided account comments and notes state.
   *
   * @param accountCommentsNotesState - The state containing account comments and notes.
   * @returns An array of account notes if any are present, otherwise null.
   */
  private buildAccountNotes(
    accountCommentsNotesState: IFinesMacAccountCommentsNotesState,
  ): IFinesMacAccountNotePayload[] | null {
    const accountNotes: IFinesMacAccountNotePayload[] = [];
    const { fm_account_comments_notes_comments: comments, fm_account_comments_notes_notes: notes } =
      accountCommentsNotesState;

    const addNote = (type: number, content: string | null, code: string) => {
      if (content) {
        accountNotes.push(this.buildAccountNote(type, content, code));
      }
    };

    addNote(3, comments, 'AC');
    addNote(2, notes, 'AA');
    // addNote(1, systemNotes, 'AA');

    return accountNotes.length ? accountNotes : null;
  }

  /**
   * Builds the defendant payload based on the provided state details.
   *
   * @param accountDetailsState - The state containing account details.
   * @param personalDetailsState - The state containing personal details.
   * @param contactDetailsState - The state containing contact details.
   * @param employerDetailsState - The state containing employer details.
   * @param languageDetailsState - The state containing language preferences.
   * @param companyDetailsState - The state containing company details.
   * @param parentGuardianDetailsState - The state containing parent or guardian details.
   * @returns The constructed generic defendant payload.
   */
  private buildDefendant(
    accountDetailsState: IFinesMacAccountDetailsState,
    personalDetailsState: IFinesMacPersonalDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languageDetailsState: IFinesMacLanguagePreferencesState,
    companyDetailsState: IFinesMacCompanyDetailsState,
    parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
  ): IFinesMacDefendantCompletePayload {
    const defendantType = accountDetailsState['fm_create_account_defendant_type'];

    // We want to start by building the defendant object based on the type of defendant we have
    // Then we want to apply the base payloads to the defendant object
    // This is so we have all fields present in the payload, even if they are null

    switch (defendantType) {
      case 'parentOrGuardianToPay':
        return this.applyBasePayloadsToParentGuardianDefendant(
          this.buildParentGuardianDefendant(
            personalDetailsState,
            contactDetailsState,
            employerDetailsState,
            parentGuardianDetailsState,
            languageDetailsState,
          ),
        );
      case 'company':
        return this.applyBasePayloadsToIndividualOrCompanyDefendant(
          this.buildCompanyDefendant(companyDetailsState, contactDetailsState, languageDetailsState),
        );
      default:
        return this.applyBasePayloadsToIndividualOrCompanyDefendant(
          this.buildIndividualDefendant(
            personalDetailsState,
            contactDetailsState,
            employerDetailsState,
            languageDetailsState,
          ),
        );
    }
  }

  private buildInitialPayload(
    accountDetailsState: IFinesMacAccountDetailsState,
    courtDetailsState: IFinesMacCourtDetailsState,
    paymentTermsState: IFinesMacPaymentTermsState,
  ): IFinesMacInitialPayload {
    const { fm_create_account_account_type: account_type, fm_create_account_defendant_type: defendant_type } =
      accountDetailsState;

    const {
      fm_court_details_originator_name: originator_name,
      fm_court_details_originator_id: originator_id,
      fm_court_details_prosecutor_case_reference: prosecutor_case_reference,
      fm_court_details_enforcement_court_id: enforcement_court_id,
    } = courtDetailsState;

    const {
      fm_payment_terms_collection_order_made: collection_order_made,
      fm_payment_terms_collection_order_made_today: collection_order_made_today,
      fm_payment_terms_collection_order_date: collection_order_date,
      fm_payment_terms_suspended_committal_date: suspended_committal_date,
      fm_payment_terms_payment_card_request: payment_card_request,
    } = paymentTermsState;

    return {
      account_type,
      defendant_type,
      originator_name,
      originator_id,
      prosecutor_case_reference,
      enforcement_court_id,
      collection_order_made: collection_order_made || null,
      collection_order_made_today: collection_order_made_today || null,
      collection_order_date: collection_order_date || null,
      suspended_committal_date: suspended_committal_date || null,
      payment_card_request: payment_card_request || null,
      account_sentence_date: null, // Derived from the earliest of all offence sentence dates
    };
  }

  public buildPayload(finesMacState: IFinesMacState): any {
    const { formData: accountDetailsState } = finesMacState.accountDetails;
    const { formData: courtDetailsState } = finesMacState.courtDetails;
    const { formData: paymentTermsState } = finesMacState.paymentTerms;
    const { formData: personalDetailsState } = finesMacState.personalDetails;
    const { formData: contactDetailsState } = finesMacState.contactDetails;
    const { formData: employerDetailsState } = finesMacState.employerDetails;
    const { formData: languageDetailsState } = finesMacState.languagePreferences;
    const { formData: companyDetailsState } = finesMacState.companyDetails;
    const { formData: parentGuardianDetailsState } = finesMacState.parentGuardianDetails;
    const { formData: accountCommentsNotesState } = finesMacState.accountCommentsNotes;

    // Build the parts of our payload...
    const initialPayload = this.buildInitialPayload(accountDetailsState, courtDetailsState, paymentTermsState);
    const defendant = this.buildDefendant(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languageDetailsState,
      companyDetailsState,
      parentGuardianDetailsState,
    );
    const paymentTerms = this.buildPaymentTerms(paymentTermsState);
    const accountNotes = this.buildAccountNotes(accountCommentsNotesState);

    // Return our payload object
    return {
      ...initialPayload,
      defendant: defendant,
      offences: null,
      fp_ticket_detail: null,
      payment_terms: paymentTerms,
      account_notes: accountNotes,
    };
  }
}
