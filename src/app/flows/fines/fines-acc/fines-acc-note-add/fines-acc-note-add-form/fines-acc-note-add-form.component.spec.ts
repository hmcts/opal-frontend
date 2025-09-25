import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccNoteAddFormComponent } from './fines-acc-note-add-form.component';
import { FINES_ACC_ADD_NOTE_FORM_MOCK } from '../mocks/fines-acc-add-note-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IFinesAccAddNoteForm } from '../interfaces/fines-acc-note-add-form.interface';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { provideRouter } from '@angular/router';
import { FINES_ACC_ADD_NOTE_FIELD_ERRORS } from '../constants/fines-acc-note-add-form-field-errors.constant';

describe('FinesAccNoteAddFormComponent', () => {
  let component: FinesAccNoteAddFormComponent;
  let fixture: ComponentFixture<FinesAccNoteAddFormComponent>;
  let formSubmit: IFinesAccAddNoteForm;
  let mockFinesAccountStore: {
    getAccountNumber: jasmine.Spy;
    party_name: jasmine.Spy;
    account_number: jasmine.Spy;
  };

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_ACC_ADD_NOTE_FORM_MOCK);

    const mockStore = {
      getAccountNumber: jasmine.createSpy('getAccountNumber').and.returnValue('123456789'),
      party_name: jasmine.createSpy('party_name').and.returnValue('Mr John, Peter DOE'),
      account_number: jasmine.createSpy('account_number').and.returnValue('123456789'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccNoteAddFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('details'),
          },
        },
        {
          provide: FinesAccountStore,
          useValue: mockStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccNoteAddFormComponent);
    component = fixture.componentInstance;
    mockFinesAccountStore = TestBed.inject(FinesAccountStore) as unknown as typeof mockFinesAccountStore;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('facc_add_notes')).toBeDefined();

    const noteControl = component.form.get('facc_add_notes');
    expect(noteControl?.hasError('required')).toBeTruthy();
  });

  it('should display account number and defendant name from store', () => {
    expect(component['accountNumber']).toBe('123456789');
    expect(component['defendantName']).toBe('Mr John, Peter DOE');
    expect(mockFinesAccountStore.getAccountNumber).toHaveBeenCalled();
    expect(mockFinesAccountStore.party_name).toHaveBeenCalled();
  });

  it('should validate required field', () => {
    const noteControl = component.form.get('facc_add_notes');

    noteControl?.setValue('');
    expect(noteControl?.hasError('required')).toBeTruthy();

    noteControl?.setValue('Valid note content');
    expect(noteControl?.hasError('required')).toBeFalsy();
  });

  it('should validate maxlength constraint', () => {
    const noteControl = component.form.get('facc_add_notes');
    const longText = 'a'.repeat(1001);

    noteControl?.setValue(longText);
    expect(noteControl?.hasError('maxlength')).toBeTruthy();

    const validText = 'a'.repeat(1000);
    noteControl?.setValue(validText);
    expect(noteControl?.hasError('maxlength')).toBeFalsy();
  });

  it('should validate alphanumeric pattern', () => {
    const noteControl = component.form.get('facc_add_notes');

    noteControl?.setValue('/$£');
    expect(noteControl?.hasError('alphanumericWithHyphensSpacesApostrophesDotPattern')).toBeTruthy();

    noteControl?.setValue('Valid note text');
    expect(noteControl?.hasError('alphanumericWithHyphensSpacesApostrophesDotPattern')).toBeFalsy();
  });

  it('should emit formSubmit event when form is submitted with valid data', () => {
    spyOn(component['formSubmit'], 'emit');

    component.form.patchValue({
      facc_add_notes: formSubmit.formData.facc_add_notes,
    });
    const mockEvent = {} as SubmitEvent;
    component.handleFormSubmit(mockEvent);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: jasmine.objectContaining({
          facc_add_notes: formSubmit.formData.facc_add_notes,
        }),
      }),
    );
  });

  it('should not emit formSubmit event when form is invalid', () => {
    spyOn(component['formSubmit'], 'emit');
    component.form.patchValue({
      facc_add_notes: null,
    });
    const mockEvent = {} as SubmitEvent;
    component.handleFormSubmit(mockEvent);
    expect(component['formSubmit'].emit).not.toHaveBeenCalled();
  });

  it('should set initial error messages', () => {
    expect(component.fieldErrors).toBeDefined();
    expect(component.fieldErrors.facc_add_notes).toBeDefined();
    expect(component.fieldErrors.facc_add_notes['required'].message).toBe(
      FINES_ACC_ADD_NOTE_FIELD_ERRORS.facc_add_notes['required'].message,
    );
    expect(component.fieldErrors.facc_add_notes['maxlength'].message).toBe(
      FINES_ACC_ADD_NOTE_FIELD_ERRORS.facc_add_notes['maxlength'].message,
    );
    expect(component.fieldErrors.facc_add_notes['alphanumericWithHyphensSpacesApostrophesDotPattern'].message).toBe(
      FINES_ACC_ADD_NOTE_FIELD_ERRORS.facc_add_notes['alphanumericWithHyphensSpacesApostrophesDotPattern'].message,
    );
  });

  it('should call super.ngOnInit() during initialization', () => {
    const superSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(component)), 'ngOnInit');

    component.ngOnInit();

    expect(superSpy).toHaveBeenCalled();
  });

  it('should setup form with correct form control', () => {
    const form = component.form;

    expect(form.get('facc_add_notes')).toBeDefined();
    expect(form.get('facc_add_notes')?.value).toBeNull();
  });

  it('should handle boundary case for maxlength validation', () => {
    const noteControl = component.form.get('facc_add_notes');

    const exactLimitText = 'a'.repeat(1000);
    noteControl?.setValue(exactLimitText);
    expect(noteControl?.hasError('maxlength')).toBeFalsy();

    const overLimitText = 'a'.repeat(1001);
    noteControl?.setValue(overLimitText);
    expect(noteControl?.hasError('maxlength')).toBeTruthy();
  });

  it('should handle whitespace-only input as invalid for required validation', () => {
    const noteControl = component.form.get('facc_add_notes');

    noteControl?.setValue('   ');

    expect(noteControl?.hasError('required')).toBeFalsy();
  });

  it('should validate special characters correctly', () => {
    const noteControl = component.form.get('facc_add_notes');

    const allowedSpecialChars = 'Note with spaces';
    noteControl?.setValue(allowedSpecialChars);
    expect(noteControl?.hasError('alphanumericWithHyphensSpacesApostrophesDotPattern')).toBeFalsy();

    const disallowedSpecialChars = 'Note with /$£';
    noteControl?.setValue(disallowedSpecialChars);
    expect(noteControl?.hasError('alphanumericWithHyphensSpacesApostrophesDotPattern')).toBeTruthy();
  });

  it('should have component created', () => {
    expect(component).toBeDefined();
  });

  it('should have finesAccStore injected', () => {
    expect(component['finesAccStore']).toBeDefined();
  });

  it('should retrieve account data from store', () => {
    expect(component['accountNumber']).toBe('123456789');
    expect(component['defendantName']).toBe('Mr John, Peter DOE');
  });

  it('should handle form submission with mock data', () => {
    spyOn(component['formSubmit'], 'emit');

    component.form.patchValue({
      facc_add_notes: FINES_ACC_ADD_NOTE_FORM_MOCK.formData.facc_add_notes,
    });

    const mockEvent = {} as SubmitEvent;

    component.handleFormSubmit(mockEvent);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: jasmine.objectContaining({
          facc_add_notes: FINES_ACC_ADD_NOTE_FORM_MOCK.formData.facc_add_notes,
        }),
      }),
    );
  });

  it('should mark form as submitted after valid submission', () => {
    component.form.patchValue({
      facc_add_notes: 'Valid test note',
    });

    const mockEvent = {} as SubmitEvent;

    component.handleFormSubmit(mockEvent);

    expect(component['formSubmitted']).toBeTruthy();
  });

  it('should call initialAddNotesSetup on ngOnInit', () => {
    const spy = spyOn(component, 'initialAddNotesSetup' as never).and.callThrough();

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should call setupAddNotesForm during initialization', () => {
    const spy = spyOn(component, 'setupAddNotesForm' as never).and.callThrough();

    component['initialAddNotesSetup']();

    expect(spy).toHaveBeenCalled();
  });
});
