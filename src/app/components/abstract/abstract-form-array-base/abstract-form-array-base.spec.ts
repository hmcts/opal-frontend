import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AbstractFormArrayBaseComponent } from './abstract-form-array-base';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

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
