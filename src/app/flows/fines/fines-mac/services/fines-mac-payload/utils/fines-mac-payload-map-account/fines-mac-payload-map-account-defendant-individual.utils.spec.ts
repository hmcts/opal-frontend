import { finesMacPayloadMapAccountDefendantIndividualPayload } from './fines-mac-payload-map-account-defendant-individual.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadBuildAccountDefendantComplete } from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-complete.interface';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-individual-complete.mock';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-personal-details-state.mock';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-individual-complete-with-alias.mock';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-employer-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../mocks/state/fines-mac-payload-language-preferences-state.mock';

describe('finesMacPayloadMapAccountDefendantIndividualPayload', () => {
  let initialState: IFinesMacState;

  beforeEach(() => {
    initialState = structuredClone(FINES_MAC_STATE);
  });

  it('should map personal details from payload to state', () => {
    const payload: IFinesMacPayloadBuildAccountDefendantComplete = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK,
    );

    const personalDetailsState: IFinesMacPersonalDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK,
    );
    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];

    const contactDetailsState: IFinesMacContactDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK,
    );

    const employerDetailsState: IFinesMacEmployerDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK,
    );

    const languagePreferencesState: IFinesMacLanguagePreferencesState = structuredClone(
      FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK,
    );

    const result = finesMacPayloadMapAccountDefendantIndividualPayload(initialState, payload);

    expect(result.personalDetails.formData).toEqual(personalDetailsState);
    expect(result.contactDetails.formData).toEqual(contactDetailsState);
    expect(result.employerDetails.formData).toEqual(employerDetailsState);
    expect(result.languagePreferences.formData).toEqual(languagePreferencesState);
  });

  it('should map personal details with aliases from payload to state', () => {
    const payload: IFinesMacPayloadBuildAccountDefendantComplete = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK,
    );

    const result = finesMacPayloadMapAccountDefendantIndividualPayload(initialState, payload);
    expect(result.personalDetails.formData.fm_personal_details_add_alias).toBe(true);
    expect(result.personalDetails.formData.fm_personal_details_aliases.length).toBeGreaterThan(0);
  });
});
