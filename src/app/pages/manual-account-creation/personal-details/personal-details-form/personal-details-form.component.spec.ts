import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalDetailsFormComponent } from './personal-details-form.component';
import { MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS } from '@constants';
import { MacStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_MOCK, MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FORM_MOCK } from '@mocks';

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
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    const personalDetailsForm = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FORM_MOCK;
    personalDetailsForm.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](personalDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(personalDetailsForm);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    const personalDetailsForm = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FORM_MOCK;
    personalDetailsForm.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](personalDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(personalDetailsForm);
  });

  it('should set up the personal details form', () => {
    component['setupPersonalDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('Title')).toBeTruthy();
    expect(component.form.get('Forenames')).toBeTruthy();
    expect(component.form.get('Surname')).toBeTruthy();
    expect(component.form.get('AddAlias')).toBeTruthy();
    expect(component.form.get('Aliases')).toBeTruthy();
    expect(component.form.get('DOB')).toBeTruthy();
    expect(component.form.get('NationalInsuranceNumber')).toBeTruthy();
    expect(component.form.get('AddressLine1')).toBeTruthy();
    expect(component.form.get('AddressLine2')).toBeTruthy();
    expect(component.form.get('AddressLine3')).toBeTruthy();
    expect(component.form.get('Postcode')).toBeTruthy();
    expect(component.form.get('VehicleMake')).toBeTruthy();
    expect(component.form.get('VehicleRegistrationMark')).toBeTruthy();
  });

  it('should set up the alias configuration for the personal details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(['AliasForenames', 'AliasSurname']);
    expect(component.aliasControlsValidation).toEqual(MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS);
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
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(component.macStateService.manualAccountCreation.personalDetails.Aliases.length).keys()],
      'Aliases',
    );
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockMacStateService.manualAccountCreation.personalDetails);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith('AddAlias', 'Aliases');
  });
});
