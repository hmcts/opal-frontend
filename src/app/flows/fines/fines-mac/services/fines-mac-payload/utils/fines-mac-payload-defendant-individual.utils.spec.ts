import { buildDefendantIndividualPayload } from './fines-mac-payload-defendant-individual.utils';
import { IFinesMacPersonalDetailsState } from '../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { IFinesMacContactDetailsState } from '../../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { IFinesMacEmployerDetailsState } from '../../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { IFinesMacLanguagePreferencesState } from '../../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';

describe('buildDefendantIndividualPayload', () => {
  it('should build the individual defendant payload correctly', () => {
    const personalDetailsState: IFinesMacPersonalDetailsState = {
      fm_personal_details_title: 'Mr',
      fm_personal_details_surname: 'Doe',
      fm_personal_details_forenames: 'John',
      fm_personal_details_add_alias: false,
      fm_personal_details_dob: '1990-01-01',
      fm_personal_details_address_line_1: '123 Main St',
      fm_personal_details_address_line_2: 'Apt 4',
      fm_personal_details_address_line_3: 'Springfield',
      fm_personal_details_post_code: '12345',
      fm_personal_details_national_insurance_number: 'AB123456C',
      fm_personal_details_vehicle_make: 'Toyota',
      fm_personal_details_vehicle_registration_mark: 'XYZ 1234',
      fm_personal_details_aliases: [],
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
      fm_employer_details_employer_company_name: 'Acme Corp',
      fm_employer_details_employer_address_line_1: '456 Business Rd',
      fm_employer_details_employer_address_line_2: 'Suite 789',
      fm_employer_details_employer_address_line_3: 'Metropolis',
      fm_employer_details_employer_address_line_4: '',
      fm_employer_details_employer_address_line_5: '',
      fm_employer_details_employer_post_code: '67890',
      fm_employer_details_employer_telephone_number: '01122334455',
      fm_employer_details_employer_email_address: 'hr@acme.com',
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      fm_language_preferences_document_language: 'English',
      fm_language_preferences_hearing_language: 'English',
    };

    const result = buildDefendantIndividualPayload(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
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
      telephone_number_home: '0123456789',
      telephone_number_business: '0987654321',
      telephone_number_mobile: '07123456789',
      email_address_1: 'john.doe@example.com',
      email_address_2: 'j.doe@example.com',
      national_insurance_number: 'AB123456C',
      debtor_detail: {
        vehicle_make: 'Toyota',
        vehicle_registration_mark: 'XYZ 1234',
        document_language: 'English',
        hearing_language: 'English',
        employee_reference: 'EMP123',
        employer_company_name: 'Acme Corp',
        employer_address_line_1: '456 Business Rd',
        employer_address_line_2: 'Suite 789',
        employer_address_line_3: 'Metropolis',
        employer_address_line_4: '',
        employer_address_line_5: '',
        employer_post_code: '67890',
        employer_telephone_number: '01122334455',
        employer_email_address: 'hr@acme.com',
        aliases: [],
      },
    });
  });

  it('should build the individual defendant payload correctly with aliases', () => {
    const personalDetailsState: IFinesMacPersonalDetailsState = {
      fm_personal_details_title: 'Mr',
      fm_personal_details_surname: 'Doe',
      fm_personal_details_forenames: 'John',
      fm_personal_details_add_alias: false,
      fm_personal_details_dob: '1990-01-01',
      fm_personal_details_address_line_1: '123 Main St',
      fm_personal_details_address_line_2: 'Apt 4',
      fm_personal_details_address_line_3: 'Springfield',
      fm_personal_details_post_code: '12345',
      fm_personal_details_national_insurance_number: 'AB123456C',
      fm_personal_details_vehicle_make: 'Toyota',
      fm_personal_details_vehicle_registration_mark: 'XYZ 1234',
      fm_personal_details_aliases: [
        {
          fm_personal_details_alias_forenames_0: 'Jane',
          fm_personal_details_alias_surname_0: 'Doe',
        },
      ],
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
      fm_employer_details_employer_company_name: 'Acme Corp',
      fm_employer_details_employer_address_line_1: '456 Business Rd',
      fm_employer_details_employer_address_line_2: 'Suite 789',
      fm_employer_details_employer_address_line_3: 'Metropolis',
      fm_employer_details_employer_address_line_4: '',
      fm_employer_details_employer_address_line_5: '',
      fm_employer_details_employer_post_code: '67890',
      fm_employer_details_employer_telephone_number: '01122334455',
      fm_employer_details_employer_email_address: 'hr@acme.com',
    };

    const languagePreferencesState: IFinesMacLanguagePreferencesState = {
      fm_language_preferences_document_language: 'English',
      fm_language_preferences_hearing_language: 'English',
    };

    const result = buildDefendantIndividualPayload(
      personalDetailsState,
      contactDetailsState,
      employerDetailsState,
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
      telephone_number_home: '0123456789',
      telephone_number_business: '0987654321',
      telephone_number_mobile: '07123456789',
      email_address_1: 'john.doe@example.com',
      email_address_2: 'j.doe@example.com',
      national_insurance_number: 'AB123456C',
      debtor_detail: {
        vehicle_make: 'Toyota',
        vehicle_registration_mark: 'XYZ 1234',
        document_language: 'English',
        hearing_language: 'English',
        employee_reference: 'EMP123',
        employer_company_name: 'Acme Corp',
        employer_address_line_1: '456 Business Rd',
        employer_address_line_2: 'Suite 789',
        employer_address_line_3: 'Metropolis',
        employer_address_line_4: '',
        employer_address_line_5: '',
        employer_post_code: '67890',
        employer_telephone_number: '01122334455',
        employer_email_address: 'hr@acme.com',
        aliases: [{ alias_forenames: 'Jane', alias_surname: 'Doe' }],
      },
    });
  });
});
