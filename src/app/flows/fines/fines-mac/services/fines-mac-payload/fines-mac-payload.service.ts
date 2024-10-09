import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class FinesMacPayloadService {
  private defendantType!: string | null;
  private accountType!: string | null;
  private businessUnit!: string | null;
  private isCompany!: boolean;

  private buildIndividualDefendantDebtorDetailsAliases(aliases: IFinesMacPersonalDetailsAliasState[]) {
    return aliases.map((alias, index) => {
      const forenameKey = `fm_personal_details_alias_forenames_${index}` as keyof IFinesMacPersonalDetailsAliasState;
      const surnameKey = `fm_personal_details_alias_surname_${index}` as keyof IFinesMacPersonalDetailsAliasState;
      return {
        alias_forenames: alias[forenameKey],
        alias_surname: alias[surnameKey],
        alias_company_name: null,
      };
    });
  }

  private buildIndividualDefendantDebtorDetails(
    personalDetailsState: IFinesMacPersonalDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ) {
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
  ) {
    return {
      company_flag: false,
      title: personalDetailsState['fm_personal_details_title'],
      surname: personalDetailsState['fm_personal_details_surname'],
      forenames: personalDetailsState['fm_personal_details_forenames'],
      organisation_name: null,
      dob: personalDetailsState['fm_personal_details_dob'],
      address_line_1: personalDetailsState['fm_personal_details_address_line_1'],
      address_line_2: personalDetailsState['fm_personal_details_address_line_2'],
      address_line_3: personalDetailsState['fm_personal_details_address_line_3'],
      address_line_4: null,
      address_line_5: null,
      post_code: personalDetailsState['fm_personal_details_post_code'],
      telephone_number_home: contactDetailsState['fm_contact_details_telephone_number_home'],
      telephone_number_business: contactDetailsState['fm_contact_details_telephone_number_business'],
      telephone_number_mobile: contactDetailsState['fm_contact_details_telephone_number_mobile'],
      email_address_1: contactDetailsState['fm_contact_details_email_address_1'],
      email_address_2: contactDetailsState['fm_contact_details_email_address_2'],
      national_insurance_number: personalDetailsState['fm_personal_details_national_insurance_number'],
      driving_licence_number: null,
      pnc_id: null,
      nationality_1: null,
      nationality_2: null,
      ethnicity_self_defined: null,
      ethnicity_observed: null,
      cro_number: null,
      occupation: null,
      gender: null,
      custody_status: null,
      prison_number: null,
      interpreter_lang: null,
      debtor_detail: this.buildIndividualDefendantDebtorDetails(
        personalDetailsState,
        employerDetailsState,
        languagePreferencesState,
      ),
      parent_guardian: null,
    };
  }

  private buildCompanyDefendantDebtorDetailsAliases(aliases: IFinesMacCompanyDetailsAliasState[]) {
    return aliases.map((alias, index) => {
      console.log(alias);
      const companyNameKey =
        `fm_company_details_alias_organisation_name_${index}` as keyof IFinesMacCompanyDetailsAliasState;
      return {
        alias_forenames: null,
        alias_surname: null,
        alias_company_name: alias[companyNameKey],
      };
    });
  }

  private buildCompanyDefendantDebtorDetails(
    companyDetailsState: IFinesMacCompanyDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ) {
    return {
      vehicle_make: null,
      vehicle_registration_mark: null,
      document_language: languagePreferencesState['fm_language_preferences_document_language'],
      hearing_language: languagePreferencesState['fm_language_preferences_hearing_language'],
      employee_reference: null,
      employer_company_name: null,
      employer_address_line_1: null,
      employer_address_line_2: null,
      employer_address_line_3: null,
      employer_address_line_4: null,
      employer_address_line_5: null,
      employer_post_code: null,
      employer_telephone_number: null,
      employer_email_address: null,
      aliases: this.buildCompanyDefendantDebtorDetailsAliases(companyDetailsState['fm_company_details_aliases']),
    };
  }

  private buildCompanyDefendant(
    companyDetailsState: IFinesMacCompanyDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ) {
    return {
      company_flag: true,
      title: null,
      surname: null,
      forenames: null,
      organisation_name: companyDetailsState['fm_company_details_organisation_name'],
      dob: null,
      address_line_1: companyDetailsState['fm_company_details_address_line_1'],
      address_line_2: companyDetailsState['fm_company_details_address_line_2'],
      address_line_3: companyDetailsState['fm_company_details_address_line_3'],
      address_line_4: null,
      address_line_5: null,
      post_code: companyDetailsState['fm_company_details_postcode'],
      telephone_number_home: contactDetailsState['fm_contact_details_telephone_number_home'],
      telephone_number_business: contactDetailsState['fm_contact_details_telephone_number_business'],
      telephone_number_mobile: contactDetailsState['fm_contact_details_telephone_number_mobile'],
      email_address_1: contactDetailsState['fm_contact_details_email_address_1'],
      email_address_2: contactDetailsState['fm_contact_details_email_address_2'],
      national_insurance_number: null,
      driving_licence_number: null,
      pnc_id: null,
      nationality_1: null,
      nationality_2: null,
      ethnicity_self_defined: null,
      ethnicity_observed: null,
      cro_number: null,
      occupation: null,
      gender: null,
      custody_status: null,
      prison_number: null,
      interpreter_lang: null,
      debtor_detail: this.buildCompanyDefendantDebtorDetails(companyDetailsState, languagePreferencesState),
      parent_guardian: null,
    };
  }

  private buildParentGuardianDebtorDetailsAliases(aliases: IFinesMacParentGuardianDetailsAliasState[]) {
    return aliases.map((alias, index) => {
      const forenameKey =
        `fm_parent_guardian_details_alias_forenames_${index}` as keyof IFinesMacParentGuardianDetailsAliasState;
      const surnameKey =
        `fm_parent_guardian_details_alias_surname_${index}` as keyof IFinesMacParentGuardianDetailsAliasState;
      return {
        alias_forenames: alias[forenameKey],
        alias_surname: alias[surnameKey],
        alias_company_name: null,
      };
    });
  }

  private buildParentGuardianDebtorDetails(
    parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ) {
    return {
      vehicle_make: parentGuardianDetailsState['fm_parent_guardian_details_vehicle_make'],
      vehicle_registration_mark: parentGuardianDetailsState['fm_parent_guardian_details_vehicle_registration_mark'],
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
      aliases: this.buildParentGuardianDebtorDetailsAliases(
        parentGuardianDetailsState['fm_parent_guardian_details_aliases'],
      ),
    };
  }

  private buildParentGuardian(
    parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ) {
    return {
      company_flag: false,
      company_name: '',
      surname: parentGuardianDetailsState['fm_parent_guardian_details_surname'],
      forenames: parentGuardianDetailsState['fm_parent_guardian_details_forenames'],
      dob: parentGuardianDetailsState['fm_parent_guardian_details_dob'],
      national_insurance_number: parentGuardianDetailsState['fm_parent_guardian_details_national_insurance_number'],
      address_line_1: parentGuardianDetailsState['fm_parent_guardian_details_address_line_1'],
      address_line_2: parentGuardianDetailsState['fm_parent_guardian_details_address_line_2'],
      address_line_3: parentGuardianDetailsState['fm_parent_guardian_details_address_line_3'],
      address_line_4: null,
      address_line_5: null,
      post_code: parentGuardianDetailsState['fm_parent_guardian_details_post_code'],
      telephone_number_home: contactDetailsState['fm_contact_details_telephone_number_home'],
      telephone_number_business: contactDetailsState['fm_contact_details_telephone_number_business'],
      telephone_number_mobile: contactDetailsState['fm_contact_details_telephone_number_mobile'],
      email_address_1: contactDetailsState['fm_contact_details_email_address_1'],
      email_address_2: contactDetailsState['fm_contact_details_email_address_2'],
      debtor_detail: this.buildParentGuardianDebtorDetails(
        parentGuardianDetailsState,
        employerDetailsState,
        languagePreferencesState,
      ),
    };
  }

  private buildParentGuardianDefendant(
    personalDetailsState: IFinesMacPersonalDetailsState,
    contactDetailsState: IFinesMacContactDetailsState,
    employerDetailsState: IFinesMacEmployerDetailsState,
    parentGuardianDetailsState: IFinesMacParentGuardianDetailsState,
    languagePreferencesState: IFinesMacLanguagePreferencesState,
  ) {
    return {
      company_flag: false,
      title: personalDetailsState['fm_personal_details_title'],
      surname: personalDetailsState['fm_personal_details_surname'],
      forenames: personalDetailsState['fm_personal_details_forenames'],
      organisation_name: null,
      dob: personalDetailsState['fm_personal_details_dob'],
      address_line_1: personalDetailsState['fm_personal_details_address_line_1'],
      address_line_2: personalDetailsState['fm_personal_details_address_line_2'],
      address_line_3: personalDetailsState['fm_personal_details_address_line_3'],
      address_line_4: null,
      address_line_5: null,
      post_code: personalDetailsState['fm_personal_details_post_code'],
      telephone_number_home: null,
      telephone_number_business: null,
      telephone_number_mobile: null,
      email_address_1: null,
      email_address_2: null,
      national_insurance_number: personalDetailsState['fm_personal_details_national_insurance_number'],
      driving_licence_number: null,
      pnc_id: null,
      nationality_1: null,
      nationality_2: null,
      ethnicity_self_defined: null,
      ethnicity_observed: null,
      cro_number: null,
      occupation: null,
      gender: null,
      custody_status: null,
      prison_number: null,
      interpreter_lang: null,
      debtor_detail: this.buildIndividualDefendantDebtorDetails(
        personalDetailsState,
        employerDetailsState,
        languagePreferencesState,
      ),
      parent_guardian: this.buildParentGuardian(
        parentGuardianDetailsState,
        contactDetailsState,
        employerDetailsState,
        languagePreferencesState,
      ),
    };
  }

  private initialSetup(accountDetailsState: IFinesMacAccountDetailsState): void {
    const {
      fm_create_account_defendant_type: defendantType,
      fm_create_account_account_type: accountType,
      fm_create_account_business_unit: businessUnit,
    } = accountDetailsState;

    this.defendantType = defendantType;
    this.accountType = accountType;
    this.businessUnit = businessUnit;

    this.isCompany = defendantType === 'company';
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

    let defendant: any;

    // Setup frequently used values.
    this.initialSetup(accountDetailsState);

    if (this.defendantType === 'parentOrGuardianToPay') {
      defendant = this.buildParentGuardianDefendant(
        personalDetailsState,
        contactDetailsState,
        employerDetailsState,
        parentGuardianDetailsState,
        languagePreferencesState,
      );
    } else if (this.defendantType === 'company') {
      defendant = this.buildCompanyDefendant(companyDetailsState, contactDetailsState, languagePreferencesState);
    } else {
      defendant = this.buildIndividualDefendant(
        personalDetailsState,
        contactDetailsState,
        employerDetailsState,
        languagePreferencesState,
      );
    }

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
