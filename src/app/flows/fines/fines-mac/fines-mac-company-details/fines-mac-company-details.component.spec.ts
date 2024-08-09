import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCompanyDetailsComponent } from './fines-mac-company-details.component';
import { IFinesMacCompanyDetailsForm, IFinesMacCompanyDetailsState } from '@interfaces/fines/mac';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FinesService } from '@services/fines';
import {
  FINES_MAC__COMPANY_DETAILS_FORM_MOCK,
  FINES_MAC__COMPANY_DETAILS_STATE_MOCK,
  FINES_MAC__STATE_MOCK,
} from '@mocks/fines/mac';

describe('FinesMacCompanyDetailsComponent', () => {
  let component: FinesMacCompanyDetailsComponent;
  let fixture: ComponentFixture<FinesMacCompanyDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formData: IFinesMacCompanyDetailsState;
  let formSubmit: IFinesMacCompanyDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC__STATE_MOCK;
    formData = FINES_MAC__COMPANY_DETAILS_STATE_MOCK;
    formSubmit = FINES_MAC__COMPANY_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacCompanyDetailsComponent],
      providers: [{ provide: FinesService, useValue: mockFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCompanyDetailsComponent);
    component = fixture.componentInstance;

    component.defendantType = 'company';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handleCompanyDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.companyDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacAccountDetails]);
  });

  it('should handle form submission and navigate next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleCompanyDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.companyDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacContactDetails]);
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component['finesService'].finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component['finesService'].finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
