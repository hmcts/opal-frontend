import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalDetailsFormComponent } from './personal-details-form.component';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
} from '@constants';
import { StateService } from '@services';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IManualAccountCreationPersonalAlias } from '@interfaces';
import { MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK } from '@mocks';

describe('PersonalDetailsFormComponent', () => {
  let component: PersonalDetailsFormComponent;
  let fixture: ComponentFixture<PersonalDetailsFormComponent>;
  let mockStateService: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('StateService', ['manualAccountCreation']);

    mockStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [PersonalDetailsFormComponent],
      providers: [{ provide: StateService, useValue: mockStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a single alias when personalDetails.addAlias is false', () => {
    mockStateService.manualAccountCreation.personalDetails.addAlias = false;
    mockStateService.manualAccountCreation.personalDetails.aliases = [{ firstName: 'Alias1', lastName: 'User1' }];

    spyOn(component, 'addAliases');
    spyOn(component, 'addAliasCheckboxChange');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rePopulateFormSpy = spyOn<any>(component, 'rePopulateForm');

    component['buildAliasInputs']();

    expect(component.addAliases).toHaveBeenCalledTimes(1);
    expect(component.addAliases).toHaveBeenCalledWith(0);
    expect(component.addAliasCheckboxChange).not.toHaveBeenCalled();
    expect(rePopulateFormSpy).not.toHaveBeenCalled();
  });

  it('should add aliases based on personalDetails.addAlias being true', () => {
    mockStateService.manualAccountCreation.personalDetails.addAlias = true;
    mockStateService.manualAccountCreation.personalDetails.aliases = [
      { firstName: 'Alias1', lastName: 'User1' },
      { firstName: 'Alias2', lastName: 'User2' },
    ];

    spyOn(component, 'addAliases');
    spyOn(component, 'addAliasCheckboxChange');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rePopulateFormSpy = spyOn<any>(component, 'rePopulateForm');

    component['buildAliasInputs']();

    expect(component.addAliases).toHaveBeenCalledTimes(2);
    expect(component.addAliases).toHaveBeenCalledWith(0);
    expect(component.addAliases).toHaveBeenCalledWith(1);
    expect(component.addAliasCheckboxChange).toHaveBeenCalled();
    expect(rePopulateFormSpy).toHaveBeenCalledWith(mockStateService.manualAccountCreation.personalDetails);
  });

  it('should call updateAliasFormGroupValidators for each alias form group', () => {
    const aliasesFormArray = new FormArray([new FormGroup({}), new FormGroup({})]);

    component.form = new FormGroup({
      aliases: aliasesFormArray,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateAliasFormGroupValidatorsSpy = spyOn<any>(component, 'updateAliasFormGroupValidators');

    component.addAliasCheckboxChange();

    aliasesFormArray.controls.forEach((control) => {
      expect(updateAliasFormGroupValidatorsSpy).toHaveBeenCalledWith(control as FormGroup);
    });

    expect(updateAliasFormGroupValidatorsSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle an empty aliases form array', () => {
    const aliasesFormArray = new FormArray([]);

    component.form = new FormGroup({
      aliases: aliasesFormArray,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateAliasFormGroupValidatorsSpy = spyOn<any>(component, 'updateAliasFormGroupValidators');

    component.addAliasCheckboxChange();

    expect(updateAliasFormGroupValidatorsSpy).not.toHaveBeenCalled();
  });

  it('should set alias validators when addAlias is true', () => {
    const aliasFormGroup = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    });

    component.form = new FormGroup({
      addAlias: new FormControl(true),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setAliasValidatorsSpy = spyOn<any>(component, 'setAliasValidators');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clearAliasValidatorsSpy = spyOn<any>(component, 'clearAliasValidators');

    component['updateAliasFormGroupValidators'](aliasFormGroup);

    Object.keys(aliasFormGroup.controls).forEach((key) => {
      expect(setAliasValidatorsSpy).toHaveBeenCalledWith(aliasFormGroup, key);
    });

    expect(clearAliasValidatorsSpy).not.toHaveBeenCalled();
  });

  it('should clear alias validators when addAlias is false', () => {
    const aliasFormGroup = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    });

    component.form = new FormGroup({
      addAlias: new FormControl(false),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setAliasValidatorsSpy = spyOn<any>(component, 'setAliasValidators');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clearAliasValidatorsSpy = spyOn<any>(component, 'clearAliasValidators');

    component['updateAliasFormGroupValidators'](aliasFormGroup);

    Object.keys(aliasFormGroup.controls).forEach((key) => {
      expect(clearAliasValidatorsSpy).toHaveBeenCalledWith(aliasFormGroup, key);
    });

    expect(setAliasValidatorsSpy).not.toHaveBeenCalled();
  });

  it('should set validators for firstNames control', () => {
    const aliasFormGroup = new FormGroup({
      firstNames: new FormControl(''),
    });

    const control = aliasFormGroup.controls['firstNames'];

    component['setAliasValidators'](aliasFormGroup, 'firstNames');

    expect(control.validator).toBeTruthy();

    const validators = control.validator ? control.validator({} as AbstractControl) : null;
    expect(validators).toEqual({
      required: true,
    });
  });

  it('should set validators for other controls', () => {
    const aliasFormGroup = new FormGroup({
      lastName: new FormControl(''),
    });

    const control = aliasFormGroup.controls['lastName'];

    component['setAliasValidators'](aliasFormGroup, 'lastName');

    expect(control.validator).toBeTruthy();

    const validators = control.validator ? control.validator({} as AbstractControl) : null;
    expect(validators).toEqual({
      required: true,
    });
  });

  it('should clear alias validators', () => {
    const aliasFormGroup = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
    });

    const firstNameControl = aliasFormGroup.controls['firstName'];
    const lastNameControl = aliasFormGroup.controls['lastName'];

    firstNameControl.setValidators(Validators.required);
    lastNameControl.setValidators(Validators.required);

    component['clearAliasValidators'](aliasFormGroup, 'firstName');
    component['clearAliasValidators'](aliasFormGroup, 'lastName');

    expect(firstNameControl.validator).toBeNull();
    expect(lastNameControl.validator).toBeNull();
    expect(firstNameControl.errors).toBeNull();
    expect(lastNameControl.errors).toBeNull();
  });

  it('should add aliases to the form array', () => {
    const aliasesFormArray = new FormArray([]);

    component.form = new FormGroup({
      addAlias: new FormControl(null),
      aliases: aliasesFormArray,
    });
    component.form.controls['addAlias'].setValue(true);

    const index = 0;
    const aliasesFormGroup = new FormGroup({});
    const controls = component['createControls'](index);
    component.aliasControls.push(controls);
    component['addControlsToFormGroup'](aliasesFormGroup, controls);

    component.addAliases(index);

    expect(aliasesFormArray.length).toBe(1);
  });

  it('should create controls with unique input IDs, input names, and control names', () => {
    const index = 0;

    const controls = component['createControls'](index);

    expect(controls.firstName.inputId).toBe(`firstNames_${index}`);
    expect(controls.firstName.inputName).toBe(`firstNames_${index}`);
    expect(controls.firstName.controlName).toBe(`firstNames_${index}`);

    expect(controls.lastName.inputId).toBe(`lastName_${index}`);
    expect(controls.lastName.inputName).toBe(`lastName_${index}`);
    expect(controls.lastName.controlName).toBe(`lastName_${index}`);
  });

  it('should add alias controls with validators when addAlias is true', () => {
    const formGroup = new FormGroup({});
    const controls: IManualAccountCreationPersonalAlias = {
      firstName: {
        controlName: 'firstNames_0',
        inputId: 'firstNames_0',
        inputName: 'firstNames_0',
      },
      lastName: {
        controlName: 'lastName_0',
        inputId: 'lastName_0',
        inputName: 'lastName_0',
      },
    };
    component.form.controls['addAlias'].setValue(true);

    component['addControlsToFormGroup'](formGroup, controls);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((formGroup.controls as { [key: string]: any })[controls.firstName.controlName].validator).not.toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((formGroup.controls as { [key: string]: any })[controls.lastName.controlName].validator).not.toBeNull();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (formGroup.controls as { [key: string]: any })[controls.firstName.controlName].validator({} as AbstractControl),
    ).toEqual({
      required: true,
    });
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (formGroup.controls as { [key: string]: any })[controls.lastName.controlName].validator({} as AbstractControl),
    ).toEqual({
      required: true,
    });
  });

  it('should add alias controls without validators when addAlias is false', () => {
    const formGroup = new FormGroup({});
    const controls: IManualAccountCreationPersonalAlias = {
      firstName: {
        controlName: 'firstNames_0',
        inputId: 'firstNames_0',
        inputName: 'firstNames_0',
      },
      lastName: {
        controlName: 'lastName_0',
        inputId: 'lastName_0',
        inputName: 'lastName_0',
      },
    };
    component.form.controls['addAlias'].setValue(false);

    component['addControlsToFormGroup'](formGroup, controls);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((formGroup.controls as { [key: string]: any })[controls.firstName.controlName].validator).toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((formGroup.controls as { [key: string]: any })[controls.lastName.controlName].validator).toBeNull();
  });

  it('should remove alias at the specified index', () => {
    const aliasesFormArray = new FormArray([
      new FormGroup({ firstName: new FormControl('Alias1'), lastName: new FormControl('User1') }),
      new FormGroup({ firstName: new FormControl('Alias2'), lastName: new FormControl('User2') }),
      new FormGroup({ firstName: new FormControl('Alias3'), lastName: new FormControl('User3') }),
    ]);

    component.form = new FormGroup({
      aliases: aliasesFormArray,
    });

    component.removeAlias(1);

    expect(aliasesFormArray.length).toBe(2);
    expect(aliasesFormArray.at(0).value).toEqual({ firstName: 'Alias1', lastName: 'User1' });
    expect(aliasesFormArray.at(1).value).toEqual({ firstName: 'Alias3', lastName: 'User3' });
  });

  it('should remove field errors for the removed alias', () => {
    const aliasesFormArray = new FormArray([
      new FormGroup({ firstName: new FormControl('Alias1'), lastName: new FormControl('User1') }),
      new FormGroup({ firstName: new FormControl('Alias2'), lastName: new FormControl('User2') }),
      new FormGroup({ firstName: new FormControl('Alias3'), lastName: new FormControl('User3') }),
    ]);

    component.form = new FormGroup({
      aliases: aliasesFormArray,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeFieldErrorsSpy = spyOn<any>(component, 'removeFieldErrors');

    component.removeAlias(1);

    expect(removeFieldErrorsSpy).toHaveBeenCalledWith(1);
  });

  it('should remove alias controls for the removed alias', () => {
    const aliasesFormArray = new FormArray([
      new FormGroup({ firstName: new FormControl('Alias1'), lastName: new FormControl('User1') }),
      new FormGroup({ firstName: new FormControl('Alias2'), lastName: new FormControl('User2') }),
      new FormGroup({ firstName: new FormControl('Alias3'), lastName: new FormControl('User3') }),
    ]);

    component.form = new FormGroup({
      aliases: aliasesFormArray,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeFieldErrorsSpy = spyOn<any>(component, 'removeFieldErrors');

    component.removeAlias(1);

    expect(removeFieldErrorsSpy).toHaveBeenCalledWith(1);
  });

  it('should remove alias controls', () => {
    const index = 0;
    component.aliasControls = [
      {
        firstName: {
          controlName: 'firstNames_0',
          inputId: 'firstNames_0',
          inputName: 'firstNames_0',
        },
        lastName: {
          controlName: 'lastName_0',
          inputId: 'lastName_0',
          inputName: 'lastName_0',
        },
      },
    ];

    component['removeAliasControls'](index);

    expect(component.aliasControls.length).toBe(0);
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    component['rePopulateForm'](MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK);
    fixture.detectChanges();

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK);
  });
});
