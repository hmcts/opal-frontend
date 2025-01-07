import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AbstractFormArrayBaseComponent } from './abstract-form-array-base';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IAbstractFormArrayControls } from '../interfaces/abstract-form-array-controls.interface';

class TestAbstractFormArrayBaseComponent extends AbstractFormArrayBaseComponent {
  constructor() {
    super();
    this.form = new FormGroup({
      impositions: new FormArray([]),
    });
  }
}

describe('AbstractFormArrayBaseComponent', () => {
  let component: TestAbstractFormArrayBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractFormArrayBaseComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractFormArrayBaseComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractFormArrayBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.formArrayControls = [];
    component.formArrayControlsValidation = [];
    component.formArrayFields = [];
  });

  afterEach(() => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.ngOnDestroy();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up the form array form controls for the form', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const impositions = [
      {
        result_code_0: 'Test',
        amount_imposed_0: 'Test',
        amount_paid_0: 'Test',
      },
    ];

    component['setupFormArrayFormControls']([...Array(impositions.length).keys()], 'impositions');

    expect(component.formArrayControls.length).toBe(1);
  });

  it('should add controls to the formArrayControls form array', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;

    expect(component.formArrayControls.length).toBe(0);

    component.addControlsToFormArray(index, 'impositions');

    expect(component.formArrayControls.length).toBe(1);
  });

  it('should remove an alias from the formArrayControls form array', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;

    component.addControlsToFormArray(index, 'impositions');
    expect(component.formArrayControls.length).toBe(1);

    component.removeControlsFromFormArray(index, 'impositions');
    expect(component.formArrayControls.length).toBe(0);
  });

  it('should create form controls based on the given fields and index', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fields = ['field1', 'field2', 'field3'];
    const index = 0;

    const result = component['createFormArrayControls'](fields, index);

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

  it('should create a form array with validators and controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const validators: ValidatorFn[] = [Validators.required];
    const controls: FormControl[] = [new FormControl('test')];

    const formArray = component['createFormArray'](validators, controls);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(1);
  });

  it('should create a form array with validators and no controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const validators: ValidatorFn[] = [Validators.required];

    const formArray = component['createFormArray'](validators);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(0);
  });

  it('should create a form array with no validators and controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const controls: FormControl[] = [new FormControl('test')];

    const formArray = component['createFormArray']([], controls);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(1);
  });

  it('should remove specific error messages from formControlErrorMessages for the given form array control', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;

    // Mock form array controls and field names
    component.formArrayControls = [
      {
        field1: { inputId: 'field1_0', inputName: 'field1_0', controlName: 'field1_0' },
        field2: { inputId: 'field2_0', inputName: 'field2_0', controlName: 'field2_0' },
      },
    ];
    const fieldNames = ['field1', 'field2'];

    // Mock formControlErrorMessages with some initial values
    component['formControlErrorMessages'] = {
      field1_0: 'Some error message for field1',
      field2_0: 'Some error message for field2',
    };

    // Call the method to remove the error messages
    component['removeFormArrayControlsErrors'](index, component.formArrayControls, fieldNames);

    // Check that the errors for the specified fields are removed
    expect(component['formControlErrorMessages']['field1_0']).toBeUndefined();
    expect(component['formControlErrorMessages']['field2_0']).toBeUndefined();
  });

  it('should return null when control has no errors', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const controlPath = ['field1'];

    // Create a FormControl without errors
    const mockControl = new FormControl();
    mockControl.setErrors(null);

    // Spy on the form.get method to return the mockControl
    spyOn(component.form, 'get').and.returnValue(mockControl);

    // Call the function
    const result = component['getFieldErrorDetails'](controlPath);

    // Assert that null is returned
    expect(result).toBeNull();
  });

  it('should retrieve field errors when they exist', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const controlPath = ['field1'];

    // Create a FormControl with errors
    const mockControl = new FormControl();
    mockControl.setErrors({ required: true });

    // Mock the fieldErrors with the required structure
    component['fieldErrors'] = {
      field1: { required: { priority: 1, message: 'Field is required' } },
    };

    spyOn(component.form, 'get').and.returnValue(mockControl);

    // Call the function
    const result = component['getFieldErrorDetails'](controlPath);

    // Assert that field errors are returned
    expect(result).toBeTruthy();
    expect(result).toEqual({ priority: 1, message: 'Field is required', type: 'required' });
  });

  it('should remove a form array control from the form array', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formArrayControl: IAbstractFormArrayControls = {
      field1: { inputId: 'field1_0', inputName: 'field1_0', controlName: 'field1_0' },
      field2: { inputId: 'field2_0', inputName: 'field2_0', controlName: 'field2_0' },
    };
    const formArrayName = 'impositions';

    // Mock the formArrayControls and formArrayFields
    component.formArrayControls = [formArrayControl];

    // Call the method to remove the form array control
    component.removeFormArrayControlFromArray(formArrayControl, formArrayName);

    // Check that the form array control is removed
    expect(component.formArrayControls.length).toBe(0);
  });

  it('should remove form array form group control validators', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formControl = new FormControl();
    formControl.setValidators(Validators.required);
    formControl.setValue('test');

    component.removeFormArrayFormGroupControlValidators(formControl);

    expect(formControl.validator).toBeNull();
    expect(formControl.errors).toBeNull();
    expect(formControl.value).toBeNull();
    expect(formControl.valid).toBe(true);
  });

  it('should return the default value if control is null', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const result = component['getControlValueOrDefault'](null, 'default value');
    expect(result).toBe('default value');
  });

  it('should add index to form array data', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const data = [
      { field1: 'value1', field2: 'value2' },
      { field1: 'value3', field2: 'value4' },
    ];

    const result = component.addIndexToFormArrayData(data);

    expect(result).toEqual([
      { field1_0: 'value1', field2_0: 'value2' },
      { field1_1: 'value3', field2_1: 'value4' },
    ]);
  });

  it('should handle undefined values in form array data', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    const data = [
      { field1: 'value1', field2: undefined },
      { field1: undefined, field2: 'value4' },
    ];

    const result = component.addIndexToFormArrayData(data);

    expect(result).toEqual([{ field1_0: 'value1' }, { field2_1: 'value4' }]);
  });
});
