import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EmployerDetailsComponent } from './employer-details.component';
import { MacStateService } from '@services';
import { IManualAccountCreationEmployerDetailsForm, IManualAccountCreationEmployerDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import { MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';

describe('EmployerDetailsComponent', () => {
  let component: EmployerDetailsComponent;
  let fixture: ComponentFixture<EmployerDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [EmployerDetailsComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const formData: IManualAccountCreationEmployerDetailsState = {
      employerName: 'Test',
      employeeReference: null,
      employerEmailAddress: null,
      employerTelephone: null,
      employerAddress1: null,
      employerAddress2: null,
      employerAddress3: null,
      employerAddress4: null,
      employerAddress5: null,
      employerPostcode: null,
    };

    const employerDetailsFormSubmit: IManualAccountCreationEmployerDetailsForm = {
      formData: formData,
      continueFlow: false,
    };

    component.handleEmployerDetailsSubmit(employerDetailsFormSubmit);

    expect(mockMacStateService.manualAccountCreation.employerDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    const formData: IManualAccountCreationEmployerDetailsState = {
      employerName: 'Test',
      employeeReference: null,
      employerEmailAddress: null,
      employerTelephone: null,
      employerAddress1: null,
      employerAddress2: null,
      employerAddress3: null,
      employerAddress4: null,
      employerAddress5: null,
      employerPostcode: null,
    };

    const employerDetailsFormSubmit: IManualAccountCreationEmployerDetailsForm = {
      formData: formData,
      continueFlow: true,
    };

    component.handleEmployerDetailsSubmit(employerDetailsFormSubmit);

    expect(mockMacStateService.manualAccountCreation.employerDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.offenceDetails]);
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.defendantType = 'parentOrGuardianToPay';

    const formData: IManualAccountCreationEmployerDetailsState = {
      employerName: 'Test',
      employeeReference: null,
      employerEmailAddress: null,
      employerTelephone: null,
      employerAddress1: null,
      employerAddress2: null,
      employerAddress3: null,
      employerAddress4: null,
      employerAddress5: null,
      employerPostcode: null,
    };

    const employerDetailsFormSubmit: IManualAccountCreationEmployerDetailsForm = {
      formData: formData,
      continueFlow: true,
    };

    component.handleEmployerDetailsSubmit(employerDetailsFormSubmit);

    expect(mockMacStateService.manualAccountCreation.employerDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.personalDetails]);
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
