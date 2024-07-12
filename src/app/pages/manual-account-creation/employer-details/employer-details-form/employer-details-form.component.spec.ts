import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployerDetailsFormComponent } from './employer-details-form.component';
import { MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK } from '@mocks';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
} from '@constants';
import { MacStateService } from '@services';

describe('EmployerDetailsFormComponent', () => {
  let component: EmployerDetailsFormComponent;
  let fixture: ComponentFixture<EmployerDetailsFormComponent>;
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
      imports: [EmployerDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.form.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value - continue flow', () => {
    const event = { submitter: { className: 'continue-flow' } } as SubmitEvent;
    const employerDetailsForm = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK;
    employerDetailsForm.continueFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](employerDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(employerDetailsForm);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    const employerDetailsForm = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK;
    employerDetailsForm.continueFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](employerDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(employerDetailsForm);
  });
});
