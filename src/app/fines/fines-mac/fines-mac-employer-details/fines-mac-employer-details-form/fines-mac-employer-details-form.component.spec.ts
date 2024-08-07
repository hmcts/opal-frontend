import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacEmployerDetailsFormComponent } from './fines-mac-employer-details-form.component';
import { FinesService } from 'src/app/fines/services/fines.service';
import { FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK, FINES_MAC_STATE_MOCK } from '../../mocks';
import { IFinesMacEmployerDetailsForm } from '../../interfaces';

describe('FinesMacEmployerDetailsFormComponent', () => {
  let component: FinesMacEmployerDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacEmployerDetailsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacEmployerDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacEmployerDetailsFormComponent],
      providers: [{ provide: FinesService, useValue: mockFinesService }],
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
