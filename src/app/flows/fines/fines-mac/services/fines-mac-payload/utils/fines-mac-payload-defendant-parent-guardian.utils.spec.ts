import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from '../../../fines-mac-contact-details/mocks/fines-mac-contact-details-state.mock';
import { IFinesMacEmployerDetailsState } from '../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK } from '../../../fines-mac-employer-details/mocks/fines-mac-employer-details-state.mock';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../../../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';
import { IFinesMacParentGuardianDetailsState } from '../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../../../fines-mac-parent-guardian-details/mocks/fines-mac-parent-guardian-details-state.mock';
import { IFinesMacPersonalDetailsState } from '../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_PERSONAL_DETAILS_STATE_MOCK } from '../../../fines-mac-personal-details/mocks/fines-mac-personal-details-state.mock';
import { buildDefendantParentGuardianPayload } from './fines-mac-payload-defendant-parent-guardian.utils';

describe('buildDefendantParentGuardianPayload', () => {
  it('should build the correct payload', () => {
    const personalDetailsState: IFinesMacPersonalDetailsState = {
      ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
      fm_personal_details_add_alias: false,
      fm_personal_details_aliases: [],
      fm_personal_details_vehicle_make: null,
      fm_personal_details_vehicle_registration_mark: null,
    };

    const contactDetailsState: IFinesMacContactDetailsState = {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    };
    const employerDetailsState: IFinesMacEmployerDetailsState = {
      ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
    };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
      fm_parent_guardian_details_add_alias: false,
      fm_parent_guardian_details_aliases: [],
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    };

    const result = buildDefendantParentGuardianPayload(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      parentGuardianDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual({
      company_flag: false,
      title: 'Mr',
      surname: 'Doe',
      forenames: 'John',
      dob: '1990-01-01',
      address_line_1: '123 Main St',
      address_line_2: 'Apt 4',
      address_line_3: 'Springfield',
      post_code: '12345',
      national_insurance_number: 'AB123456C',
      parent_guardian: {
        company_flag: false,
        surname: 'Doe',
        forenames: 'Jane',
        dob: '1970-01-01',
        national_insurance_number: 'CD123456E',
        address_line_1: '789 Parent St',
        address_line_2: '',
        address_line_3: '',
        post_code: '54321',
        telephone_number_home: '0123456789',
        telephone_number_business: '0987654321',
        telephone_number_mobile: '07123456789',
        email_address_1: 'john.doe@example.com',
        email_address_2: 'j.doe@example.com',
        debtor_detail: {
          vehicle_make: 'Toyota',
          vehicle_registration_mark: 'XYZ 1234',
          document_language: 'English',
          hearing_language: 'English',
          employee_reference: 'EMP123',
          employer_company_name: 'Company Ltd',
          employer_address_line_1: '456 Business Rd',
          employer_address_line_2: 'Suite 1',
          employer_address_line_3: 'Business Park',
          employer_address_line_4: '',
          employer_address_line_5: '',
          employer_post_code: '67890',
          employer_telephone_number: '01122334455',
          employer_email_address: 'contact@company.com',
          aliases: null,
        },
      },
    });
  });

  it('should build the correct payload with aliases', () => {
    const personalDetailsState: IFinesMacPersonalDetailsState = {
      fm_personal_details_title: 'Mr',
      fm_personal_details_surname: 'Doe',
      fm_personal_details_forenames: 'John',
      fm_personal_details_dob: '1990-01-01',
      fm_personal_details_address_line_1: '123 Main St',
      fm_personal_details_address_line_2: 'Apt 4',
      fm_personal_details_address_line_3: 'Springfield',
      fm_personal_details_post_code: '12345',
      fm_personal_details_national_insurance_number: 'AB123456C',
      fm_personal_details_add_alias: false,
      fm_personal_details_aliases: [],
      fm_personal_details_vehicle_make: null,
      fm_personal_details_vehicle_registration_mark: null,
    };

    const contactDetailsState: IFinesMacContactDetailsState = {
      fm_contact_details_telephone_number_home: '0123456789',
      fm_contact_details_telephone_number_business: '0987654321',
      fm_contact_details_telephone_number_mobile: '07123456789',
      fm_contact_details_email_address_1: 'john.doe@example.com',
      fm_contact_details_email_address_2: 'j.doe@example.com',
    };

    const employerDetailsState: IFinesMacEmployerDetailsState = {
      fm_employer_details_employer_reference: 'EMP123',
      fm_employer_details_employer_company_name: 'Company Ltd',
      fm_employer_details_employer_address_line_1: '456 Business Rd',
      fm_employer_details_employer_address_line_2: 'Suite 1',
      fm_employer_details_employer_address_line_3: 'Business Park',
      fm_employer_details_employer_address_line_4: '',
      fm_employer_details_employer_address_line_5: '',
      fm_employer_details_employer_post_code: '67890',
      fm_employer_details_employer_telephone_number: '01122334455',
      fm_employer_details_employer_email_address: 'contact@company.com',
    };

    const parentGuardianDetailsState: IFinesMacParentGuardianDetailsState = {
      fm_parent_guardian_details_surname: 'Doe',
      fm_parent_guardian_details_forenames: 'Jane',
      fm_parent_guardian_details_dob: '1970-01-01',
      fm_parent_guardian_details_national_insurance_number: 'CD123456E',
      fm_parent_guardian_details_address_line_1: '789 Parent St',
      fm_parent_guardian_details_address_line_2: '',
      fm_parent_guardian_details_address_line_3: '',
      fm_parent_guardian_details_post_code: '54321',
      fm_parent_guardian_details_vehicle_make: 'Toyota',
      fm_parent_guardian_details_vehicle_registration_mark: 'XYZ 1234',
      fm_parent_guardian_details_add_alias: false,
      fm_parent_guardian_details_aliases: [
        {
          fm_parent_guardian_details_alias_forenames_0: 'Jane',
          fm_parent_guardian_details_alias_surname_0: 'Doe',
        },
      ],
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      fm_language_preferences_document_language: 'English',
      fm_language_preferences_hearing_language: 'English',
    };

    const result = buildDefendantParentGuardianPayload(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
      parentGuardianDetailsState,
      languagePreferencesState,
    );

    expect(result).toEqual({
      company_flag: false,
      title: 'Mr',
      surname: 'Doe',
      forenames: 'John',
      dob: '1990-01-01',
      address_line_1: '123 Main St',
      address_line_2: 'Apt 4',
      address_line_3: 'Springfield',
      post_code: '12345',
      national_insurance_number: 'AB123456C',
      parent_guardian: {
        company_flag: false,
        surname: 'Doe',
        forenames: 'Jane',
        dob: '1970-01-01',
        national_insurance_number: 'CD123456E',
        address_line_1: '789 Parent St',
        address_line_2: '',
        address_line_3: '',
        post_code: '54321',
        telephone_number_home: '0123456789',
        telephone_number_business: '0987654321',
        telephone_number_mobile: '07123456789',
        email_address_1: 'john.doe@example.com',
        email_address_2: 'j.doe@example.com',
        debtor_detail: {
          vehicle_make: 'Toyota',
          vehicle_registration_mark: 'XYZ 1234',
          document_language: 'English',
          hearing_language: 'English',
          employee_reference: 'EMP123',
          employer_company_name: 'Company Ltd',
          employer_address_line_1: '456 Business Rd',
          employer_address_line_2: 'Suite 1',
          employer_address_line_3: 'Business Park',
          employer_address_line_4: '',
          employer_address_line_5: '',
          employer_post_code: '67890',
          employer_telephone_number: '01122334455',
          employer_email_address: 'contact@company.com',
          aliases: [
            {
              alias_forenames: 'Jane',
              alias_surname: 'Doe',
            },
          ],
        },
      },
    });
  });
});
