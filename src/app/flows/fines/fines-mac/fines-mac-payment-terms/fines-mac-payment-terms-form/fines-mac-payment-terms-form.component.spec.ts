import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacPaymentTermsFormComponent } from './fines-mac-payment-terms-form.component';
import { FinesService } from '@services/fines';
import { ActivatedRoute } from '@angular/router';
import { IFinesMacPaymentTermsForm } from '../interfaces';
import { FINES_MAC_STATE_MOCK } from '../../mocks';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from '../mocks';
import { DateService } from '@services';
import { DateTime } from 'luxon';

describe('FinesMacPaymentTermsFormComponent', () => {
  let component: FinesMacPaymentTermsFormComponent;
  let fixture: ComponentFixture<FinesMacPaymentTermsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacPaymentTermsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockDateService = jasmine.createSpyObj(DateService, ['getPreviousDate', 'calculateAge']);

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

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should call initialPaymentTermsSetup method', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPaymentTermsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'hasDaysInDefaultListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'paymentTermsListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'checkDefendantAge');
    mockDateService.getPreviousDate.and.returnValue('30/08/2024');

    component['initialPaymentTermsSetup']();

    expect(component['setupPaymentTermsForm']).toHaveBeenCalled();
    expect(component['hasDaysInDefaultListener']).toHaveBeenCalled();
    expect(component['paymentTermsListener']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(
      component['finesService'].finesMacState.paymentTerms.formData,
    );
    expect(component['checkDefendantAge']).toHaveBeenCalled();
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should add controls when has_days_in_default is true', () => {
    const hasDaysInDefaultControl = component.form.controls['has_days_in_default'];
    hasDaysInDefaultControl.setValue(true);

    component['hasDaysInDefaultListener']();

    expect(component.form.contains('days_in_default_date')).toBe(true);
    expect(component.form.contains('days_in_default')).toBe(true);
  });

  it('should remove controls when has_days_in_default is false', () => {
    const hasDaysInDefaultControl = component.form.controls['has_days_in_default'];
    hasDaysInDefaultControl.setValue(false);

    component['hasDaysInDefaultListener']();

    expect(component.form.contains('days_in_default_date')).toBe(false);
    expect(component.form.contains('days_in_default')).toBe(false);
  });

  it('should check defendant age and set isAdult to true when age is 18 or above', () => {
    const dob = DateTime.now().minus({ years: 30 }).toFormat('dd/MM/yyyy');
    mockFinesService.finesMacState.personalDetails.formData.dob = dob;
    mockDateService.calculateAge.and.returnValue(30);

    component['checkDefendantAge']();

    expect(component.isAdult).toBe(true);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dob);
  });

  it('should check defendant age and set isAdult to false when age is below 18', () => {
    const dob = DateTime.now().minus({ years: 10 }).toFormat('dd/MM/yyyy');
    mockFinesService.finesMacState.personalDetails.formData.dob = dob;
    mockDateService.calculateAge.and.returnValue(10);

    component['checkDefendantAge']();

    expect(component.isAdult).toBe(false);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dob);
  });
});
