import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalDetailsFormComponent } from './personal-details-form.component';
import { MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS } from '@constants';
import { MacStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_MOCK, MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FORM_MOCK } from '@mocks';
import { of } from 'rxjs';

describe('PersonalDetailsFormComponent', () => {
  let component: PersonalDetailsFormComponent;
  let fixture: ComponentFixture<PersonalDetailsFormComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [PersonalDetailsFormComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.form.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'continue-flow' } } as SubmitEvent;
    const personalDetailsForm = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FORM_MOCK;
    personalDetailsForm.continueFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](personalDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(personalDetailsForm);
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'continue-flow' } } as SubmitEvent;
    const personalDetailsForm = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FORM_MOCK;
    personalDetailsForm.continueFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](personalDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(personalDetailsForm);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    const personalDetailsForm = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FORM_MOCK;
    personalDetailsForm.continueFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](personalDetailsForm.formData);
    component.handleFormSubmit(event);
    component['rePopulateForm'](personalDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(personalDetailsForm);
  });

  it('should set up the personal details form', () => {
    component['setupPersonalDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('title')).toBeTruthy();
    expect(component.form.get('firstNames')).toBeTruthy();
    expect(component.form.get('lastName')).toBeTruthy();
    expect(component.form.get('addAlias')).toBeTruthy();
    expect(component.form.get('aliases')).toBeTruthy();
    expect(component.form.get('dateOfBirth')).toBeTruthy();
    expect(component.form.get('nationalInsuranceNumber')).toBeTruthy();
    expect(component.form.get('addressLine1')).toBeTruthy();
    expect(component.form.get('addressLine2')).toBeTruthy();
    expect(component.form.get('addressLine3')).toBeTruthy();
    expect(component.form.get('postcode')).toBeTruthy();
    expect(component.form.get('makeOfCar')).toBeTruthy();
    expect(component.form.get('registrationNumber')).toBeTruthy();
  });

  it('should set up the alias configuration for the personal details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(['firstNames', 'lastName']);
    expect(component.aliasControlsValidation).toEqual(MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS);
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

  it('should set up the aliases for the personal details form', () => {
    const aliases = [
      {
        firstNames_0: 'Test',
        lastName_0: 'test',
      },
    ];

    component.macStateService.manualAccountCreation.personalDetails.aliases = aliases;
    component['setupAliasFormControls']();

    expect(component.aliasControls.length).toBe(1);
  });

  it('should call the necessary setup methods', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUpAliasCheckboxListener');

    component['initialSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockMacStateService.manualAccountCreation.personalDetails);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalled();
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
