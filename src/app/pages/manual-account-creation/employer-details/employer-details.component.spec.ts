import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EmployerDetailsComponent } from './employer-details.component';
import { StateService } from '@services';
import { IManualAccountCreationEmployerDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import {
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
} from '@constants';

describe('EmployerDetailsComponent', () => {
  let component: EmployerDetailsComponent;
  let fixture: ComponentFixture<EmployerDetailsComponent>;
  let mockStateService: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('StateService', ['manualAccountCreation']);

    mockStateService.manualAccountCreation = {
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [EmployerDetailsComponent],
      providers: [{ provide: StateService, useValue: mockStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate', () => {
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

    component.handleEmployerDetailsSubmit(formData);

    expect(mockStateService.manualAccountCreation.employerDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.createAccount]);
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component.stateService.manualAccountCreation.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component.stateService.manualAccountCreation.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
