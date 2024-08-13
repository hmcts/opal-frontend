import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCompanyDetailsComponent } from './fines-mac-company-details.component';
import { IFinesMacCompanyDetailsForm, IFinesMacCompanyDetailsState } from './interfaces';
import { FinesService } from '@services/fines';
import { FINES_MAC_STATE_MOCK } from '../mocks';
import { FINES_MAC_COMPANY_DETAILS_FORM_MOCK, FINES_MAC_COMPANY_DETAILS_STATE_MOCK } from './mocks';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';

describe('FinesMacCompanyDetailsComponent', () => {
  let component: FinesMacCompanyDetailsComponent;
  let fixture: ComponentFixture<FinesMacCompanyDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formData: IFinesMacCompanyDetailsState;
  let formSubmit: IFinesMacCompanyDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formData = FINES_MAC_COMPANY_DETAILS_STATE_MOCK;
    formSubmit = FINES_MAC_COMPANY_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacCompanyDetailsComponent],
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
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleCompanyDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.companyDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.contactDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
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
