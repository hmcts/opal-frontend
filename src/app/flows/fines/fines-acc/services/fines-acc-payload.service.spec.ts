import { TestBed } from '@angular/core/testing';
import { FinesAccPayloadService } from './fines-acc-payload.service';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IFinesAccAddNoteForm } from '../fines-acc-note-add/interfaces/fines-acc-note-add-form.interface';
import { FINES_ACC_ADD_NOTE_FORM_MOCK } from '../fines-acc-note-add/mocks/fines-acc-add-note-form.mock';

describe('FinesAccPayloadService', () => {
  let service: FinesAccPayloadService;
  let mockMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let mockGlobalStore: jasmine.SpyObj<GlobalStoreType>;
  let mockFinesAccountStore: {
    version: jasmine.Spy;
    party_type: jasmine.Spy;
    party_id: jasmine.Spy;
  };

  beforeEach(() => {
    mockMacPayloadService = jasmine.createSpyObj('FinesMacPayloadService', ['getBusinessUnitBusinessUserId']);
    mockGlobalStore = jasmine.createSpyObj('GlobalStore', ['userState']);

    const mockStore = {
      version: jasmine.createSpy('version').and.returnValue(1),
      party_type: jasmine.createSpy('party_type').and.returnValue('PERSON'),
      party_id: jasmine.createSpy('party_id').and.returnValue('12345'),
    };

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
      mockFinesAccountStore.version.and.returnValue(5);
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
        account_version: 5,
        associated_record_type: 'PERSON',
        associated_record_id: '12345',
        note_type: 'AA',
        note_text: 'Test note content',
      });
    });

    it('should call store methods to get party data', () => {
      // Setup mocks
      mockFinesAccountStore.version.and.returnValue(1);
      mockFinesAccountStore.party_type.and.returnValue('COMPANY');
      mockFinesAccountStore.party_id.and.returnValue('67890');

      const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;

      service.buildAddNotePayload(testForm);

      expect(mockFinesAccountStore.version).toHaveBeenCalled();
      expect(mockFinesAccountStore.party_type).toHaveBeenCalled();
      expect(mockFinesAccountStore.party_id).toHaveBeenCalled();
    });

    it('should use the note text from form data', () => {
      // Setup mocks
      mockFinesAccountStore.version.and.returnValue(3);
      mockFinesAccountStore.party_type.and.returnValue('PERSON');
      mockFinesAccountStore.party_id.and.returnValue('54321');

      const result = service.buildAddNotePayload(FINES_ACC_ADD_NOTE_FORM_MOCK);

      expect(result.note_text).toBe(FINES_ACC_ADD_NOTE_FORM_MOCK.formData.facc_add_notes as string);
      expect(result.note_type).toBe('AA');
    });

    it('should handle null note text from form', () => {
      // Setup mocks
      mockFinesAccountStore.version.and.returnValue(2);
      mockFinesAccountStore.party_type.and.returnValue('PERSON');
      mockFinesAccountStore.party_id.and.returnValue('11111');

      const testForm: IFinesAccAddNoteForm = {
        formData: {
          facc_add_notes: null,
        },
        nestedFlow: false,
      };

      const result = service.buildAddNotePayload(testForm);

      expect(result.note_text).toBeNull();
      expect(result.note_type).toBe('AA');
    });
  });
});
