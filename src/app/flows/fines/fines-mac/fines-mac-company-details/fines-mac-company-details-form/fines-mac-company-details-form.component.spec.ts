import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCompanyDetailsFormComponent } from './fines-mac-company-details-form.component';
import { FinesService } from '@services/fines';
import { IFinesMacCompanyDetailsForm } from '@interfaces/fines/mac';
import { FINES_MAC_COMPANY_DETAILS_FORM_MOCK, FINES_MAC_STATE_MOCK } from '@mocks/fines/mac';
import { FINES_MAC_COMPANY_DETAILS_ALIAS } from '@constants/fines/mac';

describe('FinesMacCompanyDetailsFormComponent', () => {
  let component: FinesMacCompanyDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacCompanyDetailsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacCompanyDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_COMPANY_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacCompanyDetailsFormComponent],
      providers: [{ provide: FinesService, useValue: mockFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCompanyDetailsFormComponent);
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

  it('should emit form submit event with form value - nestedFlow true', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should emit form submit event with form value - nestedFlow false', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should set up the company details form', () => {
    component['setupCompanyDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('CompanyName')).toBeTruthy();
    expect(component.form.get('AddAlias')).toBeTruthy();
    expect(component.form.get('Aliases')).toBeTruthy();
    expect(component.form.get('AddressLine1')).toBeTruthy();
    expect(component.form.get('AddressLine2')).toBeTruthy();
    expect(component.form.get('AddressLine3')).toBeTruthy();
    expect(component.form.get('Postcode')).toBeTruthy();
  });

  it('should set up the alias configuration for the company details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(['AliasOrganisationName']);
    expect(component.aliasControlsValidation).toEqual(FINES_MAC_COMPANY_DETAILS_ALIAS);
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
      [...Array(mockFinesService.finesMacState.companyDetails.Aliases.length).keys()],
      'Aliases',
    );
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockFinesService.finesMacState.companyDetails);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith('AddAlias', 'Aliases');
  });
});
