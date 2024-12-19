import { finesMacPayloadMapAccountDefendantIndividualPayload } from './fines-mac-payload-map-account-defendant-individual.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK } from '../mocks/fines-mac-payload-account-defendant-individual-complete.mock';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-personal-details-state.mock';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK } from '../mocks/fines-mac-payload-account-defendant-individual-complete-with-alias.mock';
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
    const payload: IFinesMacPayloadAccountDefendantComplete = structuredClone(
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

  it('should not map debtor details from payload to state if debtor details is null', () => {
    const payload: IFinesMacPayloadAccountDefendantComplete = structuredClone({
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK,
      debtor_detail: null,
    });

    const result = finesMacPayloadMapAccountDefendantIndividualPayload(initialState, payload);

    expect(result.personalDetails.formData.fm_personal_details_add_alias).toBe(null);
    expect(result.personalDetails.formData.fm_personal_details_aliases).toEqual([]);
    expect(result.personalDetails.formData.fm_personal_details_vehicle_make).toBe(null);
    expect(result.personalDetails.formData.fm_personal_details_vehicle_registration_mark).toBe(null);

    expect(result.employerDetails.formData.fm_employer_details_employer_reference).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_company_name).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_address_line_1).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_address_line_2).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_address_line_3).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_address_line_4).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_address_line_5).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_post_code).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_telephone_number).toBe(null);
    expect(result.employerDetails.formData.fm_employer_details_employer_email_address).toBe(null);

    expect(result.languagePreferences.formData).toEqual({
      fm_language_preferences_document_language: null,
      fm_language_preferences_hearing_language: null,
    });
  });

  it('should map personal details with aliases from payload to state', () => {
    const payload: IFinesMacPayloadAccountDefendantComplete = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK,
    );

    const result = finesMacPayloadMapAccountDefendantIndividualPayload(initialState, payload);
    expect(result.personalDetails.formData.fm_personal_details_add_alias).toBe(true);
    expect(result.personalDetails.formData.fm_personal_details_aliases.length).toBeGreaterThan(0);
  });
});
