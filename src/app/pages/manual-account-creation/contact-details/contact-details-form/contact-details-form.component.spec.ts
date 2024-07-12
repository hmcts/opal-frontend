import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactDetailsFormComponent } from './contact-details-form.component';
import { MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_FORM_MOCK } from '@mocks';
import { MacStateService } from '@services';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
} from '@constants';

describe('ContactDetailsFormComponent', () => {
  let component: ContactDetailsFormComponent;
  let fixture: ComponentFixture<ContactDetailsFormComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = {
      accountDetails: { ...MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE, defendantType: 'adultOrYouthOnly' },
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [ContactDetailsFormComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'continue-flow' } } as SubmitEvent;
    const contactDetailsForm = MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_FORM_MOCK;
    contactDetailsForm.continueFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](contactDetailsForm.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(contactDetailsForm);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    const contactDetailsForm = MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_FORM_MOCK;
    contactDetailsForm.continueFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](contactDetailsForm.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(contactDetailsForm);
  });
});
