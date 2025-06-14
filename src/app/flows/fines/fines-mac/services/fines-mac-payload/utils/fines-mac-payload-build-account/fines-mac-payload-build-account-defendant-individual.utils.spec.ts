import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-employer-details-state.mock';
import { FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-personal-details-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK } from '../mocks/fines-mac-payload-account-defendant-individual.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK } from '../mocks/fines-mac-payload-account-defendant-individual-with-alias.mock';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../mocks/state/fines-mac-payload-language-preferences-state.mock';
import { finesMacPayloadBuildAccountDefendantIndividual } from './fines-mac-payload-build-account-defendant-individual.utils';

describe('finesMacPayloadBuildAccountDefendantIndividual', () => {
  let contactDetailsState: IFinesMacContactDetailsState | null;
  let languagePreferencesState: IFinesMacLanguagePreferencesState | null;
  let personalDetailsState: IFinesMacPersonalDetailsState | null;
  let employerDetailsState: IFinesMacEmployerDetailsState | null;

  beforeEach(() => {
    contactDetailsState = structuredClone(FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK);
    languagePreferencesState = structuredClone(FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK);
    personalDetailsState = structuredClone(FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK);
    employerDetailsState = structuredClone(FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK);
  });

  afterAll(() => {
    contactDetailsState = null;
    languagePreferencesState = null;
    personalDetailsState = null;
    employerDetailsState = null;
  });

  it('should build the individual defendant payload correctly', () => {
    if (!personalDetailsState || !contactDetailsState || !employerDetailsState || !languagePreferencesState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];

    const result = finesMacPayloadBuildAccountDefendantIndividual(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK);
  });

  it('should build the individual defendant payload correctly with aliases', () => {
    if (!personalDetailsState || !contactDetailsState || !employerDetailsState || !languagePreferencesState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const result = finesMacPayloadBuildAccountDefendantIndividual(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK);
  });

  it('should return null for alias forenames and surname if dynamic keys are missing', () => {
    if (!personalDetailsState || !contactDetailsState || !employerDetailsState || !languagePreferencesState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    // Set up state to include an alias but omit the dynamic keys
    personalDetailsState.fm_personal_details_add_alias = true;
    personalDetailsState.fm_personal_details_aliases = [
      {}, // no keys like fm_personal_details_alias_forenames_0 or surname_0
    ];

    const result = finesMacPayloadBuildAccountDefendantIndividual(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
    );

    expect(result.debtor_detail.aliases).toEqual([
      {
        alias_forenames: null,
        alias_surname: null,
      },
    ]);
  });
});
