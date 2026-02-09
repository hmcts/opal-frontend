import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccNoteAddComponent } from './fines-acc-note-add.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { IFinesAccAddNoteForm } from './interfaces/fines-acc-note-add-form.interface';
import { FINES_ACC_ADD_NOTE_FORM_MOCK } from './mocks/fines-acc-add-note-form.mock';
import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';
import { IOpalFinesAddNoteResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note-response.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccNoteAddComponent', () => {
  let component: FinesAccNoteAddComponent;
  let fixture: ComponentFixture<FinesAccNoteAddComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesAccPayloadService: any;
  let mockFinesAccountStore: {
    party_type: Mock;
    party_id: Mock;
    getAccountNumber: Mock;
    party_name: Mock;
    base_version: Mock;
  };

  beforeEach(async () => {
    // Create mock OpalFines service
    mockOpalFinesService = {
      addNote: vi.fn().mockName('OpalFines.addNote'),
    };

    // Create mock FinesAccPayloadService
    mockFinesAccPayloadService = {
      buildAddNotePayload: vi.fn().mockName('FinesAccPayloadService.buildAddNotePayload'),
    };

    // Create mock FinesAccountStore with signal methods
    mockFinesAccountStore = {
      party_type: vi.fn().mockReturnValue('PERSON'),
      party_id: vi.fn().mockReturnValue('12345'),
      getAccountNumber: vi.fn().mockReturnValue('123456789'),
      party_name: vi.fn().mockReturnValue('Mr John, Peter DOE'),
      base_version: vi.fn().mockReturnValue(1),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccNoteAddComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('details'),
          },
        },
        {
          provide: OpalFines,
          useValue: mockOpalFinesService,
        },
        {
          provide: FinesAccountStore,
          useValue: mockFinesAccountStore,
        },
        {
          provide: FinesAccPayloadService,
          useValue: mockFinesAccPayloadService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccNoteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call opalFinesService with correct payload on form submission', () => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    const expectedPayload: IOpalFinesAddNotePayload = {
      activity_note: {
        record_type: 'PERSON',
        record_id: 77,
        note_type: 'AA',
        note_text: testForm.formData.facc_add_notes!,
      },
    };

    const mockResponse: IOpalFinesAddNoteResponse = {
      note_id: 123,
    };

    mockOpalFinesService.addNote.mockReturnValue(of(mockResponse));
    mockFinesAccPayloadService.buildAddNotePayload.mockReturnValue(expectedPayload);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'routerNavigate' as never);

    component.handleAddNoteSubmit(testForm);

    expect(mockFinesAccPayloadService.buildAddNotePayload).toHaveBeenCalledWith(testForm);
    expect(mockOpalFinesService.addNote).toHaveBeenCalledWith(expectedPayload, expect.any(String));
  });

  it('should navigate to details page on successful API call', () => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    const expectedPayload: IOpalFinesAddNotePayload = {
      activity_note: {
        record_type: 'PERSON',
        record_id: 88,
        note_type: 'AA',
        note_text: testForm.formData.facc_add_notes!,
      },
    };
    const mockResponse: IOpalFinesAddNoteResponse = {
      note_id: 123,
    };

    mockOpalFinesService.addNote.mockReturnValue(of(mockResponse));
    mockFinesAccPayloadService.buildAddNotePayload.mockReturnValue(expectedPayload);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'routerNavigate' as never);

    component.handleAddNoteSubmit(testForm);

    expect(component['routerNavigate']).toHaveBeenCalledWith(expect.any(String));
  });

  it('should not navigate on API call failure', () => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    const expectedPayload: IOpalFinesAddNotePayload = {
      activity_note: {
        record_type: 'PERSON',
        record_id: 99,
        note_type: 'AA',
        note_text: testForm.formData.facc_add_notes!,
      },
    };

    mockOpalFinesService.addNote.mockReturnValue(throwError(() => new Error('API Error')));
    mockFinesAccPayloadService.buildAddNotePayload.mockReturnValue(expectedPayload);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'routerNavigate' as never);

    component.handleAddNoteSubmit(testForm);

    expect(component['routerNavigate']).not.toHaveBeenCalled();
  });

  it('should set stateUnsavedChanges to true when passed true', () => {
    component.handleUnsavedChanges(true);

    expect(component['stateUnsavedChanges']).toBe(true);
  });

  it('should set stateUnsavedChanges to false when passed false', () => {
    component.handleUnsavedChanges(false);

    expect(component['stateUnsavedChanges']).toBe(false);
  });

  it('should update stateUnsavedChanges value correctly', () => {
    component.handleUnsavedChanges(false);
    expect(component['stateUnsavedChanges']).toBe(false);

    component.handleUnsavedChanges(true);
    expect(component['stateUnsavedChanges']).toBe(true);

    component.handleUnsavedChanges(false);
    expect(component['stateUnsavedChanges']).toBe(false);
  });

  it('should have component created', () => {
    expect(component).toBeDefined();
  });

  it('should have opalFinesService injected', () => {
    expect(component['opalFinesService']).toBeDefined();
  });

  it('should have finesAccStore injected', () => {
    expect(component['finesAccStore']).toBeDefined();
  });

  it('should call utilsService.scrollToTop on API call failure', () => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    const expectedPayload: IOpalFinesAddNotePayload = {
      activity_note: {
        record_type: 'PERSON',
        record_id: 111,
        note_type: 'AA',
        note_text: testForm.formData.facc_add_notes!,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['utilsService'], 'scrollToTop');
    mockOpalFinesService.addNote.mockReturnValue(throwError(() => new Error('API Error')));
    mockFinesAccPayloadService.buildAddNotePayload.mockReturnValue(expectedPayload);

    component.handleAddNoteSubmit(testForm);

    expect(component['utilsService'].scrollToTop).toHaveBeenCalled();
  });

  it('should call next and complete on ngUnsubscribe when ngOnDestroy is invoked', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['ngUnsubscribe'], 'next');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['ngUnsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(component['ngUnsubscribe'].next).toHaveBeenCalled();
    expect(component['ngUnsubscribe'].complete).toHaveBeenCalled();
  });
});
