import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDetailsFormComponent } from './company-details-form.component';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FORM_MOCK,
  MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_MOCK,
} from '@mocks';
import { MacStateService } from '@services';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE } from '@constants';
import { IManualAccountCreationCompanyAlias } from '@interfaces';

describe('CompanyDetailsFormComponent', () => {
  let component: CompanyDetailsFormComponent;
  let fixture: ComponentFixture<CompanyDetailsFormComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [CompanyDetailsFormComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;
    mockMacStateService.manualAccountCreation.accountDetails = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK;
    mockMacStateService.manualAccountCreation.companyDetails = MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE;

    component.form.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a single alias when companyDetails.addAlias is false', () => {
    mockMacStateService.manualAccountCreation.companyDetails.addAlias = false;
    mockMacStateService.manualAccountCreation.companyDetails.aliases = [{ companyName_0: 'Alias1' }];

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

  it('should add aliases based on companyDetails.addAlias being true', () => {
    mockMacStateService.manualAccountCreation.companyDetails = MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE_MOCK;

    spyOn(component, 'addAliases');
    spyOn(component, 'addAliasCheckboxChange');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rePopulateFormSpy = spyOn<any>(component, 'rePopulateForm');

    component['buildAliasInputs']();

    expect(component.addAliases).toHaveBeenCalledTimes(1);
    expect(component.addAliases).toHaveBeenCalledWith(0);
    expect(component.addAliasCheckboxChange).toHaveBeenCalled();
    expect(rePopulateFormSpy).toHaveBeenCalledWith(mockMacStateService.manualAccountCreation.companyDetails);
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
      companyName: new FormControl(''),
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
      companyName: new FormControl(''),
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

  it('should set validators for companyName control', () => {
    const aliasFormGroup = new FormGroup({
      companyName: new FormControl(''),
    });

    const control = aliasFormGroup.controls['companyName'];

    component['setAliasValidators'](aliasFormGroup, 'companyName');

    expect(control.validator).toBeTruthy();

    const validators = control.validator ? control.validator({} as AbstractControl) : null;
    expect(validators).toEqual({
      required: true,
    });
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

    expect(controls.companyName.inputId).toBe(`companyName_${index}`);
    expect(controls.companyName.inputName).toBe(`companyName_${index}`);
    expect(controls.companyName.controlName).toBe(`companyName_${index}`);
  });

  it('should add alias controls with validators when addAlias is true', () => {
    const formGroup = new FormGroup({});
    const controls: IManualAccountCreationCompanyAlias = {
      companyName: {
        controlName: 'firstNames_0',
        inputId: 'firstNames_0',
        inputName: 'firstNames_0',
      },
    };
    component.form.controls['addAlias'].setValue(true);

    component['addControlsToFormGroup'](formGroup, controls);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((formGroup.controls as { [key: string]: any })[controls.companyName.controlName].validator).not.toBeNull();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (formGroup.controls as { [key: string]: any })[controls.companyName.controlName].validator({} as AbstractControl),
    ).toEqual({
      required: true,
    });
  });

  it('should add alias controls without validators when addAlias is false', () => {
    const formGroup = new FormGroup({});
    const controls: IManualAccountCreationCompanyAlias = {
      companyName: {
        controlName: 'firstNames_0',
        inputId: 'firstNames_0',
        inputName: 'firstNames_0',
      },
    };
    component.form.controls['addAlias'].setValue(false);

    component['addControlsToFormGroup'](formGroup, controls);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((formGroup.controls as { [key: string]: any })[controls.companyName.controlName].validator).toBeNull();
  });

  it('should remove alias at the specified index', () => {
    const aliasesFormArray = new FormArray([
      new FormGroup({ companyName: new FormControl('Alias1') }),
      new FormGroup({ companyName: new FormControl('Alias2') }),
      new FormGroup({ companyName: new FormControl('Alias3') }),
    ]);

    component.form = new FormGroup({
      aliases: aliasesFormArray,
    });

    component.removeAlias(1);

    expect(aliasesFormArray.length).toBe(2);
    expect(aliasesFormArray.at(0).value).toEqual({ companyName: 'Alias1' });
    expect(aliasesFormArray.at(1).value).toEqual({ companyName: 'Alias3' });
  });

  it('should remove field errors for the removed alias', () => {
    const aliasesFormArray = new FormArray([
      new FormGroup({ companyName: new FormControl('Alias1') }),
      new FormGroup({ companyName: new FormControl('Alias2') }),
      new FormGroup({ companyName: new FormControl('Alias3') }),
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
      new FormGroup({ companyName: new FormControl('Alias1') }),
      new FormGroup({ companyName: new FormControl('Alias2') }),
      new FormGroup({ companyName: new FormControl('Alias3') }),
    ]);

    component.form = new FormGroup({
      aliases: aliasesFormArray,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeFieldErrorsSpy = spyOn<any>(component, 'removeFieldErrors');

    component.removeAlias(1);

    expect(removeFieldErrorsSpy).toHaveBeenCalledWith(1);
  });

  it('should emit form submit event with form value - continueFlow true', () => {
    const event = { submitter: { className: 'continue-flow' } } as SubmitEvent;
    mockMacStateService.manualAccountCreation.accountDetails.defendantType = 'adultOrYouthOnly';
    const companyDetailsForm = MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FORM_MOCK;
    companyDetailsForm.continueFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](companyDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(companyDetailsForm);
  });

  it('should emit form submit event with form value - continueFlow false', () => {
    const event = {} as SubmitEvent;
    mockMacStateService.manualAccountCreation.accountDetails.defendantType = 'adultOrYouthOnly';
    const companyDetailsForm = MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FORM_MOCK;
    companyDetailsForm.continueFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](companyDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(companyDetailsForm);
  });
});
