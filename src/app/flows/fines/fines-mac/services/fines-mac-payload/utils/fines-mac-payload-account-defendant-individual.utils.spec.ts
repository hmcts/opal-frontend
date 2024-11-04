import { buildAccountDefendantIndividualPayload } from './fines-mac-payload-account-defendant-individual.utils';
import { IFinesMacPersonalDetailsState } from '../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from '../../../fines-mac-contact-details/mocks/fines-mac-contact-details-state.mock';
import { FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK } from '../../../fines-mac-employer-details/mocks/fines-mac-employer-details-state.mock';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../../../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_STATE_MOCK } from '../../../fines-mac-personal-details/mocks/fines-mac-personal-details-state.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK } from './mocks/fines-mac-payload-defendant-individual.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK } from './mocks/fines-mac-payload-defendant-individual-with-alias.mock';

describe('buildAccountDefendantIndividualPayload', () => {
  it('should build the individual defendant payload correctly', () => {
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

    const result = buildAccountDefendantIndividualPayload(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK);
  });

  it('should build the individual defendant payload correctly with aliases', () => {
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

    const result = buildAccountDefendantIndividualPayload(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK);
  });
});