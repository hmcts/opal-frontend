import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailsComponent } from './contact-details.component';
import { MacStateService } from '@services';
import { IManualAccountCreationContactDetailsForm, IManualAccountCreationContactDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import { MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [ContactDetailsComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

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
      continueFlow: false,
    };

    component.handleContactDetailsSubmit(contactDetailsFormSubmit);

    expect(mockMacStateService.manualAccountCreation.contactDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should handle form submission and navigate to next route', () => {
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
      continueFlow: true,
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
