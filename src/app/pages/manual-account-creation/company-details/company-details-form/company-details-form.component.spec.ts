import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDetailsFormComponent } from './company-details-form.component';
import { MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FORM_MOCK, MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';
import { MacStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS } from '@constants';

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

  it('should emit form submit event with form value - continueFlow true', () => {
    const event = { submitter: { className: 'continue-flow' } } as SubmitEvent;
    const companyDetailsForm = MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FORM_MOCK;
    companyDetailsForm.continueFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](companyDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(companyDetailsForm);
  });

  it('should emit form submit event with form value - continueFlow false', () => {
    const event = {} as SubmitEvent;
    const companyDetailsForm = MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FORM_MOCK;
    companyDetailsForm.continueFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](companyDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(companyDetailsForm);
  });

  it('should set up the company details form', () => {
    component['setupCompanyDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('companyName')).toBeTruthy();
    expect(component.form.get('addAlias')).toBeTruthy();
    expect(component.form.get('aliases')).toBeTruthy();
    expect(component.form.get('addressLine1')).toBeTruthy();
    expect(component.form.get('addressLine2')).toBeTruthy();
    expect(component.form.get('addressLine3')).toBeTruthy();
    expect(component.form.get('postcode')).toBeTruthy();
  });

  it('should set up the alias configuration for the company details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(['companyName']);
    expect(component.aliasControlsValidation).toEqual(MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS);
  });

  it('should call the necessary setup methods', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupCompanyDetailsForm');
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

    expect(component['setupCompanyDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(component.macStateService.manualAccountCreation.companyDetails.aliases.length).keys()],
      'aliases',
    );
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockMacStateService.manualAccountCreation.companyDetails);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith('addAlias', 'aliases');
  });
});
