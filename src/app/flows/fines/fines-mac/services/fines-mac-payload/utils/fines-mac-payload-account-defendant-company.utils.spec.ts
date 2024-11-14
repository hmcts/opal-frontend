import { buildAccountDefendantCompanyPayload } from './fines-mac-payload-account-defendant-company.utils';
import { IFinesMacCompanyDetailsState } from '../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK } from './mocks/state/fines-mac-payload-company-details-state.mock';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from './mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from './mocks/state/fines-mac-payload-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK } from './mocks/fines-mac-payload-account-defendant-company.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK } from './mocks/fines-mac-payload-account-defendant-company-with-aliases.mock';

fdescribe('buildAccountDefendantCompanyPayload', () => {
  it('should build the correct payload', () => {
    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK,
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = { ...FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK };

    const result = buildAccountDefendantCompanyPayload(
      companyDetailsState,
      contactDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK);
  });

  it('should handle empty alias array', () => {
    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK,
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = {
      ...FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK,
      fm_company_details_add_alias: false,
      fm_company_details_aliases: [],
    };

    const result = buildAccountDefendantCompanyPayload(
      companyDetailsState,
      contactDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK);
  });
});
