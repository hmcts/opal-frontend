import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDetailsFormComponent } from './company-details-form.component';
import { MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FORM_MOCK, MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';
import { MacStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS } from '@constants';
import { of } from 'rxjs';

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

    component.macStateService.manualAccountCreation.companyDetails.aliases = aliases;
    component['setupAliasFormControls']();

    expect(component.aliasControls.length).toBe(1);
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
    expect(component['setupAliasFormControls']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockMacStateService.manualAccountCreation.companyDetails);
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
