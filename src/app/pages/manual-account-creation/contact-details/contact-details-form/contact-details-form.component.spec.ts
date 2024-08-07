import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactDetailsFormComponent } from './contact-details-form.component';
import { MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_FORM_MOCK, MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';
import { MacStateService } from '@services';

describe('ContactDetailsFormComponent', () => {
  let component: ContactDetailsFormComponent;
  let fixture: ComponentFixture<ContactDetailsFormComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [ContactDetailsFormComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    const formSubmit = MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_FORM_MOCK;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    const formSubmit = MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_FORM_MOCK;
    formSubmit.nestedFlow = false;
    component.defendantType = 'adultOrYouthOnly';
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });
});
