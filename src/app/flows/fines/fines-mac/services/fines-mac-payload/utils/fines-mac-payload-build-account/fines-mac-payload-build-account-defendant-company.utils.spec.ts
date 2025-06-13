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
  let contactDetailsState: IFinesMacContactDetailsState | null;
  let languagePreferencesState: IFinesMacLanguagePreferencesState | null;
  let companyDetailsState: IFinesMacCompanyDetailsState | null;

  beforeEach(() => {
    contactDetailsState = structuredClone(FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK);
    languagePreferencesState = structuredClone(FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK);
    companyDetailsState = structuredClone(FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK);
  });

  afterAll(() => {
    contactDetailsState = null;
    languagePreferencesState = null;
    companyDetailsState = null;
  });

  it('should build the correct payload', () => {
    if (!companyDetailsState || !contactDetailsState || !languagePreferencesState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const result = finesMacPayloadBuildAccountDefendantCompany(
      companyDetailsState,
      contactDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK);
  });

  it('should handle empty alias array', () => {
    if (!companyDetailsState || !contactDetailsState || !languagePreferencesState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    companyDetailsState.fm_company_details_add_alias = false;
    companyDetailsState.fm_company_details_aliases = [];

    const result = finesMacPayloadBuildAccountDefendantCompany(
      companyDetailsState,
      contactDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK);
  });

  it('should return null for alias company name if dynamic key is missing', () => {
    if (!companyDetailsState || !contactDetailsState || !languagePreferencesState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    // Add an alias entry but remove the dynamic key
    companyDetailsState.fm_company_details_add_alias = true;
    companyDetailsState.fm_company_details_aliases = [
      {}, // This alias will have no dynamic key like `fm_company_details_alias_company_name_0`
    ];

    const result = finesMacPayloadBuildAccountDefendantCompany(
      companyDetailsState,
      contactDetailsState,
      languagePreferencesState,
    );

    expect(result.debtor_detail.aliases).toEqual([
      {
        alias_company_name: null,
      },
    ]);
  });
});
