import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormComponent } from './search-form.component';
import { AUTO_COMPLETE_ITEMS_MOCK, FORM_CONTROL_ERROR_MOCK, FORM_ERROR_SUMMARY_MOCK, SEARCH_STATE_MOCK } from '@mocks';
import { IFormControlError, IFormErrorSummaryEntry } from '@interfaces';
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

    component.ngOnInit();

    expect(component['setupSearchForm']).toHaveBeenCalled();
    expect(component['rePopulateSearchForm']).toHaveBeenCalled();
  });

  it('should return the highest priority error', () => {
    const component = new SearchFormComponent();
    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IFormControlError = FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toEqual(fieldErrors['minLength']);
  });

  it('should return null if errorKeys is empty', () => {
    const component = new SearchFormComponent();
    const errorKeys: string[] = [];
    const fieldErrors: IFormControlError = FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);
    expect(result).toBeUndefined();
  });

  it('should return null if fieldErrors is empty', () => {
    const component = new SearchFormComponent();
    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IFormControlError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBeUndefined();
  });

  it('should return null if errorKeys and fieldErrors are empty', () => {
    const component = new SearchFormComponent();
    const errorKeys: string[] = [];
    const fieldErrors: IFormControlError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBeUndefined();
  });

  it('should return the error summary entries', () => {
    const errorMessage = component['getFieldErrorMessages'](['court']);
    expect(errorMessage).toBe(component['fieldErrors']['court']['required']['message']);
  });

  it('should return null as no control error', () => {
    expect(component['getFieldErrorMessages'](['surname'])).toBeNull();
  });

  it('should build field error messages', () => {
    const errorSummaryEntry: IFormErrorSummaryEntry[] = FORM_ERROR_SUMMARY_MOCK;

    component['buildFieldErrorMessages'](errorSummaryEntry);

    expect(component.formErrorMessages['court']).toBe('Court error');
    expect(component.formErrorMessages['surname']).toBe('Surname error');
  });

  it('should return an empty array if the form is valid', () => {
    component.searchForm.patchValue(SEARCH_STATE_MOCK);
    const result = component['getErrorSummary'](component.searchForm);

    expect(result).toEqual([]);
  });

  it('should return an array of error summary entries for invalid form controls', () => {
    const result = component['getErrorSummary'](component.searchForm);
    expect(result).toEqual([{ fieldId: 'court', message: component['fieldErrors']['court']['required']['message'] }]);
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

    const result = component['getErrorSummary'](component.searchForm);

    expect(result).toEqual([
      { fieldId: 'street', message: 'Street is required' },
      { fieldId: 'city', message: 'City is required' },
    ]);
  });

  it('should set initial form error messages to null for each form control', () => {
    component['setInitialFormErrorMessages'](component.searchForm);

    expect(component.formErrorMessages['court']).toBeNull();
    expect(component.formErrorMessages['surname']).toBeNull();
  });
});
