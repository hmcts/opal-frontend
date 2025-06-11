import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_MOCK } from '../mocks/fines-mac-payload-account-defendant-parent-guardian.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK } from '../mocks/fines-mac-payload-account-defendant-parent-guardian-with-alias.mock';

import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-employer-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../mocks/state/fines-mac-payload-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-personal-details-state.mock';
import { FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-parent-guardian-details-state.mock';
import { finesMacPayloadBuildAccountDefendantParentGuardian } from './fines-mac-payload-build-account-defendant-parent-guardian.utils';

describe('finesMacPayloadBuildAccountDefendantParentGuardian', () => {
  let contactDetailsState: IFinesMacContactDetailsState | null;
  let languagePreferencesState: IFinesMacLanguagePreferencesState | null;
  let personalDetailsState: IFinesMacPersonalDetailsState | null;
  let employerDetailsState: IFinesMacEmployerDetailsState | null;
  let parentGuardianDetailsState: IFinesMacParentGuardianDetailsState | null;

  beforeEach(() => {
    contactDetailsState = structuredClone(FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK);
    languagePreferencesState = structuredClone(FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK);
    personalDetailsState = structuredClone(FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK);
    employerDetailsState = structuredClone(FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK);
    parentGuardianDetailsState = structuredClone(FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK);
  });

  afterAll(() => {
    contactDetailsState = null;
    languagePreferencesState = null;
    personalDetailsState = null;
    employerDetailsState = null;
    parentGuardianDetailsState = null;
  });

  it('should build the correct payload', () => {
    if (
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !parentGuardianDetailsState ||
      !languagePreferencesState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    personalDetailsState.fm_personal_details_vehicle_make = null;
    personalDetailsState.fm_personal_details_vehicle_registration_mark = null;
    personalDetailsState.fm_personal_details_aliases = [];
    personalDetailsState.fm_personal_details_add_alias = false;

    parentGuardianDetailsState.fm_parent_guardian_details_add_alias = false;
    parentGuardianDetailsState.fm_parent_guardian_details_aliases = [];

    const result = finesMacPayloadBuildAccountDefendantParentGuardian(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      parentGuardianDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_MOCK);
  });

  it('should build the correct payload with aliases', () => {
    if (
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !parentGuardianDetailsState ||
      !languagePreferencesState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];
    personalDetailsState.fm_personal_details_vehicle_make = null;
    personalDetailsState.fm_personal_details_vehicle_registration_mark = null;

    parentGuardianDetailsState.fm_parent_guardian_details_add_alias = true;
    parentGuardianDetailsState.fm_parent_guardian_details_aliases = [
      {
        fm_parent_guardian_details_alias_forenames_0: 'Testing',
        fm_parent_guardian_details_alias_surname_0: 'Test',
      },
    ];

    const result = finesMacPayloadBuildAccountDefendantParentGuardian(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      parentGuardianDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK);
  });

  it('should return null for alias forenames and surname if dynamic keys are missing in parent guardian aliases', () => {
    if (
      !personalDetailsState ||
      !contactDetailsState ||
      !employerDetailsState ||
      !parentGuardianDetailsState ||
      !languagePreferencesState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];
    personalDetailsState.fm_personal_details_vehicle_make = null;
    personalDetailsState.fm_personal_details_vehicle_registration_mark = null;

    parentGuardianDetailsState.fm_parent_guardian_details_add_alias = true;
    parentGuardianDetailsState.fm_parent_guardian_details_aliases = [{}]; // no dynamic keys

    const result = finesMacPayloadBuildAccountDefendantParentGuardian(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      parentGuardianDetailsState,
      languagePreferencesState,
    );

    expect(result.parent_guardian.debtor_detail.aliases).toEqual([
      {
        alias_forenames: null,
        alias_surname: null,
      },
    ]);
  });
});
