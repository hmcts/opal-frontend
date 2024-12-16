import { finesMacPayloadMapAccountDefendantCompanyPayload } from './fines-mac-payload-map-account-defendant-company.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadBuildAccountDefendantComplete } from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-complete.interface';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-company-complete.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-company-complete-with-aliases.mock';
import { IFinesMacCompanyDetailsState } from '../../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_PAYLOAD_BUILD_COMPANY_DETAILS_STATE_MOCK } from '../fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-company-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_CONTACT_DETAILS_STATE_MOCK } from '../fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-language-preferences-state.mock';

describe('finesMacPayloadMapAccountDefendantCompanyPayload', () => {
  let initialState: IFinesMacState;

  beforeEach(() => {
    initialState = structuredClone(FINES_MAC_STATE);
  });

  it('should map payload to fines MAC state', () => {
    const payload: IFinesMacPayloadBuildAccountDefendantComplete = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK,
    );

    const result = finesMacPayloadMapAccountDefendantCompanyPayload(initialState, payload);

    const contactDetailsState: IFinesMacContactDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_BUILD_CONTACT_DETAILS_STATE_MOCK,
    );

    const languagePreferencesState: IFinesMacLanguagePreferencesState = structuredClone(
      FINES_MAC_PAYLOAD_BUILD_LANGUAGE_PREFERENCES_STATE_MOCK,
    );

    const companyDetailsState: IFinesMacCompanyDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_BUILD_COMPANY_DETAILS_STATE_MOCK,
    );
    companyDetailsState.fm_company_details_add_alias = false;
    companyDetailsState.fm_company_details_aliases = [];

    expect(result.companyDetails.formData).toEqual(companyDetailsState);
    expect(result.contactDetails.formData).toEqual(contactDetailsState);
    expect(result.languagePreferences.formData).toEqual(languagePreferencesState);
  });

  it('should map the payload with aliases', () => {
    const payload: IFinesMacPayloadBuildAccountDefendantComplete =
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK;

    const result = finesMacPayloadMapAccountDefendantCompanyPayload(initialState, payload);
    expect(result.companyDetails.formData.fm_company_details_add_alias).toBe(true);
    expect(result.companyDetails.formData.fm_company_details_aliases.length).toEqual(1);
  });
});
