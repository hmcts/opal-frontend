import { transformDefendantAccountPartyPayload } from './fines-acc-payload-transform-defendant-data.utils';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { IFinesAccPartyAddAmendConvertState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-state.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK } from '../mocks/opal-fines-account-defendant-account-party-null-data.mock';

describe('transformDefendantAccountPartyPayload', () => {
  let mockDefendantData: IOpalFinesAccountDefendantAccountParty;

  beforeEach(() => {
    // Use the existing mock data from the opal-fines-service
    mockDefendantData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
  });

  it('should transform defendant data to debtor form state correctly', () => {
    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(mockDefendantData);

    // Test basic personal details (using mock data values)
    expect(result.facc_party_add_amend_convert_title).toBe('Ms');
    expect(result.facc_party_add_amend_convert_forenames).toBe('Sarah Jane');
    expect(result.facc_party_add_amend_convert_surname).toBe('Thompson');
    expect(result.facc_party_add_amend_convert_dob).toBe('12/04/1988');
    expect(result.facc_party_add_amend_convert_national_insurance_number).toBe('QQ 12 34 56 C');
    expect(result.facc_party_add_amend_convert_add_alias).toBe(true); // Should be true when aliases exist

    // Test address details
    expect(result.facc_party_add_amend_convert_address_line_1).toBe('45 High Street');
    expect(result.facc_party_add_amend_convert_address_line_2).toBe('Flat 2B');
    expect(result.facc_party_add_amend_convert_address_line_3).toBeNull();
    expect(result.facc_party_add_amend_convert_post_code).toBe('AB1 2CD');

    // Test contact details
    expect(result.facc_party_add_amend_convert_contact_email_address_1).toBe('sarah.thompson@example.com');
    expect(result.facc_party_add_amend_convert_contact_email_address_2).toBe('sarah.t@example.com');
    expect(result.facc_party_add_amend_convert_contact_telephone_number_mobile).toBe('07123 456789');
    expect(result.facc_party_add_amend_convert_contact_telephone_number_home).toBe('01234 567890');
    expect(result.facc_party_add_amend_convert_contact_telephone_number_business).toBe('09876 543210');

    // Test vehicle details
    expect(result.facc_party_add_amend_convert_vehicle_make).toBe('Ford Focus');
    expect(result.facc_party_add_amend_convert_vehicle_registration_mark).toBe('XY21 ABC');

    // Test language preferences
    expect(result.facc_party_add_amend_convert_language_preferences_document_language).toBe('CY');
    expect(result.facc_party_add_amend_convert_language_preferences_hearing_language).toBe('CY');

    // Test employer details
    expect(result.facc_party_add_amend_convert_employer_company_name).toBe('Tech Solutions Ltd');
    expect(result.facc_party_add_amend_convert_employer_reference).toBe('EMP-001234');
    expect(result.facc_party_add_amend_convert_employer_email_address).toBe('hr@techsolutions.com');
    expect(result.facc_party_add_amend_convert_employer_telephone_number).toBe('01234 567890');
    expect(result.facc_party_add_amend_convert_employer_address_line_1).toBe('200 Innovation Park');
    expect(result.facc_party_add_amend_convert_employer_address_line_2).toBeNull();
    expect(result.facc_party_add_amend_convert_employer_address_line_3).toBeNull();
    expect(result.facc_party_add_amend_convert_employer_address_line_4).toBeNull();
    expect(result.facc_party_add_amend_convert_employer_address_line_5).toBeNull();
    expect(result.facc_party_add_amend_convert_employer_post_code).toBe('CD3 4EF');
  });

  it('should transform aliases correctly into array structure', () => {
    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(mockDefendantData);

    expect(result.facc_party_add_amend_convert_individual_aliases.length).toBe(2);

    // Test first alias (using mock data values)
    expect(result.facc_party_add_amend_convert_individual_aliases[0]).toEqual({
      facc_party_add_amend_convert_alias_forenames_0: 'S. J.',
      facc_party_add_amend_convert_alias_surname_0: 'Taylor',
    });

    // Test second alias
    expect(result.facc_party_add_amend_convert_individual_aliases[1]).toEqual({
      facc_party_add_amend_convert_alias_forenames_1: 'John',
      facc_party_add_amend_convert_alias_surname_1: 'Peters',
    });
  });

  it('should handle null or undefined values correctly', () => {
    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(
      OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
    );

    // All fields should be null when the mock has empty strings or null values
    // because the transformation function uses "|| null" which treats empty strings as falsy
    expect(result.facc_party_add_amend_convert_title).toBeNull();
    expect(result.facc_party_add_amend_convert_forenames).toBeNull();
    expect(result.facc_party_add_amend_convert_surname).toBeNull(); // Empty string becomes null
    expect(result.facc_party_add_amend_convert_dob).toBeNull();
    expect(result.facc_party_add_amend_convert_national_insurance_number).toBeNull();
    expect(result.facc_party_add_amend_convert_address_line_1).toBeNull(); // Empty string becomes null
    expect(result.facc_party_add_amend_convert_post_code).toBeNull();
    expect(result.facc_party_add_amend_convert_contact_email_address_1).toBeNull();
    expect(result.facc_party_add_amend_convert_vehicle_make).toBeNull();
    expect(result.facc_party_add_amend_convert_language_preferences_document_language).toBeNull();
    expect(result.facc_party_add_amend_convert_employer_company_name).toBeNull();

    // Aliases should be empty array
    expect(result.facc_party_add_amend_convert_individual_aliases).toEqual([]);
    expect(result.facc_party_add_amend_convert_organisation_aliases).toEqual([]);
    expect(result.facc_party_add_amend_convert_add_alias).toBe(false);
  });

  it('should handle empty aliases array', () => {
    mockDefendantData.defendant_account_party.party_details.individual_details!.individual_aliases = [];

    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(mockDefendantData);

    expect(result.facc_party_add_amend_convert_individual_aliases).toEqual([]);
  });

  it('should limit aliases to maximum of 5', () => {
    const manyAliases = Array.from({ length: 10 }, (_, i) => ({
      alias_id: `${i + 1}`,
      sequence_number: i + 1,
      forenames: `Alias${i}`,
      surname: `Surname${i}`,
    }));

    mockDefendantData.defendant_account_party.party_details.individual_details!.individual_aliases = manyAliases;

    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(mockDefendantData);

    // Should only have 5 aliases
    expect(result.facc_party_add_amend_convert_individual_aliases.length).toBe(5);

    // Test that the correct indices are used
    expect(result.facc_party_add_amend_convert_individual_aliases[0]).toEqual({
      facc_party_add_amend_convert_alias_forenames_0: 'Alias0',
      facc_party_add_amend_convert_alias_surname_0: 'Surname0',
    });

    expect(result.facc_party_add_amend_convert_individual_aliases[4]).toEqual({
      facc_party_add_amend_convert_alias_forenames_4: 'Alias4',
      facc_party_add_amend_convert_alias_surname_4: 'Surname4',
    });
  });

  it('should handle missing individual_details', () => {
    mockDefendantData.defendant_account_party.party_details.individual_details = null;

    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(mockDefendantData);

    expect(result.facc_party_add_amend_convert_title).toBeNull();
    expect(result.facc_party_add_amend_convert_forenames).toBeNull();
    expect(result.facc_party_add_amend_convert_surname).toBeNull();
    expect(result.facc_party_add_amend_convert_individual_aliases).toEqual([]);
    expect(result.facc_party_add_amend_convert_organisation_aliases).toEqual([]);
  });

  it('should handle missing optional nested objects gracefully', () => {
    // Create a minimal version using the empty mock with spread operator
    const minimalData: IOpalFinesAccountDefendantAccountParty = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          individual_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .individual_details!,
            title: 'Mr',
            forenames: 'John',
            surname: 'Doe',
          },
        },
        address: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.address,
          address_line_1: '123 Main St',
          postcode: 'AB12 3CD',
        },
      },
    };

    const result = transformDefendantAccountPartyPayload(minimalData);

    expect(result.facc_party_add_amend_convert_title).toBe('Mr');
    expect(result.facc_party_add_amend_convert_forenames).toBe('John');
    expect(result.facc_party_add_amend_convert_surname).toBe('Doe');
    expect(result.facc_party_add_amend_convert_address_line_1).toBe('123 Main St');
    expect(result.facc_party_add_amend_convert_post_code).toBe('AB12 3CD');
    expect(result.facc_party_add_amend_convert_individual_aliases).toEqual([]);
    expect(result.facc_party_add_amend_convert_organisation_aliases).toEqual([]);

    // Verify other fields are still null from the empty mock
    expect(result.facc_party_add_amend_convert_national_insurance_number).toBeNull();
    expect(result.facc_party_add_amend_convert_contact_email_address_1).toBeNull();
    expect(result.facc_party_add_amend_convert_vehicle_make).toBeNull();
    expect(result.facc_party_add_amend_convert_employer_company_name).toBeNull();
  });

  it('should demonstrate spreading empty mock with specific values', () => {
    // Example of how to use the empty mock with spread operator to customize specific fields
    const customizedMockData: IOpalFinesAccountDefendantAccountParty = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party,
        defendant_account_party_type: 'Individual',
        is_debtor: true,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          party_id: 'PARTY-123',
          individual_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .individual_details!,
            title: 'Dr',
            forenames: 'Jane',
            surname: 'Smith',
          },
        },
        address: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.address,
          address_line_1: '456 Test Street',
          postcode: 'TE5T 123',
        },
      },
    };

    const result = transformDefendantAccountPartyPayload(customizedMockData);

    expect(result.facc_party_add_amend_convert_title).toBe('Dr');
    expect(result.facc_party_add_amend_convert_forenames).toBe('Jane');
    expect(result.facc_party_add_amend_convert_surname).toBe('Smith');
    expect(result.facc_party_add_amend_convert_address_line_1).toBe('456 Test Street');
    expect(result.facc_party_add_amend_convert_post_code).toBe('TE5T 123');

    // All other fields should still be null (from the empty mock)
    expect(result.facc_party_add_amend_convert_national_insurance_number).toBeNull();
    expect(result.facc_party_add_amend_convert_contact_email_address_1).toBeNull();
    expect(result.facc_party_add_amend_convert_vehicle_make).toBeNull();
  });
  it('should transform organisation aliases correctly into array structure', () => {
    const mockDataWithOrgAliases = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          organisation_flag: true, // This is crucial for organization processing
          organisation_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .organisation_details!,
            organisation_name: 'Test Company Ltd',
            organisation_aliases: [
              {
                alias_id: 'ORG-ALIAS-1',
                sequence_number: 1,
                organisation_name: 'Test Corp',
              },
              {
                alias_id: 'ORG-ALIAS-2',
                sequence_number: 2,
                organisation_name: 'Testing Corporation',
              },
            ],
          },
        },
      },
    };

    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(mockDataWithOrgAliases);

    expect(result.facc_party_add_amend_convert_organisation_aliases.length).toBe(2);
    expect(result.facc_party_add_amend_convert_organisation_aliases[0]).toEqual({
      facc_party_add_amend_convert_alias_organisation_name_0: 'Test Corp',
    });
    expect(result.facc_party_add_amend_convert_organisation_aliases[1]).toEqual({
      facc_party_add_amend_convert_alias_organisation_name_1: 'Testing Corporation',
    });
    expect(result.facc_party_add_amend_convert_add_alias).toBe(true);
  });

  it('should handle empty organisation aliases array', () => {
    const mockDataWithEmptyOrgAliases = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          organisation_flag: true,
          organisation_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .organisation_details!,
            organisation_name: 'Test Company Ltd',
            organisation_aliases: [],
          },
        },
      },
    };

    const result: IFinesAccPartyAddAmendConvertState =
      transformDefendantAccountPartyPayload(mockDataWithEmptyOrgAliases);

    expect(result.facc_party_add_amend_convert_organisation_aliases.length).toBe(0);
    expect(result.facc_party_add_amend_convert_add_alias).toBe(false);
  });

  it('should limit organisation aliases to maximum of 5', () => {
    const manyOrgAliases = Array.from({ length: 10 }, (_, i) => ({
      alias_id: `ORG-ALIAS-${i + 1}`,
      sequence_number: i + 1,
      organisation_name: `Alias Company ${i}`,
    }));

    const mockDataWithManyOrgAliases = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          organisation_flag: true,
          organisation_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .organisation_details!,
            organisation_name: 'Main Company Ltd',
            organisation_aliases: manyOrgAliases,
          },
        },
      },
    };

    const result: IFinesAccPartyAddAmendConvertState =
      transformDefendantAccountPartyPayload(mockDataWithManyOrgAliases);

    // Should only have 5 aliases
    expect(result.facc_party_add_amend_convert_organisation_aliases.length).toBe(5);

    // Test that the correct indices are used
    expect(result.facc_party_add_amend_convert_organisation_aliases[0]).toEqual({
      facc_party_add_amend_convert_alias_organisation_name_0: 'Alias Company 0',
    });
    expect(result.facc_party_add_amend_convert_organisation_aliases[4]).toEqual({
      facc_party_add_amend_convert_alias_organisation_name_4: 'Alias Company 4',
    });
    expect(result.facc_party_add_amend_convert_add_alias).toBe(true);
  });

  it('should handle organisation aliases with null organisation_name', () => {
    const mockDataWithNullOrgName = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          organisation_flag: true,
          organisation_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .organisation_details!,
            organisation_name: 'Test Company Ltd',
            organisation_aliases: [
              {
                alias_id: 'ORG-ALIAS-1',
                sequence_number: 1,
                organisation_name: '',
              },
              {
                alias_id: 'ORG-ALIAS-2',
                sequence_number: 2,
                organisation_name: 'Valid Alias Name',
              },
            ],
          },
        },
      },
    };

    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(mockDataWithNullOrgName);

    expect(result.facc_party_add_amend_convert_organisation_aliases.length).toBe(2);
    // Empty string becomes null due to || null logic in the function
    expect(
      result.facc_party_add_amend_convert_organisation_aliases[0]
        .facc_party_add_amend_convert_alias_organisation_name_0,
    ).toBeNull();
    expect(result.facc_party_add_amend_convert_organisation_aliases[1]).toEqual({
      facc_party_add_amend_convert_alias_organisation_name_1: 'Valid Alias Name',
    });
    expect(result.facc_party_add_amend_convert_add_alias).toBe(true);
  });

  it('should handle undefined organisation_name in aliases', () => {
    const mockDataWithUndefinedOrgName = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          organisation_flag: true,
          organisation_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .organisation_details!,
            organisation_name: 'Test Company Ltd',
            organisation_aliases: [
              {
                alias_id: 'ORG-ALIAS-1',
                sequence_number: 1,
                organisation_name: 'Test Alias',
              },
            ],
          },
        },
      },
    };

    const result: IFinesAccPartyAddAmendConvertState =
      transformDefendantAccountPartyPayload(mockDataWithUndefinedOrgName);

    expect(result.facc_party_add_amend_convert_organisation_aliases.length).toBe(1);
    expect(result.facc_party_add_amend_convert_organisation_aliases[0]).toEqual({
      facc_party_add_amend_convert_alias_organisation_name_0: 'Test Alias',
    });
    expect(result.facc_party_add_amend_convert_add_alias).toBe(true);
  });

  it('should handle organisation aliases with empty string organisation_name using fallback to null', () => {
    // Test the `alias.organisation_name || null` logic by using falsy values
    const mockDataWithEmptyOrgName = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
      defendant_account_party: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party,
        party_details: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details,
          organisation_flag: true,
          organisation_details: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK.defendant_account_party.party_details
              .organisation_details!,
            organisation_name: 'Test Company Ltd',
            organisation_aliases: [
              {
                alias_id: 'ORG-ALIAS-1',
                sequence_number: 1,
                organisation_name: '', // Empty string should fallback to null
              },
              {
                alias_id: 'ORG-ALIAS-2',
                sequence_number: 2,
                organisation_name: 'Valid Name',
              },
            ],
          },
        },
      },
    };

    const result: IFinesAccPartyAddAmendConvertState = transformDefendantAccountPartyPayload(mockDataWithEmptyOrgName);

    expect(result.facc_party_add_amend_convert_organisation_aliases.length).toBe(2);
    // Empty string should become null due to the `|| null` logic in the function
    expect(
      result.facc_party_add_amend_convert_organisation_aliases[0]
        .facc_party_add_amend_convert_alias_organisation_name_0,
    ).toBeNull();
    expect(
      result.facc_party_add_amend_convert_organisation_aliases[1]
        .facc_party_add_amend_convert_alias_organisation_name_1,
    ).toBe('Valid Name');
    expect(result.facc_party_add_amend_convert_add_alias).toBe(true);
  });
});
