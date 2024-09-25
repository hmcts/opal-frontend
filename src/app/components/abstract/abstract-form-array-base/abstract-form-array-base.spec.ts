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

fdescribe('AbstractFormArrayBaseComponent', () => {
  let component: TestAbstractFormArrayBaseComponent;
  let fixture: ComponentFixture<TestAbstractFormArrayBaseComponent>;

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
    component.formArrayControls = [];
    component.formArrayControlsValidation = [];
    component.formArrayFields = [];
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up the form array form controls for the form', () => {
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
    const index = 0;

    expect(component.formArrayControls.length).toBe(0);

    component.addControlsToFormArray(index, 'impositions');

    expect(component.formArrayControls.length).toBe(1);
  });

  it('should remove an alias from the formArrayControls form array', () => {
    const index = 0;

    component.addControlsToFormArray(index, 'impositions');
    expect(component.formArrayControls.length).toBe(1);

    component.removeControlsFromFormArray(index, 'impositions');
    expect(component.formArrayControls.length).toBe(0);
  });

  it('should remove all form array controls and clear error messages', () => {
    // Arrange
    const formArrayName = 'impositions';
    const fieldNames = ['result_code', 'amount_imposed', 'amount_paid'];
    const formArrayControls: IAbstractFormArrayControls[] = [
      {
        result_code: {
          inputId: 'result_code_0',
          inputName: 'result_code_0',
          controlName: 'result_code_0',
        },
        amount_imposed: {
          inputId: 'amount_imposed_0',
          inputName: 'amount_imposed_0',
          controlName: 'amount_imposed_0',
        },
        amount_paid: {
          inputId: 'amount_paid_0',
          inputName: 'amount_paid_0',
          controlName: 'amount_paid_0',
        },
      },
      {
        result_code: {
          inputId: 'result_code_1',
          inputName: 'result_code_1',
          controlName: 'result_code_1',
        },
        amount_imposed: {
          inputId: 'amount_imposed_1',
          inputName: 'amount_imposed_1',
          controlName: 'amount_imposed_1',
        },
        amount_paid: {
          inputId: 'amount_paid_1',
          inputName: 'amount_paid_1',
          controlName: 'amount_paid_1',
        },
      },
    ];
    component.form = new FormGroup({
      impositions: new FormArray([
        new FormGroup({
          result_code: new FormControl(null),
          amount_imposed: new FormControl(null),
          amount_paid: new FormControl(null),
        }),
        new FormGroup({
          result_code: new FormControl(null),
          amount_imposed: new FormControl(null),
          amount_paid: new FormControl(null),
        }),
      ]),
    });

    component.formControlErrorMessages = {
      result_code_0: 'Error 1',
      amount_imposed_0: 'Error 2',
      amount_paid_0: 'Error 3',
      result_code_1: 'Error 4',
      amount_imposed_1: 'Error 5',
      amount_paid_1: 'Error 6',
    };

    // Act
    const result = component['removeAllFormArrayControls'](formArrayControls, formArrayName, fieldNames);

    // Assert
    expect(result).toEqual([]);
    expect(component.form.get(formArrayName)?.value).toEqual([]);
    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should create form controls based on the given fields and index', () => {
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
    const validators: ValidatorFn[] = [Validators.required];
    const controls: FormControl[] = [new FormControl('test')];

    const formArray = component['createFormArray'](validators, controls);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(1);
  });

  it('should create a form array with validators and no controls', () => {
    const validators: ValidatorFn[] = [Validators.required];

    const formArray = component['createFormArray'](validators);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(0);
  });

  it('should create a form array with no validators and controls', () => {
    const controls: FormControl[] = [new FormControl('test')];

    const formArray = component['createFormArray']([], controls);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(1);
  });
});
