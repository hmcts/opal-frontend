import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacPaymentTermsFormComponent } from './fines-mac-payment-terms-form.component';
import { FinesService } from '@services/fines';
import { ActivatedRoute } from '@angular/router';
import { IFinesMacPaymentTermsForm } from '../interfaces';
import { FINES_MAC_STATE_MOCK } from '../../mocks';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from '../mocks';
import { DateService } from '@services';

describe('FinesMacPaymentTermsFormComponent', () => {
  let component: FinesMacPaymentTermsFormComponent;
  let fixture: ComponentFixture<FinesMacPaymentTermsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacPaymentTermsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);
    mockDateService = jasmine.createSpyObj('DateService', ['getPreviousDate']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_PAYMENT_TERMS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacPaymentTermsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacPaymentTermsFormComponent);
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
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should call initialPaymentTermsSetup method', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPaymentTermsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'hasDaysInDefaultListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    mockDateService.getPreviousDate.and.returnValue('30/08/2024');

    component['initialPaymentTermsSetup']();

    expect(component['setupPaymentTermsForm']).toHaveBeenCalled();
    expect(component['hasDaysInDefaultListener']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(component['finesService'].finesMacState.paymentTerms);
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should add controls when hasDaysInDefault is true', () => {
    const hasDaysInDefaultControl = component.form.controls['hasDaysInDefault'];
    hasDaysInDefaultControl.setValue(true);

    component['hasDaysInDefaultListener']();

    expect(component.form.contains('daysInDefaultDate')).toBe(true);
    expect(component.form.contains('daysInDefault')).toBe(true);
  });

  it('should remove controls when hasDaysInDefault is false', () => {
    const hasDaysInDefaultControl = component.form.controls['hasDaysInDefault'];
    hasDaysInDefaultControl.setValue(false);

    component['hasDaysInDefaultListener']();

    expect(component.form.contains('daysInDefaultDate')).toBe(false);
    expect(component.form.contains('daysInDefault')).toBe(false);
  });
});
