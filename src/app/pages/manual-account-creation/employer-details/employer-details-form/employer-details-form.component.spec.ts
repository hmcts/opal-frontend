import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployerDetailsFormComponent } from './employer-details-form.component';
import { MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK, MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';
import { MacStateService } from '@services';

describe('EmployerDetailsFormComponent', () => {
  let component: EmployerDetailsFormComponent;
  let fixture: ComponentFixture<EmployerDetailsFormComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

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
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    const employerDetailsForm = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK;
    employerDetailsForm.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](employerDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(employerDetailsForm);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    const employerDetailsForm = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK;
    employerDetailsForm.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](employerDetailsForm.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(employerDetailsForm);
  });
});
