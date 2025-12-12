import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { DateTime } from 'luxon';

import { FinesAccPaymentTermsAmendFormComponent } from './fines-acc-payment-terms-amend-form.component';
import { IFinesAccPaymentTermsAmendForm } from '../interfaces/fines-acc-payment-terms-amend-form.interface';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM } from '../constants/fines-acc-payment-terms-amend-form.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from '../../stores/fines-acc.store';

describe('FinesAccPaymentTermsAmendFormComponent', () => {
  let component: FinesAccPaymentTermsAmendFormComponent;
  let fixture: ComponentFixture<FinesAccPaymentTermsAmendFormComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockAccountStore: jasmine.SpyObj<typeof FinesAccountStore>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { data: {} },
      params: of({}),
      queryParams: of({}),
      data: of({}),
    });
    mockDateService = jasmine.createSpyObj('DateService', [
      'isValidDate',
      'isDateInThePast',
      'isDateInTheFuture',
      'getDateNow',
      'toFormat',
      'getPreviousDate',
    ]);
    mockAccountStore = jasmine.createSpyObj('FinesAccountStore', [], {
      defendantType: signal('individual'),
      accountDetails: signal({}),
      paymentTerms: signal({}),
      account_number: signal('ACC123'),
      party_name: signal('John Doe'),
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesAccPaymentTermsAmendFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DateService, useValue: mockDateService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
      ],
    }).compileComponents();

    // Setup DateService mock return values
    mockDateService.getDateNow.and.returnValue(DateTime.fromISO('2024-01-02'));
    mockDateService.toFormat.and.returnValue('02/01/2024');
    mockDateService.getPreviousDate.and.returnValue('01/01/2024');
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.isDateInThePast.and.returnValue(false);
    mockDateService.isDateInTheFuture.and.returnValue(false);

    fixture = TestBed.createComponent(FinesAccPaymentTermsAmendFormComponent);
    component = fixture.componentInstance;

    // Setup date service mocks
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.isDateInThePast.and.returnValue(false);
    mockDateService.isDateInTheFuture.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default form data when no initial data provided', () => {
    component.ngOnInit();

    expect(component.initialFormData).toEqual(FINES_ACC_PAYMENT_TERMS_AMEND_FORM);
  });

  it('should not overwrite initialFormData when already set', () => {
    const existingFormData: IFinesAccPaymentTermsAmendForm = {
      formData: {
        ...FINES_ACC_PAYMENT_TERMS_AMEND_FORM.formData,
        facc_payment_terms_payment_terms: 'payInInstalments',
      },
      nestedFlow: false,
    };

    component.initialFormData = existingFormData;
    component.ngOnInit();

    expect(component.initialFormData).toEqual(existingFormData);
    expect(component.initialFormData).not.toEqual(FINES_ACC_PAYMENT_TERMS_AMEND_FORM);
  });

  it('should initialize form with correct controls', () => {
    component.ngOnInit();

    const expectedControls = [
      'facc_payment_terms_payment_terms',
      'facc_payment_terms_pay_by_date',
      'facc_payment_terms_lump_sum_amount',
      'facc_payment_terms_instalment_amount',
      'facc_payment_terms_instalment_period',
      'facc_payment_terms_start_date',
      'facc_payment_terms_payment_card_request',
      'facc_payment_terms_has_days_in_default',
      'facc_payment_terms_suspended_committal_date',
      'facc_payment_terms_default_days_in_jail',
      'facc_payment_terms_reason_for_change',
      'facc_payment_terms_change_letter',
    ];

    expectedControls.forEach((controlName) => {
      expect(component.form.get(controlName)).toBeTruthy();
    });
  });

  it('should set payment terms as required', () => {
    component.ngOnInit();

    const paymentTermsControl = component.form.get('facc_payment_terms_payment_terms');
    expect(paymentTermsControl?.hasError('required')).toBeTruthy();
  });

  describe('Conditional Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should require pay by date when payment term is payInFull', () => {
      const paymentTermsControl = component.form.get('facc_payment_terms_payment_terms');
      const payByDateControl = component.form.get('facc_payment_terms_pay_by_date');

      paymentTermsControl?.setValue('payInFull');

      expect(payByDateControl?.hasError('required')).toBeTruthy();
    });

    it('should require instalment fields when payment term is instalmentsOnly', () => {
      const paymentTermsControl = component.form.get('facc_payment_terms_payment_terms');
      const instalmentAmountControl = component.form.get('facc_payment_terms_instalment_amount');
      const instalmentPeriodControl = component.form.get('facc_payment_terms_instalment_period');
      const startDateControl = component.form.get('facc_payment_terms_start_date');

      paymentTermsControl?.setValue('instalmentsOnly');

      expect(instalmentAmountControl?.hasError('required')).toBeTruthy();
      expect(instalmentPeriodControl?.hasError('required')).toBeTruthy();
      expect(startDateControl?.hasError('required')).toBeTruthy();
    });

    it('should require lump sum and instalment fields when payment term is lumpSumPlusInstalments', () => {
      const paymentTermsControl = component.form.get('facc_payment_terms_payment_terms');
      const lumpSumAmountControl = component.form.get('facc_payment_terms_lump_sum_amount');
      const instalmentAmountControl = component.form.get('facc_payment_terms_instalment_amount');
      const instalmentPeriodControl = component.form.get('facc_payment_terms_instalment_period');
      const startDateControl = component.form.get('facc_payment_terms_start_date');

      paymentTermsControl?.setValue('lumpSumPlusInstalments');

      expect(lumpSumAmountControl?.hasError('required')).toBeTruthy();
      expect(instalmentAmountControl?.hasError('required')).toBeTruthy();
      expect(instalmentPeriodControl?.hasError('required')).toBeTruthy();
      expect(startDateControl?.hasError('required')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate decimal format for lump sum amount', () => {
      const lumpSumControl = component.form.get('facc_payment_terms_lump_sum_amount');

      // Test with non-numeric input - should fail with numericalTextPattern error first
      lumpSumControl?.setValue('abc');
      lumpSumControl?.markAsTouched();
      lumpSumControl?.updateValueAndValidity();

      // Should only have invalidDecimal error since we removed NUMERIC_PATTERN_VALIDATOR
      expect(lumpSumControl?.errors?.['invalidDecimal']).toBeTruthy();

      // Test with valid decimal
      lumpSumControl?.setValue('100.50');
      lumpSumControl?.updateValueAndValidity();
      expect(lumpSumControl?.valid).toBeTruthy();
    });

    it('should validate decimal format for instalment amount', () => {
      const instalmentControl = component.form.get('facc_payment_terms_instalment_amount');

      // Test with non-numeric input - should fail with both validators
      instalmentControl?.setValue('xyz');
      instalmentControl?.markAsTouched();
      instalmentControl?.updateValueAndValidity();

      // Should only have invalidDecimal error since we removed NUMERIC_PATTERN_VALIDATOR
      expect(instalmentControl?.errors?.['invalidDecimal']).toBeTruthy();

      // Test with valid decimal
      instalmentControl?.setValue('50.99');
      instalmentControl?.updateValueAndValidity();
      expect(instalmentControl?.valid).toBeTruthy();
    });

    it('should validate days in jail format and length', () => {
      const daysInJailControl = component.form.get('facc_payment_terms_default_days_in_jail');

      daysInJailControl?.setValue('abc');
      expect(daysInJailControl?.hasError('numericalTextPattern')).toBeTruthy();

      daysInJailControl?.setValue('123456');
      expect(daysInJailControl?.hasError('maxlength')).toBeTruthy();

      daysInJailControl?.setValue('30');
      expect(daysInJailControl?.valid).toBeTruthy();
    });

    it('should validate maximum length and pattern for reason for change field', () => {
      const reasonControl = component.form.get('facc_payment_terms_reason_for_change');

      const longText = 'a'.repeat(251);
      reasonControl?.setValue(longText);
      expect(reasonControl?.hasError('maxlength')).toBeTruthy();

      reasonControl?.setValue('Invalid@#$%^characters');
      expect(reasonControl?.hasError('alphanumericWithHyphensSpacesApostrophesDotPattern')).toBeTruthy();

      const validText = "Valid text with hyphens-apostrophes'.";
      reasonControl?.setValue(validText);
      expect(reasonControl?.valid).toBeTruthy();
    });

    it('should require reason for change field', () => {
      const reasonControl = component.form.get('facc_payment_terms_reason_for_change');

      reasonControl?.setValue('');
      expect(reasonControl?.hasError('required')).toBeTruthy();

      reasonControl?.setValue('Valid reason');
      expect(reasonControl?.valid).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should route to defendant details with payment-terms fragment', () => {
      component.handleRouteToDefendantDetails();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['../../details'], {
        relativeTo: mockActivatedRoute,
        fragment: 'payment-terms',
      });
    });
  });

  describe('Form Population', () => {
    it('should populate form with initial data', () => {
      const testData: IFinesAccPaymentTermsAmendForm = {
        formData: {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '2023-12-31',
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null,
          facc_payment_terms_payment_card_request: false,
          facc_payment_terms_prevent_payment_card: false,
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: 'Test reason',
          facc_payment_terms_change_letter: true,
        },
        nestedFlow: false,
      };

      component.initialFormData = testData;
      component.ngOnInit();

      expect(component.form.get('facc_payment_terms_payment_terms')?.value).toBe('payInFull');
      expect(component.form.get('facc_payment_terms_pay_by_date')?.value).toBe('2023-12-31');
      expect(component.form.get('facc_payment_terms_payment_card_request')?.value).toBe(false);
      expect(component.form.get('facc_payment_terms_reason_for_change')?.value).toBe('Test reason');
      expect(component.form.get('facc_payment_terms_change_letter')?.value).toBe(true);
    });
  });

  describe('Payment Terms Options', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have correct payment terms options', () => {
      expect(component.paymentTerms).toBeDefined();
      expect(component.paymentTerms.length).toBeGreaterThan(0);

      const payInFullOption = component.paymentTerms.find((option) => option.key === 'payInFull');
      expect(payInFullOption).toBeTruthy();
      expect(payInFullOption?.value).toBeDefined();
    });

    it('should have correct frequency options', () => {
      expect(component.frequencyOptions).toBeDefined();
      expect(component.frequencyOptions.length).toBeGreaterThan(0);

      const weeklyOption = component.frequencyOptions.find((option) => option.key === 'W');
      expect(weeklyOption).toBeTruthy();
      expect(weeklyOption?.value).toBe('Weekly');
    });
  });

  describe('Date Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should initialize date validation flags', () => {
      expect(component.dateInPast).toBe(false);
      expect(component.dateInFuture).toBe(false);
    });

    it('should validate dates on initial form population', () => {
      // Setup mock to return that date is in the past
      mockDateService.isDateInThePast.and.returnValue(true);
      mockDateService.isDateInTheFuture.and.returnValue(false);

      const testData: IFinesAccPaymentTermsAmendForm = {
        formData: {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '2023-01-01', // Past date
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null,
          facc_payment_terms_payment_card_request: false,
          facc_payment_terms_prevent_payment_card: false,
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: 'Test reason',
          facc_payment_terms_change_letter: true,
        },
        nestedFlow: false,
      };

      component.initialFormData = testData;
      component.ngOnInit();

      // Verify that date validation was called and flags are set
      expect(mockDateService.isDateInThePast).toHaveBeenCalledWith('2023-01-01');
      expect(component.dateInPast).toBe(true);
      expect(component.dateInFuture).toBe(false);
    });

    it('should validate future dates on initial form population', () => {
      // Setup mock to return that date is in the future
      mockDateService.isDateInThePast.and.returnValue(false);
      mockDateService.isDateInTheFuture.and.returnValue(true);

      const testData: IFinesAccPaymentTermsAmendForm = {
        formData: {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_pay_by_date: null,
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: 100.0,
          facc_payment_terms_instalment_period: 'W',
          facc_payment_terms_start_date: '2025-12-31', // Future date
          facc_payment_terms_payment_card_request: false,
          facc_payment_terms_prevent_payment_card: false,
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: 'Test reason',
          facc_payment_terms_change_letter: true,
        },
        nestedFlow: false,
      };

      component.initialFormData = testData;
      component.ngOnInit();

      // Verify that date validation was called and flags are set
      expect(mockDateService.isDateInTheFuture).toHaveBeenCalledWith('2025-12-31', 0.6);
      expect(component.dateInPast).toBe(false);
      expect(component.dateInFuture).toBe(true);
    });

    it('should not validate suspended committal date for banner flags', () => {
      // Reset mocks and component state
      mockDateService.isDateInThePast.calls.reset();
      mockDateService.isDateInTheFuture.calls.reset();
      mockDateService.isValidDate.calls.reset();

      // Setup mocks to return false for date validation methods since no relevant dates should be validated
      mockDateService.isValidDate.and.returnValue(false);
      mockDateService.isDateInThePast.and.returnValue(false);
      mockDateService.isDateInTheFuture.and.returnValue(false);

      const testData: IFinesAccPaymentTermsAmendForm = {
        formData: {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: null, // No date to validate
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null, // No date to validate
          facc_payment_terms_payment_card_request: false,
          facc_payment_terms_prevent_payment_card: false,
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: '2023-01-01', // Past date - should not affect banner
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: 'Test reason',
          facc_payment_terms_change_letter: true,
        },
        nestedFlow: false,
      };

      component.initialFormData = testData;
      component.ngOnInit();

      // Verify that suspended committal date was not checked for banner validation
      expect(mockDateService.isDateInThePast).not.toHaveBeenCalledWith('2023-01-01');
      expect(component.dateInPast).toBe(false);
      expect(component.dateInFuture).toBe(false);
    });
  });
});
