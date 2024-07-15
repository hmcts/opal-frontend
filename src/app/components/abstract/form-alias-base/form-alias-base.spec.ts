import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormAliasBaseComponent } from './form-alias-base';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { IFormArrayControlValidation, IFormArrayControls, IFormControlErrorMessage } from '@interfaces';
import { of } from 'rxjs';

class TestFormAliasBaseComponent extends FormAliasBaseComponent {
  constructor() {
    super();
    this.form = new FormGroup({
      addAlias: new FormControl(null),
      aliases: new FormArray([]),
    });
  }
}

describe('FormArrayBase', () => {
  let component: TestFormAliasBaseComponent;
  let fixture: ComponentFixture<TestFormAliasBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFormAliasBaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFormAliasBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.aliasControls = [];
    component.aliasControlsValidation = [];
    component.aliasFields = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add controls to a form group', () => {
    const formGroup = new FormGroup({});
    const controls: IFormArrayControlValidation[] = [
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
    const formArrayControls: IFormArrayControls[] = [
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
    const expectedFormArrayControls: IFormArrayControls[] = [
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
    const fieldNames = ['name', 'age'];
    const formArrayControls = [
      { name: { controlName: 'name_0' }, age: { controlName: 'age_0' } },
      { name: { controlName: 'name_1' }, age: { controlName: 'age_1' } },
      { name: { controlName: 'name_2' }, age: { controlName: 'age_2' } },
    ];
    component.form = new FormGroup({
      aliases: new FormArray([
        new FormGroup({
          name: new FormControl(null),
          age: new FormControl(null),
        }),
        new FormGroup({
          name: new FormControl(null),
          age: new FormControl(null),
        }),
        new FormGroup({
          name: new FormControl(null),
          age: new FormControl(null),
        }),
      ]),
    });
    component.formControlErrorMessages = {
      name_0: 'Error 1',
      age_0: 'Error 2',
      name_1: 'Error 3',
      age_1: 'Error 4',
      name_2: 'Error 5',
      age_2: 'Error 6',
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
    const formArrayControls: IFormArrayControls[] = [
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
    const errorMessage: IFormControlErrorMessage = {
      firstNames_0: 'test message',
      lastName_0: 'test message',
    };

    component.formControlErrorMessages = errorMessage;

    component['removeFormArrayControlsErrors'](index, formArrayControls, fieldNames);

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should not remove field errors if the form array control does not exist', () => {
    const index = 1;
    const formArrayControls: IFormArrayControls[] = [
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
    const errorMessage: IFormControlErrorMessage = {
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
    const formArrayControls: IFormArrayControls[] = [
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
    const errorMessage: IFormControlErrorMessage = {
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

    addAliasControl?.setValue(true);

    // Call the setUpAliasCheckboxListener method
    component['setUpAliasCheckboxListener']();

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

    component.addAlias(index);

    expect(component.aliasControls.length).toBe(1);
  });

  it('should remove an alias from the aliasControls form array', () => {
    const index = 0;

    component.addAlias(index);
    expect(component.aliasControls.length).toBe(1);

    component.removeAlias(index);
    expect(component.aliasControls.length).toBe(0);
  });

  it('should set up the aliases for the company details form', () => {
    const aliases = [
      {
        companyName_0: 'Test',
      },
    ];

    component['setupAliasFormControls'](aliases);

    expect(component.aliasControls.length).toBe(1);
  });

  it('should unsubscribe from addAliasListener on ngOnDestroy', () => {
    const addAliasControl = component.form.get('addAlias');

    addAliasControl?.setValue(true);

    // Call the setUpAliasCheckboxListener method
    component['setUpAliasCheckboxListener']();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribeSpy = spyOn<any>(component['addAliasListener'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should return if addAlias control is not found', () => {
    spyOn(component.form, 'get').and.returnValue(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUpAliasCheckboxListener').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'buildFormArrayControls').and.returnValue(of([]));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeAllFormArrayControls').and.returnValue(of([]));

    component['setUpAliasCheckboxListener']();

    expect(component.form.get).toHaveBeenCalledWith('addAlias');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['setUpAliasCheckboxListener']).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['buildFormArrayControls']).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<any>(component['removeAllFormArrayControls']).not.toHaveBeenCalled();
  });
});
