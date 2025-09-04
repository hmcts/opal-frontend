import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import {
  IOpalFinesAddNotePayload,
  IOpalFinesAddNoteResponse,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';

describe('FinesAccNoteAddComponent', () => {
  let component: FinesAccNoteAddComponent;
  let fixture: ComponentFixture<FinesAccNoteAddComponent>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockFinesAccPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  let mockFinesAccountStore: {
    party_type: jasmine.Spy;
    party_id: jasmine.Spy;
    getAccountNumber: jasmine.Spy;
    party_name: jasmine.Spy;
    base_version: jasmine.Spy;
  };

  beforeEach(async () => {
    // Create mock OpalFines service
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['addNote']);

    // Create mock FinesAccPayloadService
    mockFinesAccPayloadService = jasmine.createSpyObj('FinesAccPayloadService', ['buildAddNotePayload']);

    // Create mock FinesAccountStore with signal methods
    mockFinesAccountStore = {
      party_type: jasmine.createSpy('party_type').and.returnValue('PERSON'),
      party_id: jasmine.createSpy('party_id').and.returnValue('12345'),
      getAccountNumber: jasmine.createSpy('getAccountNumber').and.returnValue('123456789'),
      party_name: jasmine.createSpy('party_name').and.returnValue('Mr John, Peter DOE'),
      base_version: jasmine.createSpy('base_version').and.returnValue(1),
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
      account_version: 1,
      associated_record_type: 'PERSON',
      associated_record_id: '12345',
      note_type: 'AA',
      note_text: testForm.formData.facc_add_notes!,
    };

    const mockResponse: IOpalFinesAddNoteResponse = {
      note_id: 123,
      associated_record_type: 'PERSON',
      associated_record_id: '12345',
      note_type: 'AA',
      note_text: testForm.formData.facc_add_notes!,
      created_date: '2024-01-01T10:00:00Z',
      created_by: 'test_user',
    };

    mockOpalFinesService.addNote.and.returnValue(of(mockResponse));
    mockFinesAccPayloadService.buildAddNotePayload.and.returnValue(expectedPayload);
    spyOn(component, 'routerNavigate' as never);

    component.handleAddNoteSubmit(testForm);

    expect(mockFinesAccPayloadService.buildAddNotePayload).toHaveBeenCalledWith(testForm);
    expect(mockOpalFinesService.addNote).toHaveBeenCalledWith(expectedPayload);
  });

  it('should navigate to details page on successful API call', fakeAsync(() => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    const expectedPayload: IOpalFinesAddNotePayload = {
      account_version: 1,
      associated_record_type: 'PERSON',
      associated_record_id: '12345',
      note_type: 'AA',
      note_text: testForm.formData.facc_add_notes!,
    };
    const mockResponse: IOpalFinesAddNoteResponse = {
      note_id: 123,
      associated_record_type: 'PERSON',
      associated_record_id: '12345',
      note_type: 'AA',
      note_text: testForm.formData.facc_add_notes!,
      created_date: '2024-01-01T10:00:00Z',
      created_by: 'test_user',
    };

    mockOpalFinesService.addNote.and.returnValue(of(mockResponse));
    mockFinesAccPayloadService.buildAddNotePayload.and.returnValue(expectedPayload);
    spyOn(component, 'routerNavigate' as never);

    component.handleAddNoteSubmit(testForm);
    tick(); // Wait for observable to complete

    expect(component['routerNavigate']).toHaveBeenCalledWith(component['finesAccRoutingPaths'].children.details);
  }));

  it('should not navigate on API call failure', fakeAsync(() => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    const expectedPayload: IOpalFinesAddNotePayload = {
      account_version: 1,
      associated_record_type: 'PERSON',
      associated_record_id: '12345',
      note_type: 'AA',
      note_text: testForm.formData.facc_add_notes!,
    };

    mockOpalFinesService.addNote.and.returnValue(throwError(() => new Error('API Error')));
    mockFinesAccPayloadService.buildAddNotePayload.and.returnValue(expectedPayload);
    spyOn(component, 'routerNavigate' as never);

    component.handleAddNoteSubmit(testForm);
    tick(); // Wait for error to be handled

    expect(component['routerNavigate']).not.toHaveBeenCalled();
  }));

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

  it('should have finesAccRoutingPaths injected', () => {
    expect(component['finesAccRoutingPaths']).toBeDefined();
  });

  it('should have opalFinesService injected', () => {
    expect(component['opalFinesService']).toBeDefined();
  });

  it('should have finesAccStore injected', () => {
    expect(component['finesAccStore']).toBeDefined();
  });

  it('should call utilsService.scrollToTop on API call failure', fakeAsync(() => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    const expectedPayload: IOpalFinesAddNotePayload = {
      account_version: 1,
      associated_record_type: 'PERSON',
      associated_record_id: '12345',
      note_type: 'AA',
      note_text: testForm.formData.facc_add_notes!,
    };

    spyOn(component['utilsService'], 'scrollToTop');
    mockOpalFinesService.addNote.and.returnValue(throwError(() => new Error('API Error')));
    mockFinesAccPayloadService.buildAddNotePayload.and.returnValue(expectedPayload);

    component.handleAddNoteSubmit(testForm);
    tick(); // Wait for error to be handled

    expect(component['utilsService'].scrollToTop).toHaveBeenCalled();
  }));

  it('should call next and complete on ngUnsubscribe when ngOnDestroy is invoked', () => {
    spyOn(component['ngUnsubscribe'], 'next');
    spyOn(component['ngUnsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(component['ngUnsubscribe'].next).toHaveBeenCalled();
    expect(component['ngUnsubscribe'].complete).toHaveBeenCalled();
  });
});
