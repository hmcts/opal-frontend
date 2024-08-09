import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacContactDetailsFormComponent } from './fines-mac-contact-details-form.component';
import { FinesService } from '@services/fines';
import { IFinesMacContactDetailsForm } from '@interfaces/fines/mac';
import { FINES_MAC__CONTACT_DETAILS_FORM_MOCK, FINES_MAC__STATE_MOCK } from '@mocks/fines/mac';

describe('FinesMacContactDetailsFormComponent', () => {
  let component: FinesMacContactDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacContactDetailsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacContactDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC__STATE_MOCK;
    formSubmit = FINES_MAC__CONTACT_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacContactDetailsFormComponent],
      providers: [{ provide: FinesService, useValue: mockFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacContactDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    component.defendantType = 'adultOrYouthOnly';
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });
});
