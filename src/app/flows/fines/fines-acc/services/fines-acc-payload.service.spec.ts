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

describe('FinesAccPayloadService', () => {
  let service: FinesAccPayloadService;
  let mockMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let mockGlobalStore: jasmine.SpyObj<GlobalStoreType>;
  let mockFinesAccountStore: {
    version: jasmine.Spy;
    base_version: jasmine.Spy;
    party_type: jasmine.Spy;
    party_id: jasmine.Spy;
  };

  beforeEach(() => {
    mockMacPayloadService = jasmine.createSpyObj('FinesMacPayloadService', ['getBusinessUnitBusinessUserId']);
    mockGlobalStore = jasmine.createSpyObj('GlobalStore', ['userState']);

    const mockStore = {
      version: jasmine.createSpy('version').and.returnValue(1),
      base_version: jasmine.createSpy('base_version').and.returnValue(1),
      party_type: jasmine.createSpy('party_type').and.returnValue('PERSON'),
      party_id: jasmine.createSpy('party_id').and.returnValue('12345'),
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
      mockFinesAccountStore.party_id.and.returnValue('12345');

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
          record_id: '12345',
          note_type: 'AA',
          note_text: 'Test note content',
        },
      });
    });

    it('should call store methods to get party data', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.and.returnValue(1);
      mockFinesAccountStore.party_type.and.returnValue('COMPANY');
      mockFinesAccountStore.party_id.and.returnValue('67890');

      const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;

      service.buildAddNotePayload(testForm);

      expect(mockFinesAccountStore.party_id).toHaveBeenCalled();
    });

    it('should use the note text from form data', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.and.returnValue(3);
      mockFinesAccountStore.party_type.and.returnValue('PERSON');
      mockFinesAccountStore.party_id.and.returnValue('54321');

      const result = service.buildAddNotePayload(FINES_ACC_ADD_NOTE_FORM_MOCK);

      expect(result.activity_note.note_text).toBe(FINES_ACC_ADD_NOTE_FORM_MOCK.formData.facc_add_notes as string);
      expect(result.activity_note.note_type).toBe('AA');
    });

    it('should handle null note text from form', () => {
      // Setup mocks
      mockFinesAccountStore.base_version.and.returnValue(2);
      mockFinesAccountStore.party_type.and.returnValue('PERSON');
      mockFinesAccountStore.party_id.and.returnValue('11111');

      const testForm: IFinesAccAddNoteForm = {
        formData: {
          facc_add_notes: null,
        },
        nestedFlow: false,
      };

      const result = service.buildAddNotePayload(testForm);

      expect(result.activity_note.note_text).toBeNull();
      expect(result.activity_note.note_type).toBe('AA');
    });
  });

  it('should transform account header for store for an individual', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    const account_id = 77;

    const result: IFinesAccountState = service.transformAccountHeaderForStore(account_id, header);

    expect(result).toEqual({
      account_number: header.account_number,
      account_id: account_id,
      party_id: header.defendant_party_id,
      party_type: header.parent_guardian_party_id ? 'Parent/Guardian' : 'Defendant',
      party_name:
        header.party_details.individual_details?.title +
        ' ' +
        header.party_details.individual_details?.forenames +
        ' ' +
        header.party_details.individual_details?.surname?.toUpperCase(),
      base_version: Number(header.version),
      business_unit_id: header.business_unit_summary.business_unit_id,
      business_unit_user_id: header.business_unit_summary.business_unit_id,
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
      party_type: header.parent_guardian_party_id ? 'Parent/Guardian' : 'Defendant',
      party_name: header.party_details.organisation_details?.organisation_name ?? '',
      base_version: Number(header.version),
      business_unit_id: header.business_unit_summary.business_unit_id,
      business_unit_user_id: header.business_unit_summary.business_unit_id,
    });

    expect(mockMacPayloadService.getBusinessUnitBusinessUserId).toHaveBeenCalledWith(
      Number(header.business_unit_summary.business_unit_id),
      OPAL_USER_STATE_MOCK,
    );
    expect(mockGlobalStore.userState).toHaveBeenCalled();
  });

  it('should handle missing surname gracefully', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    const account_id = 77;

    const result = service.transformAccountHeaderForStore(account_id, header);

    expect(result.party_name).toBe(
      header.party_details.individual_details?.title +
        ' ' +
        header.party_details.individual_details?.forenames +
        ' ' +
        header.party_details.individual_details?.surname?.toUpperCase(),
    );
    expect(result.base_version).toBe(Number(header.version));
    expect(result.business_unit_user_id).toBe(header.business_unit_summary.business_unit_id);
  });
});
