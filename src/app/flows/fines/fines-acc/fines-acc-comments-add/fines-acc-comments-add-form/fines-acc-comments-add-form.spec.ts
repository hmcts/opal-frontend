import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FinesAccCommentsAddFormComponent } from './fines-acc-comments-add-form';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { IFinesAccAddCommentsFormState } from '../interfaces/fines-acc-comments-add-form-state.interface';

describe('FinesAccCommentsAddFormComponent', () => {
  let component: FinesAccCommentsAddFormComponent;
  let fixture: ComponentFixture<FinesAccCommentsAddFormComponent>;
  let mockFinesAccStore: any;

  const mockInitialFormData: IFinesAccAddCommentsFormState = {
    facc_add_comment: 'Test comment',
    facc_add_free_text_1: 'Free text 1',
    facc_add_free_text_2: 'Free text 2',
    facc_add_free_text_3: 'Free text 3',
  };

  beforeEach(async () => {
    mockFinesAccStore = {
      getAccountNumber: jasmine.createSpy('getAccountNumber').and.returnValue(signal('123456')),
      party_name: signal('John Doe'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccCommentsAddFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              url: [],
            },
          },
        },
        {
          provide: FinesAccountStore,
          useValue: mockFinesAccStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccCommentsAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with null values when no initial data provided', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('facc_add_comment')?.value).toBeNull();
    expect(component.form.get('facc_add_free_text_1')?.value).toBeNull();
    expect(component.form.get('facc_add_free_text_2')?.value).toBeNull();
    expect(component.form.get('facc_add_free_text_3')?.value).toBeNull();
  });

  it('should initialize form with prefilled data when initial data provided', () => {
    component.initialFormData = mockInitialFormData;
    component.ngOnInit();

    expect(component.form.get('facc_add_comment')?.value).toBe('Test comment');
    expect(component.form.get('facc_add_free_text_1')?.value).toBe('Free text 1');
    expect(component.form.get('facc_add_free_text_2')?.value).toBe('Free text 2');
    expect(component.form.get('facc_add_free_text_3')?.value).toBe('Free text 3');
  });

  it('should apply correct validators to form controls', () => {
    const commentControl = component.form.get('facc_add_comment') as FormControl;
    const freeText1Control = component.form.get('facc_add_free_text_1') as FormControl;
    const freeText2Control = component.form.get('facc_add_free_text_2') as FormControl;
    const freeText3Control = component.form.get('facc_add_free_text_3') as FormControl;

    // Test maxLength validation for comment (30 characters)
    commentControl.setValue('a'.repeat(31));
    expect(commentControl.errors?.['maxlength']).toBeTruthy();

    commentControl.setValue('a'.repeat(30));
    expect(commentControl.errors?.['maxlength']).toBeFalsy();

    // Test maxLength validation for free text fields (76 characters)
    freeText1Control.setValue('a'.repeat(77));
    expect(freeText1Control.errors?.['maxlength']).toBeTruthy();

    freeText1Control.setValue('a'.repeat(76));
    expect(freeText1Control.errors?.['maxlength']).toBeFalsy();
  });

  it('should validate pattern for alphanumeric with hyphens, spaces, apostrophes, and dots', () => {
    const commentControl = component.form.get('facc_add_comment') as FormControl;

    // Valid patterns
    commentControl.setValue("Valid text-123 with's dots.");
    expect(commentControl.errors?.['alphanumericWithHyphensSpacesApostrophesDotPattern']).toBeFalsy();

    // Invalid patterns
    commentControl.setValue('Invalid@symbol');
    expect(commentControl.errors?.['alphanumericWithHyphensSpacesApostrophesDotPattern']).toBeTruthy();
  });

  it('should emit formSubmit event when form is submitted', () => {
    spyOn(component['formSubmit'], 'emit');

    const formData: IFinesAccAddCommentsFormState = {
      facc_add_comment: 'Test comment',
      facc_add_free_text_1: 'Free text 1',
      facc_add_free_text_2: null,
      facc_add_free_text_3: null,
    };

    component.form.patchValue(formData);

    // Trigger form submission by calling the submit handler with a mock event
    const mockEvent = { submitter: null } as SubmitEvent;
    component.handleFormSubmit(mockEvent);

    expect(component['formSubmit'].emit).toHaveBeenCalled();
  });

  it('should have correct field errors configuration', () => {
    expect(component.fieldErrors).toBeDefined();
    expect(component.fieldErrors.facc_add_comment).toBeDefined();
    expect(component.fieldErrors.facc_add_free_text_1).toBeDefined();
    expect(component.fieldErrors.facc_add_free_text_2).toBeDefined();
    expect(component.fieldErrors.facc_add_free_text_3).toBeDefined();
  });

  it('should handle form reset correctly', () => {
    // Set form values
    component.form.patchValue({
      facc_add_comment: 'Test comment',
      facc_add_free_text_1: 'Free text 1',
      facc_add_free_text_2: 'Free text 2',
      facc_add_free_text_3: 'Free text 3',
    });

    // Reset form
    component.form.reset();

    expect(component.form.get('facc_add_comment')?.value).toBeNull();
    expect(component.form.get('facc_add_free_text_1')?.value).toBeNull();
    expect(component.form.get('facc_add_free_text_2')?.value).toBeNull();
    expect(component.form.get('facc_add_free_text_3')?.value).toBeNull();
  });

  it('should mark form as invalid when required validators fail', () => {
    const commentControl = component.form.get('facc_add_comment') as FormControl;

    // Set invalid value (too long)
    commentControl.setValue('a'.repeat(31));
    expect(component.form.invalid).toBeTruthy();

    // Set valid value
    commentControl.setValue('Valid comment');
    expect(component.form.valid).toBeTruthy();
  });
});
