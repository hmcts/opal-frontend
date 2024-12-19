import { finesMacPayloadMapAccountDefendantCompanyPayload } from './fines-mac-payload-map-account-defendant-company.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK } from '../mocks/fines-mac-payload-account-defendant-company-complete.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK } from '../mocks/fines-mac-payload-account-defendant-company-complete-with-aliases.mock';
import { IFinesMacCompanyDetailsState } from '../../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-company-details-state.mock';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../mocks/state/fines-mac-payload-language-preferences-state.mock';

describe('finesMacPayloadMapAccountDefendantCompanyPayload', () => {
  let initialState: IFinesMacState;
  let contactDetailsState: IFinesMacContactDetailsState;
  let languagePreferencesState: IFinesMacLanguagePreferencesState;
  let companyDetailsState: IFinesMacCompanyDetailsState;

  beforeEach(() => {
    initialState = structuredClone(FINES_MAC_STATE);
    contactDetailsState = structuredClone(FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK);
    languagePreferencesState = structuredClone(FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK);
    companyDetailsState = structuredClone(FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK);
  });

  it('should map payload to fines MAC state', () => {
    const payload: IFinesMacPayloadAccountDefendantComplete = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK,
    );

    const result = finesMacPayloadMapAccountDefendantCompanyPayload(initialState, payload);

    companyDetailsState.fm_company_details_add_alias = false;
    companyDetailsState.fm_company_details_aliases = [];

    expect(result.companyDetails.formData).toEqual(companyDetailsState);
    expect(result.contactDetails.formData).toEqual(contactDetailsState);
    expect(result.languagePreferences.formData).toEqual(languagePreferencesState);
  });

  it('should not map debtor details from payload to state if debtor detail is null', () => {
    const payload: IFinesMacPayloadAccountDefendantComplete = structuredClone({
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK,
      debtor_detail: null,
    });

    const result = finesMacPayloadMapAccountDefendantCompanyPayload(initialState, payload);

    expect(result.companyDetails.formData.fm_company_details_add_alias).toBe(null);
    expect(result.companyDetails.formData.fm_company_details_aliases).toEqual([]);

    expect(result.languagePreferences.formData).toEqual({
      fm_language_preferences_document_language: null,
      fm_language_preferences_hearing_language: null,
    });
  });

  it('should map the payload with aliases', () => {
    const payload: IFinesMacPayloadAccountDefendantComplete =
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK;

    const result = finesMacPayloadMapAccountDefendantCompanyPayload(initialState, payload);
    expect(result.companyDetails.formData.fm_company_details_add_alias).toBe(true);
    expect(result.companyDetails.formData.fm_company_details_aliases.length).toEqual(1);
  });
});
