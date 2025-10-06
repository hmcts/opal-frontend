import { FinesAccPayloadService } from './fines-acc-payload.service';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IFinesAccAddNoteForm } from '../fines-acc-note-add/interfaces/fines-acc-note-add-form.interface';
import { FINES_ACC_ADD_NOTE_FORM_MOCK } from '../fines-acc-note-add/mocks/fines-acc-add-note-form.mock';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { TestBed } from '@angular/core/testing';
import { IOpalFinesAccountDefendantAccountParty } from '../../services/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../fines-mac/services/fines-mac-payload/constants/fines-mac-transform-items-config.constant';


describe('FinesAccPayloadService', () => {
  let service: FinesAccPayloadService;
  let mockMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let mockGlobalStore: jasmine.SpyObj<GlobalStoreType>;
  let mockFinesAccountStore: {
    version: jasmine.Spy;
    base_version: jasmine.Spy;
    party_type: jasmine.Spy;
    account_id: jasmine.Spy;
  };

  beforeEach(() => {
    mockMacPayloadService = jasmine.createSpyObj('FinesMacPayloadService', ['getBusinessUnitBusinessUserId']);
    mockGlobalStore = jasmine.createSpyObj('GlobalStore', ['userState']);

    const mockStore = {
      version: jasmine.createSpy('version').and.returnValue(1),
      base_version: jasmine.createSpy('base_version').and.returnValue(1),
      party_type: jasmine.createSpy('party_type').and.returnValue('PERSON'),
      account_id: jasmine.createSpy('account_id').and.returnValue(77),
    };
    mockMacPayloadService.getBusinessUnitBusinessUserId.and.returnValue(
      FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.business_unit_summary.business_unit_id,
    );
    mockGlobalStore.userState.and.returnValue(OPAL_USER_STATE_MOCK);

    TestBed.configureTestingModule({
      providers: [
        FinesAccPayloadService,
        { provide: FinesMacPayloadService, useValue: mockMacPayloadService },
        { provide: GlobalStore, useValue: mockGlobalStore },
        { provide: FinesAccountStore, useValue: mockStore },
      ],
    });
    service = TestBed.inject(FinesAccPayloadService);
    mockFinesAccountStore = TestBed.inject(FinesAccountStore) as unknown as typeof mockFinesAccountStore;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildAddNotePayload', () => {
    it('should build correct payload with form data', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.and.returnValue(5);
      mockFinesAccountStore.party_type.and.returnValue('PERSON');
      mockFinesAccountStore.account_id.and.returnValue(77);

      const testForm: IFinesAccAddNoteForm = {
        formData: {
          facc_add_notes: 'Test note content',
        },
        nestedFlow: false,
      };

      const result = service.buildAddNotePayload(testForm);

      expect(result).toEqual({
        activity_note: {
          record_type: 'DEFENDANT_ACCOUNTS',
          record_id: 77,
          note_type: 'AA',
          note_text: 'Test note content',
        },
      });
    });

    it('should call store methods to get party data', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.and.returnValue(1);
      mockFinesAccountStore.party_type.and.returnValue('COMPANY');
      mockFinesAccountStore.account_id.and.returnValue(88);

      const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;

      service.buildAddNotePayload(testForm);

      expect(mockFinesAccountStore.account_id).toHaveBeenCalled();
    });

    it('should use the note text from form data', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.and.returnValue(3);
      mockFinesAccountStore.party_type.and.returnValue('PERSON');
      mockFinesAccountStore.account_id.and.returnValue(99);

      const result = service.buildAddNotePayload(FINES_ACC_ADD_NOTE_FORM_MOCK);

      expect(result.activity_note.note_text).toBe(FINES_ACC_ADD_NOTE_FORM_MOCK.formData.facc_add_notes as string);
      expect(result.activity_note.note_type).toBe('AA');
      expect(result.activity_note.record_id).toBe(99);
    });

    it('should handle null note text from form', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.and.returnValue(2);
      mockFinesAccountStore.party_type.and.returnValue('PERSON');
      mockFinesAccountStore.account_id.and.returnValue(111);

      const testForm: IFinesAccAddNoteForm = {
        formData: {
          facc_add_notes: null,
        },
        nestedFlow: false,
      };

      const result = service.buildAddNotePayload(testForm);

      expect(result.activity_note.note_text).toBeNull();
      expect(result.activity_note.note_type).toBe('AA');
      expect(result.activity_note.record_id).toBe(111);
    });
  });

  it('should transform account header for store for an individual', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    header.party_details.organisation_flag = false;
    const account_id = 77;

    const result: IFinesAccountState = service.transformAccountHeaderForStore(account_id, header);

    expect(result).toEqual({
      account_number: header.account_number,
      account_id: account_id,
      party_id: header.defendant_party_id,
      party_type: header.debtor_type,
      party_name:
        header.party_details.individual_details?.title +
        ' ' +
        header.party_details.individual_details?.forenames +
        ' ' +
        header.party_details.individual_details?.surname?.toUpperCase(),
      base_version: header.version,
      business_unit_id: header.business_unit_summary.business_unit_id,
      business_unit_user_id: header.business_unit_summary.business_unit_id,
      welsh_speaking: header.business_unit_summary.welsh_speaking,
    });

    expect(mockMacPayloadService.getBusinessUnitBusinessUserId).toHaveBeenCalledWith(
      Number(header.business_unit_summary.business_unit_id),
      OPAL_USER_STATE_MOCK,
    );
    expect(mockGlobalStore.userState).toHaveBeenCalled();
  });

  it('should transform account header for store for a company', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    header.party_details.organisation_flag = true;
    const account_id = 77;

    const result: IFinesAccountState = service.transformAccountHeaderForStore(account_id, header);

    expect(result).toEqual({
      account_number: header.account_number,
      account_id: account_id,
      party_id: header.defendant_party_id,
      party_type: header.debtor_type,
      party_name: header.party_details.organisation_details?.organisation_name ?? '',
      base_version: header.version,
      business_unit_id: header.business_unit_summary.business_unit_id,
      business_unit_user_id: header.business_unit_summary.business_unit_id,
      welsh_speaking: header.business_unit_summary.welsh_speaking,
    });

    expect(mockMacPayloadService.getBusinessUnitBusinessUserId).toHaveBeenCalledWith(
      Number(header.business_unit_summary.business_unit_id),
      OPAL_USER_STATE_MOCK,
    );
    expect(mockGlobalStore.userState).toHaveBeenCalled();
  });

  it('should handle missing surname gracefully', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    header.party_details.organisation_flag = false;
    const account_id = 77;

    const result = service.transformAccountHeaderForStore(account_id, header);

    expect(result.party_name).toBe(
      header.party_details.individual_details?.title +
        ' ' +
        header.party_details.individual_details?.forenames +
        ' ' +
        header.party_details.individual_details?.surname?.toUpperCase(),
    );
    expect(result.base_version).toBe(header.version);
    expect(result.business_unit_user_id).toBe(header.business_unit_summary.business_unit_id);
  });

  describe('transformDefendantDataToDebtorForm', () => {
    it('should transform complete defendant data to debtor form', () => {
      const mockDefendantData: IOpalFinesAccountDefendantAccountParty = structuredClone(
        OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK,
      );

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData);

      const { defendant_account_party } = mockDefendantData;
      const { party_details, address, contact_details, vehicle_details } = defendant_account_party;
      const individualDetails = party_details.individual_details;

      expect(result.facc_debtor_add_amend_title).toBe(individualDetails?.title || null);
      expect(result.facc_debtor_add_amend_forenames).toBe(individualDetails?.forenames || null);
      expect(result.facc_debtor_add_amend_surname).toBe(individualDetails?.surname || null);
      expect(result.facc_debtor_add_amend_dob).toBe(individualDetails?.date_of_birth || null);
      expect(result.facc_debtor_add_amend_national_insurance_number).toBe(
        individualDetails?.national_insurance_number || null,
      );
      expect(result.facc_debtor_add_amend_address_line_1).toBe(address?.address_line_1 || null);
      expect(result.facc_debtor_add_amend_address_line_2).toBe(address?.address_line_2 || null);
      expect(result.facc_debtor_add_amend_address_line_3).toBe(address?.address_line_3 || null);
      expect(result.facc_debtor_add_amend_post_code).toBe(address?.postcode || null);
      expect(result.facc_debtor_add_amend_contact_email_address_1).toBe(contact_details?.primary_email_address || null);
      expect(result.facc_debtor_add_amend_contact_email_address_2).toBe(
        contact_details?.secondary_email_address || null,
      );
      expect(result.facc_debtor_add_amend_contact_telephone_number_mobile).toBe(
        contact_details?.mobile_telephone_number || null,
      );
      expect(result.facc_debtor_add_amend_contact_telephone_number_home).toBe(
        contact_details?.home_telephone_number || null,
      );
      expect(result.facc_debtor_add_amend_contact_telephone_number_business).toBe(
        contact_details?.work_telephone_number || null,
      );
      expect(result.facc_debtor_add_amend_vehicle_make).toBe(vehicle_details?.vehicle_make_and_model || null);
      expect(result.facc_debtor_add_amend_vehicle_registration_mark).toBe(
        vehicle_details?.vehicle_registration || null,
      );
    });

    it('should handle aliases transformation', () => {
      const mockDefendantData: IOpalFinesAccountDefendantAccountParty = structuredClone(
        OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK,
      );

      // Add aliases to the mock data
      if (mockDefendantData.defendant_account_party.party_details.individual_details) {
        mockDefendantData.defendant_account_party.party_details.individual_details.individual_aliases = [
          {
            alias_number: '1',
            sequence_number: 1,
            alias_forenames: 'Johnny',
            alias_surname: 'Smith',
          },
          {
            alias_number: '2',
            sequence_number: 2,
            alias_forenames: 'Jon',
            alias_surname: 'Doe',
          },
        ];
      }

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData);

      expect(result.facc_debtor_add_amend_aliases).toEqual([
        {
          facc_debtor_add_amend_alias_forenames_0: 'Johnny',
          facc_debtor_add_amend_alias_surname_0: 'Smith',
        },
        {
          facc_debtor_add_amend_alias_forenames_1: 'Jon',
          facc_debtor_add_amend_alias_surname_1: 'Doe',
        },
      ]);
      expect(result.facc_debtor_add_amend_add_alias).toBe(true); // Should be true when aliases exist
    });

    it('should handle employer details transformation', () => {
      const mockDefendantData: IOpalFinesAccountDefendantAccountParty = structuredClone(
        OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK,
      );

      // Add employer details to the mock data
      mockDefendantData.defendant_account_party.employer_details = {
        employer_name: 'Test Company Ltd',
        employer_reference: 'EMP123',
        employer_email_address: 'hr@testcompany.com',
        employer_telephone_number: '01234567890',
        employer_address: {
          address_line_1: '123 Business Park',
          address_line_2: 'Business District',
          address_line_3: 'City Center',
          address_line_4: 'County',
          address_line_5: 'Region',
          postcode: 'BU5 1NE',
        },
      };

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData);

      expect(result.facc_debtor_add_amend_employer_details_employer_company_name).toBe('Test Company Ltd');
      expect(result.facc_debtor_add_amend_employer_details_employer_reference).toBe('EMP123');
      expect(result.facc_debtor_add_amend_employer_details_employer_email_address).toBe('hr@testcompany.com');
      expect(result.facc_debtor_add_amend_employer_details_employer_telephone_number).toBe('01234567890');
      expect(result.facc_debtor_add_amend_employer_details_employer_address_line_1).toBe('123 Business Park');
      expect(result.facc_debtor_add_amend_employer_details_employer_address_line_2).toBe('Business District');
      expect(result.facc_debtor_add_amend_employer_details_employer_address_line_3).toBe('City Center');
      expect(result.facc_debtor_add_amend_employer_details_employer_address_line_4).toBe('County');
      expect(result.facc_debtor_add_amend_employer_details_employer_address_line_5).toBe('Region');
      expect(result.facc_debtor_add_amend_employer_details_employer_post_code).toBe('BU5 1NE');
    });

    it('should handle language preferences transformation', () => {
      const mockDefendantData: IOpalFinesAccountDefendantAccountParty = structuredClone(
        OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK,
      );

      // Add language preferences to the mock data
      mockDefendantData.defendant_account_party.language_preferences = {
        document_language_preference: {
          language_code: 'CY',
          language_display_name: 'Welsh and English',
        },
        hearing_language_preference: {
          language_code: 'EN',
          language_display_name: 'English only',
        },
      };

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData);

      expect(result.facc_debtor_add_amend_language_preferences_document_language).toBe('CY');
      expect(result.facc_debtor_add_amend_language_preferences_hearing_language).toBe('EN');
    });

    it('should handle null and undefined values gracefully', () => {
      const mockDefendantData: IOpalFinesAccountDefendantAccountParty = structuredClone(
        OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK,
      );

      // Set all optional fields to null
      mockDefendantData.defendant_account_party.party_details.individual_details = null;
      mockDefendantData.defendant_account_party.address = {
        address_line_1: '',
        address_line_2: null,
        address_line_3: null,
        address_line_4: null,
        address_line_5: null,
        postcode: '',
      };
      mockDefendantData.defendant_account_party.contact_details = {
        primary_email_address: null,
        secondary_email_address: null,
        mobile_telephone_number: null,
        home_telephone_number: null,
        work_telephone_number: null,
      };
      mockDefendantData.defendant_account_party.vehicle_details = null;
      mockDefendantData.defendant_account_party.employer_details = null;
      mockDefendantData.defendant_account_party.language_preferences = null;

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData);

      expect(result.facc_debtor_add_amend_title).toBeNull();
      expect(result.facc_debtor_add_amend_forenames).toBeNull();
      expect(result.facc_debtor_add_amend_surname).toBeNull();
      expect(result.facc_debtor_add_amend_aliases).toEqual([]);
      expect(result.facc_debtor_add_amend_address_line_1).toBeNull(); // Empty string becomes null due to || null
      expect(result.facc_debtor_add_amend_address_line_2).toBeNull();
      expect(result.facc_debtor_add_amend_post_code).toBeNull(); // Empty string becomes null due to || null
      expect(result.facc_debtor_add_amend_contact_email_address_1).toBeNull();
      expect(result.facc_debtor_add_amend_employer_details_employer_company_name).toBeNull();
      expect(result.facc_debtor_add_amend_language_preferences_document_language).toBeNull();
    });

  it('should transform payload using the transformation service', () => {
    spyOn(service['transformationService'], 'transformObjectValues').and.callFake((...args) => args[0]);
    const inputPayload = {
      date_of_birth: '2000-09-09',
    };

    const result = service.transformPayload(inputPayload, FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG);

    expect(service['transformationService'].transformObjectValues).toHaveBeenCalledWith(
      inputPayload,
      FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    expect(result).toEqual(inputPayload);

  });
});
