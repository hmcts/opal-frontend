import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormComponent } from './search-form.component';
import {
  AUTO_COMPLETE_ITEMS_MOCK,
  FORM_CONTROL_ERROR_MOCK,
  FORM_DATE_ERROR_SUMMARY_MOCK,
  FORM_ERROR_SUMMARY_MOCK,
  SEARCH_STATE_MOCK,
} from '@mocks';
import { IFieldError, IFormError, IFormErrorSummaryMessage } from '@interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    component.selectOptions = AUTO_COMPLETE_ITEMS_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup the search form', () => {
    expect(component.searchForm).not.toBeNull();
  });

  it('should repopulate if there are any initials values', () => {
    expect(component.searchForm.value.court).toBeNull();
  });

  it('should repopulate if there are values', () => {
    component.state = SEARCH_STATE_MOCK;
    component['rePopulateSearchForm']();
    expect(component.searchForm.value.court).toBe('Bath');
  });

  it('should repopulate the form', () => {
    component.state = SEARCH_STATE_MOCK;
    component['rePopulateSearchForm']();
    expect(component.searchForm.value.court).toBe('Bath');

    component.handleClearForm();
    expect(component.searchForm.value.court).toBeNull();
  });

  it('should emit form submit event with form value', () => {
    const formValue = SEARCH_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component.searchForm.patchValue(formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });

  it('should setup the search form on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupSearchForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateSearchForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');

    component.ngOnInit();

    expect(component['setupSearchForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalledWith(component.searchForm);
    expect(component['rePopulateSearchForm']).toHaveBeenCalled();
  });

  it('should return the highest priority error', () => {
    const component = new SearchFormComponent();
    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IFieldError = FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toEqual({ ...fieldErrors['minLength'], type: 'minLength' });
  });

  it('should return null if errorKeys is empty', () => {
    const component = new SearchFormComponent();
    const errorKeys: string[] = [];
    const fieldErrors: IFieldError = FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);
    expect(result).toBe(null);
  });

  it('should return null if fieldErrors is empty', () => {
    const component = new SearchFormComponent();
    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
  });

  it('should return null if nothing is not passed in', () => {
    const component = new SearchFormComponent();

    const result = component['getHighestPriorityError']();

    expect(result).toBe(null);
  });

  it('should return null if errorKeys and fieldErrors are empty', () => {
    const component = new SearchFormComponent();
    const errorKeys: string[] = [];
    const fieldErrors: IFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
  });

  it('should return the error summary entries', () => {
    const errorMessage = component['getFieldErrorDetails'](['court']);
    const expectedResp = { message: 'Select a court', priority: 1, type: 'required' };

    expect(errorMessage).toEqual(expectedResp);
  });

  it('should return null as no control error', () => {
    expect(component['getFieldErrorDetails'](['surname'])).toBeNull();
  });

  it('should set the error messages', () => {
    const errorSummaryEntry: IFormError[] = FORM_ERROR_SUMMARY_MOCK;

    component['setErrorMessages'](errorSummaryEntry);

    expect(component.formControlErrorMessages['court']).toBe('Select a court');
    expect(component.formControlErrorMessages['dayOfMonth']).toBe(
      'The date your passport was issued must include a day',
    );
    expect(component.formErrorSummaryMessage).toEqual([
      {
        fieldId: 'court',
        message: 'Select a court',
      },
      {
        fieldId: 'dayOfMonth',
        message: 'The date your passport was issued must include a day',
      },
      {
        fieldId: 'monthOfYear',
        message: 'The date your passport was issued must include a month',
      },
      {
        fieldId: 'year',
        message: 'The date your passport was issued must include a year',
      },
    ]);
  });

  it('should return an empty array if the form is valid', () => {
    component.searchForm.patchValue(SEARCH_STATE_MOCK);
    const result = component['getFormErrors'](component.searchForm);

    expect(result).toEqual([]);
  });

  it('should return an array of error summary entries for invalid form controls', () => {
    const result = component['getFormErrors'](component.searchForm);
    expect(result).toEqual(FORM_ERROR_SUMMARY_MOCK);
  });

  it('should return an array of error summary entries for nested form group controls', () => {
    component['fieldErrors'] = {
      street: {
        required: {
          message: 'Street is required',
          priority: 1,
        },
      },
      city: {
        required: {
          message: 'City is required',
          priority: 1,
        },
      },
    };

    component.searchForm = new FormGroup({
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
      }),
    });

    fixture.detectChanges();

    const result = component['getFormErrors'](component.searchForm);

    expect(result).toEqual([
      { fieldId: 'street', message: 'Street is required', type: 'required', priority: 1 },
      { fieldId: 'city', message: 'City is required', type: 'required', priority: 1 },
    ]);
  });

  it('should set initial form error messages to null for each form control', () => {
    component['setInitialErrorMessages'](component.searchForm);

    expect(component.formControlErrorMessages['court']).toBeNull();
    expect(component.formControlErrorMessages['surname']).toBeNull();
    expect(component.formErrorSummaryMessage.length).toBe(0);
  });

  it('should test scrollTo', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'scroll');

    component.scrollTo('court');

    expect(component['scroll']).toHaveBeenCalled();
  });

  it('should test scroll', () => {
    // TODO: add tests/expects for the error label so scroll is being tested
    const fieldElement = document.getElementById('niNumber') as HTMLElement;
    const labelElement = document.querySelector('label[for=niNumber]') as HTMLInputElement;
    spyOn(fieldElement, 'focus');
    spyOn(labelElement, 'scrollIntoView');

    component['scroll']('niNumber');

    expect(fieldElement.focus).toHaveBeenCalled();
    expect(labelElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should test scroll when fieldElement is undefined', () => {
    const fieldElement = document.getElementById('niNumber') as HTMLElement;
    const labelElement = document.querySelector('label[for=niNumber]') as HTMLInputElement;
    spyOn(fieldElement, 'focus');
    spyOn(labelElement, 'scrollIntoView');

    component['scroll']('test');

    expect(fieldElement.focus).not.toHaveBeenCalled();
    expect(labelElement.scrollIntoView).not.toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should split form errors into clean and removed form errors', () => {
    const fieldIds = ['monthOfYear', 'dayOfMonth', 'year'];
    const formErrors: IFormError[] = FORM_ERROR_SUMMARY_MOCK;

    const [cleanFormErrors, removedFormErrors] = component['splitFormErrors'](fieldIds, formErrors);

    expect(cleanFormErrors).toEqual([FORM_ERROR_SUMMARY_MOCK[0]]);

    expect(removedFormErrors).toEqual([
      FORM_ERROR_SUMMARY_MOCK[1],
      FORM_ERROR_SUMMARY_MOCK[2],
      FORM_ERROR_SUMMARY_MOCK[3],
    ]);
  });
  it('should return the highest priority form errors', () => {
    const formErrors: IFormError[] = [
      FORM_ERROR_SUMMARY_MOCK[0],
      { ...FORM_ERROR_SUMMARY_MOCK[1], priority: 2 },
      { ...FORM_ERROR_SUMMARY_MOCK[2], priority: 2 },
      { ...FORM_ERROR_SUMMARY_MOCK[3], priority: 2 },
    ];

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual([FORM_ERROR_SUMMARY_MOCK[0]]);
  });

  it('should return an empty array if formErrors is empty', () => {
    const formErrors: IFormError[] = [];

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual([]);
  });

  it('should return all form errors if they have the same priority', () => {
    const formErrors: IFormError[] = FORM_ERROR_SUMMARY_MOCK;

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual(formErrors);
  });

  it('should manipulate the form error message for specified fields', () => {
    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'required';
    const formErrors: IFormError[] = FORM_ERROR_SUMMARY_MOCK;

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual([
      FORM_ERROR_SUMMARY_MOCK[0],
      { ...FORM_ERROR_SUMMARY_MOCK[1], message: messageOverride },
      { ...FORM_ERROR_SUMMARY_MOCK[2], message: messageOverride },
      { ...FORM_ERROR_SUMMARY_MOCK[3], message: messageOverride },
    ]);
  });

  it('should not manipulate the form error message if the error type does not match', () => {
    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'maxLength';
    const formErrors: IFormError[] = FORM_ERROR_SUMMARY_MOCK;

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual(formErrors);
  });

  it('should return an empty array if formErrors is empty', () => {
    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'required';
    const formErrors: IFormError[] = [];

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual([]);
  });

  it('should handle date input form errors', () => {
    const errorSummary: IFormError[] = FORM_ERROR_SUMMARY_MOCK;
    const messageOverride = 'Please enter a DOB';

    const result = component['handleDateInputFormErrors'](errorSummary);

    expect(result).toEqual([
      FORM_ERROR_SUMMARY_MOCK[0],
      { ...FORM_ERROR_SUMMARY_MOCK[1], message: messageOverride },
      { ...FORM_ERROR_SUMMARY_MOCK[2], message: messageOverride },
      { ...FORM_ERROR_SUMMARY_MOCK[3], message: messageOverride },
    ]);
  });

  it('should return an empty array if the form control does not have a field error', () => {
    component.searchForm = new FormGroup({
      test: new FormControl(null, Validators.required),
    });
    const result = component['getFormErrors'](component.searchForm);

    expect(result).toEqual([]);
  });

  it('should return the indices of form error summary messages for given field IDs', () => {
    const fieldIds = ['dayOfMonth', 'monthOfYear', 'year'];
    const formErrorSummaryMessage: IFormErrorSummaryMessage[] = FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([0, 1, 2]);
  });

  it('should return an empty array if no form error summary messages match the field IDs', () => {
    const fieldIds = ['surname', 'address', 'phone'];
    const formErrorSummaryMessage: IFormErrorSummaryMessage[] = FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([]);
  });
  it('should return the indices of form error summary messages for given field IDs', () => {
    const fieldIds = ['dayOfMonth', 'monthOfYear', 'year'];
    const formErrorSummaryMessage: IFormErrorSummaryMessage[] = FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([0, 1, 2]);
  });

  it('should return an empty array if no form error summary messages match the field IDs', () => {
    const fieldIds = ['surname', 'address', 'phone'];
    const formErrorSummaryMessage: IFormErrorSummaryMessage[] = FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([]);
  });

  it('should return the indices of form error summary messages to remove for date fields', () => {
    component.formErrorSummaryMessage = FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([1, 2]);
  });

  it('should return the indices of form error summary messages to remove for date fields when only two fields are present', () => {
    component.formErrorSummaryMessage = FORM_DATE_ERROR_SUMMARY_MOCK.slice(0, 2);

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([1]);
  });

  it('should return an empty array if no form error summary messages to remove for date fields', () => {
    component.formErrorSummaryMessage = [];

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([]);
  });
});
