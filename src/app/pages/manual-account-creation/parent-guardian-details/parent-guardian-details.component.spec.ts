import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentGuardianDetailsComponent } from './parent-guardian-details.component';
import { ManualAccountCreationRoutes } from '@enums';
import {
  IManualAccountCreationParentGuardianDetailsState,
  IManualAccountCreationParentGuardianForm,
} from '@interfaces';
import { MacStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';

describe('ParentGuardianDetailsComponent', () => {
  let component: ParentGuardianDetailsComponent;
  let fixture: ComponentFixture<ParentGuardianDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [ParentGuardianDetailsComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentGuardianDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const formData: IManualAccountCreationParentGuardianDetailsState = {
      fullName: 'Test test',
      dateOfBirth: '',
      nationalInsuranceNumber: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    };

    const parentGuardianFormSubmit: IManualAccountCreationParentGuardianForm = {
      formData: formData,
      continueFlow: false,
    };

    component.handleParentGuardianDetailsSubmit(parentGuardianFormSubmit);

    expect(mockMacStateService.manualAccountCreation.parentGuardianDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.macStateService.manualAccountCreation.accountDetails.defendantType = 'parentOrGuardianToPay';

    const formData: IManualAccountCreationParentGuardianDetailsState = {
      fullName: 'Test test',
      dateOfBirth: '',
      nationalInsuranceNumber: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    };

    const parentGuardianFormSubmit: IManualAccountCreationParentGuardianForm = {
      formData: formData,
      continueFlow: true,
    };

    component.handleParentGuardianDetailsSubmit(parentGuardianFormSubmit);

    expect(mockMacStateService.manualAccountCreation.parentGuardianDetails).toEqual(formData);
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
