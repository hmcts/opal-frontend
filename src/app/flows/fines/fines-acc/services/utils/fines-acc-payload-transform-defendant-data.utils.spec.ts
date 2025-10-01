import { transformDefendantAccountPartyPayload } from './fines-acc-payload-transform-defendant-data.utils';
import { IOpalFinesAccountDefendantDetailsDefendantTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-defendant-tab-ref-data.interface';
import { IFinesAccDebtorAddAmendState } from '../../fines-acc-debtor-add-amend/interfaces/fines-acc-debtor-add-amend-state.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_DEFENDANT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-defendant-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK } from '../mocks/opal-fines-account-defendant-details-null-data.mock';

describe('transformDefendantAccountPartyPayload', () => {
  let mockDefendantData: IOpalFinesAccountDefendantDetailsDefendantTabRefData;

  beforeEach(() => {
    // Use the existing mock data from the opal-fines-service
    mockDefendantData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_DEFENDANT_TAB_REF_DATA_MOCK);
  });

  it('should transform defendant data to debtor form state correctly', () => {
    const result: IFinesAccDebtorAddAmendState = transformDefendantAccountPartyPayload(mockDefendantData);

    // Test basic personal details (using mock data values)
    expect(result.facc_debtor_add_amend_title).toBe('Ms');
    expect(result.facc_debtor_add_amend_forenames).toBe('Sarah Jane');
    expect(result.facc_debtor_add_amend_surname).toBe('Thompson');
    expect(result.facc_debtor_add_amend_dob).toBe('12/04/1988');
    expect(result.facc_debtor_add_amend_national_insurance_number).toBe('QQ123456C');
    expect(result.facc_debtor_add_amend_add_alias).toBe(true); // Should be true when aliases exist

    // Test address details
    expect(result.facc_debtor_add_amend_address_line_1).toBe('45 High Street');
    expect(result.facc_debtor_add_amend_address_line_2).toBe('Flat 2B');
    expect(result.facc_debtor_add_amend_address_line_3).toBeNull();
    expect(result.facc_debtor_add_amend_post_code).toBe('AB1 2CD');

    // Test contact details
    expect(result.facc_debtor_add_amend_contact_email_address_1).toBe('sarah.thompson@example.com');
    expect(result.facc_debtor_add_amend_contact_email_address_2).toBe('sarah.t@example.com');
    expect(result.facc_debtor_add_amend_contact_telephone_number_mobile).toBe('07123456789');
    expect(result.facc_debtor_add_amend_contact_telephone_number_home).toBe('01234567890');
    expect(result.facc_debtor_add_amend_contact_telephone_number_business).toBe('09876543210');

    // Test vehicle details
    expect(result.facc_debtor_add_amend_vehicle_make).toBe('Ford Focus');
    expect(result.facc_debtor_add_amend_vehicle_registration_mark).toBe('XY21 ABC');

    // Test language preferences
    expect(result.facc_debtor_add_amend_language_preferences_document_language).toBe('CY');
    expect(result.facc_debtor_add_amend_language_preferences_hearing_language).toBe('CY');

    // Test employer details
    expect(result.facc_debtor_add_amend_employer_details_employer_company_name).toBe('Tech Solutions Ltd');
    expect(result.facc_debtor_add_amend_employer_details_employer_reference).toBe('EMP-001234');
    expect(result.facc_debtor_add_amend_employer_details_employer_email_address).toBe('hr@techsolutions.com');
    expect(result.facc_debtor_add_amend_employer_details_employer_telephone_number).toBe('01234567890');
    expect(result.facc_debtor_add_amend_employer_details_employer_address_line_1).toBe('200 Innovation Park');
    expect(result.facc_debtor_add_amend_employer_details_employer_address_line_2).toBeNull();
    expect(result.facc_debtor_add_amend_employer_details_employer_address_line_3).toBeNull();
    expect(result.facc_debtor_add_amend_employer_details_employer_address_line_4).toBeNull();
    expect(result.facc_debtor_add_amend_employer_details_employer_address_line_5).toBeNull();
    expect(result.facc_debtor_add_amend_employer_details_employer_post_code).toBe('CD3 4EF');
  });

  it('should transform aliases correctly into array structure', () => {
    const result: IFinesAccDebtorAddAmendState = transformDefendantAccountPartyPayload(mockDefendantData);

    expect(result.facc_debtor_add_amend_aliases.length).toBe(2);

    // Test first alias (using mock data values)
    expect(result.facc_debtor_add_amend_aliases[0]).toEqual({
      facc_debtor_add_amend_alias_forenames_0: 'S. J.',
      facc_debtor_add_amend_alias_surname_0: 'Taylor',
    });

    // Test second alias
    expect(result.facc_debtor_add_amend_aliases[1]).toEqual({
      facc_debtor_add_amend_alias_forenames_1: 'John',
      facc_debtor_add_amend_alias_surname_1: 'Peters',
    });
  });

  it('should handle null or undefined values correctly', () => {
    const result: IFinesAccDebtorAddAmendState = transformDefendantAccountPartyPayload(
      OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK,
    );

    // All fields should be null when the mock has empty strings or null values
    // because the transformation function uses "|| null" which treats empty strings as falsy
    expect(result.facc_debtor_add_amend_title).toBeNull();
    expect(result.facc_debtor_add_amend_forenames).toBeNull();
    expect(result.facc_debtor_add_amend_surname).toBeNull(); // Empty string becomes null
    expect(result.facc_debtor_add_amend_dob).toBeNull();
    expect(result.facc_debtor_add_amend_national_insurance_number).toBeNull();
    expect(result.facc_debtor_add_amend_address_line_1).toBeNull(); // Empty string becomes null
    expect(result.facc_debtor_add_amend_post_code).toBeNull();
    expect(result.facc_debtor_add_amend_contact_email_address_1).toBeNull();
    expect(result.facc_debtor_add_amend_vehicle_make).toBeNull();
    expect(result.facc_debtor_add_amend_language_preferences_document_language).toBeNull();
    expect(result.facc_debtor_add_amend_employer_details_employer_company_name).toBeNull();

    // Aliases should be empty array
    expect(result.facc_debtor_add_amend_aliases).toEqual([]);
    expect(result.facc_debtor_add_amend_add_alias).toBe(false);
  });

  it('should handle empty aliases array', () => {
    mockDefendantData.defendant_account_party.party_details.individual_details!.individual_aliases = [];

    const result: IFinesAccDebtorAddAmendState = transformDefendantAccountPartyPayload(mockDefendantData);

    expect(result.facc_debtor_add_amend_aliases).toEqual([]);
  });

  it('should limit aliases to maximum of 5', () => {
    const manyAliases = Array.from({ length: 10 }, (_, i) => ({
      alias_number: `${i + 1}`,
      sequence_number: i + 1,
      alias_forenames: `Alias${i}`,
      alias_surname: `Surname${i}`,
    }));

    mockDefendantData.defendant_account_party.party_details.individual_details!.individual_aliases = manyAliases;

    const result: IFinesAccDebtorAddAmendState = transformDefendantAccountPartyPayload(mockDefendantData);

    // Should only have 5 aliases
    expect(result.facc_debtor_add_amend_aliases.length).toBe(5);

    // Test that the correct indices are used
    expect(result.facc_debtor_add_amend_aliases[0]).toEqual({
      facc_debtor_add_amend_alias_forenames_0: 'Alias0',
      facc_debtor_add_amend_alias_surname_0: 'Surname0',
    });

    expect(result.facc_debtor_add_amend_aliases[4]).toEqual({
      facc_debtor_add_amend_alias_forenames_4: 'Alias4',
      facc_debtor_add_amend_alias_surname_4: 'Surname4',
    });
  });

  it('should handle missing individual_details', () => {
    mockDefendantData.defendant_account_party.party_details.individual_details = null;

    const result: IFinesAccDebtorAddAmendState = transformDefendantAccountPartyPayload(mockDefendantData);

    expect(result.facc_debtor_add_amend_title).toBeNull();
    expect(result.facc_debtor_add_amend_forenames).toBeNull();
    expect(result.facc_debtor_add_amend_surname).toBeNull();
    expect(result.facc_debtor_add_amend_aliases).toEqual([]);
  });

  it('should handle missing optional nested objects gracefully', () => {
    // Create a minimal version using the empty mock with spread operator
    const minimalData: IOpalFinesAccountDefendantDetailsDefendantTabRefData = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK.defendant_account_party,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          individual_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .individual_details!,
            title: 'Mr',
            forenames: 'John',
            surname: 'Doe',
          },
        },
        address: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK.defendant_account_party.address,
          address_line_1: '123 Main St',
          postcode: 'AB12 3CD',
        },
      },
    };

    const result = transformDefendantAccountPartyPayload(minimalData);

    expect(result.facc_debtor_add_amend_title).toBe('Mr');
    expect(result.facc_debtor_add_amend_forenames).toBe('John');
    expect(result.facc_debtor_add_amend_surname).toBe('Doe');
    expect(result.facc_debtor_add_amend_address_line_1).toBe('123 Main St');
    expect(result.facc_debtor_add_amend_post_code).toBe('AB12 3CD');
    expect(result.facc_debtor_add_amend_aliases).toEqual([]);

    // Verify other fields are still null from the empty mock
    expect(result.facc_debtor_add_amend_national_insurance_number).toBeNull();
    expect(result.facc_debtor_add_amend_contact_email_address_1).toBeNull();
    expect(result.facc_debtor_add_amend_vehicle_make).toBeNull();
    expect(result.facc_debtor_add_amend_employer_details_employer_company_name).toBeNull();
  });

  it('should demonstrate spreading empty mock with specific values', () => {
    // Example of how to use the empty mock with spread operator to customize specific fields
    const customizedMockData: IOpalFinesAccountDefendantDetailsDefendantTabRefData = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK,
      defendant_account_id: 'DA-123',
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK.defendant_account_party,
        defendant_account_party_type: 'Individual',
        is_debtor: true,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          party_id: 'PARTY-123',
          individual_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .individual_details!,
            title: 'Dr',
            forenames: 'Jane',
            surname: 'Smith',
          },
        },
        address: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_EMPTY_DATA_MOCK.defendant_account_party.address,
          address_line_1: '456 Test Street',
          postcode: 'TE5T 123',
        },
      },
    };

    const result = transformDefendantAccountPartyPayload(customizedMockData);

    expect(result.facc_debtor_add_amend_title).toBe('Dr');
    expect(result.facc_debtor_add_amend_forenames).toBe('Jane');
    expect(result.facc_debtor_add_amend_surname).toBe('Smith');
    expect(result.facc_debtor_add_amend_address_line_1).toBe('456 Test Street');
    expect(result.facc_debtor_add_amend_post_code).toBe('TE5T 123');

    // All other fields should still be null (from the empty mock)
    expect(result.facc_debtor_add_amend_national_insurance_number).toBeNull();
    expect(result.facc_debtor_add_amend_contact_email_address_1).toBeNull();
    expect(result.facc_debtor_add_amend_vehicle_make).toBeNull();
  });
});
