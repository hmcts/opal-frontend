import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractFormBaseComponent } from './abstract-form-base.component';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFormArrayControlValidation,
  IAbstractFormBaseFormArrayControls,
  IAbstractFormBaseFormControlErrorMessage,
  IAbstractFormBaseFormError,
  IAbstractFormBaseFormErrorSummaryMessage,
} from './interfaces';
import {
  ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK,
  ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK,
  ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK,
  ABSTRACT_FORM_BASE_FORM_STATE_MOCK,
} from './mocks';
import { ABSTRACT_FORM_BASE_FIELD_ERRORS } from './constants';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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
  let component: TestAbstractFormBaseComponent;
  let fixture: ComponentFixture<TestAbstractFormBaseComponent>;

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
    const fieldErrors: IAbstractFormBaseFieldError = ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toEqual({ ...fieldErrors['minLength'], type: 'minLength' });
  });

  it('should return null if errorKeys is empty', () => {
    const errorKeys: string[] = [];
    const fieldErrors: IAbstractFormBaseFieldError = ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);
    expect(result).toBe(null);
  });

  it('should return null if fieldErrors is empty', () => {
    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IAbstractFormBaseFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
  });

  it('should return null if nothing is not passed in', () => {
    const result = component['getHighestPriorityError']();

    expect(result).toBe(null);
  });

  it('should return null if errorKeys and fieldErrors are empty', () => {
    const errorKeys: string[] = [];
    const fieldErrors: IAbstractFormBaseFieldError = {};

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
    component['rePopulateForm'](ABSTRACT_FORM_BASE_FORM_STATE_MOCK);
    expect(component.form.value.forename).toBe('Test');
  });

  it('should remove error summary messages', () => {
    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK.slice(0, 1);

    component['removeErrorSummaryMessages'](component.formErrorSummaryMessage, [1]);

    expect(component.formErrorSummaryMessage.length).toBe(1);
  });

  it('should return the indices of form error summary messages for given field IDs', () => {
    const fieldIds = ['dayOfMonth', 'monthOfYear', 'year'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([0, 1, 2]);
  });

  it('should return an empty array if no form error summary messages match the field IDs', () => {
    const fieldIds = ['surname', 'address', 'phone'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([]);
  });
  it('should return the indices of form error summary messages for given field IDs', () => {
    const fieldIds = ['dayOfMonth', 'monthOfYear', 'year'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([0, 1, 2]);
  });

  it('should return an empty array if no form error summary messages match the field IDs', () => {
    const fieldIds = ['surname', 'address', 'phone'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([]);
  });

  it('should return the indices of form error summary messages to remove for date fields', () => {
    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([1, 2]);
  });

  it('should return the indices of form error summary messages to remove for date fields when only two fields are present', () => {
    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK.slice(0, 2);

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([1]);
  });

  it('should return an empty array if no form error summary messages to remove for date fields', () => {
    component.formErrorSummaryMessage = [];

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([]);
  });

  it('should set the error messages', () => {
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
    component['setInitialErrorMessages']();

    expect(component.formControlErrorMessages['forename']).toBeNull();
    expect(component.formControlErrorMessages['surname']).toBeNull();
    expect(component.formErrorSummaryMessage.length).toBe(0);
  });

  it('should return an empty array if the form is valid', () => {
    component.form.patchValue(ABSTRACT_FORM_BASE_FORM_STATE_MOCK);
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

  it('should return an empty array if the form array does not have any field errors', () => {
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
    component['fieldErrors'] = ABSTRACT_FORM_BASE_FIELD_ERRORS;
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
    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'maxLength';
    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual(formErrors);
  });

  it('should return an empty array if formErrors is empty', () => {
    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'required';
    const formErrors: IAbstractFormBaseFormError[] = [];

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual([]);
  });

  it('should handle date input form errors', () => {
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
    const formErrors: IAbstractFormBaseFormError[] = [];

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual([]);
  });

  it('should return all form errors if they have the same priority', () => {
    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual(formErrors);
  });

  it('should split form errors into clean and removed form errors', () => {
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
    const formValue = ABSTRACT_FORM_BASE_FORM_STATE_MOCK;
    component['rePopulateForm'](formValue);

    component['handleErrorMessages']();

    expect(component.formControlErrorMessages).toEqual({});
    expect(component.formErrorSummaryMessage).toEqual([]);
  });

  it('should navigate to account-details page on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should navigate to relative route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test', true);
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should navigate to relative route with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
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

  it('should add controls to a form group', () => {
    const formGroup = new FormGroup({});
    const controls: IAbstractFormBaseFormArrayControlValidation[] = [
      { controlName: 'firstName', validators: [] },
      { controlName: 'lastName', validators: [] },
    ];
    const index = 0;

    component['addControlsToFormGroup'](formGroup, controls, index);

    fixture.detectChanges();

    expect(formGroup.get('firstName_0')).toBeInstanceOf(FormControl);
    expect(formGroup.get('lastName_0')).toBeInstanceOf(FormControl);
  });

  it('should remove the form array control at the specified index', () => {
    const index = 1;
    const formArrayControls: IAbstractFormBaseFormArrayControls[] = [
      {
        firstNames: {
          inputId: 'firstNames_0',
          inputName: 'firstNames_0',
          controlName: 'firstNames_0',
        },
        lastName: {
          inputId: 'lastName_0',
          inputName: 'lastName_0',
          controlName: 'lastName_0',
        },
      },
      {
        firstNames: {
          inputId: 'firstNames_1',
          inputName: 'firstNames_1',
          controlName: 'firstNames_1',
        },
        lastName: {
          inputId: 'lastName_1',
          inputName: 'lastName_1',
          controlName: 'lastName_1',
        },
      },
    ];
    const expectedFormArrayControls: IAbstractFormBaseFormArrayControls[] = [
      {
        firstNames: {
          inputId: 'firstNames_0',
          inputName: 'firstNames_0',
          controlName: 'firstNames_0',
        },
        lastName: {
          inputId: 'lastName_0',
          inputName: 'lastName_0',
          controlName: 'lastName_0',
        },
      },
    ];

    const result = component['removeFormArrayControl'](index, formArrayControls);

    expect(result).toEqual(expectedFormArrayControls);
  });

  it('should create form controls based on the given fields and index', () => {
    const fields = ['field1', 'field2', 'field3'];
    const index = 0;

    const result = component['createControls'](fields, index);

    expect(result).toEqual({
      field1: {
        inputId: 'field1_0',
        inputName: 'field1_0',
        controlName: 'field1_0',
      },
      field2: {
        inputId: 'field2_0',
        inputName: 'field2_0',
        controlName: 'field2_0',
      },
      field3: {
        inputId: 'field3_0',
        inputName: 'field3_0',
        controlName: 'field3_0',
      },
    });
  });

  it('should build form array controls with the given form control count, form array name, field names, and control validation', () => {
    const formControlCount = [0, 1, 2];
    const formArrayName = 'alias';
    const fieldNames = ['field1', 'field2', 'field3'];
    const controlValidation = [
      { controlName: 'field1', validators: [Validators.required] },
      { controlName: 'field2', validators: [Validators.maxLength(10)] },
      { controlName: 'field3', validators: [Validators.pattern('[a-zA-Z]*')] },
    ];

    const result = component['buildFormArrayControls'](formControlCount, formArrayName, fieldNames, controlValidation);

    expect(result).toEqual([
      {
        field1: {
          inputId: 'field1_0',
          inputName: 'field1_0',
          controlName: 'field1_0',
        },
        field2: {
          inputId: 'field2_0',
          inputName: 'field2_0',
          controlName: 'field2_0',
        },
        field3: {
          inputId: 'field3_0',
          inputName: 'field3_0',
          controlName: 'field3_0',
        },
      },
      {
        field1: {
          inputId: 'field1_1',
          inputName: 'field1_1',
          controlName: 'field1_1',
        },
        field2: {
          inputId: 'field2_1',
          inputName: 'field2_1',
          controlName: 'field2_1',
        },
        field3: {
          inputId: 'field3_1',
          inputName: 'field3_1',
          controlName: 'field3_1',
        },
      },
      {
        field1: {
          inputId: 'field1_2',
          inputName: 'field1_2',
          controlName: 'field1_2',
        },
        field2: {
          inputId: 'field2_2',
          inputName: 'field2_2',
          controlName: 'field2_2',
        },
        field3: {
          inputId: 'field3_2',
          inputName: 'field3_2',
          controlName: 'field3_2',
        },
      },
    ]);
  });

  it('should remove all form array controls and clear error messages', () => {
    // Arrange
    const formArrayName = 'aliases';
    const fieldNames = ['firstNames', 'lastName'];
    const formArrayControls: IAbstractFormBaseFormArrayControls[] = [
      {
        firstNames: {
          inputId: 'firstNames_0',
          inputName: 'firstNames_0',
          controlName: 'firstNames_0',
        },
        lastName: {
          inputId: 'lastName_0',
          inputName: 'lastName_0',
          controlName: 'lastName_0',
        },
      },
      {
        firstNames: {
          inputId: 'firstNames_1',
          inputName: 'firstNames_1',
          controlName: 'firstNames_1',
        },
        lastName: {
          inputId: 'lastName_1',
          inputName: 'lastName_1',
          controlName: 'lastName_1',
        },
      },
    ];
    component.form = new FormGroup({
      aliases: new FormArray([
        new FormGroup({
          firstNames: new FormControl(null),
          lastName: new FormControl(null),
        }),
        new FormGroup({
          firstNames: new FormControl(null),
          lastName: new FormControl(null),
        }),
      ]),
    });
    component.formControlErrorMessages = {
      firstNames_0: 'Error 1',
      lastName_0: 'Error 2',
      firstNames_1: 'Error 3',
      lastName_1: 'Error 4',
    };

    // Act
    const result = component['removeAllFormArrayControls'](formArrayControls, formArrayName, fieldNames);

    // Assert
    expect(result).toEqual([]);
    expect(component.form.get(formArrayName)?.value).toEqual([]);
    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should remove control name errors', () => {
    component.formControlErrorMessages = {
      court: 'test message',
    };

    component['removeControlErrors']('court');

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should remove field errors for the specified form array control', () => {
    const index = 0;
    const formArrayControls: IAbstractFormBaseFormArrayControls[] = [
      {
        firstNames: {
          inputId: 'firstNames_0',
          inputName: 'firstNames_0',
          controlName: 'firstNames_0',
        },
        lastName: {
          inputId: 'lastName_0',
          inputName: 'lastName_0',
          controlName: 'lastName_0',
        },
      },
    ];
    const fieldNames = ['firstNames', 'lastName'];
    const errorMessage: IAbstractFormBaseFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormArrayControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should not remove field errors if the form array control does not exist', () => {
    const index = 1;
    const formArrayControls: IAbstractFormBaseFormArrayControls[] = [
      {
        firstNames: {
          inputId: 'firstNames_0',
          inputName: 'firstNames_0',
          controlName: 'firstNames_0',
        },
        lastName: {
          inputId: 'lastName_0',
          inputName: 'lastName_0',
          controlName: 'lastName_0',
        },
      },
    ];
    const fieldNames = ['firstNames', 'lastName'];
    const errorMessage: IAbstractFormBaseFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormArrayControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual(errorMessage);
  });

  it('should add form array controls to the form group', () => {
    const index = 0;
    const formArrayName = 'alias';
    const fieldNames = ['field1', 'field2'];
    const controlValidation = [
      { controlName: 'field1', validators: [Validators.required] },
      { controlName: 'field2', validators: [Validators.maxLength(10)] },
    ];
    const expectedControlObj = {
      field1: { inputId: 'field1_0', inputName: 'field1_0', controlName: 'field1_0' },
      field2: { inputId: 'field2_0', inputName: 'field2_0', controlName: 'field2_0' },
    };

    const controls = component.addFormArrayControls(index, formArrayName, fieldNames, controlValidation);
    const aliasArray = component.form.get('alias') as FormArray;

    expect(controls).toEqual(expectedControlObj);
    expect(aliasArray.at(0).get('field1_0')).toBeInstanceOf(FormControl);
    expect(aliasArray.at(0).get('field2_0')).toBeInstanceOf(FormControl);
  });

  it('should remove the form array control at the specified index', () => {
    const index = 1;
    const formArrayName = 'alias';
    const formArrayControls: IAbstractFormBaseFormArrayControls[] = [
      {
        firstNames: {
          inputId: 'firstNames_0',
          inputName: 'firstNames_0',
          controlName: 'firstNames_0',
        },
        lastName: {
          inputId: 'lastName_0',
          inputName: 'lastName_0',
          controlName: 'lastName_0',
        },
      },
      {
        firstNames: {
          inputId: 'firstNames_1',
          inputName: 'firstNames_1',
          controlName: 'firstNames_1',
        },
        lastName: {
          inputId: 'lastName_1',
          inputName: 'lastName_1',
          controlName: 'lastName_1',
        },
      },
    ];
    const fieldNames = ['firstNames', 'lastName'];
    const errorMessage: IAbstractFormBaseFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
      firstNames_1: 'test message',
      lastName_1: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormArrayControls'](index, formArrayName, formArrayControls, fieldNames);

    expect(formArrayControls.length).toBe(1);

    expect(component.formControlErrorMessages['firstNames_1']).toBeUndefined();
    expect(component.formControlErrorMessages['firstNames_0']).toBeDefined();
  });

  it('should create a new control with the given control name and validators', () => {
    const controlName = 'testControl';
    const validators: ValidatorFn[] = [Validators.required];

    component['createControl'](controlName, validators);

    expect(component.form.get(controlName)).toBeTruthy();
    expect(component.form.get(controlName)?.value).toBeNull();
    expect(component.form.get(controlName)?.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should remove a control from the form', () => {
    const controlName = 'surname';
    component['removeControl'](controlName);
    expect(component.form.get(controlName)).toBeNull();
  });

  it('should create a form control with the specified validators and initial value', () => {
    const validators = [Validators.required];
    const initialValue = 'Test';

    const formControl = component['createFormControl'](validators, initialValue);

    expect(formControl).toBeInstanceOf(FormControl);
    expect(formControl.value).toBe(initialValue);
    expect(formControl.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should create a form control with default initial value of null', () => {
    const validators = [Validators.required];

    const formControl = component['createFormControl'](validators);

    expect(formControl).toBeInstanceOf(FormControl);
    expect(formControl.value).toBeNull();
    expect(formControl.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should create a new FormArray with validators and controls', () => {
    const validators = [Validators.required];
    const controls = [new FormControl('value1'), new FormControl('value2'), new FormControl('value3')];

    const formArray = component['createFormArray'](validators, controls);

    expect(formArray instanceof FormArray).toBe(true);
    expect(formArray.controls.length).toBe(3);
    expect(formArray.controls[0].value).toBe('value1');
    expect(formArray.controls[1].value).toBe('value2');
    expect(formArray.controls[2].value).toBe('value3');
    expect(formArray.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should create a new FormArray with validators and no controls', () => {
    const validators = [Validators.required];

    const formArray = component['createFormArray'](validators);

    expect(formArray instanceof FormArray).toBe(true);
    expect(formArray.controls.length).toBe(0);
    expect(formArray.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should create a new FormArray without validators and controls', () => {
    const formArray = component['createFormArray']([]);

    expect(formArray instanceof FormArray).toBe(true);
    expect(formArray.controls.length).toBe(0);
    expect(formArray.hasValidator(Validators.required)).toBeFalsy();
  });
});
