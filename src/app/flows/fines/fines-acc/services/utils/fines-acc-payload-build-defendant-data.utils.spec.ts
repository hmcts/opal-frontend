import {
  buildAccountPartyFromFormState,
  buildIndividualAliases,
  buildOrganisationAliases,
} from './fines-acc-payload-build-defendant-data.utils';
import { IFinesAccPartyAddAmendConvertState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-state.interface';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { IFinesAccPartyAddAmendConvertIndividualAliasState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-individual-alias-state.interface';
import { IFinesAccPartyAddAmendConvertOrganisationAliasState } from '../../fines-acc-party-add-amend-convert/interfaces/fines-acc-party-add-amend-convert-organisation-alias-state.interface';

describe('fines-acc-payload-build-defendant-data.utils', () => {
  describe('buildIndividualAliases', () => {
    it('should return null for empty aliases array', () => {
      const result = buildIndividualAliases([]);
      expect(result).toBeNull();
    });

    it('should return null for null aliases', () => {
      const result = buildIndividualAliases(null);
      expect(result).toBeNull();
    });

    it('should build individual aliases correctly', () => {
      const aliases: IFinesAccPartyAddAmendConvertIndividualAliasState[] = [
        {
          facc_party_add_amend_convert_alias_surname_0: 'Smith',
          facc_party_add_amend_convert_alias_forenames_0: 'John',
        },
        {
          facc_party_add_amend_convert_alias_surname_1: 'Johnson',
          facc_party_add_amend_convert_alias_forenames_1: 'Jane',
        },
      ];

      const result = buildIndividualAliases(aliases);

      expect(result).toEqual([
        { alias_id: '', sequence_number: 1, surname: 'Smith', forenames: 'John' },
        { alias_id: '', sequence_number: 2, surname: 'Johnson', forenames: 'Jane' },
      ]);
    });

    it('should build individual aliases with existing alias_id for UPDATE scenario', () => {
      const aliases: IFinesAccPartyAddAmendConvertIndividualAliasState[] = [
        {
          facc_party_add_amend_convert_alias_surname_0: 'Smith',
          facc_party_add_amend_convert_alias_forenames_0: 'John',
          facc_party_add_amend_convert_alias_id_0: '99000000001031',
        },
        {
          facc_party_add_amend_convert_alias_surname_1: 'Johnson',
          facc_party_add_amend_convert_alias_forenames_1: 'Jane',
          facc_party_add_amend_convert_alias_id_1: '99000000001032',
        },
      ];

      const result = buildIndividualAliases(aliases);

      expect(result).toEqual([
        { alias_id: '99000000001031', sequence_number: 1, surname: 'Smith', forenames: 'John' },
        { alias_id: '99000000001032', sequence_number: 2, surname: 'Johnson', forenames: 'Jane' },
      ]);
    });

    it('should handle mixed new and existing aliases for individual aliases', () => {
      const aliases: IFinesAccPartyAddAmendConvertIndividualAliasState[] = [
        {
          facc_party_add_amend_convert_alias_surname_0: 'Smith',
          facc_party_add_amend_convert_alias_forenames_0: 'John',
          facc_party_add_amend_convert_alias_id_0: '99000000001031', // Existing alias
        },
        {
          facc_party_add_amend_convert_alias_surname_1: 'Johnson',
          facc_party_add_amend_convert_alias_forenames_1: 'Jane',
          // No alias_id - this is a new alias
        },
      ];

      const result = buildIndividualAliases(aliases);

      expect(result).toEqual([
        { alias_id: '99000000001031', sequence_number: 1, surname: 'Smith', forenames: 'John' },
        { alias_id: '', sequence_number: 2, surname: 'Johnson', forenames: 'Jane' },
      ]);
    });

    it('should handle empty and whitespace-only alias_id as new aliases', () => {
      const aliases: IFinesAccPartyAddAmendConvertIndividualAliasState[] = [
        {
          facc_party_add_amend_convert_alias_surname_0: 'Smith',
          facc_party_add_amend_convert_alias_forenames_0: 'John',
          facc_party_add_amend_convert_alias_id_0: '', // Empty string
        },
        {
          facc_party_add_amend_convert_alias_surname_1: 'Johnson',
          facc_party_add_amend_convert_alias_forenames_1: 'Jane',
          facc_party_add_amend_convert_alias_id_1: '   ', // Whitespace only
        },
        {
          facc_party_add_amend_convert_alias_surname_2: 'Brown',
          facc_party_add_amend_convert_alias_forenames_2: 'Bob',
          // Undefined alias_id (no property set)
        },
      ];

      const result = buildIndividualAliases(aliases);

      expect(result).toEqual([
        { alias_id: '', sequence_number: 1, surname: 'Smith', forenames: 'John' },
        { alias_id: '', sequence_number: 2, surname: 'Johnson', forenames: 'Jane' },
        { alias_id: '', sequence_number: 3, surname: 'Brown', forenames: 'Bob' },
      ]);
    });

    it('should skip aliases with no forenames or surname', () => {
      const aliases: IFinesAccPartyAddAmendConvertIndividualAliasState[] = [
        {
          facc_party_add_amend_convert_alias_surname_0: 'Smith',
          facc_party_add_amend_convert_alias_forenames_0: 'John',
          facc_party_add_amend_convert_alias_id_0: '99000000001031',
        },
        {
          // Empty alias - should be skipped
          facc_party_add_amend_convert_alias_surname_1: '',
          facc_party_add_amend_convert_alias_forenames_1: '',
        },
        {
          facc_party_add_amend_convert_alias_surname_2: 'Johnson',
          facc_party_add_amend_convert_alias_forenames_2: 'Jane',
        },
      ];

      const result = buildIndividualAliases(aliases);

      expect(result).toEqual([
        { alias_id: '99000000001031', sequence_number: 1, surname: 'Smith', forenames: 'John' },
        { alias_id: '', sequence_number: 3, surname: 'Johnson', forenames: 'Jane' },
      ]);
    });
  });

  describe('buildOrganisationAliases', () => {
    it('should return null for empty aliases array', () => {
      const result = buildOrganisationAliases([]);
      expect(result).toBeNull();
    });

    it('should return null for null aliases', () => {
      const result = buildOrganisationAliases(null);
      expect(result).toBeNull();
    });

    it('should build organisation aliases correctly', () => {
      const aliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[] = [
        { facc_party_add_amend_convert_alias_organisation_name_0: 'Acme Corp' },
        { facc_party_add_amend_convert_alias_organisation_name_1: 'Acme Ltd' },
      ];

      const result = buildOrganisationAliases(aliases);

      expect(result).toEqual([
        { alias_id: '', sequence_number: 1, organisation_name: 'Acme Corp' },
        { alias_id: '', sequence_number: 2, organisation_name: 'Acme Ltd' },
      ]);
    });

    it('should build organisation aliases with existing alias_id for UPDATE scenario', () => {
      const aliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[] = [
        {
          facc_party_add_amend_convert_alias_organisation_name_0: 'Acme Corp',
          facc_party_add_amend_convert_alias_id_0: '99000000002031',
        },
        {
          facc_party_add_amend_convert_alias_organisation_name_1: 'Acme Ltd',
          facc_party_add_amend_convert_alias_id_1: '99000000002032',
        },
      ];

      const result = buildOrganisationAliases(aliases);

      expect(result).toEqual([
        { alias_id: '99000000002031', sequence_number: 1, organisation_name: 'Acme Corp' },
        { alias_id: '99000000002032', sequence_number: 2, organisation_name: 'Acme Ltd' },
      ]);
    });

    it('should handle mixed new and existing aliases for organisation aliases', () => {
      const aliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[] = [
        {
          facc_party_add_amend_convert_alias_organisation_name_0: 'Acme Corp',
          facc_party_add_amend_convert_alias_id_0: '99000000002031', // Existing alias
        },
        {
          facc_party_add_amend_convert_alias_organisation_name_1: 'New Company',
          // No alias_id - this is a new alias
        },
      ];

      const result = buildOrganisationAliases(aliases);

      expect(result).toEqual([
        { alias_id: '99000000002031', sequence_number: 1, organisation_name: 'Acme Corp' },
        { alias_id: '', sequence_number: 2, organisation_name: 'New Company' },
      ]);
    });

    it('should handle empty and whitespace-only alias_id as new organisation aliases', () => {
      const aliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[] = [
        {
          facc_party_add_amend_convert_alias_organisation_name_0: 'Acme Corp',
          facc_party_add_amend_convert_alias_id_0: '', // Empty string
        },
        {
          facc_party_add_amend_convert_alias_organisation_name_1: 'Beta Inc',
          facc_party_add_amend_convert_alias_id_1: '   ', // Whitespace only
        },
        {
          facc_party_add_amend_convert_alias_organisation_name_2: 'Gamma Ltd',
        },
      ];

      const result = buildOrganisationAliases(aliases);

      expect(result).toEqual([
        { alias_id: '', sequence_number: 1, organisation_name: 'Acme Corp' },
        { alias_id: '', sequence_number: 2, organisation_name: 'Beta Inc' },
        { alias_id: '', sequence_number: 3, organisation_name: 'Gamma Ltd' },
      ]);
    });

    it('should skip organisation aliases with no organisation name', () => {
      const aliases: IFinesAccPartyAddAmendConvertOrganisationAliasState[] = [
        {
          facc_party_add_amend_convert_alias_organisation_name_0: 'Acme Corp',
          facc_party_add_amend_convert_alias_id_0: '99000000002031',
        },
        {
          // Empty alias - should be skipped
          facc_party_add_amend_convert_alias_organisation_name_1: '',
        },
        {
          facc_party_add_amend_convert_alias_organisation_name_2: 'Beta Inc',
        },
      ];

      const result = buildOrganisationAliases(aliases);

      expect(result).toEqual([
        { alias_id: '99000000002031', sequence_number: 1, organisation_name: 'Acme Corp' },
        { alias_id: '', sequence_number: 3, organisation_name: 'Beta Inc' },
      ]);
    });
  });

  describe('buildAccountPartyPayload', () => {
    it('should build payload for individual party', () => {
      const formState: IFinesAccPartyAddAmendConvertState = {
        facc_party_add_amend_convert_title: 'Mr',
        facc_party_add_amend_convert_forenames: 'John',
        facc_party_add_amend_convert_surname: 'Doe',
        facc_party_add_amend_convert_dob: '01/01/1990',
        facc_party_add_amend_convert_national_insurance_number: 'AB123456C',
        facc_party_add_amend_convert_address_line_1: '123 Main St',
        facc_party_add_amend_convert_address_line_2: 'Apt 4',
        facc_party_add_amend_convert_address_line_3: null,
        facc_party_add_amend_convert_post_code: 'AB12 3CD',
        facc_party_add_amend_convert_contact_email_address_1: 'john@example.com',
        facc_party_add_amend_convert_contact_email_address_2: null,
        facc_party_add_amend_convert_contact_telephone_number_mobile: '07123456789',
        facc_party_add_amend_convert_contact_telephone_number_home: '01234567890',
        facc_party_add_amend_convert_contact_telephone_number_business: null,
        facc_party_add_amend_convert_vehicle_registration_mark: 'ABC123',
        facc_party_add_amend_convert_vehicle_make: 'Ford Fiesta',
        facc_party_add_amend_convert_individual_aliases: [],
        facc_party_add_amend_convert_organisation_aliases: [],
        facc_party_add_amend_convert_add_alias: null,
        facc_party_add_amend_convert_organisation_name: null,
        facc_party_add_amend_convert_language_preferences_document_language: 'EN',
        facc_party_add_amend_convert_language_preferences_hearing_language: 'EN',
        facc_party_add_amend_convert_employer_company_name: 'Acme Corp',
        facc_party_add_amend_convert_employer_reference: 'EMP123',
        facc_party_add_amend_convert_employer_email_address: 'hr@acme.com',
        facc_party_add_amend_convert_employer_telephone_number: '01234567890',
        facc_party_add_amend_convert_employer_address_line_1: '456 Business St',
        facc_party_add_amend_convert_employer_address_line_2: null,
        facc_party_add_amend_convert_employer_address_line_3: null,
        facc_party_add_amend_convert_employer_address_line_4: null,
        facc_party_add_amend_convert_employer_address_line_5: null,
        facc_party_add_amend_convert_employer_post_code: 'EF45 6GH',
      };

      const result: IOpalFinesAccountPartyDetails = buildAccountPartyFromFormState(
        formState,
        'individual',
        true,
        'party123',
      );

      expect(result.defendant_account_party_type).toBe('Defendant');
      expect(result.is_debtor).toBe(true);
      expect(result.party_details.organisation_flag).toBe(false);
      expect(result.party_details.individual_details?.title).toBe('Mr');
      expect(result.party_details.individual_details?.forenames).toBe('John');
      expect(result.party_details.individual_details?.surname).toBe('Doe');
      expect(result.party_details.individual_details?.date_of_birth).toBe('01/01/1990');
      expect(result.party_details.individual_details?.national_insurance_number).toBe('AB123456C');
      expect(result.party_details.organisation_details).toBeNull();
      expect(result.address.address_line_1).toBe('123 Main St');
      expect(result.address.address_line_2).toBe('Apt 4');
      expect(result.address.postcode).toBe('AB12 3CD');
      expect(result.contact_details?.primary_email_address).toBe('john@example.com');
      expect(result.contact_details?.mobile_telephone_number).toBe('07123456789');
      expect(result.vehicle_details?.vehicle_registration).toBe('ABC123');
      expect(result.vehicle_details?.vehicle_make_and_model).toBe('Ford Fiesta');
      expect(result.employer_details?.employer_name).toBe('Acme Corp');
      expect(result.employer_details?.employer_reference).toBe('EMP123');
      expect(result.language_preferences?.document_language_preference?.language_code).toBe('EN');
      expect(result.language_preferences?.hearing_language_preference?.language_code).toBe('EN');
    });

    it('should build payload for company party', () => {
      const formState: IFinesAccPartyAddAmendConvertState = {
        facc_party_add_amend_convert_organisation_name: 'Test Company Ltd',
        facc_party_add_amend_convert_address_line_1: '789 Corporate Ave',
        facc_party_add_amend_convert_address_line_2: null,
        facc_party_add_amend_convert_address_line_3: null,
        facc_party_add_amend_convert_post_code: 'CO12 3RP',
        facc_party_add_amend_convert_contact_email_address_1: 'info@testcompany.com',
        facc_party_add_amend_convert_contact_email_address_2: null,
        facc_party_add_amend_convert_contact_telephone_number_mobile: null,
        facc_party_add_amend_convert_contact_telephone_number_home: null,
        facc_party_add_amend_convert_contact_telephone_number_business: '01234567890',
        facc_party_add_amend_convert_vehicle_registration_mark: null,
        facc_party_add_amend_convert_vehicle_make: null,
        facc_party_add_amend_convert_individual_aliases: [],
        facc_party_add_amend_convert_organisation_aliases: [],
        facc_party_add_amend_convert_add_alias: null,
        facc_party_add_amend_convert_title: null,
        facc_party_add_amend_convert_forenames: null,
        facc_party_add_amend_convert_surname: null,
        facc_party_add_amend_convert_dob: null,
        facc_party_add_amend_convert_national_insurance_number: null,
        facc_party_add_amend_convert_language_preferences_document_language: null,
        facc_party_add_amend_convert_language_preferences_hearing_language: null,
        facc_party_add_amend_convert_employer_company_name: null,
        facc_party_add_amend_convert_employer_reference: null,
        facc_party_add_amend_convert_employer_email_address: null,
        facc_party_add_amend_convert_employer_telephone_number: null,
        facc_party_add_amend_convert_employer_address_line_1: null,
        facc_party_add_amend_convert_employer_address_line_2: null,
        facc_party_add_amend_convert_employer_address_line_3: null,
        facc_party_add_amend_convert_employer_address_line_4: null,
        facc_party_add_amend_convert_employer_address_line_5: null,
        facc_party_add_amend_convert_employer_post_code: null,
      };

      const result: IOpalFinesAccountPartyDetails = buildAccountPartyFromFormState(
        formState,
        'company',
        false,
        'party123',
      );

      expect(result.defendant_account_party_type).toBe('Defendant');
      expect(result.is_debtor).toBe(false);
      expect(result.party_details.organisation_flag).toBe(true);
      expect(result.party_details.organisation_details?.organisation_name).toBe('Test Company Ltd');
      expect(result.party_details.individual_details).toBeNull();
      expect(result.address.address_line_1).toBe('789 Corporate Ave');
      expect(result.contact_details?.primary_email_address).toBe('info@testcompany.com');
      expect(result.contact_details?.work_telephone_number).toBe('01234567890');
      expect(result.employer_details).toBeNull();
      expect(result.vehicle_details).toBeNull();
    });

    it('should build payload for parent/guardian party', () => {
      const formState: IFinesAccPartyAddAmendConvertState = {
        facc_party_add_amend_convert_title: 'Mrs',
        facc_party_add_amend_convert_forenames: 'Jane',
        facc_party_add_amend_convert_surname: 'Doe',
        facc_party_add_amend_convert_dob: '01/01/1970',
        facc_party_add_amend_convert_national_insurance_number: null,
        facc_party_add_amend_convert_address_line_1: '456 Parent St',
        facc_party_add_amend_convert_address_line_2: null,
        facc_party_add_amend_convert_address_line_3: null,
        facc_party_add_amend_convert_post_code: 'PG12 3CD',
        facc_party_add_amend_convert_contact_email_address_1: 'jane@example.com',
        facc_party_add_amend_convert_contact_email_address_2: null,
        facc_party_add_amend_convert_contact_telephone_number_mobile: '07987654321',
        facc_party_add_amend_convert_contact_telephone_number_home: null,
        facc_party_add_amend_convert_contact_telephone_number_business: null,
        facc_party_add_amend_convert_vehicle_registration_mark: null,
        facc_party_add_amend_convert_vehicle_make: null,
        facc_party_add_amend_convert_individual_aliases: [],
        facc_party_add_amend_convert_organisation_aliases: [],
        facc_party_add_amend_convert_add_alias: null,
        facc_party_add_amend_convert_organisation_name: null,
        facc_party_add_amend_convert_language_preferences_document_language: null,
        facc_party_add_amend_convert_language_preferences_hearing_language: null,
        facc_party_add_amend_convert_employer_company_name: null,
        facc_party_add_amend_convert_employer_reference: null,
        facc_party_add_amend_convert_employer_email_address: null,
        facc_party_add_amend_convert_employer_telephone_number: null,
        facc_party_add_amend_convert_employer_address_line_1: null,
        facc_party_add_amend_convert_employer_address_line_2: null,
        facc_party_add_amend_convert_employer_address_line_3: null,
        facc_party_add_amend_convert_employer_address_line_4: null,
        facc_party_add_amend_convert_employer_address_line_5: null,
        facc_party_add_amend_convert_employer_post_code: null,
      };

      const result: IOpalFinesAccountPartyDetails = buildAccountPartyFromFormState(
        formState,
        'parentGuardian',
        false,
        'party123',
      );

      expect(result.defendant_account_party_type).toBe('Parent/Guardian');
      expect(result.is_debtor).toBe(false);
      expect(result.party_details.organisation_flag).toBe(false);
      expect(result.party_details.individual_details?.title).toBe('Mrs');
      expect(result.party_details.individual_details?.forenames).toBe('Jane');
      expect(result.party_details.individual_details?.surname).toBe('Doe');
      expect(result.address.address_line_1).toBe('456 Parent St');
      expect(result.contact_details?.primary_email_address).toBe('jane@example.com');
      expect(result.employer_details).toBeNull(); // Should be null for non-debtor
    });

    it('should handle Welsh language preferences', () => {
      const formState: IFinesAccPartyAddAmendConvertState = {
        facc_party_add_amend_convert_title: 'Mr',
        facc_party_add_amend_convert_forenames: 'Gareth',
        facc_party_add_amend_convert_surname: 'Jones',
        facc_party_add_amend_convert_dob: null,
        facc_party_add_amend_convert_national_insurance_number: null,
        facc_party_add_amend_convert_address_line_1: '123 Welsh St',
        facc_party_add_amend_convert_address_line_2: null,
        facc_party_add_amend_convert_address_line_3: null,
        facc_party_add_amend_convert_post_code: 'CF10 1XX',
        facc_party_add_amend_convert_contact_email_address_1: null,
        facc_party_add_amend_convert_contact_email_address_2: null,
        facc_party_add_amend_convert_contact_telephone_number_mobile: null,
        facc_party_add_amend_convert_contact_telephone_number_home: null,
        facc_party_add_amend_convert_contact_telephone_number_business: null,
        facc_party_add_amend_convert_vehicle_registration_mark: null,
        facc_party_add_amend_convert_vehicle_make: null,
        facc_party_add_amend_convert_individual_aliases: [],
        facc_party_add_amend_convert_organisation_aliases: [],
        facc_party_add_amend_convert_add_alias: null,
        facc_party_add_amend_convert_organisation_name: null,
        facc_party_add_amend_convert_language_preferences_document_language: 'CY',
        facc_party_add_amend_convert_language_preferences_hearing_language: 'CY',
        facc_party_add_amend_convert_employer_company_name: null,
        facc_party_add_amend_convert_employer_reference: null,
        facc_party_add_amend_convert_employer_email_address: null,
        facc_party_add_amend_convert_employer_telephone_number: null,
        facc_party_add_amend_convert_employer_address_line_1: null,
        facc_party_add_amend_convert_employer_address_line_2: null,
        facc_party_add_amend_convert_employer_address_line_3: null,
        facc_party_add_amend_convert_employer_address_line_4: null,
        facc_party_add_amend_convert_employer_address_line_5: null,
        facc_party_add_amend_convert_employer_post_code: null,
      };

      const result: IOpalFinesAccountPartyDetails = buildAccountPartyFromFormState(
        formState,
        'individual',
        false,
        'party123',
      );

      expect(result.language_preferences?.document_language_preference?.language_code).toBe('CY');
      expect(result.language_preferences?.document_language_preference?.language_display_name).toBe(
        'Welsh and English',
      );
      expect(result.language_preferences?.hearing_language_preference?.language_code).toBe('CY');
      expect(result.language_preferences?.hearing_language_preference?.language_display_name).toBe('Welsh and English');
    });
  });
});
