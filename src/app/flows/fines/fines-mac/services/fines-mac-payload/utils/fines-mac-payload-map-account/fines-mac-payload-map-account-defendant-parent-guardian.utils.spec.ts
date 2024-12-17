import { finesMacPayloadMapAccountDefendantParentGuardianPayload } from './fines-mac-payload-map-account-defendant-parent-guardian.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadBuildAccountDefendantComplete } from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-complete.interface';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-parent-guardian-complete.mock';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-employer-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../mocks/state/fines-mac-payload-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-parent-guardian-details-state.mock';
import { FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-personal-details-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-parent-guardian-complete-with-alias.mock';

describe('finesMacPayloadMapAccountDefendantParentGuardianPayload', () => {
  let initialState: IFinesMacState;

  beforeEach(() => {
    initialState = structuredClone(FINES_MAC_STATE);
  });

  it('should map personal details from payload to state', () => {
    const payload: IFinesMacPayloadBuildAccountDefendantComplete = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK,
    );

    const result = finesMacPayloadMapAccountDefendantParentGuardianPayload(initialState, payload);
    const personalDetailsState: IFinesMacPersonalDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK,
    );
    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];
    personalDetailsState.fm_personal_details_vehicle_make = null;
    personalDetailsState.fm_personal_details_vehicle_registration_mark = null;

    const contactDetailsState: IFinesMacContactDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK,
    );

    const employerDetailsState: IFinesMacEmployerDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK,
    );

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    );
    parentGuardianDetailsState.fm_parent_guardian_details_add_alias = false;
    parentGuardianDetailsState.fm_parent_guardian_details_aliases = [];

    const languagePreferencesState: IFinesMacLanguagePreferencesState = structuredClone(
      FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK,
    );

    expect(result.personalDetails.formData).toEqual(personalDetailsState);
    expect(result.contactDetails.formData).toEqual(contactDetailsState);
    expect(result.employerDetails.formData).toEqual(employerDetailsState);
    expect(result.parentGuardianDetails.formData).toEqual(parentGuardianDetailsState);
    expect(result.languagePreferences.formData).toEqual(languagePreferencesState);
  });

  it('should map parent/guardian details if present in payload', () => {
    const payload: IFinesMacPayloadBuildAccountDefendantComplete = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK,
    );

    const result = finesMacPayloadMapAccountDefendantParentGuardianPayload(initialState, payload);
    expect(result.parentGuardianDetails.formData.fm_parent_guardian_details_add_alias).toBe(true);
    expect(result.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.length).toEqual(1);
  });
});
