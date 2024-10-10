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
import { DateService } from '@services/date-service/date.service';

import {
  IFinesMacDefendantPayload,
  IFinesMacDefendantPayloadDebtorDetail,
  IFinesMacDefendantPayloadDebtorDetailAlias,
  IFinesMacDefendantPayloadParentGuardian,
} from './interfaces/fines-mac-defendant-payload.interface';
import { FINES_MAC_DEFENDANT_PAYLOAD } from './constants/fines-mac-defendant-payload.constant';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from './constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD } from './constants/fines-mac-defendant-debtor-details-alias-payload.constant';
import { IFinesMacIndividualDefendant } from './interfaces/fines-mac-individual-defendant.interface';
import { IFinesMacIndividualDefendantDebtorDetails } from './interfaces/fines-mac-individual-defendant-debtor-details.interface';
import { IFinesMacIndividualDefendantDebtorDetailsAlias } from './interfaces/fines-mac-individual-defendant-debtor-details-alias.interface';
import { IFinesMacCompanyDefendant } from './interfaces/fines-mac-company-defendant.interface';
import { IFinesMacCompanyDefendantDebtorDetails } from './interfaces/fines-mac-company-defendant-debtor-details.interface';
import { IFinesMacCompanyDefendantDebtorDetailsAlias } from './interfaces/fines-mac-company-defendant-debtor-details-alias.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesMacPayloadService {
  private dateService = inject(DateService);

  private defendantType!: string | null;
  private accountType!: string | null;

  private buildIndividualDefendantDebtorDetailsAliases(
    aliases: IFinesMacPersonalDetailsAliasState[],
  ): IFinesMacIndividualDefendantDebtorDetailsAlias[] {
    return aliases.map((alias, index) => {
      const forenameKey = `fm_personal_details_alias_forenames_${index}` as keyof IFinesMacPersonalDetailsAliasState;
      const surnameKey = `fm_personal_details_alias_surname_${index}` as keyof IFinesMacPersonalDetailsAliasState;
      return {
        alias_forenames: alias[forenameKey] || null,
        alias_surname: alias[surnameKey] || null,
      };
    });
  }

  private buildIndividualDefendantDebtorDetails(
    personalDetailsState: IFinesMacPersonalDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacIndividualDefendantDebtorDetails {
    return {
      vehicle_make: personalDetailsState['fm_personal_details_vehicle_make'],
      vehicle_registration_mark: personalDetailsState['fm_personal_details_vehicle_registration_mark'],
      document_language: languagePreferencesState['fm_language_preferences_document_language'],
      hearing_language: languagePreferencesState['fm_language_preferences_hearing_language'],
      employee_reference: employerDetailsState['fm_employer_details_employer_reference'],
      employer_company_name: employerDetailsState['fm_employer_details_employer_company_name'],
      employer_address_line_1: employerDetailsState['fm_employer_details_employer_company_name'],
      employer_address_line_2: employerDetailsState['fm_employer_details_employer_address_line_2'],
      employer_address_line_3: employerDetailsState['fm_employer_details_employer_address_line_3'],
      employer_address_line_4: employerDetailsState['fm_employer_details_employer_address_line_4'],
      employer_address_line_5: employerDetailsState['fm_employer_details_employer_address_line_5'],
      employer_post_code: employerDetailsState['fm_employer_details_employer_post_code'],
      employer_telephone_number: employerDetailsState['fm_employer_details_employer_telephone_number'],
      employer_email_address: employerDetailsState['fm_employer_details_employer_email_address'],
      aliases: this.buildIndividualDefendantDebtorDetailsAliases(personalDetailsState['fm_personal_details_aliases']),
    };
  }

  private buildIndividualDefendant(
    personalDetailsState: IFinesMacPersonalDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacIndividualDefendant {
    return {
      company_flag: false,
      title: personalDetailsState['fm_personal_details_title'],
      surname: personalDetailsState['fm_personal_details_surname'],
      forenames: personalDetailsState['fm_personal_details_forenames'],
      dob: personalDetailsState['fm_personal_details_dob'],
      address_line_1: personalDetailsState['fm_personal_details_address_line_1'],
      address_line_2: personalDetailsState['fm_personal_details_address_line_2'],
      address_line_3: personalDetailsState['fm_personal_details_address_line_3'],
      post_code: personalDetailsState['fm_personal_details_post_code'],
      telephone_number_home: contactDetailsState['fm_contact_details_telephone_number_home'],
      telephone_number_business: contactDetailsState['fm_contact_details_telephone_number_business'],
      telephone_number_mobile: contactDetailsState['fm_contact_details_telephone_number_mobile'],
      email_address_1: contactDetailsState['fm_contact_details_email_address_1'],
      email_address_2: contactDetailsState['fm_contact_details_email_address_2'],
      national_insurance_number: personalDetailsState['fm_personal_details_national_insurance_number'],
      debtor_detail: this.buildIndividualDefendantDebtorDetails(
        personalDetailsState,
        employerDetailsState,
        languagePreferencesState,
      ),
    };
  }

  private applyIndividualDefendantBasePayload(defendant: IFinesMacIndividualDefendant): IFinesMacDefendantPayload {
    // We want to apply the base payload files to the defendant object so that all the fields are present

    // Apply the base payload to the aliases so that all the fields are present
    const aliases: IFinesMacDefendantPayloadDebtorDetailAlias[] =
      defendant.debtor_detail.aliases?.map((alias) => ({
        ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD,
        ...alias,
      })) || [];

    // Apply the base payload to the debtor detail so that all the fields are present
    // and the aliases are included
    const debtorDetail: IFinesMacDefendantPayloadDebtorDetail = {
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
      ...defendant.debtor_detail,
      aliases: aliases,
    };

    // Apply the base payload to the defendant so that all the fields are present
    return {
      ...FINES_MAC_DEFENDANT_PAYLOAD,
      ...defendant,
      debtor_detail: debtorDetail,
    };
  }

  private buildCompanyDefendantDebtorDetailsAliases(
    aliases: IFinesMacCompanyDetailsAliasState[],
  ): IFinesMacCompanyDefendantDebtorDetailsAlias[] {
    return aliases.map((alias, index) => {
      const companyNameKey =
        `fm_company_details_alias_organisation_name_${index}` as keyof IFinesMacCompanyDetailsAliasState;
      return {
        alias_company_name: alias[companyNameKey] || null,
      };
    });
  }

  private buildCompanyDefendantDebtorDetails(
    companyDetailsState: IFinesMacCompanyDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacCompanyDefendantDebtorDetails {
    return {
      document_language: languagePreferencesState['fm_language_preferences_document_language'],
      hearing_language: languagePreferencesState['fm_language_preferences_hearing_language'],
      aliases: this.buildCompanyDefendantDebtorDetailsAliases(companyDetailsState['fm_company_details_aliases']),
    };
  }

  private buildCompanyDefendant(
    companyDetailsState: IFinesMacCompanyDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ): IFinesMacCompanyDefendant {
    return {
      company_flag: true,
      organisation_name: companyDetailsState['fm_company_details_organisation_name'],
      address_line_1: companyDetailsState['fm_company_details_address_line_1'],
      address_line_2: companyDetailsState['fm_company_details_address_line_2'],
      address_line_3: companyDetailsState['fm_company_details_address_line_3'],
      post_code: companyDetailsState['fm_company_details_postcode'],
      telephone_number_home: contactDetailsState['fm_contact_details_telephone_number_home'],
      telephone_number_business: contactDetailsState['fm_contact_details_telephone_number_business'],
      telephone_number_mobile: contactDetailsState['fm_contact_details_telephone_number_mobile'],
      email_address_1: contactDetailsState['fm_contact_details_email_address_1'],
      email_address_2: contactDetailsState['fm_contact_details_email_address_2'],
      debtor_detail: this.buildCompanyDefendantDebtorDetails(companyDetailsState, languagePreferencesState),
    };
  }

  private applyCompanyDefendantBasePayload(defendant: IFinesMacCompanyDefendant): IFinesMacDefendantPayload {
    // We want to apply the base payload files to the defendant object so that all the fields are present

    // Apply the base payload to the aliases so that all the fields are present
    const aliases: IFinesMacDefendantPayloadDebtorDetailAlias[] =
      defendant.debtor_detail.aliases?.map((alias) => ({
        ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD,
        ...alias,
      })) || [];

    // Apply the base payload to the debtor detail so that all the fields are present
    // and the aliases are included
    const debtorDetail: IFinesMacDefendantPayloadDebtorDetail = {
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
      ...defendant.debtor_detail,
      aliases: aliases,
    };

    // Apply the base payload to the defendant so that all the fields are present
    return {
      ...FINES_MAC_DEFENDANT_PAYLOAD,
      ...defendant,
      debtor_detail: debtorDetail,
    };
  }

  // private buildParentGuardianDebtorDetailsAliases(
  //   aliases: IFinesMacParentGuardianDetailsAliasState[],
  // ): IFinesMacDefendantPayloadDebtorDetailAlias[] {
  //   return aliases.map((alias, index) => {
  //     const forenameKey =
  //       `fm_parent_guardian_details_alias_forenames_${index}` as keyof IFinesMacParentGuardianDetailsAliasState;
  //     const surnameKey =
  //       `fm_parent_guardian_details_alias_surname_${index}` as keyof IFinesMacParentGuardianDetailsAliasState;
  //     return {
  //       ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_ALIAS_PAYLOAD,
  //       alias_forenames: alias[forenameKey] || null,
  //       alias_surname: alias[surnameKey] || null,
  //     };
  //   });
  // }

  // private buildParentGuardianDebtorDetails(
  //   parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
  //   employerDetailsState: IFinesMacEmployerDetailsState,
  //   languagePreferencesState: IFinesMacLanguagePreferencesState,
  // ): IFinesMacDefendantPayloadDebtorDetail {
  //   return {
  //     vehicle_make: parentGuardianDetailsState['fm_parent_guardian_details_vehicle_make'],
  //     vehicle_registration_mark: parentGuardianDetailsState['fm_parent_guardian_details_vehicle_registration_mark'],
  //     document_language: languagePreferencesState['fm_language_preferences_document_language'],
  //     hearing_language: languagePreferencesState['fm_language_preferences_hearing_language'],
  //     employee_reference: employerDetailsState['fm_employer_details_employer_reference'],
  //     employer_company_name: employerDetailsState['fm_employer_details_employer_company_name'],
  //     employer_address_line_1: employerDetailsState['fm_employer_details_employer_company_name'],
  //     employer_address_line_2: employerDetailsState['fm_employer_details_employer_address_line_2'],
  //     employer_address_line_3: employerDetailsState['fm_employer_details_employer_address_line_3'],
  //     employer_address_line_4: employerDetailsState['fm_employer_details_employer_address_line_4'],
  //     employer_address_line_5: employerDetailsState['fm_employer_details_employer_address_line_5'],
  //     employer_post_code: employerDetailsState['fm_employer_details_employer_post_code'],
  //     employer_telephone_number: employerDetailsState['fm_employer_details_employer_telephone_number'],
  //     employer_email_address: employerDetailsState['fm_employer_details_employer_email_address'],
  //     aliases: this.buildParentGuardianDebtorDetailsAliases(
  //       parentGuardianDetailsState['fm_parent_guardian_details_aliases'],
  //     ),
  //   };
  // }

  // private buildParentGuardian(
  //   parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
  //   contactDetailsState: IFinesMacContactDetailsState,
  //   employerDetailsState: IFinesMacEmployerDetailsState,
  //   languagePreferencesState: IFinesMacLanguagePreferencesState,
  // ): IFinesMacDefendantPayloadParentGuardian {
  //   return {
  //     company_flag: false,
  //     company_name: null,
  //     surname: parentGuardianDetailsState['fm_parent_guardian_details_surname'],
  //     forenames: parentGuardianDetailsState['fm_parent_guardian_details_forenames'],
  //     dob: parentGuardianDetailsState['fm_parent_guardian_details_dob'],
  //     national_insurance_number: parentGuardianDetailsState['fm_parent_guardian_details_national_insurance_number'],
  //     address_line_1: parentGuardianDetailsState['fm_parent_guardian_details_address_line_1'],
  //     address_line_2: parentGuardianDetailsState['fm_parent_guardian_details_address_line_2'],
  //     address_line_3: parentGuardianDetailsState['fm_parent_guardian_details_address_line_3'],
  //     address_line_4: null,
  //     address_line_5: null,
  //     post_code: parentGuardianDetailsState['fm_parent_guardian_details_post_code'],
  //     telephone_number_home: contactDetailsState['fm_contact_details_telephone_number_home'],
  //     telephone_number_business: contactDetailsState['fm_contact_details_telephone_number_business'],
  //     telephone_number_mobile: contactDetailsState['fm_contact_details_telephone_number_mobile'],
  //     email_address_1: contactDetailsState['fm_contact_details_email_address_1'],
  //     email_address_2: contactDetailsState['fm_contact_details_email_address_2'],
  //     debtor_detail: this.buildParentGuardianDebtorDetails(
  //       parentGuardianDetailsState,
  //       employerDetailsState,
  //       languagePreferencesState,
  //     ),
  //   };
  // }

  // private buildParentGuardianDefendant(
  //   personalDetailsState: IFinesMacPersonalDetailsState,
  //   contactDetailsState: IFinesMacContactDetailsState,
  //   employerDetailsState: IFinesMacEmployerDetailsState,
  //   parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
  //   languagePreferencesState: IFinesMacLanguagePreferencesState,
  // ): IFinesMacDefendantPayload {
  //   return {
  //     ...FINES_MAC_DEFENDANT_PAYLOAD,
  //     company_flag: false,
  //     title: personalDetailsState['fm_personal_details_title'],
  //     surname: personalDetailsState['fm_personal_details_surname'],
  //     forenames: personalDetailsState['fm_personal_details_forenames'],
  //     dob: personalDetailsState['fm_personal_details_dob'],
  //     address_line_1: personalDetailsState['fm_personal_details_address_line_1'],
  //     address_line_2: personalDetailsState['fm_personal_details_address_line_2'],
  //     address_line_3: personalDetailsState['fm_personal_details_address_line_3'],
  //     post_code: personalDetailsState['fm_personal_details_post_code'],
  //     national_insurance_number: personalDetailsState['fm_personal_details_national_insurance_number'],
  //     debtor_detail: this.buildIndividualDefendantDebtorDetails(
  //       personalDetailsState,
  //       employerDetailsState,
  //       languagePreferencesState,
  //     ),
  //     parent_guardian: this.buildParentGuardian(
  //       parentGuardianDetailsState,
  //       contactDetailsState,
  //       employerDetailsState,
  //       languagePreferencesState,
  //     ),
  //   };
  // }

  private initialSetup(accountDetailsState: IFinesMacAccountDetailsState): void {
    const {
      fm_create_account_defendant_type: defendantType,
      fm_create_account_account_type: accountType,
      fm_create_account_business_unit: businessUnit,
    } = accountDetailsState;

    this.defendantType = defendantType;
    this.accountType = accountType;
  }

  public buildPayload(finesMacState: IFinesMacState): any {
    const {
      courtDetails,
      accountDetails,
      paymentTerms,
      employerDetails,
      personalDetails,
      contactDetails,
      languagePreferences,
      companyDetails,
      parentGuardianDetails,
    } = finesMacState;
    const courtDetailsState = courtDetails.formData;
    const accountDetailsState = accountDetails.formData;
    const paymentTermsState = paymentTerms.formData;
    const personalDetailsState = personalDetails.formData;
    const employerDetailsState = employerDetails.formData;
    const contactDetailsState = contactDetails.formData;
    const languagePreferencesState = languagePreferences.formData;
    const companyDetailsState = companyDetails.formData;
    const parentGuardianDetailsState = parentGuardianDetails.formData;

    let defendant: IFinesMacDefendantPayload;

    // Setup frequently used values.
    this.initialSetup(accountDetailsState);

    // if (this.defendantType === 'parentOrGuardianToPay') {
    // defendant = this.buildParentGuardianDefendant(
    //   personalDetailsState,
    //   contactDetailsState,
    //   employerDetailsState,
    //   parentGuardianDetailsState,
    //   languagePreferencesState,
    // );
    // } else if (this.defendantType === 'company') {
    defendant = this.applyCompanyDefendantBasePayload(
      this.buildCompanyDefendant(companyDetailsState, contactDetailsState, languagePreferencesState),
    );
    // } else {
    //   defendant = this.applyIndividualDefendantBasePayload(
    //     this.buildIndividualDefendant(
    //       personalDetailsState,
    //       contactDetailsState,
    //       employerDetailsState,
    //       languagePreferencesState,
    //     ),
    //   );
    // }

    return {
      account_type: this.accountType,
      defendant_type: this.defendantType,
      originator_name: 'awaiting autocomplete change',
      originator_id: 'awaiting autocomplete change',
      prosecutor_case_reference: courtDetailsState['fm_court_details_prosecutor_case_reference'],
      enforcement_court_id: 'awaiting autocomplete change',
      collection_order_made: paymentTermsState['fm_payment_terms_collection_order_made'],
      collection_order_made_today: paymentTermsState['fm_payment_terms_make_collection_order_today'],
      collection_order_date: paymentTermsState['fm_payment_terms_collection_order_date'],
      suspended_committal_date: paymentTermsState['fm_payment_terms_suspended_committal_date'],
      payment_card_request: paymentTermsState['fm_payment_terms_payment_card_request'],
      account_sentence_date: '2023-09-15', // Derived from from the earliest of all offence sentence dates
      defendant: defendant,
    };
  }
}
