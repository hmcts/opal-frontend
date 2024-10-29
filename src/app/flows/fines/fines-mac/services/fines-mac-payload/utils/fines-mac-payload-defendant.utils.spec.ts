import { buildDefendantPayload } from './fines-mac-payload-defendant.utils';
import { IFinesMacAccountDetailsState } from '../../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { IFinesMacCompanyDetailsState } from '../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../../../fines-mac-account-details/mocks/fines-mac-account-details-state.mock';
import { FINES_MAC_COMPANY_DETAILS_STATE_MOCK } from '../../../fines-mac-company-details/mocks/fines-mac-company-details-state.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK } from './mocks/fines-mac-payload-defendant-parent-guardian-complete.mock';
import { FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from '../../../fines-mac-contact-details/mocks/fines-mac-contact-details-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_STATE_MOCK } from '../../../fines-mac-personal-details/mocks/fines-mac-personal-details-state.mock';
import { FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK } from '../../../fines-mac-employer-details/mocks/fines-mac-employer-details-state.mock';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../../../fines-mac-parent-guardian-details/mocks/fines-mac-parent-guardian-details-state.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK } from './mocks/fines-mac-payload-defendant-parent-guardian-complete-with-alias.mock';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../../../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK } from './mocks/fines-mac-payload-defendant-company-complete-with-aliases.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_COMPLETE_MOCK } from './mocks/fines-mac-payload-defendant-company-complete.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK } from './mocks/fines-mac-payload-defendant-individual-complete-with-alias.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK } from './mocks/fines-mac-payload-defendant-individual-complete.mock';

describe('buildDefendantPayload', () => {
  it('should build payload for parent or guardian defendant', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      fm_create_account_defendant_type: 'parentOrGuardianToPay',
    };
    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
      fm_personal_details_add_alias: false,
      fm_personal_details_aliases: [],
      fm_personal_details_vehicle_make: null,
      fm_personal_details_vehicle_registration_mark: null,
    };

    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
    };
    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = { ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
      fm_parent_guardian_details_add_alias: false,
      fm_parent_guardian_details_aliases: [],
    };

    const result = buildDefendantPayload(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK);
  });

  it('should build payload for parent or guardian defendant with aliases', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      fm_create_account_defendant_type: 'parentOrGuardianToPay',
    };
    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
      fm_personal_details_add_alias: false,
      fm_personal_details_aliases: [],
      fm_personal_details_vehicle_make: null,
      fm_personal_details_vehicle_registration_mark: null,
    };

    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
    };
    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = { ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK };
    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    };

    const result = buildDefendantPayload(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK);
  });

  it('should build payload for company defendant', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      fm_create_account_defendant_type: 'company',
    };

    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
    };
    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
    };
    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = {
      ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK,
      fm_company_details_add_alias: false,
      fm_company_details_aliases: [],
    };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    };

    const result = buildDefendantPayload(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_COMPLETE_MOCK);
  });

  it('should build payload for company defendant with aliases', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      fm_create_account_defendant_type: 'company',
    };

    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
    };
    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
    };
    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = { ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    };

    const result = buildDefendantPayload(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK);
  });

  it('should build payload for individual defendant with aliases', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      fm_create_account_defendant_type: 'individual',
    };

    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
    };
    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
    };
    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = { ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    };
    const result = buildDefendantPayload(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK);
  });

  it('should build payload for individual defendant', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      fm_create_account_defendant_type: 'individual',
    };

    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
      fm_personal_details_add_alias: false,
      fm_personal_details_aliases: [],
    };
    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
    };
    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = { ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    };
    const result = buildDefendantPayload(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK);
  });
});