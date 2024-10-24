import { buildDefendantCompanyPayload } from './fines-mac-payload-defendant-company.utils';
import { IFinesMacCompanyDetailsState } from '../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_COMPANY_DETAILS_STATE_MOCK } from '../../../fines-mac-company-details/mocks/fines-mac-company-details-state.mock';
import { FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from '../../../fines-mac-contact-details/mocks/fines-mac-contact-details-state.mock';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../../../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_MOCK } from './mocks/fines-mac-payload-defendant-company.mock';
import { FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_WITH_ALIASES_MOCK } from './mocks/fines-mac-payload-defendant-company-with-aliases.mock';

describe('buildDefendantCompanyPayload', () => {
  it('should build the correct payload', () => {
    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = { ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK };

    const result = buildDefendantCompanyPayload(companyDetailsState, contactDetailsState, languagePreferencesState);

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_WITH_ALIASES_MOCK);
  });

  it('should handle empty alias array', () => {
    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };
    const companyDetailsState: IFinesMacCompanyDetailsState = {
      ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK,
      fm_company_details_add_alias: false,
      fm_company_details_aliases: [],
    };

    const result = buildDefendantCompanyPayload(companyDetailsState, contactDetailsState, languagePreferencesState);

    expect(result).toEqual(FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_MOCK);
  });
});
