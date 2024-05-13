import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormComponent } from './search-form.component';
import { AUTO_COMPLETE_ITEMS_MOCK, FORM_CONTROL_ERROR_MOCK, FORM_ERROR_SUMMARY_MOCK, SEARCH_STATE_MOCK } from '@mocks';
import { IFieldError, IFormError } from '@interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';

fdescribe('SearchFormComponent', () => {
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
    console.log(result);
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

    console.log(component['formControlErrorMessages']);

    expect(component.formControlErrorMessages['court']).toBeNull();
    expect(component.formControlErrorMessages['surname']).toBeNull();
    expect(component.formErrorSummaryMessage.length).toBe(0);
  });

  it('should test scroll', () => {
    // TODO: add tests/expects for the error label so scroll is being tested
    const fieldElement = document.getElementById('court') as HTMLElement;
    spyOn(fieldElement, 'focus');

    component.scroll('court');

    expect(fieldElement.focus).toHaveBeenCalled();
  });
});
