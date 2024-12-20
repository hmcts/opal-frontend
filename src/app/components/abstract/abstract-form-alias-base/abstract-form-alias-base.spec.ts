import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractFormAliasBaseComponent } from './abstract-form-alias-base';
import { FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IAbstractFormArrayControls } from '../interfaces/abstract-form-array-controls.interface';
import { IAbstractFormControlErrorMessage } from '../interfaces/abstract-form-control-error-message.interface';
import { IAbstractFormArrayControlValidation } from '../interfaces/abstract-form-array-control-validation.interface';

class TestAbstractFormAliasBaseComponent extends AbstractFormAliasBaseComponent {
  constructor() {
    super();
    this.form = new FormGroup({
      addAlias: new FormControl(null),
      aliases: new FormArray([]),
    });
  }
}

describe('AbstractFormAliasBaseComponent', () => {
  let component: TestAbstractFormAliasBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractFormAliasBaseComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractFormAliasBaseComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractFormAliasBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component.aliasControls = [];
    component.aliasControlsValidation = [];
    component.aliasFields = [];
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

  it('should remove the form array control at the specified index', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 1;
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const expectedFormArrayControls: IAbstractFormArrayControls[] = [
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

    const result = component['removeFormAliasControl'](index, formArrayControls);

    expect(result).toEqual(expectedFormArrayControls);
  });

  it('should create form controls based on the given fields and index', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    const fields = ['field1', 'field2', 'field3'];
    const index = 0;

    const result = component['createAliasControls'](fields, index);

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
    if (!component) {
      fail('component returned null');
      return;
    }
    const formControlCount = [0, 1, 2];
    const formArrayName = 'aliases';
    const fieldNames = ['field1', 'field2', 'field3'];
    const controlValidation = [
      { controlName: 'field1', validators: [Validators.required] },
      { controlName: 'field2', validators: [Validators.maxLength(10)] },
      { controlName: 'field3', validators: [Validators.pattern('[a-zA-Z]*')] },
    ];

    const result = component['buildFormAliasControls'](formControlCount, formArrayName, fieldNames, controlValidation);

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
    if (!component) {
      fail('component returned null');
      return;
    }

    // Arrange
    const formArrayName = 'aliases';
    const fieldNames = ['firstNames', 'lastName'];
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const result = component['removeAllFormAliasControls'](formArrayControls, formArrayName, fieldNames);

    // Assert
    expect(result).toEqual([]);
    expect(component.form.get(formArrayName)?.value).toEqual([]);
    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should remove field errors for the specified form array control', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const errorMessage: IAbstractFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormAliasControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should not remove field errors if the form array control does not exist', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 1;
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const errorMessage: IAbstractFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormAliasControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual(errorMessage);
  });

  it('should add form array controls to the form group', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;
    const formArrayName = 'aliases';
    const fieldNames = ['field1', 'field2'];
    const controlValidation = [
      { controlName: 'field1', validators: [Validators.required] },
      { controlName: 'field2', validators: [Validators.maxLength(10)] },
    ];
    const expectedControlObj = {
      field1: { inputId: 'field1_0', inputName: 'field1_0', controlName: 'field1_0' },
      field2: { inputId: 'field2_0', inputName: 'field2_0', controlName: 'field2_0' },
    };

    const controls = component['addAliasControls'](index, formArrayName, fieldNames, controlValidation);
    const aliasArray = component.form.get('aliases') as FormArray;

    expect(controls).toEqual(expectedControlObj);
    expect(aliasArray.at(0).get('field1_0')).toBeInstanceOf(FormControl);
    expect(aliasArray.at(0).get('field2_0')).toBeInstanceOf(FormControl);
  });

  it('should remove the form array control at the specified index', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 1;
    const formArrayName = 'aliases';
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const errorMessage: IAbstractFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
      firstNames_1: 'test message',
      lastName_1: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormAliasControls'](index, formArrayName, formArrayControls, fieldNames);

    expect(formArrayControls.length).toBe(1);

    expect(component.formControlErrorMessages['firstNames_1']).toBeUndefined();
    expect(component.formControlErrorMessages['firstNames_0']).toBeDefined();
  });

  it('should update alias controls based on the value of the checkbox', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const addAliasControl = component.form.get('addAlias');

    // Call the setUpAliasCheckboxListener method
    component['setUpAliasCheckboxListener']('addAlias', 'aliases');

    // Mark checkbox as true
    addAliasControl?.setValue(true);

    // Check that the aliasControls array is populated with the expected number of controls
    expect(component.aliasControls.length).toBe(1);

    // // Set the value of the addAlias control to false
    addAliasControl?.setValue(false);

    // // Check that the aliasControls array is empty
    expect(component.aliasControls.length).toBe(0);
  });

  it('should add an alias to the aliasControls form array', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;

    expect(component.aliasControls.length).toBe(0);

    component.addAlias(index, 'aliases');

    expect(component.aliasControls.length).toBe(1);
  });

  it('should remove an alias from the aliasControls form array', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;

    component.addAlias(index, 'aliases');
    expect(component.aliasControls.length).toBe(1);

    component.removeAlias(index, 'aliases');
    expect(component.aliasControls.length).toBe(0);
  });

  it('should set up the aliases for the company details form', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const aliases = [
      {
        companyName_0: 'Test',
      },
    ];

    component['setupAliasFormControls']([...Array(aliases.length).keys()], 'aliases');

    expect(component.aliasControls.length).toBe(1);
  });

  it('should unsubscribe from addAliasListener on ngOnDestroy', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const addAliasControl = component.form.get('addAlias');

    addAliasControl?.setValue(true);

    // Call the setUpAliasCheckboxListener method
    component['setUpAliasCheckboxListener']('addAlias', 'aliases');

    spyOn(component['ngUnsubscribe'], 'next');
    spyOn(component['ngUnsubscribe'], 'complete');

    component.ngOnDestroy();
    expect(component['ngUnsubscribe'].next).toHaveBeenCalled();
    expect(component['ngUnsubscribe'].complete).toHaveBeenCalled();
  });

  it('should return if addAlias control is not found', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    spyOn(component.form, 'get').and.returnValue(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUpAliasCheckboxListener').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'buildFormAliasControls').and.returnValue(of([]));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeAllFormAliasControls').and.returnValue(of([]));

    component['setUpAliasCheckboxListener']('addAlias', 'aliases');

    expect(component.form.get).toHaveBeenCalledWith('addAlias');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['setUpAliasCheckboxListener']).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['buildFormAliasControls']).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['removeAllFormAliasControls']).not.toHaveBeenCalled();
  });

  it('should remove field errors for the specified form array control', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const errorMessage: IAbstractFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormAliasControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should not remove field errors if the form array control does not exist', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 1;
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const errorMessage: IAbstractFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormAliasControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual(errorMessage);
  });

  it('should add form array controls to the form group', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 0;
    const formArrayName = 'aliases';
    const fieldNames = ['field1', 'field2'];
    const controlValidation = [
      { controlName: 'field1', validators: [Validators.required] },
      { controlName: 'field2', validators: [Validators.maxLength(10)] },
    ];
    const expectedControlObj = {
      field1: { inputId: 'field1_0', inputName: 'field1_0', controlName: 'field1_0' },
      field2: { inputId: 'field2_0', inputName: 'field2_0', controlName: 'field2_0' },
    };

    const controls = component['addAliasControls'](index, formArrayName, fieldNames, controlValidation);
    const aliasArray = component.form.get('aliases') as FormArray;

    expect(controls).toEqual(expectedControlObj);
    expect(aliasArray.at(0).get('field1_0')).toBeInstanceOf(FormControl);
    expect(aliasArray.at(0).get('field2_0')).toBeInstanceOf(FormControl);
  });

  it('should remove the form array control at the specified index', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 1;
    const formArrayName = 'aliases';
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const errorMessage: IAbstractFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
      firstNames_1: 'test message',
      lastName_1: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormAliasControls'](index, formArrayName, formArrayControls, fieldNames);

    expect(formArrayControls.length).toBe(1);

    expect(component.formControlErrorMessages['firstNames_1']).toBeUndefined();
    expect(component.formControlErrorMessages['firstNames_0']).toBeDefined();
  });

  it('should remove the form array control at the specified index', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const index = 1;
    const formArrayControls: IAbstractFormArrayControls[] = [
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
    const expectedFormArrayControls: IAbstractFormArrayControls[] = [
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

    const result = component['removeFormAliasControl'](index, formArrayControls);

    expect(result).toEqual(expectedFormArrayControls);
  });

  it('should create form controls based on the given fields and index', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const fields = ['field1', 'field2', 'field3'];
    const index = 0;

    const result = component['createAliasControls'](fields, index);

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
    if (!component) {
      fail('component returned null');
      return;
    }

    const formControlCount = [0, 1, 2];
    const formArrayName = 'aliases';
    const fieldNames = ['field1', 'field2', 'field3'];
    const controlValidation = [
      { controlName: 'field1', validators: [Validators.required] },
      { controlName: 'field2', validators: [Validators.maxLength(10)] },
      { controlName: 'field3', validators: [Validators.pattern('[a-zA-Z]*')] },
    ];

    const result = component['buildFormAliasControls'](formControlCount, formArrayName, fieldNames, controlValidation);

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

  it('should create a new FormArray with validators and controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const validators = [Validators.required];
    const controls = [new FormControl('value1'), new FormControl('value2'), new FormControl('value3')];

    const formArray = component['createFormAlias'](validators, controls);

    expect(formArray instanceof FormArray).toBe(true);
    expect(formArray.controls.length).toBe(3);
    expect(formArray.controls[0].value).toBe('value1');
    expect(formArray.controls[1].value).toBe('value2');
    expect(formArray.controls[2].value).toBe('value3');
    expect(formArray.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should create a new FormArray with validators and no controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const validators = [Validators.required];

    const formArray = component['createFormAlias'](validators);

    expect(formArray instanceof FormArray).toBe(true);
    expect(formArray.controls.length).toBe(0);
    expect(formArray.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should create a new FormArray without validators and controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const formArray = component['createFormAlias']([]);

    expect(formArray instanceof FormArray).toBe(true);
    expect(formArray.controls.length).toBe(0);
    expect(formArray.hasValidator(Validators.required)).toBeFalsy();
  });

  it('should create a form array with validators and controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const validators: ValidatorFn[] = [Validators.required];
    const controls: FormControl[] = [new FormControl('test')];

    const formArray = component['createFormAlias'](validators, controls);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(1);
  });

  it('should create a form array with validators and no controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const validators: ValidatorFn[] = [Validators.required];

    const formArray = component['createFormAlias'](validators);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(0);
  });

  it('should create a form array with no validators and controls', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    const controls: FormControl[] = [new FormControl('test')];

    const formArray = component['createFormAlias']([], controls);

    expect(formArray instanceof FormArray).toBeTruthy();
    expect(formArray.controls.length).toBe(1);
  });
});
