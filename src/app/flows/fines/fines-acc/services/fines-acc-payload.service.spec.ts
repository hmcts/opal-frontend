import type { Mock } from 'vitest';
import { FinesAccPayloadService } from './fines-acc-payload.service';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
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
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { IFinesAccAddCommentsFormState } from '../fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';
import { FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../fines-mac/services/fines-mac-payload/constants/fines-mac-map-transform-items-config.constant';
import { MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA } from '../fines-acc-party-add-amend-convert/mocks/fines-acc-party-add-amend-convert-form-empty.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccPayloadService', () => {
  let service: FinesAccPayloadService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMacPayloadService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGlobalStore: any;
  let mockFinesAccountStore: {
    version: Mock;
    base_version: Mock;
    party_type: Mock;
    account_id: Mock;
  };

  beforeEach(() => {
    mockMacPayloadService = {
      getBusinessUnitBusinessUserId: vi.fn().mockName('FinesMacPayloadService.getBusinessUnitBusinessUserId'),
    };
    mockGlobalStore = {
      userState: vi.fn().mockName('GlobalStore.userState'),
    };

    const mockStore = {
      version: vi.fn().mockReturnValue(1),
      base_version: vi.fn().mockReturnValue(1),
      party_type: vi.fn().mockReturnValue('PERSON'),
      account_id: vi.fn().mockReturnValue(77),
    };
    mockMacPayloadService.getBusinessUnitBusinessUserId.mockReturnValue(
      FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.business_unit_summary.business_unit_id,
    );
    mockGlobalStore.userState.mockReturnValue(OPAL_USER_STATE_MOCK);

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
      mockFinesAccountStore.base_version.mockReturnValue(5);
      mockFinesAccountStore.party_type.mockReturnValue('PERSON');
      mockFinesAccountStore.account_id.mockReturnValue(77);

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
      mockFinesAccountStore.base_version.mockReturnValue(1);
      mockFinesAccountStore.party_type.mockReturnValue('COMPANY');
      mockFinesAccountStore.account_id.mockReturnValue(88);

      const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;

      service.buildAddNotePayload(testForm);

      expect(mockFinesAccountStore.account_id).toHaveBeenCalled();
    });

    it('should use the note text from form data', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.mockReturnValue(3);
      mockFinesAccountStore.party_type.mockReturnValue('PERSON');
      mockFinesAccountStore.account_id.mockReturnValue(99);

      const result = service.buildAddNotePayload(FINES_ACC_ADD_NOTE_FORM_MOCK);

      expect(result.activity_note.note_text).toBe(FINES_ACC_ADD_NOTE_FORM_MOCK.formData.facc_add_notes as string);
      expect(result.activity_note.note_type).toBe('AA');
      expect(result.activity_note.record_id).toBe(99);
    });

    it('should handle null note text from form', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.mockReturnValue(2);
      mockFinesAccountStore.party_type.mockReturnValue('PERSON');
      mockFinesAccountStore.account_id.mockReturnValue(111);

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
      pg_party_id: header.parent_guardian_party_id,
      party_id: header.defendant_account_party_id,
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
      pg_party_id: header.parent_guardian_party_id,
      party_id: header.defendant_account_party_id,
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

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData, 'individual', true);

      const { defendant_account_party } = mockDefendantData;
      const { party_details, address, contact_details, vehicle_details } = defendant_account_party;
      const individualDetails = party_details.individual_details;

      expect(result.facc_party_add_amend_convert_title).toBe(individualDetails?.title || null);
      expect(result.facc_party_add_amend_convert_forenames).toBe(individualDetails?.forenames || null);
      expect(result.facc_party_add_amend_convert_surname).toBe(individualDetails?.surname || null);
      expect(result.facc_party_add_amend_convert_dob).toBe(individualDetails?.date_of_birth || null);
      expect(result.facc_party_add_amend_convert_national_insurance_number).toBe(
        individualDetails?.national_insurance_number || null,
      );
      expect(result.facc_party_add_amend_convert_address_line_1).toBe(address?.address_line_1 || null);
      expect(result.facc_party_add_amend_convert_address_line_2).toBe(address?.address_line_2 || null);
      expect(result.facc_party_add_amend_convert_address_line_3).toBe(address?.address_line_3 || null);
      expect(result.facc_party_add_amend_convert_post_code).toBe(address?.postcode || null);
      expect(result.facc_party_add_amend_convert_contact_email_address_1).toBe(
        contact_details?.primary_email_address || null,
      );
      expect(result.facc_party_add_amend_convert_contact_email_address_2).toBe(
        contact_details?.secondary_email_address || null,
      );
      expect(result.facc_party_add_amend_convert_contact_telephone_number_mobile).toBe(
        contact_details?.mobile_telephone_number || null,
      );
      expect(result.facc_party_add_amend_convert_contact_telephone_number_home).toBe(
        contact_details?.home_telephone_number || null,
      );
      expect(result.facc_party_add_amend_convert_contact_telephone_number_business).toBe(
        contact_details?.work_telephone_number || null,
      );
      expect(result.facc_party_add_amend_convert_vehicle_make).toBe(vehicle_details?.vehicle_make_and_model || null);
      expect(result.facc_party_add_amend_convert_vehicle_registration_mark).toBe(
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
            alias_id: '1',
            sequence_number: 1,
            forenames: 'Johnny',
            surname: 'Smith',
          },
          {
            alias_id: '2',
            sequence_number: 2,
            forenames: 'Jon',
            surname: 'Doe',
          },
        ];
      }

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData, 'individual', true);

      expect(result.facc_party_add_amend_convert_individual_aliases).toEqual([
        {
          facc_party_add_amend_convert_alias_forenames_0: 'Johnny',
          facc_party_add_amend_convert_alias_surname_0: 'Smith',
          facc_party_add_amend_convert_alias_id_0: '1',
        },
        {
          facc_party_add_amend_convert_alias_forenames_1: 'Jon',
          facc_party_add_amend_convert_alias_surname_1: 'Doe',
          facc_party_add_amend_convert_alias_id_1: '2',
        },
      ]);
      expect(result.facc_party_add_amend_convert_add_alias).toBe(true); // Should be true when aliases exist
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

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData, 'individual', true);

      expect(result.facc_party_add_amend_convert_employer_company_name).toBe('Test Company Ltd');
      expect(result.facc_party_add_amend_convert_employer_reference).toBe('EMP123');
      expect(result.facc_party_add_amend_convert_employer_email_address).toBe('hr@testcompany.com');
      expect(result.facc_party_add_amend_convert_employer_telephone_number).toBe('01234567890');
      expect(result.facc_party_add_amend_convert_employer_address_line_1).toBe('123 Business Park');
      expect(result.facc_party_add_amend_convert_employer_address_line_2).toBe('Business District');
      expect(result.facc_party_add_amend_convert_employer_address_line_3).toBe('City Center');
      expect(result.facc_party_add_amend_convert_employer_address_line_4).toBe('County');
      expect(result.facc_party_add_amend_convert_employer_address_line_5).toBe('Region');
      expect(result.facc_party_add_amend_convert_employer_post_code).toBe('BU5 1NE');
    });

    it('should transform payload using the transformation service', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn<any, any>(service['transformationService'], 'transformObjectValues').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (...args: any[]) => args[0],
      );
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

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData, 'individual', true);

      expect(result.facc_party_add_amend_convert_language_preferences_document_language).toBe('CY');
      expect(result.facc_party_add_amend_convert_language_preferences_hearing_language).toBe('EN');
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

      const result = service.mapDebtorAccountPartyPayload(mockDefendantData, 'individual', true);

      expect(result.facc_party_add_amend_convert_title).toBeNull();
      expect(result.facc_party_add_amend_convert_forenames).toBeNull();
      expect(result.facc_party_add_amend_convert_surname).toBeNull();
      expect(result.facc_party_add_amend_convert_individual_aliases).toEqual([]);
      expect(result.facc_party_add_amend_convert_organisation_aliases).toEqual([]);
      expect(result.facc_party_add_amend_convert_address_line_1).toBeNull(); // Empty string becomes null due to || null
      expect(result.facc_party_add_amend_convert_address_line_2).toBeNull();
      expect(result.facc_party_add_amend_convert_post_code).toBeNull(); // Empty string becomes null due to || null
      expect(result.facc_party_add_amend_convert_contact_email_address_1).toBeNull();
      expect(result.facc_party_add_amend_convert_employer_company_name).toBeNull();
      expect(result.facc_party_add_amend_convert_language_preferences_document_language).toBeNull();
    });
    it('should transform at-a-glance data to comments form state', () => {
      const atAGlanceData = OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK;

      const result: IFinesAccAddCommentsFormState = service.transformAtAGlanceDataToCommentsForm(atAGlanceData);

      expect(result).toEqual({
        facc_add_comment: atAGlanceData.comments_and_notes?.account_comment || '',
        facc_add_free_text_1: atAGlanceData.comments_and_notes?.free_text_note_1 || '',
        facc_add_free_text_2: atAGlanceData.comments_and_notes?.free_text_note_2 || '',
        facc_add_free_text_3: atAGlanceData.comments_and_notes?.free_text_note_3 || '',
      });
    });

    it('should handle null account notes gracefully', () => {
      const atAGlanceData = {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
        comments_and_notes: {
          account_comment: null,
          free_text_note_1: null,
          free_text_note_2: null,
          free_text_note_3: null,
        },
      };

      const result: IFinesAccAddCommentsFormState = service.transformAtAGlanceDataToCommentsForm(atAGlanceData);

      expect(result).toEqual({
        facc_add_comment: '',
        facc_add_free_text_1: '',
        facc_add_free_text_2: '',
        facc_add_free_text_3: '',
      });
    });

    describe('buildCommentsFormPayload', () => {
      it('should transform form state to update payload correctly', () => {
        const formState: IFinesAccAddCommentsFormState = {
          facc_add_comment: 'Updated comment',
          facc_add_free_text_1: 'Updated note 1',
          facc_add_free_text_2: 'Updated note 2',
          facc_add_free_text_3: 'Updated note 3',
        };

        const result = service.buildCommentsFormPayload(formState);

        expect(result).toEqual({
          comment_and_notes: {
            account_comment: 'Updated comment',
            free_text_note_1: 'Updated note 1',
            free_text_note_2: 'Updated note 2',
            free_text_note_3: 'Updated note 3',
          },
        });
      });

      it('should handle null/empty values in form state', () => {
        const formState: IFinesAccAddCommentsFormState = {
          facc_add_comment: '',
          facc_add_free_text_1: null,
          facc_add_free_text_2: '',
          facc_add_free_text_3: null,
        };

        const result = service.buildCommentsFormPayload(formState);

        expect(result).toEqual({
          comment_and_notes: {
            account_comment: null,
            free_text_note_1: null,
            free_text_note_2: null,
            free_text_note_3: null,
          },
        });
      });

      it('should transform payload using the transformation service', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.spyOn<any, any>(service['transformationService'], 'transformObjectValues').mockImplementation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (...args: any[]) => args[0],
        );
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

      it('should transform payload using the transformation service', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.spyOn<any, any>(service['transformationService'], 'transformObjectValues').mockImplementation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (...args: any[]) => args[0],
        );
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
    it('should delegate to buildAccountPartyPayload utility function', () => {
      // This test ensures the service method properly delegates to the utility
      const formState = {
        ...MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
        facc_party_add_amend_convert_title: 'Mr',
        facc_party_add_amend_convert_forenames: 'John',
        facc_party_add_amend_convert_surname: 'Doe',
        facc_party_add_amend_convert_address_line_1: '123 Main St',
      };

      const result = service.buildAccountPartyPayload(formState, 'individual', true, 'party123');

      // Verify it returns a proper payload structure
      expect(result).toBeDefined();
      expect(result.defendant_account_party_type).toBe('Defendant');
      expect(result.is_debtor).toBe(true);
      expect(result.party_details).toBeDefined();
      expect(result.address).toBeDefined();
      expect(result.contact_details).toBeDefined();
      expect(result.language_preferences).toBeDefined();
    });
  });

  describe('transformPaymentTermsPayload', () => {
    it('should return form structure with nestedFlow false', () => {
      const mockPaymentTermsData = {
        payment_terms: {
          payment_terms_type: { payment_terms_type_code: 'B' },
          effective_date: '2025-01-01',
        },
      } as never;
      const mockResultData = null;

      const result = service.transformPaymentTermsPayload(mockPaymentTermsData, mockResultData);

      expect(result).toEqual(
        expect.objectContaining({
          nestedFlow: false,
          formData: expect.any(Object),
        }),
      );
    });
  });

  describe('buildPaymentTermsAmendPayload', () => {
    it('should build and return payment terms amend payload', () => {
      const mockFormData = {
        facc_payment_terms_payment_terms: 'payInFull',
        facc_payment_terms_pay_by_date: '2025-01-01',
      } as never;

      vi.spyOn(service, 'transformPayload').mockImplementation((payload) => payload);

      const result = service.buildPaymentTermsAmendPayload(mockFormData);

      expect(service.transformPayload).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          payment_terms: expect.any(Object),
        }),
      );
    });
  });
});
