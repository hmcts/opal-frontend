import { IFinesMacAccountDetailsState } from '../../../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { IFinesMacCompanyDetailsState } from '../../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';

import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK } from '../mocks/fines-mac-payload-account-defendant-parent-guardian-complete.mock';

import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK } from '../mocks/fines-mac-payload-account-defendant-parent-guardian-complete-with-alias.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK } from '../mocks/fines-mac-payload-account-defendant-company-complete-with-aliases.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK } from '../mocks/fines-mac-payload-account-defendant-company-complete.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK } from '../mocks/fines-mac-payload-account-defendant-individual-complete-with-alias.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK } from '../mocks/fines-mac-payload-account-defendant-individual-complete.mock';
import { FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-employer-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../mocks/state/fines-mac-payload-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-parent-guardian-details-state.mock';
import { FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-personal-details-state.mock';
import { FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-company-details-state.mock';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-contact-details-state.mock';
import { finesMacPayloadBuildAccountDefendant } from './fines-mac-payload-build-account-defendant.utils';
import { FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-account-details-state.mock';

describe('finesMacPayloadBuildAccountDefendant', () => {
  let contactDetailsState: IFinesMacContactDetailsState | null;
  let languagePreferencesState: IFinesMacLanguagePreferencesState | null;
  let personalDetailsState: IFinesMacPersonalDetailsState | null;
  let employerDetailsState: IFinesMacEmployerDetailsState | null;
  let companyDetailsState: IFinesMacCompanyDetailsState | null;
  let parentGuardianDetailsState: IFinesMacParentGuardianDetailsState | null;
  let accountDetailsState: IFinesMacAccountDetailsState | null;

  beforeEach(() => {
    contactDetailsState = structuredClone(FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK);
    languagePreferencesState = structuredClone(FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK);
    personalDetailsState = structuredClone(FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK);
    employerDetailsState = structuredClone(FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK);
    companyDetailsState = structuredClone(FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK);
    parentGuardianDetailsState = structuredClone(FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK);
    accountDetailsState = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK);
  });

  afterEach(() => {
    contactDetailsState = null;
    languagePreferencesState = null;
    personalDetailsState = null;
    employerDetailsState = null;
    companyDetailsState = null;
    parentGuardianDetailsState = null;
    accountDetailsState = null;
  });

  it('should build payload for parent or guardian defendant', () => {
    if (
      !accountDetailsState ||
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !languagePreferencesState ||
      !companyDetailsState ||
      !parentGuardianDetailsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    accountDetailsState.fm_create_account_defendant_type = 'parentOrGuardianToPay';

    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];
    personalDetailsState.fm_personal_details_vehicle_make = null;
    personalDetailsState.fm_personal_details_vehicle_registration_mark = null;

    parentGuardianDetailsState.fm_parent_guardian_details_add_alias = false;
    parentGuardianDetailsState.fm_parent_guardian_details_aliases = [];

    const result = finesMacPayloadBuildAccountDefendant(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK);
  });

  it('should build payload for parent or guardian defendant with aliases', () => {
    if (
      !accountDetailsState ||
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !languagePreferencesState ||
      !companyDetailsState ||
      !parentGuardianDetailsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    accountDetailsState.fm_create_account_defendant_type = 'parentOrGuardianToPay';

    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];
    personalDetailsState.fm_personal_details_vehicle_make = null;
    personalDetailsState.fm_personal_details_vehicle_registration_mark = null;

    const result = finesMacPayloadBuildAccountDefendant(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK);
  });

  it('should build payload for company defendant', () => {
    if (
      !accountDetailsState ||
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !languagePreferencesState ||
      !companyDetailsState ||
      !parentGuardianDetailsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    accountDetailsState.fm_create_account_defendant_type = 'company';

    companyDetailsState.fm_company_details_add_alias = false;
    companyDetailsState.fm_company_details_aliases = [];

    const result = finesMacPayloadBuildAccountDefendant(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK);
  });

  it('should build payload for company defendant with aliases', () => {
    if (
      !accountDetailsState ||
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !languagePreferencesState ||
      !companyDetailsState ||
      !parentGuardianDetailsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    accountDetailsState.fm_create_account_defendant_type = 'company';

    const result = finesMacPayloadBuildAccountDefendant(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK);
  });

  it('should build payload for individual defendant with aliases', () => {
    if (
      !accountDetailsState ||
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !languagePreferencesState ||
      !companyDetailsState ||
      !parentGuardianDetailsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    accountDetailsState.fm_create_account_defendant_type = 'individual';

    const result = finesMacPayloadBuildAccountDefendant(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK);
  });

  it('should build payload for individual defendant', () => {
    if (
      !accountDetailsState ||
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !languagePreferencesState ||
      !companyDetailsState ||
      !parentGuardianDetailsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    accountDetailsState.fm_create_account_defendant_type = 'individual';

    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];

    const result = finesMacPayloadBuildAccountDefendant(
      accountDetailsState,
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
      companyDetailsState,
      parentGuardianDetailsState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK);
  });
});
