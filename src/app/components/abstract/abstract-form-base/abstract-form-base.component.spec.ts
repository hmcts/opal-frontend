import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractFormBaseComponent } from './abstract-form-base.component';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IAbstractFormBaseFieldError } from './interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFormError } from './interfaces/abstract-form-base-form-error.interface';
import { IAbstractFormBaseFormErrorSummaryMessage } from './interfaces/abstract-form-base-form-error-summary-message.interface';
import { ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK } from './mocks/abstract-form-base-form-control-error.mock';
import { ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK } from './mocks/abstract-form-base-form-date-error-summary.mock';
import { ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK } from './mocks/abstract-form-base-form-error-summary.mock';
import { ABSTRACT_FORM_BASE_FORM_STATE_MOCK } from './mocks/abstract-form-base-form-state.mock';
import { ABSTRACT_FORM_BASE_FIELD_ERRORS } from './constants/abstract-form-base-field-errors';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IAbstractFormArrayControlValidation } from '../interfaces/abstract-form-array-control-validation.interface';

class TestAbstractFormBaseComponent extends AbstractFormBaseComponent {
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
      alias: new FormArray([]),
    });
  }
}

describe('AbstractFormBaseComponent', () => {
  let component: TestAbstractFormBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractFormBaseComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractFormBaseComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractFormBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form when handleClearForm is called', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    spyOn(component.form, 'reset');
    component.handleClearForm();
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('should scroll to the label and focus the field when testScroll is called', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

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
    if (!component) {
      fail('component returned null');
      return;
    }

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
    if (!component) {
      fail('component returned null');
      return;
    }

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
    if (!component) {
      fail('component returned null');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'scroll');

    component.scrollTo('forename');

    expect(component['scroll']).toHaveBeenCalled();
  });

  it('should return the highest priority error', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IAbstractFormBaseFieldError = ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toEqual({ ...fieldErrors['minLength'], type: 'minLength' });
  });

  it('should return null if errorKeys is empty', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const errorKeys: string[] = [];
    const fieldErrors: IAbstractFormBaseFieldError = ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);
    expect(result).toBe(null);
  });

  it('should return null if fieldErrors is empty', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IAbstractFormBaseFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
  });

  it('should return null if nothing is not passed in', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const result = component['getHighestPriorityError']();

    expect(result).toBe(null);
  });

  it('should return null if errorKeys and fieldErrors are empty', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const errorKeys: string[] = [];
    const fieldErrors: IAbstractFormBaseFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
  });

  it('should return an array of error summary entries for nested form group controls', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

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
    if (!component) {
      fail('component returned null');
      return;
    }

    component['rePopulateForm'](ABSTRACT_FORM_BASE_FORM_STATE_MOCK);
    expect(component.form.value.forename).toBe('Test');
  });

  it('should remove error summary messages', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK.slice(0, 1);

    component['removeErrorSummaryMessages'](component.formErrorSummaryMessage, [1]);

    expect(component.formErrorSummaryMessage.length).toBe(1);
  });

  it('should return the indices of form error summary messages for given field IDs', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fieldIds = ['dayOfMonth', 'monthOfYear', 'year'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([0, 1, 2]);
  });

  it('should return an empty array if no form error summary messages match the field IDs', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fieldIds = ['surname', 'address', 'phone'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([]);
  });
  it('should return the indices of form error summary messages for given field IDs', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fieldIds = ['dayOfMonth', 'monthOfYear', 'year'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([0, 1, 2]);
  });

  it('should return an empty array if no form error summary messages match the field IDs', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fieldIds = ['surname', 'address', 'phone'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([]);
  });

  it('should return the indices of form error summary messages to remove for date fields', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([1, 2]);
  });

  it('should return the indices of form error summary messages to remove for date fields when only two fields are present', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK.slice(0, 2);

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([1]);
  });

  it('should return an empty array if no form error summary messages to remove for date fields', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.formErrorSummaryMessage = [];

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([]);
  });

  it('should set the error messages', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const errorSummaryEntry: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

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
    if (!component) {
      fail('component returned null');
      return;
    }

    component['setInitialErrorMessages']();

    expect(component.formControlErrorMessages['forename']).toBeNull();
    expect(component.formControlErrorMessages['surname']).toBeNull();
    expect(component.formErrorSummaryMessage.length).toBe(0);
  });

  it('should return an empty array if the form is valid', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.form.patchValue(ABSTRACT_FORM_BASE_FORM_STATE_MOCK);
    const result = component['getFormErrors'](component.form);

    expect(result).toEqual([]);
  });

  it('should return an empty array if the form control does not have a field error', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const invalidField = new FormGroup({
      test: new FormControl(null, Validators.required),
    });
    const result = component['getFormErrors'](invalidField);

    expect(result).toEqual([]);
  });

  it('should return an empty array if the form array does not have any field errors', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formArray = new FormArray([
      new FormGroup({
        test: new FormControl(null, Validators.required),
      }),
      new FormGroup({
        test: new FormControl('valid value'),
      }),
    ]);

    const formGroup = new FormGroup({
      formArray: formArray,
    });

    const result = component['getFormErrors'](formGroup);

    expect(result).toEqual([]);
  });

  it('should handle FormArray containing non-FormGroup controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formArray = new FormArray([
      new FormControl(null, Validators.required),
      new FormGroup({
        test: new FormControl('valid value'),
      }),
    ]);

    const formGroup = new FormGroup({
      formArray: formArray,
    });

    const result = component['getFormErrors'](formGroup);

    expect(result).toEqual([]);
  });

  it('should return the error summary entries', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component['fieldErrors'] = ABSTRACT_FORM_BASE_FIELD_ERRORS;
    const errorMessage = component['getFieldErrorDetails'](['court']);
    const expectedResp = { message: 'Select a court', priority: 1, type: 'required' };

    expect(errorMessage).toEqual(expectedResp);
  });

  it('should return null as no control error', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    expect(component['getFieldErrorDetails'](['surname'])).toBeNull();
  });

  it('should manipulate the form error message for specified fields', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'required';
    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual([
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0],
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[1], message: messageOverride },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[2], message: messageOverride },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[3], message: messageOverride },
    ]);
  });

  it('should not manipulate the form error message if the error type does not match', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'maxLength';
    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual(formErrors);
  });

  it('should return an empty array if formErrors is empty', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'required';
    const formErrors: IAbstractFormBaseFormError[] = [];

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual([]);
  });

  it('should handle date input form errors', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.formErrors = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;
    const messageOverride = 'Please enter a DOB';

    const result = component['handleDateInputFormErrors']();

    expect(result).toEqual([
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0],
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[1], message: messageOverride },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[2], message: messageOverride },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[3], message: messageOverride },
    ]);
  });

  it('should return the highest priority form errors', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formErrors: IAbstractFormBaseFormError[] = [
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0],
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[1], priority: 2 },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[2], priority: 2 },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[3], priority: 2 },
    ];

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual([ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0]]);
  });

  it('should return an empty array if formErrors is empty', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formErrors: IAbstractFormBaseFormError[] = [];

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual([]);
  });

  it('should return all form errors if they have the same priority', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual(formErrors);
  });

  it('should split form errors into clean and removed form errors', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fieldIds = ['monthOfYear', 'dayOfMonth', 'year'];
    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const [cleanFormErrors, removedFormErrors] = component['splitFormErrors'](fieldIds, formErrors);

    expect(cleanFormErrors).toEqual([ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0]]);

    expect(removedFormErrors).toEqual([
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[1],
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[2],
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[3],
    ]);
  });

  it('should emit form submit event with form value', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formValue = ABSTRACT_FORM_BASE_FORM_STATE_MOCK;
    component['rePopulateForm'](formValue);

    component['handleErrorMessages']();

    expect(component.formControlErrorMessages).toEqual({});
    expect(component.formErrorSummaryMessage).toEqual([]);
  });

  it('should navigate to account-details page on handleRoute', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should navigate to relative route', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test', true);
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should navigate to relative route with event', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should test hasUnsavedChanges', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component['formSubmitted'] = false;
    expect(component['hasUnsavedChanges']()).toBe(false);

    component.form.controls['surname'].markAsDirty();
    component['formSubmitted'] = true;
    expect(component['hasUnsavedChanges']()).toBe(false);

    component['formSubmitted'] = false;
    expect(component['hasUnsavedChanges']()).toBe(true);
  });

  it('should set the value of the form control and mark it as touched', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const testValue = 'newValue';
    const controlName = 'surname';

    // Set the input value
    component['setInputValue'](testValue, controlName);

    // Check updated state
    expect(component.form.controls[controlName].value).toBe(testValue);
    expect(component.form.controls[controlName].touched).toBeTrue();
  });

  it('should add controls to a form group', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const formGroup = new FormGroup({});
    const controls: IAbstractFormArrayControlValidation[] = [
      { controlName: 'firstName', validators: [] },
      { controlName: 'lastName', validators: [] },
    ];
    const index = 0;

    component['addControlsToFormGroup'](formGroup, controls, index);

    fixture.detectChanges();

    expect(formGroup.get('firstName_0')).toBeInstanceOf(FormControl);
    expect(formGroup.get('lastName_0')).toBeInstanceOf(FormControl);
  });

  it('should remove control name errors', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.formControlErrorMessages = {
      court: 'test message',
    };

    component['removeControlErrors']('court');

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should create a new control with the given control name and validators', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const controlName = 'testControl';
    const validators: ValidatorFn[] = [Validators.required];

    component['createControl'](controlName, validators);

    expect(component.form.get(controlName)).toBeTruthy();
    expect(component.form.get(controlName)?.value).toBeNull();
    expect(component.form.get(controlName)?.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should remove a control from the form', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const controlName = 'surname';
    component.formControlErrorMessages = { surname: 'Please enter a surname' };
    component['removeControl'](controlName);
    expect(component.form.get(controlName)).toBeNull();
  });

  it('should create a form control with the specified validators and initial value', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const validators = [Validators.required];
    const initialValue = 'Test';

    const formControl = component['createFormControl'](validators, initialValue);

    expect(formControl).toBeInstanceOf(FormControl);
    expect(formControl.value).toBe(initialValue);
    expect(formControl.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should create a form control with default initial value of null', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const validators = [Validators.required];

    const formControl = component['createFormControl'](validators);

    expect(formControl).toBeInstanceOf(FormControl);
    expect(formControl.value).toBeNull();
    expect(formControl.hasValidator(Validators.required)).toBeTruthy();
  });
});
