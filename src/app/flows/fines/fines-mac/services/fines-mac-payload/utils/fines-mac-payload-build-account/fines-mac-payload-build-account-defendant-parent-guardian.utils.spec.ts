import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_MOCK } from './mocks/fines-mac-payload-account-defendant-parent-guardian.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK } from './mocks/fines-mac-payload-account-defendant-parent-guardian-with-alias.mock';

import { FINES_MAC_PAYLOAD_BUILD_CONTACT_DETAILS_STATE_MOCK } from './mocks/state/fines-mac-payload-build-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_EMPLOYER_DETAILS_STATE_MOCK } from './mocks/state/fines-mac-payload-build-employer-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_LANGUAGE_PREFERENCES_STATE_MOCK } from './mocks/state/fines-mac-payload-build-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_PERSONAL_DETAILS_STATE_MOCK } from './mocks/state/fines-mac-payload-build-personal-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from './mocks/state/fines-mac-payload-build-parent-guardian-details-state.mock';
import { finesMacPayloadBuildAccountDefendantParentGuardian } from './fines-mac-payload-build-account-defendant-parent-guardian.utils';

describe('finesMacPayloadBuildAccountDefendantParentGuardian', () => {
  it('should build the correct payload', () => {
    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PAYLOAD_BUILD_PERSONAL_DETAILS_STATE_MOCK,
      fm_personal_details_add_alias: false,
      fm_personal_details_aliases: [],
      fm_personal_details_vehicle_make: null,
      fm_personal_details_vehicle_registration_mark: null,
    };

    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_PAYLOAD_BUILD_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_PAYLOAD_BUILD_EMPLOYER_DETAILS_STATE_MOCK,
    };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PAYLOAD_BUILD_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
      fm_parent_guardian_details_add_alias: false,
      fm_parent_guardian_details_aliases: [],
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_PAYLOAD_BUILD_LANGUAGE_PREFERENCES_STATE_MOCK,
    };

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
    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PAYLOAD_BUILD_PERSONAL_DETAILS_STATE_MOCK,
      fm_personal_details_add_alias: false,
      fm_personal_details_aliases: [],
      fm_personal_details_vehicle_make: null,
      fm_personal_details_vehicle_registration_mark: null,
    };

    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_PAYLOAD_BUILD_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_PAYLOAD_BUILD_EMPLOYER_DETAILS_STATE_MOCK,
    };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PAYLOAD_BUILD_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
      fm_parent_guardian_details_add_alias: true,
      fm_parent_guardian_details_aliases: [
        {
          fm_parent_guardian_details_alias_forenames_0: 'Testing',
          fm_parent_guardian_details_alias_surname_0: 'Test',
        },
      ],
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_PAYLOAD_BUILD_LANGUAGE_PREFERENCES_STATE_MOCK,
    };

    const result = finesMacPayloadBuildAccountDefendantParentGuardian(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      parentGuardianDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK);
  });
});
