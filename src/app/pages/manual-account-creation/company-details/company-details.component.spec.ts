import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailsComponent } from './company-details.component';
import { MacStateService } from '@services';
import { IManualAccountCreationCompanyDetailsForm, IManualAccountCreationCompanyDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import { MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';

describe('CompanyDetailsComponent', () => {
  let component: CompanyDetailsComponent;
  let fixture: ComponentFixture<CompanyDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;
  let formData: IManualAccountCreationCompanyDetailsState;
  let formSubmit: IManualAccountCreationCompanyDetailsForm;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    formData = {
      companyName: 'Test',
      addAlias: false,
      aliases: [],
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    };

    formSubmit = {
      formData: formData,
      continueFlow: false,
    };

    await TestBed.configureTestingModule({
      imports: [CompanyDetailsComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleCompanyDetailsSubmit(formSubmit);

    expect(mockMacStateService.manualAccountCreation.companyDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should handle form submission and navigate next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.macStateService.manualAccountCreation.accountDetails.defendantType = 'company';

    formSubmit.continueFlow = true;

    component.handleCompanyDetailsSubmit(formSubmit);

    expect(mockMacStateService.manualAccountCreation.companyDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.contactDetails]);
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component.macStateService.manualAccountCreation.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component.macStateService.manualAccountCreation.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
