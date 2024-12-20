import { IFinesMacCompanyDetailsState } from '../../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-company-details-state.mock';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../mocks/state/fines-mac-payload-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK } from '../mocks/fines-mac-payload-account-defendant-company.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK } from '../mocks/fines-mac-payload-account-defendant-company-with-aliases.mock';
import { finesMacPayloadBuildAccountDefendantCompany } from './fines-mac-payload-build-account-defendant-company.utils';

describe('finesMacPayloadBuildAccountDefendantCompany', () => {
  let contactDetailsState: IFinesMacContactDetailsState;
  let languagePreferencesState: IFinesMacLanguagePreferencesState;
  let companyDetailsState: IFinesMacCompanyDetailsState;

  beforeEach(() => {
    contactDetailsState = structuredClone(FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK);
    languagePreferencesState = structuredClone(FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK);
    companyDetailsState = structuredClone(FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK);
  });

  it('should build the correct payload', () => {
    const result = finesMacPayloadBuildAccountDefendantCompany(
      companyDetailsState,
      contactDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK);
  });

  it('should handle empty alias array', () => {
    companyDetailsState.fm_company_details_add_alias = false;
    companyDetailsState.fm_company_details_aliases = [];

    const result = finesMacPayloadBuildAccountDefendantCompany(
      companyDetailsState,
      contactDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK);
  });
});
