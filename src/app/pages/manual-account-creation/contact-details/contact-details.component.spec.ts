import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailsComponent } from './contact-details.component';
import { MacStateService } from '@services';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
} from '@constants';
import { IManualAccountCreationContactDetailsForm, IManualAccountCreationContactDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
      courtDetails: MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE,
      businessUnit: MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [ContactDetailsComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const formData: IManualAccountCreationContactDetailsState = {
      primaryEmailAddress: 'Test',
      secondaryEmailAddress: null,
      homeTelephoneNumber: null,
      mobileTelephoneNumber: null,
      workTelephoneNumber: null,
    };

    const contactDetailsFormSubmit: IManualAccountCreationContactDetailsForm = {
      formData,
      nestedFlow: false,
    };

    component.handleContactDetailsSubmit(contactDetailsFormSubmit);

    expect(mockMacStateService.manualAccountCreation.contactDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.defendantType = 'adultOrYouthOnly';

    const formData: IManualAccountCreationContactDetailsState = {
      primaryEmailAddress: 'Test',
      secondaryEmailAddress: null,
      homeTelephoneNumber: null,
      mobileTelephoneNumber: null,
      workTelephoneNumber: null,
    };

    const contactDetailsFormSubmit: IManualAccountCreationContactDetailsForm = {
      formData,
      nestedFlow: true,
    };

    component.handleContactDetailsSubmit(contactDetailsFormSubmit);

    expect(mockMacStateService.manualAccountCreation.contactDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.employerDetails]);
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
