import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsFormComponent } from './personal-details-form.component';
import { MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK } from '@mocks';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { alphabeticalTextValidator } from 'src/app/validators';
import {
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
} from '@constants';
import { StateService } from '@services';

describe('PersonalDetailsFormComponent', () => {
  let component: PersonalDetailsFormComponent;
  let fixture: ComponentFixture<PersonalDetailsFormComponent>;
  let mockStateService: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('StateService', ['manualAccountCreation']);

    mockStateService.manualAccountCreation = {
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
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

  it('should emit form submit event with form value', () => {
    const formValue = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });

  it('should add alias when addAlias is true', () => {
    component.form.controls['addAlias'].setValue(true);
    component.addAliases(1);

    const aliasesFormArray = component.form.get('aliases') as FormArray;
    const aliasesFormArrayFormGroups = aliasesFormArray.controls as FormGroup[];
    aliasesFormArrayFormGroups.forEach((aliasFormGroup: FormGroup) => {
      Object.keys(aliasFormGroup.controls).forEach((key) => {
        const control = aliasFormGroup.controls[key];
        expect(control.hasValidator(Validators.required)).toBeTruthy;
        expect(control.hasValidator(Validators.maxLength(30))).toBeTruthy;
        expect(control.hasValidator(alphabeticalTextValidator())).toBeTruthy;
      });
    });

    expect(aliasesFormArray).not.toBeNull();
    expect(aliasesFormArrayFormGroups.length).toBe(2);
  });

  it('should remove an alias from the form', () => {
    component.addAliases(1);

    const aliases = component.form.get('aliases') as FormArray;
    expect(aliases.length).toBe(2);

    component.removeAlias(1);

    expect(aliases.length).toBe(1);
    expect(component.aliasControls.length).toBe(1);
    expect(component.fieldErrors['firstName_1']).toBeUndefined();
    expect(component.fieldErrors['lastName_1']).toBeUndefined();
  });

  it('should activate validators when addAlias is checked', () => {
    component.form.controls['addAlias'].setValue(true);
    component.addAliasCheckboxChange();

    const aliasesFormArray = component.form.get('aliases') as FormArray;
    const aliasesFormArrayFormGroups = aliasesFormArray.controls as FormGroup[];
    aliasesFormArrayFormGroups.forEach((aliasFormGroup: FormGroup) => {
      Object.keys(aliasFormGroup.controls).forEach((key) => {
        const control = aliasFormGroup.controls[key];
        expect(control.hasValidator(Validators.required)).toBeTruthy;
        expect(control.hasValidator(Validators.maxLength(30))).toBeTruthy;
        expect(control.hasValidator(alphabeticalTextValidator())).toBeTruthy;
      });
    });
    expect(aliasesFormArray).not.toBeNull();
    expect(aliasesFormArrayFormGroups.length).toBe(1);
  });

  it('should deactivate validators when addAlias is unchecked', () => {
    component.form.controls['addAlias'].setValue(false);
    component.addAliasCheckboxChange();

    const aliasesFormArray = component.form.get('aliases') as FormArray;
    const aliasesFormArrayFormGroups = aliasesFormArray.controls as FormGroup[];
    aliasesFormArrayFormGroups.forEach((aliasFormGroup: FormGroup) => {
      Object.keys(aliasFormGroup.controls).forEach((key) => {
        const control = aliasFormGroup.controls[key];
        expect(control.hasValidator(Validators.required)).toBeFalsy;
        expect(control.hasValidator(Validators.maxLength(30))).toBeFalsy;
        expect(control.hasValidator(alphabeticalTextValidator())).toBeFalsy;
      });
    });

    expect(aliasesFormArray).not.toBeNull();
    expect(aliasesFormArrayFormGroups.length).toBe(1);
  });

  it('should build the aliases dependant on the state service - one alias only', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = spyOn<any>(component, 'rePopulateForm');
    component.stateService.manualAccountCreation.personalDetails = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK;
    component['buildAliasInputs']();

    const aliases = component.form.get('aliases') as FormArray;
    expect(aliases.length).toBe(2);
    expect(component.aliasControls.length).toBe(2);
    expect(spy).toHaveBeenCalledWith(component.stateService.manualAccountCreation.personalDetails);
  });
});
