import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccNoteAddComponent } from './fines-acc-note-add.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
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
  let mockFinesAccountStore: {
    party_type: jasmine.Spy;
    party_id: jasmine.Spy;
    getAccountNumber: jasmine.Spy;
    party_name: jasmine.Spy;
    version: jasmine.Spy;
  };

  beforeEach(async () => {
    // Create mock OpalFines service
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['postAddNotePayload']);

    // Create mock FinesAccountStore with signal methods
    mockFinesAccountStore = {
      party_type: jasmine.createSpy('party_type').and.returnValue('PERSON'),
      party_id: jasmine.createSpy('party_id').and.returnValue('12345'),
      getAccountNumber: jasmine.createSpy('getAccountNumber').and.returnValue('123456789'),
      party_name: jasmine.createSpy('party_name').and.returnValue('Mr John, Peter DOE'),
      version: jasmine.createSpy('version').and.returnValue(1),
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

    mockOpalFinesService.postAddNotePayload.and.returnValue(of(mockResponse));
    spyOn(component, 'routerNavigate' as never);

    component.handleAddNoteSubmit(testForm);

    expect(mockOpalFinesService.postAddNotePayload).toHaveBeenCalledWith(expectedPayload);
  });

  it('should navigate to details page on successful API call', () => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    const mockResponse: IOpalFinesAddNoteResponse = {
      note_id: 123,
      associated_record_type: 'PERSON',
      associated_record_id: '12345',
      note_type: 'AA',
      note_text: testForm.formData.facc_add_notes!,
      created_date: '2024-01-01T10:00:00Z',
      created_by: 'test_user',
    };

    mockOpalFinesService.postAddNotePayload.and.returnValue(of(mockResponse));
    spyOn(component, 'routerNavigate' as never);

    component.handleAddNoteSubmit(testForm);

    expect(component['routerNavigate']).toHaveBeenCalledWith(component['finesAccRoutingPaths'].children.details);
  });

  it('should not navigate on API call failure', () => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    mockOpalFinesService.postAddNotePayload.and.returnValue(throwError(() => new Error('API Error')));
    spyOn(component, 'routerNavigate' as never);

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

  it('should have finesAccRoutingPaths injected', () => {
    expect(component['finesAccRoutingPaths']).toBeDefined();
  });

  it('should have opalFinesService injected', () => {
    expect(component['opalFinesService']).toBeDefined();
  });

  it('should have finesAccStore injected', () => {
    expect(component['finesAccStore']).toBeDefined();
  });

  it('should call utilsService.scrollToTop on API call failure', () => {
    const testForm: IFinesAccAddNoteForm = FINES_ACC_ADD_NOTE_FORM_MOCK;
    spyOn(component['utilsService'], 'scrollToTop');
    mockOpalFinesService.postAddNotePayload.and.returnValue(throwError(() => new Error('API Error')));

    component.handleAddNoteSubmit(testForm);

    expect(component['utilsService'].scrollToTop).toHaveBeenCalled();
  });
});
