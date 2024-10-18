import { buildDefendantCompanyPayload } from './fines-mac-payload-defendant-company.utils';
import { IFinesMacCompanyDetailsState } from '../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';

describe('buildDefendantCompanyPayload', () => {
  it('should build the correct payload', () => {
    const companyDetailsState: IFinesMacCompanyDetailsState = {
      fm_company_details_organisation_name: 'Test Company',
      fm_company_details_address_line_1: '123 Test St',
      fm_company_details_address_line_2: 'Suite 100',
      fm_company_details_address_line_3: 'Test City',
      fm_company_details_postcode: '12345',
      fm_company_details_add_alias: true,
      fm_company_details_aliases: [
        { fm_company_details_alias_organisation_name_0: 'Alias 1' },
        { fm_company_details_alias_organisation_name_1: 'Alias 2' },
      ],
    };

    const contactDetailsState: IFinesMacContactDetailsState = {
      fm_contact_details_telephone_number_home: '123-456-7890',
      fm_contact_details_telephone_number_business: '098-765-4321',
      fm_contact_details_telephone_number_mobile: '555-555-5555',
      fm_contact_details_email_address_1: 'test1@example.com',
      fm_contact_details_email_address_2: 'test2@example.com',
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      fm_language_preferences_document_language: 'EN',
      fm_language_preferences_hearing_language: 'FR',
    };

    const result = buildDefendantCompanyPayload(companyDetailsState, contactDetailsState, languagePreferencesState);

    expect(result).toEqual({
      company_flag: true,
      organisation_name: 'Test Company',
      address_line_1: '123 Test St',
      address_line_2: 'Suite 100',
      address_line_3: 'Test City',
      post_code: '12345',
      telephone_number_home: '123-456-7890',
      telephone_number_business: '098-765-4321',
      telephone_number_mobile: '555-555-5555',
      email_address_1: 'test1@example.com',
      email_address_2: 'test2@example.com',
      debtor_detail: {
        document_language: 'EN',
        hearing_language: 'FR',
        aliases: [{ alias_company_name: 'Alias 1' }, { alias_company_name: 'Alias 2' }],
      },
    });
  });

  it('should handle empty alias array', () => {
    const companyDetailsState: IFinesMacCompanyDetailsState = {
      fm_company_details_organisation_name: 'Test Company',
      fm_company_details_address_line_1: '123 Test St',
      fm_company_details_address_line_2: 'Suite 100',
      fm_company_details_address_line_3: 'Test City',
      fm_company_details_postcode: '12345',
      fm_company_details_add_alias: false,
      fm_company_details_aliases: [],
    };

    const contactDetailsState: IFinesMacContactDetailsState = {
      fm_contact_details_telephone_number_home: '123-456-7890',
      fm_contact_details_telephone_number_business: '098-765-4321',
      fm_contact_details_telephone_number_mobile: '555-555-5555',
      fm_contact_details_email_address_1: 'test1@example.com',
      fm_contact_details_email_address_2: 'test2@example.com',
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      fm_language_preferences_document_language: 'EN',
      fm_language_preferences_hearing_language: 'FR',
    };

    const result = buildDefendantCompanyPayload(companyDetailsState, contactDetailsState, languagePreferencesState);

    expect(result).toEqual({
      company_flag: true,
      organisation_name: 'Test Company',
      address_line_1: '123 Test St',
      address_line_2: 'Suite 100',
      address_line_3: 'Test City',
      post_code: '12345',
      telephone_number_home: '123-456-7890',
      telephone_number_business: '098-765-4321',
      telephone_number_mobile: '555-555-5555',
      email_address_1: 'test1@example.com',
      email_address_2: 'test2@example.com',
      debtor_detail: {
        document_language: 'EN',
        hearing_language: 'FR',
        aliases: [],
      },
    });
  });
});
