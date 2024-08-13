import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacEmployerDetailsFormComponent } from './fines-mac-employer-details-form.component';
import { FinesService } from '@services/fines';
import { FINES_MAC_STATE_MOCK } from '@mocks/fines/mac';
import { IFinesMacEmployerDetailsForm } from '../interfaces';
import { FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK } from '../mocks';
import { ActivatedRoute } from '@angular/router';

describe('FinesMacEmployerDetailsFormComponent', () => {
  let component: FinesMacEmployerDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacEmployerDetailsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacEmployerDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacEmployerDetailsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacEmployerDetailsFormComponent);
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
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });
});
