import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsComponent } from './personal-details.component';
import { MacStateService } from '@services';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
} from '@constants';
import { IManualAccountCreationPersonalDetailsForm, IManualAccountCreationPersonalDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';

describe('PersonalDetailsComponent', () => {
  let component: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;
  let formData: IManualAccountCreationPersonalDetailsState;
  let formSubmit: IManualAccountCreationPersonalDetailsForm;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
      companyDetails: MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    formData = {
      title: 'Mr',
      firstNames: null,
      lastName: null,
      addAlias: false,
      aliases: [],
      dateOfBirth: null,
      nationalInsuranceNumber: null,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
      makeOfCar: null,
      registrationNumber: null,
    };

    formSubmit = {
      formData: formData,
      continueFlow: false,
    };

    await TestBed.configureTestingModule({
      imports: [PersonalDetailsComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handlePersonalDetailsSubmit(formSubmit);

    expect(mockMacStateService.manualAccountCreation.personalDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should handle form submission and navigate next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.macStateService.manualAccountCreation.accountDetails.defendantType = 'adultOrYouthOnly';

    formSubmit.continueFlow = true;

    component.handlePersonalDetailsSubmit(formSubmit);

    expect(mockMacStateService.manualAccountCreation.personalDetails).toEqual(formData);
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
