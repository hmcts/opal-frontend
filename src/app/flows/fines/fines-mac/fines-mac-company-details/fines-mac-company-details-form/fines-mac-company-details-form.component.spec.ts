import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCompanyDetailsFormComponent } from './fines-mac-company-details-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacCompanyDetailsForm } from '../interfaces/fines-mac-company-details-form.interface';
import { FINES_MAC_COMPANY_DETAILS_ALIAS } from '../constants/fines-mac-company-details-alias';
import { FINES_MAC_COMPANY_DETAILS_FORM_MOCK } from '../mocks/fines-mac-company-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { of } from 'rxjs';

describe('FinesMacCompanyDetailsFormComponent', () => {
  let component: FinesMacCompanyDetailsFormComponent | null;
  let fixture: ComponentFixture<FinesMacCompanyDetailsFormComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacCompanyDetailsForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE);

    formSubmit = structuredClone(FINES_MAC_COMPANY_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCompanyDetailsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCompanyDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    formSubmit = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value - nestedFlow true', () => {
    if (!component || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value - nestedFlow false', () => {
    if (!component || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should set up the company details form', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component['setupCompanyDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('fm_company_details_organisation_name')).toBeTruthy();
    expect(component.form.get('fm_company_details_add_alias')).toBeTruthy();
    expect(component.form.get('fm_company_details_aliases')).toBeTruthy();
    expect(component.form.get('fm_company_details_address_line_1')).toBeTruthy();
    expect(component.form.get('fm_company_details_address_line_2')).toBeTruthy();
    expect(component.form.get('fm_company_details_address_line_3')).toBeTruthy();
    expect(component.form.get('fm_company_details_postcode')).toBeTruthy();
  });

  it('should set up the alias configuration for the company details form', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(FINES_MAC_COMPANY_DETAILS_ALIAS.map((item) => item.controlName));
    expect(component.aliasControlsValidation).toEqual(FINES_MAC_COMPANY_DETAILS_ALIAS);
  });

  it('should call the necessary setup methods', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

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

    component['initialCompanyDetailsSetup']();

    expect(component['setupCompanyDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(mockFinesService.finesMacState.companyDetails.formData['fm_company_details_aliases'].length).keys()],
      'fm_company_details_aliases',
    );
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockFinesService.finesMacState.companyDetails.formData);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith(
      'fm_company_details_add_alias',
      'fm_company_details_aliases',
    );
  });
});
