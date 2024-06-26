import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBaseComponent } from './form-base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FORM_CONTROL_ERROR_MOCK,
  FORM_DATE_ERROR_SUMMARY_MOCK,
  FORM_ERROR_SUMMARY_MOCK,
  SEARCH_STATE_MOCK,
} from '@mocks';
import { IFieldError, IFormError, IFormErrorSummaryMessage } from '@interfaces';
import { ACCOUNT_ENQUIRY_SEARCH_FORM_FIELD_ERRORS } from '@constants';
import { MacStateService } from '@services';

class TestFormBaseComponent extends FormBaseComponent {
  constructor() {
    super();
    this.form = new FormGroup({
      court: new FormControl(null, [Validators.required]),
      surname: new FormControl(null),
      forename: new FormControl(null),
      initials: new FormControl(null),
      dateOfBirth: new FormGroup({
        dayOfMonth: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
        monthOfYear: new FormControl(null, [Validators.required]),
        year: new FormControl(null, [Validators.required]),
      }),
      addressLine: new FormControl(null),
      niNumber: new FormControl(null),
      pcr: new FormControl(null),
    });
  }
}

describe('FormBaseComponent', () => {
  let component: TestFormBaseComponent;
  let fixture: ComponentFixture<TestFormBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFormBaseComponent],
      providers: [MacStateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFormBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form when handleClearForm is called', () => {
    spyOn(component.form, 'reset');
    component.handleClearForm();
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('should scroll to the label and focus the field when testScroll is called', () => {
    const fieldId = 'testField';
    const fieldElement = document.createElement('input');
    fieldElement.id = fieldId;
    document.body.appendChild(fieldElement);

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', fieldId);
    document.body.appendChild(labelElement);

    spyOn(fieldElement, 'focus');
    spyOn(labelElement, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(labelElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(fieldElement.focus).toHaveBeenCalled();

    document.body.removeChild(fieldElement);
    document.body.removeChild(labelElement);
  });

  it('should scroll to the govuk-fieldset__legend if no label for fieldId is found', () => {
    const fieldId = 'testField';
    const fieldElement = document.createElement('input');
    fieldElement.id = fieldId;
    document.body.appendChild(fieldElement);

    const legendElement = document.createElement('div');
    legendElement.classList.add('govuk-fieldset__legend');
    fieldElement.appendChild(legendElement);

    spyOn(fieldElement, 'focus');
    spyOn(legendElement, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(legendElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(fieldElement.focus).toHaveBeenCalled();

    document.body.removeChild(fieldElement);
  });

  it('should scroll to label[for=fieldId-autocomplete] if present', () => {
    const fieldId = 'testField';
    const fieldElement = document.createElement('input');
    fieldElement.id = `${fieldId}-autocomplete`;
    document.body.appendChild(fieldElement);

    const autocompleteLabelElement = document.createElement('label');
    autocompleteLabelElement.setAttribute('for', `${fieldId}-autocomplete`);
    document.body.appendChild(autocompleteLabelElement);

    spyOn(fieldElement, 'focus');
    spyOn(autocompleteLabelElement, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(autocompleteLabelElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(fieldElement.focus).toHaveBeenCalled();

    document.body.removeChild(fieldElement);
    document.body.removeChild(autocompleteLabelElement);
  });

  it('should test scrollTo', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'scroll');

    component.scrollTo('forename');

    expect(component['scroll']).toHaveBeenCalled();
  });

  it('should return the highest priority error', () => {
    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IFieldError = FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toEqual({ ...fieldErrors['minLength'], type: 'minLength' });
  });

  it('should return null if errorKeys is empty', () => {
    const errorKeys: string[] = [];
    const fieldErrors: IFieldError = FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);
    expect(result).toBe(null);
  });

  it('should return null if fieldErrors is empty', () => {
    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
  });

  it('should return null if nothing is not passed in', () => {
    const result = component['getHighestPriorityError']();

    expect(result).toBe(null);
  });

  it('should return null if errorKeys and fieldErrors are empty', () => {
    const errorKeys: string[] = [];
    const fieldErrors: IFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
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

    component.form = new FormGroup({
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
      }),
    });

    fixture.detectChanges();

    const result = component['getFormErrors'](component.form);

    expect(result).toEqual([
      { fieldId: 'street', message: 'Street is required', type: 'required', priority: 1 },
      { fieldId: 'city', message: 'City is required', type: 'required', priority: 1 },
    ]);
  });

  it('should repopulate the form', () => {
    component['rePopulateForm'](SEARCH_STATE_MOCK);
    expect(component.form.value.forename).toBe('Test');
  });

  it('should remove error summary messages', () => {
    component.formErrorSummaryMessage = FORM_DATE_ERROR_SUMMARY_MOCK.slice(0, 1);

    component['removeErrorSummaryMessages'](component.formErrorSummaryMessage, [1]);

    expect(component.formErrorSummaryMessage.length).toBe(1);
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

  it('should set initial form error messages to null for each form control', () => {
    component['setInitialErrorMessages']();

    expect(component.formControlErrorMessages['forename']).toBeNull();
    expect(component.formControlErrorMessages['surname']).toBeNull();
    expect(component.formErrorSummaryMessage.length).toBe(0);
  });

  it('should return an empty array if the form is valid', () => {
    component.form.patchValue(SEARCH_STATE_MOCK);
    const result = component['getFormErrors'](component.form);

    expect(result).toEqual([]);
  });

  it('should return an empty array if the form control does not have a field error', () => {
    const invalidField = new FormGroup({
      test: new FormControl(null, Validators.required),
    });
    const result = component['getFormErrors'](invalidField);

    expect(result).toEqual([]);
  });

  it('should return the error summary entries', () => {
    component['fieldErrors'] = ACCOUNT_ENQUIRY_SEARCH_FORM_FIELD_ERRORS;
    const errorMessage = component['getFieldErrorDetails'](['court']);
    const expectedResp = { message: 'Select a court', priority: 1, type: 'required' };

    expect(errorMessage).toEqual(expectedResp);
  });

  it('should return null as no control error', () => {
    expect(component['getFieldErrorDetails'](['surname'])).toBeNull();
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
    component.formErrors = FORM_ERROR_SUMMARY_MOCK;
    const messageOverride = 'Please enter a DOB';

    const result = component['handleDateInputFormErrors']();

    expect(result).toEqual([
      FORM_ERROR_SUMMARY_MOCK[0],
      { ...FORM_ERROR_SUMMARY_MOCK[1], message: messageOverride },
      { ...FORM_ERROR_SUMMARY_MOCK[2], message: messageOverride },
      { ...FORM_ERROR_SUMMARY_MOCK[3], message: messageOverride },
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

  it('should emit form submit event with form value', () => {
    const formValue = SEARCH_STATE_MOCK;
    component['rePopulateForm'](formValue);

    component['handleErrorMessages']();

    expect(component.formControlErrorMessages).toEqual({});
    expect(component.formErrorSummaryMessage).toEqual([]);
  });

  it('should navigate to account-details page on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should test hasUnsavedChanges', () => {
    component['formSubmitted'] = false;
    expect(component['hasUnsavedChanges']()).toBe(false);

    component.form.controls['surname'].markAsDirty();
    component['formSubmitted'] = true;
    expect(component['hasUnsavedChanges']()).toBe(false);

    component['formSubmitted'] = false;
    expect(component['hasUnsavedChanges']()).toBe(true);
  });

  it('should set the value of the form control and mark it as touched', () => {
    const testValue = 'newValue';
    const controlName = 'surname';

    // Set the input value
    component['setInputValue'](testValue, controlName);

    // Check updated state
    expect(component.form.controls[controlName].value).toBe(testValue);
    expect(component.form.controls[controlName].touched).toBeTrue();
  });
});
