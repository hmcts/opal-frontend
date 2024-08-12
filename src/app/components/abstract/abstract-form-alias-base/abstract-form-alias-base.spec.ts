import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractFormAliasBaseComponent } from './abstract-form-alias-base';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import {
  IAbstractFormAliasBaseFormArrayControlValidation,
  IAbstractFormAliasBaseFormArrayControls,
  IAbstractFormAliasBaseFormControlErrorMessage,
} from './interfaces';
import { of } from 'rxjs';

class TestAbstractFormAliasBaseComponent extends AbstractFormAliasBaseComponent {
  constructor() {
    super();
    this.form = new FormGroup({
      addAlias: new FormControl(null),
      aliases: new FormArray([]),
    });
  }
}

describe('FormArrayBase', () => {
  let component: TestAbstractFormAliasBaseComponent;
  let fixture: ComponentFixture<TestAbstractFormAliasBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractFormAliasBaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractFormAliasBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.aliasControls = [];
    component.aliasControlsValidation = [];
    component.aliasFields = [];
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add controls to a form group', () => {
    const formGroup = new FormGroup({});
    const controls: IAbstractFormAliasBaseFormArrayControlValidation[] = [
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
    const formArrayControls: IAbstractFormAliasBaseFormArrayControls[] = [
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
    const expectedFormArrayControls: IAbstractFormAliasBaseFormArrayControls[] = [
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
    const formArrayName = 'aliases';
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
    const formArrayControls: IAbstractFormAliasBaseFormArrayControls[] = [
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

  it('should remove field errors for the specified form array control', () => {
    const index = 0;
    const formArrayControls: IAbstractFormAliasBaseFormArrayControls[] = [
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
    const errorMessage: IAbstractFormAliasBaseFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormArrayControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should not remove field errors if the form array control does not exist', () => {
    const index = 1;
    const formArrayControls: IAbstractFormAliasBaseFormArrayControls[] = [
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
    const errorMessage: IAbstractFormAliasBaseFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormArrayControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual(errorMessage);
  });

  it('should add form array controls to the form group', () => {
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

    const controls = component.addFormArrayControls(index, formArrayName, fieldNames, controlValidation);
    const aliasArray = component.form.get('aliases') as FormArray;

    expect(controls).toEqual(expectedControlObj);
    expect(aliasArray.at(0).get('field1_0')).toBeInstanceOf(FormControl);
    expect(aliasArray.at(0).get('field2_0')).toBeInstanceOf(FormControl);
  });

  it('should remove the form array control at the specified index', () => {
    const index = 1;
    const formArrayName = 'aliases';
    const formArrayControls: IAbstractFormAliasBaseFormArrayControls[] = [
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
    const errorMessage: IAbstractFormAliasBaseFormControlErrorMessage = {
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

  it('should update alias controls based on the value of the checkbox', () => {
    const addAliasControl = component.form.get('addAlias');

    // Call the setUpAliasCheckboxListener method
    component['setUpAliasCheckboxListener']('addAlias', 'aliases');

    // Mark checkbox as true
    addAliasControl?.setValue(true);

    // Check addAliasListener is setup
    expect(component['addAliasListener']).toBeDefined();

    // Check that the aliasControls array is populated with the expected number of controls
    expect(component.aliasControls.length).toBe(1);

    // // Set the value of the addAlias control to false
    addAliasControl?.setValue(false);

    // // Check that the aliasControls array is empty
    expect(component.aliasControls.length).toBe(0);
  });

  it('should add an alias to the aliasControls form array', () => {
    const index = 0;

    expect(component.aliasControls.length).toBe(0);

    component.addAlias(index, 'aliases');

    expect(component.aliasControls.length).toBe(1);
  });

  it('should remove an alias from the aliasControls form array', () => {
    const index = 0;

    component.addAlias(index, 'aliases');
    expect(component.aliasControls.length).toBe(1);

    component.removeAlias(index, 'aliases');
    expect(component.aliasControls.length).toBe(0);
  });

  it('should set up the aliases for the company details form', () => {
    const aliases = [
      {
        companyName_0: 'Test',
      },
    ];

    component['setupAliasFormControls']([...Array(aliases.length).keys()], 'aliases');

    expect(component.aliasControls.length).toBe(1);
  });

  it('should unsubscribe from addAliasListener on ngOnDestroy', () => {
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
    spyOn(component.form, 'get').and.returnValue(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUpAliasCheckboxListener').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'buildFormArrayControls').and.returnValue(of([]));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeAllFormArrayControls').and.returnValue(of([]));

    component['setUpAliasCheckboxListener']('addAlias', 'aliases');

    expect(component.form.get).toHaveBeenCalledWith('addAlias');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['setUpAliasCheckboxListener']).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['buildFormArrayControls']).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['removeAllFormArrayControls']).not.toHaveBeenCalled();
  });
});
