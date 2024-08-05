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
  let formData: IManualAccountCreationParentGuardianDetailsState;
  let formSubmit: IManualAccountCreationParentGuardianForm;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    formData = {
      FullName: 'Test test',
      DOB: '',
      NationalInsuranceNumber: '',
      AddressLine1: '',
      AddressLine2: '',
      AddressLine3: '',
      Postcode: '',
    };

    formSubmit = {
      formData: formData,
      nestedFlow: false,
    };

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

    component.handleParentGuardianDetailsSubmit(formSubmit);

    expect(mockMacStateService.manualAccountCreation.parentGuardianDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.defendantType = 'parentOrGuardianToPay';

    formSubmit.nestedFlow = true;

    component.handleParentGuardianDetailsSubmit(formSubmit);

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
