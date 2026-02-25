import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { DateTime } from 'luxon';

import { FinesAccPaymentTermsAmendFormComponent } from './fines-acc-payment-terms-amend-form.component';
import { IFinesAccPaymentTermsAmendForm } from '../interfaces/fines-acc-payment-terms-amend-form.interface';
import { IFinesAccPaymentTermsAmendState } from '../interfaces/fines-acc-payment-terms-amend-state.interface';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM } from '../constants/fines-acc-payment-terms-amend-form.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { payInFullPaymentCardValidator } from '../validators/fines-acc-payment-terms-pay-in-full.validator';
import { changeLetterWithoutChangesValidator } from '../validators/fines-acc-payment-terms-change-letter.validator';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('FinesAccPaymentTermsAmendFormComponent', () => {
  let component: FinesAccPaymentTermsAmendFormComponent;
  let fixture: ComponentFixture<FinesAccPaymentTermsAmendFormComponent>;
  let mockRouter: ReturnType<typeof createSpyObj>;
  let mockActivatedRoute: ActivatedRoute;
  let mockDateService: ReturnType<typeof createSpyObj>;
  let mockAccountStore: {
    defendantType: ReturnType<typeof signal>;
    accountDetails: ReturnType<typeof signal>;
    paymentTerms: ReturnType<typeof signal>;
    account_number: ReturnType<typeof signal>;
    party_name: ReturnType<typeof signal>;
    business_unit_id: ReturnType<typeof signal>;
  };
  let mockOpalFinesService: ReturnType<typeof createSpyObj>;

  beforeEach(async () => {
    mockRouter = createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: { data: {} },
      params: of({}),
      queryParams: of({}),
      data: of({}),
    } as unknown as ActivatedRoute;
    mockDateService = createSpyObj('DateService', [
      'isValidDate',
      'isDateInThePast',
      'isDateInTheFuture',
      'getDateNow',
      'toFormat',
      'getPreviousDate',
    ]);
    mockAccountStore = {
      defendantType: signal('individual'),
      accountDetails: signal({}),
      paymentTerms: signal({}),
      account_number: signal('ACC123'),
      party_name: signal('John Doe'),
      business_unit_id: signal('61'),
    };

    mockOpalFinesService = createSpyObj('OpalFines', ['getBusinessUnitById']);
    mockOpalFinesService['getBusinessUnitById'].mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, FinesAccPaymentTermsAmendFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DateService, useValue: mockDateService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: OpalFines, useValue: mockOpalFinesService },
      ],
    }).compileComponents();

    // Setup DateService mock return values
    mockDateService['getDateNow'].mockReturnValue(DateTime.fromISO('2024-01-02'));
    mockDateService['toFormat'].mockReturnValue('02/01/2024');
    mockDateService['getPreviousDate'].mockReturnValue('01/01/2024');
    mockDateService['isValidDate'].mockReturnValue(true);
    mockDateService['isDateInThePast'].mockReturnValue(false);
    mockDateService['isDateInTheFuture'].mockReturnValue(false);

    fixture = TestBed.createComponent(FinesAccPaymentTermsAmendFormComponent);
    component = fixture.componentInstance;

    // Setup date service mocks
    mockDateService['isValidDate'].mockReturnValue(true);
    mockDateService['isDateInThePast'].mockReturnValue(false);
    mockDateService['isDateInTheFuture'].mockReturnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default form data when no initial data provided', () => {
    // Explicitly ensure initialFormData is undefined to test the default assignment
    component.initialFormData = undefined as unknown as IFinesAccPaymentTermsAmendForm;

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

      expect(mockRouter['navigate']).toHaveBeenCalledWith(['../../details'], {
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
      expect(component.payByDateInPast).toBe(false);
      expect(component.payByDateInFuture).toBe(false);
      expect(component.startDateInPast).toBe(false);
      expect(component.startDateInFuture).toBe(false);
    });

    it('should validate dates on initial form population', () => {
      // Reset component flags
      component.payByDateInPast = false;
      component.payByDateInFuture = false;
      component.startDateInPast = false;
      component.startDateInFuture = false;

      // Setup mock to return different values based on the input date
      mockDateService['isValidDate'].mockImplementation((date: string) => date === '2023-01-01');
      mockDateService['isDateInThePast'].mockImplementation((date: string) => date === '2023-01-01');
      mockDateService['isDateInTheFuture'].mockImplementation(() => false);

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
      expect(mockDateService['isDateInThePast']).toHaveBeenCalledWith('2023-01-01');
      expect(component.payByDateInPast).toBe(true);
      expect(component.payByDateInFuture).toBe(false);
      expect(component.startDateInPast).toBe(false);
      expect(component.startDateInFuture).toBe(false);
    });

    it('should validate future dates on initial form population', () => {
      // Reset component flags
      component.payByDateInPast = false;
      component.payByDateInFuture = false;
      component.startDateInPast = false;
      component.startDateInFuture = false;

      // Setup mock to return different values based on the input date
      mockDateService['isValidDate'].mockImplementation((date: string) => date === '2025-12-31');
      mockDateService['isDateInThePast'].mockImplementation(() => false);
      mockDateService['isDateInTheFuture'].mockImplementation((date: string) => date === '2025-12-31');

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
      expect(mockDateService['isDateInTheFuture']).toHaveBeenCalledWith('2025-12-31', 0.6);
      expect(component.payByDateInPast).toBe(false);
      expect(component.payByDateInFuture).toBe(false);
      expect(component.startDateInPast).toBe(false);
      expect(component.startDateInFuture).toBe(true);
    });

    it('should not validate suspended committal date for banner flags', () => {
      // Reset mocks and component state
      mockDateService['isDateInThePast'].mockReset();
      mockDateService['isDateInTheFuture'].mockReset();
      mockDateService['isValidDate'].mockReset();

      // Setup mocks to return false for date validation methods since no relevant dates should be validated
      mockDateService['isValidDate'].mockReturnValue(false);
      mockDateService['isDateInThePast'].mockReturnValue(false);
      mockDateService['isDateInTheFuture'].mockReturnValue(false);

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
      expect(mockDateService['isDateInThePast']).not.toHaveBeenCalledWith('2023-01-01');
      expect(component.payByDateInPast).toBe(false);
      expect(component.payByDateInFuture).toBe(false);
      expect(component.startDateInPast).toBe(false);
      expect(component.startDateInFuture).toBe(false);
    });
  });

  describe('preventPaymentCard getter', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return true when payment card last requested flag is true (Condition 1)', () => {
      // Set up initial form data with payment card request flag
      component.initialFormData = {
        formData: {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: null,
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null,
          facc_payment_terms_payment_card_request: true, // Flag is true
          facc_payment_terms_prevent_payment_card: false,
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: null,
          facc_payment_terms_change_letter: false,
        },
        nestedFlow: false,
      };

      expect(component.preventPaymentCard()).toBe(true);
    });

    it('should return true when enforcement prevent payment card flag is true (Condition 2)', () => {
      // Set up initial form data with prevent payment card flag
      component.initialFormData = {
        formData: {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: null,
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null,
          facc_payment_terms_payment_card_request: null, // No flag
          facc_payment_terms_prevent_payment_card: true, // Flag is true
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: null,
          facc_payment_terms_change_letter: false,
        },
        nestedFlow: false,
      };

      expect(component.preventPaymentCard()).toBe(true);
    });

    it('should return false when no prevent conditions are met', () => {
      // Set up initial form data with no prevent conditions
      component.initialFormData = {
        formData: {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: null,
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null,
          facc_payment_terms_payment_card_request: null, // No flag
          facc_payment_terms_prevent_payment_card: false, // Flag is false
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: null,
          facc_payment_terms_change_letter: false,
        },
        nestedFlow: false,
      };

      expect(component.preventPaymentCard()).toBe(false);
    });

    it('should prioritize condition 1 (payment card request) over condition 2 (enforcement result)', () => {
      // Set up initial form data with both prevent conditions
      component.initialFormData = {
        formData: {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: null,
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null,
          facc_payment_terms_payment_card_request: true, // Flag is true (Condition 1)
          facc_payment_terms_prevent_payment_card: true, // Flag is true (Condition 2)
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: null,
          facc_payment_terms_change_letter: false,
        },
        nestedFlow: false,
      };

      // Should return true (both conditions met, but condition 1 is checked first)
      expect(component.preventPaymentCard()).toBe(true);
    });
  });

  describe('Payment Card Error Clearing', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should clear payment card errors when preventPaymentCard is true due to payment terms change', () => {
      // Setup initial form data where preventPaymentCard is false
      component.initialFormData = {
        formData: {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_pay_by_date: null,
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null,
          facc_payment_terms_payment_card_request: false, // No existing request
          facc_payment_terms_prevent_payment_card: false, // Not prevented
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: null,
          facc_payment_terms_change_letter: false,
        },
        nestedFlow: false,
      };

      const paymentCardControl = component.form.get('facc_payment_terms_payment_card_request')!;
      const paymentTermsControl = component.form.get('facc_payment_terms_payment_terms')!;

      // Manually set a payInFullRestriction error to simulate the validator setting it
      paymentCardControl.setErrors({ payInFullRestriction: true });
      expect(paymentCardControl.errors?.['payInFullRestriction']).toBeTruthy();

      // Change initial form data to trigger preventPaymentCard = true
      component.initialFormData.formData.facc_payment_terms_payment_card_request = true; // This makes preventPaymentCard true

      // Trigger payment terms change to activate the error clearing logic
      paymentTermsControl.setValue('payInFull');

      // The error should be cleared because preventPaymentCard is now true
      expect(paymentCardControl.errors?.['payInFullRestriction']).toBeFalsy();
    });

    it('should preserve other errors when clearing payInFullRestriction error', () => {
      // Setup initial form data where preventPaymentCard is false
      component.initialFormData = {
        formData: {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_pay_by_date: null,
          facc_payment_terms_lump_sum_amount: null,
          facc_payment_terms_instalment_amount: null,
          facc_payment_terms_instalment_period: null,
          facc_payment_terms_start_date: null,
          facc_payment_terms_payment_card_request: false,
          facc_payment_terms_prevent_payment_card: false,
          facc_payment_terms_has_days_in_default: null,
          facc_payment_terms_suspended_committal_date: null,
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: null,
          facc_payment_terms_change_letter: false,
        },
        nestedFlow: false,
      };

      const paymentCardControl = component.form.get('facc_payment_terms_payment_card_request')!;
      const paymentTermsControl = component.form.get('facc_payment_terms_payment_terms')!;

      // Set multiple errors including payInFullRestriction
      paymentCardControl.setErrors({
        payInFullRestriction: true,
        someOtherError: true,
      });
      expect(paymentCardControl.errors?.['payInFullRestriction']).toBeTruthy();
      expect(paymentCardControl.errors?.['someOtherError']).toBeTruthy();

      // Change initial form data to trigger preventPaymentCard = true
      component.initialFormData.formData.facc_payment_terms_payment_card_request = true;

      // Trigger payment terms change to activate the error clearing logic
      paymentTermsControl.setValue('payInFull');

      // Only payInFullRestriction error should be cleared, other errors should remain
      expect(paymentCardControl.errors?.['payInFullRestriction']).toBeFalsy();
      expect(paymentCardControl.errors?.['someOtherError']).toBeTruthy();
    });
  });
  describe('Custom Validators', () => {
    describe('payInFullPaymentCardValidator', () => {
      beforeEach(() => {
        component.ngOnInit();
      });

      it('should add error when payment terms is "payInFull" and payment card is requested', () => {
        const form = component.form;

        // Set payment terms to payInFull and request payment card
        form.get('facc_payment_terms_payment_terms')?.setValue('payInFull');
        form.get('facc_payment_terms_payment_card_request')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Check that the form has the validation error
        expect(form.errors?.['payInFullRestriction']).toBeTruthy();
        expect(form.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeTruthy();
      });

      it('should not add error when payment terms is "payInFull" but payment card is not requested', () => {
        const form = component.form;

        // Set payment terms to payInFull but don't request payment card
        form.get('facc_payment_terms_payment_terms')?.setValue('payInFull');
        form.get('facc_payment_terms_payment_card_request')?.setValue(false);

        // Trigger validation
        form.updateValueAndValidity();

        // Check that there's no validation error
        expect(form.errors?.['payInFullRestriction']).toBeFalsy();
        expect(form.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeFalsy();
      });

      it('should not add error when payment terms is not "payInFull" even if payment card is requested', () => {
        const form = component.form;

        // Set payment terms to something other than payInFull and request payment card
        form.get('facc_payment_terms_payment_terms')?.setValue('instalmentsOnly');
        form.get('facc_payment_terms_payment_card_request')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Check that there's no validation error
        expect(form.errors?.['payInFullRestriction']).toBeFalsy();
        expect(form.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeFalsy();
      });

      it('should clear existing payInFullRestriction error when condition is no longer met', () => {
        const form = component.form;

        // First, create the error condition
        form.get('facc_payment_terms_payment_terms')?.setValue('payInFull');
        form.get('facc_payment_terms_payment_card_request')?.setValue(true);
        form.updateValueAndValidity();

        // Verify error exists
        expect(form.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeTruthy();

        // Remove the error condition
        form.get('facc_payment_terms_payment_card_request')?.setValue(false);
        form.updateValueAndValidity();

        // Verify error is cleared
        expect(form.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeFalsy();
      });

      it('should preserve other validation errors when clearing payInFullRestriction error', () => {
        const form = component.form;
        const paymentCardControl = form.get('facc_payment_terms_payment_card_request');

        // First, create the payInFullRestriction error condition
        form.get('facc_payment_terms_payment_terms')?.setValue('payInFull');
        form.get('facc_payment_terms_payment_card_request')?.setValue(true);
        form.updateValueAndValidity();

        // Manually add another validation error to simulate multiple errors
        paymentCardControl?.setErrors({
          ...paymentCardControl.errors,
          someOtherError: true,
        });

        // Verify both errors exist
        expect(paymentCardControl?.errors?.['payInFullRestriction']).toBeTruthy();
        expect(paymentCardControl?.errors?.['someOtherError']).toBeTruthy();

        // Remove the payInFullRestriction error condition by changing payment terms
        form.get('facc_payment_terms_payment_terms')?.setValue('instalmentsOnly');
        form.updateValueAndValidity();

        // Verify payInFullRestriction error is cleared but other error remains
        expect(paymentCardControl?.errors?.['payInFullRestriction']).toBeFalsy();
        expect(paymentCardControl?.errors?.['someOtherError']).toBeTruthy();
      });

      it('should set errors to null when payInFullRestriction is the only error being cleared', () => {
        const form = component.form;
        const paymentCardControl = form.get('facc_payment_terms_payment_card_request');

        // First, create the payInFullRestriction error condition
        form.get('facc_payment_terms_payment_terms')?.setValue('payInFull');
        form.get('facc_payment_terms_payment_card_request')?.setValue(true);
        form.updateValueAndValidity();

        // Verify error exists
        expect(paymentCardControl?.errors?.['payInFullRestriction']).toBeTruthy();
        expect(Object.keys(paymentCardControl?.errors || {}).length).toBe(1);

        // Remove the payInFullRestriction error condition by unchecking payment card
        form.get('facc_payment_terms_payment_card_request')?.setValue(false);
        form.updateValueAndValidity();

        // Verify errors object is set to null when no errors remain
        expect(paymentCardControl?.errors).toBeNull();
      });

      it('should handle error clearing when control has no existing errors', () => {
        const form = component.form;
        const paymentCardControl = form.get('facc_payment_terms_payment_card_request');

        // Set up a condition where the validator runs but no error should be set
        form.get('facc_payment_terms_payment_terms')?.setValue('instalmentsOnly');
        form.get('facc_payment_terms_payment_card_request')?.setValue(true);
        form.updateValueAndValidity();

        // Verify no errors exist
        expect(paymentCardControl?.errors).toBeNull();

        // Trigger validator again to ensure it handles null errors gracefully
        form.updateValueAndValidity();

        // Verify still no errors
        expect(paymentCardControl?.errors).toBeNull();
      });

      it('should not add error when preventPaymentCard returns true', () => {
        // Create a test form group for direct validator testing
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('payInFull'),
          facc_payment_terms_payment_card_request: new FormControl(true),
        });

        // Create validator with preventPaymentCard set to true
        const validator = payInFullPaymentCardValidator(true);
        const result = validator(testForm);

        // Should not have validation error when payment card is prevented
        expect(result).toBeNull();
        expect(testForm.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeFalsy();
      });

      it('should add error when preventPaymentCard returns false', () => {
        // Create a test form group for direct validator testing
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('payInFull'),
          facc_payment_terms_payment_card_request: new FormControl(true),
        });

        // Create validator with preventPaymentCard set to false
        const validator = payInFullPaymentCardValidator(false);
        const result = validator(testForm);

        // Should have validation error when payment card is not prevented
        expect(result).toEqual({ payInFullRestriction: true });
        expect(testForm.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeTruthy();
      });

      it('should clear existing errors when preventPaymentCard returns true', () => {
        // Create a test form group for direct validator testing
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('payInFull'),
          facc_payment_terms_payment_card_request: new FormControl(true),
        });

        // First apply validator without prevention to create error
        const validatorWithoutPrevention = payInFullPaymentCardValidator(false);
        validatorWithoutPrevention(testForm);

        // Verify error exists
        expect(testForm.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeTruthy();

        // Now apply validator with prevention
        const validatorWithPrevention = payInFullPaymentCardValidator(true);
        const result = validatorWithPrevention(testForm);

        // Should clear the error when payment card is prevented
        expect(result).toBeNull();
        expect(testForm.get('facc_payment_terms_payment_card_request')?.errors?.['payInFullRestriction']).toBeFalsy();
      });

      it('should set payment card value to null when preventPaymentCard is true', () => {
        // Create a test form group with payment card value set to true
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('payInFull'),
          facc_payment_terms_payment_card_request: new FormControl(true),
        });

        // Verify initial value is true
        expect(testForm.get('facc_payment_terms_payment_card_request')?.value).toBe(true);

        // Apply validator with prevention
        const validatorWithPrevention = payInFullPaymentCardValidator(true);
        const result = validatorWithPrevention(testForm);

        // Should set the value to null when payment card is prevented
        expect(result).toBeNull();
        expect(testForm.get('facc_payment_terms_payment_card_request')?.value).toBeNull();
      });

      it('should not change payment card value when preventPaymentCard is false', () => {
        // Create a test form group with payment card value set to true
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('instalmentsOnly'),
          facc_payment_terms_payment_card_request: new FormControl(true),
        });

        // Verify initial value is true
        expect(testForm.get('facc_payment_terms_payment_card_request')?.value).toBe(true);

        // Apply validator without prevention
        const validatorWithoutPrevention = payInFullPaymentCardValidator(false);
        const result = validatorWithoutPrevention(testForm);

        // Should not change the value when payment card is not prevented
        expect(result).toBeNull();
        expect(testForm.get('facc_payment_terms_payment_card_request')?.value).toBe(true);
      });
    });

    describe('changeLetterWithoutChangesValidator', () => {
      beforeEach(() => {
        // Set up initial form data
        const initialFormData: IFinesAccPaymentTermsAmendForm = {
          formData: {
            facc_payment_terms_payment_terms: 'payInFull',
            facc_payment_terms_pay_by_date: '2024-12-31',
            facc_payment_terms_lump_sum_amount: null,
            facc_payment_terms_instalment_amount: null,
            facc_payment_terms_instalment_period: null,
            facc_payment_terms_start_date: null,
            facc_payment_terms_payment_card_request: false,
            facc_payment_terms_prevent_payment_card: false,
            facc_payment_terms_has_days_in_default: null,
            facc_payment_terms_suspended_committal_date: null,
            facc_payment_terms_default_days_in_jail: 30,
            facc_payment_terms_reason_for_change: 'Initial reason',
            facc_payment_terms_change_letter: false,
          },
          nestedFlow: false,
        };
        component.initialFormData = initialFormData;
        component.ngOnInit();
      });

      it('should add error when change letter is selected but no form changes are made', () => {
        const form = component.form;

        // Don't change any form values, just request change letter
        form.get('facc_payment_terms_change_letter')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Check that the form has the validation error
        expect(form.errors?.['noChangesMade']).toBeTruthy();
        expect(form.get('facc_payment_terms_change_letter')?.errors?.['noChangesMade']).toBeTruthy();
      });

      it('should not add error when change letter is selected and form changes are made', () => {
        const form = component.form;

        // Make a change to the form and request change letter
        form.get('facc_payment_terms_payment_terms')?.setValue('instalmentsOnly');
        form.get('facc_payment_terms_change_letter')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Check that there's no validation error
        expect(form.errors?.['noChangesMade']).toBeFalsy();
        expect(form.get('facc_payment_terms_change_letter')?.errors?.['noChangesMade']).toBeFalsy();
      });

      it('should not add error when change letter is not selected', () => {
        const form = component.form;

        // Don't request change letter (even with no changes)
        form.get('facc_payment_terms_change_letter')?.setValue(false);

        // Trigger validation
        form.updateValueAndValidity();

        // Check that there's no validation error
        expect(form.errors?.['noChangesMade']).toBeFalsy();
        expect(form.get('facc_payment_terms_change_letter')?.errors?.['noChangesMade']).toBeFalsy();
      });

      it('should detect changes in payment terms field', () => {
        const form = component.form;

        // Change payment terms and request change letter
        form.get('facc_payment_terms_payment_terms')?.setValue('lumpSumPlusInstalments');
        form.get('facc_payment_terms_change_letter')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Should not have error because changes were made
        expect(form.errors?.['noChangesMade']).toBeFalsy();
      });

      it('should detect changes in pay by date field', () => {
        const form = component.form;

        // Change pay by date and request change letter
        form.get('facc_payment_terms_pay_by_date')?.setValue('2025-01-15');
        form.get('facc_payment_terms_change_letter')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Should not have error because changes were made
        expect(form.errors?.['noChangesMade']).toBeFalsy();
      });

      it('should detect changes in reason for change field', () => {
        const form = component.form;

        // Change reason for change and request change letter
        form.get('facc_payment_terms_reason_for_change')?.setValue('Updated reason');
        form.get('facc_payment_terms_change_letter')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Should not have error because changes were made
        expect(form.errors?.['noChangesMade']).toBeFalsy();
      });

      it('should handle null and empty string values correctly', () => {
        const form = component.form;

        // Set initial value to null, then change to empty string (should be considered no change)
        component.initialFormData.formData.facc_payment_terms_lump_sum_amount = null;
        form.get('facc_payment_terms_lump_sum_amount')?.setValue('');
        form.get('facc_payment_terms_change_letter')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Should have error because null and empty string are normalized to the same value
        expect(form.errors?.['noChangesMade']).toBeTruthy();
      });

      it('should clear existing noChangesMade error when changes are made', () => {
        const form = component.form;

        // First, create the error condition (change letter without changes)
        form.get('facc_payment_terms_change_letter')?.setValue(true);
        form.updateValueAndValidity();

        // Verify error exists
        expect(form.get('facc_payment_terms_change_letter')?.errors?.['noChangesMade']).toBeTruthy();

        // Make a change to remove the error condition
        form.get('facc_payment_terms_payment_terms')?.setValue('instalmentsOnly');
        form.updateValueAndValidity();

        // Verify error is cleared
        expect(form.get('facc_payment_terms_change_letter')?.errors?.['noChangesMade']).toBeFalsy();
      });

      it('should allow change letter request when form changes are made from null initial values', () => {
        // The component starts with default form data where all values are null
        // This tests that the validator allows change letter when changes are made
        // from the default null state

        const form = component.form;

        // Make a change to the form from the initial null state
        form.get('facc_payment_terms_payment_terms')?.setValue('payByDate');

        // Request change letter after making changes
        form.get('facc_payment_terms_change_letter')?.setValue(true);

        // Trigger validation
        form.updateValueAndValidity();

        // Should not have error because changes were made before requesting change letter
        expect(form.errors?.['noChangesMade']).toBeFalsy();
      });

      it('should handle null currentFormValue gracefully', () => {
        // Create a custom FormGroup to test null value scenario
        const testForm = new FormGroup({
          facc_payment_terms_change_letter: new FormControl(true),
        });

        // Mock the value property to return null
        Object.defineProperty(testForm, 'value', {
          get: () => null,
          configurable: true,
        });

        // Create validator with proper initial data
        const initialFormData = {
          formData: {
            facc_payment_terms_payment_terms: 'payInFull',
          },
          nestedFlow: false,
        } as IFinesAccPaymentTermsAmendForm;
        const validator = changeLetterWithoutChangesValidator(initialFormData);

        // Test the validator directly
        const result = validator(testForm);

        // Should return null when currentFormValue is null (line 32)
        expect(result).toBeNull();
      });

      it('should handle null initialFormValue gracefully', () => {
        // Create a validator directly with null initialFormData to test line 67
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('payInFull'),
          facc_payment_terms_change_letter: new FormControl(true),
        });

        // Apply validator with null initial data
        const validator = changeLetterWithoutChangesValidator(undefined);
        const result = validator(testForm);

        // Should not have error when initialFormData is null
        expect(result).toBeNull();
      });

      it('should handle undefined initialFormValue gracefully', () => {
        // Create a validator directly with undefined initialFormData to test line 67
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('payInFull'),
          facc_payment_terms_change_letter: new FormControl(true),
        });

        // Apply validator with undefined initial data
        const validator = changeLetterWithoutChangesValidator(undefined);
        const result = validator(testForm);

        // Should not have error when initialFormData is undefined
        expect(result).toBeNull();
      });

      it('should return true when hasFormFieldsChanged receives null initialFormValue', () => {
        // Create a form with initial data that has null formData to test line 67
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('payInFull'),
          facc_payment_terms_change_letter: new FormControl(true),
        });

        // Create validator with initialFormData that has null formData
        const initialFormData = {
          formData: null,
          nestedFlow: false,
        } as unknown as IFinesAccPaymentTermsAmendForm;
        const validator = changeLetterWithoutChangesValidator(initialFormData);
        const result = validator(testForm);

        // Should not have error because hasFormFieldsChanged returns true for null initialFormValue (line 67)
        expect(result).toBeNull();
      });

      it('should reach hasFormFieldsChanged falsy condition by modifying formData reference', () => {
        // This test attempts to reach line 67 by creating a scenario where initialFormData.formData
        // becomes falsy after the initial validator check through object reference manipulation
        const testForm = new FormGroup({
          facc_payment_terms_payment_terms: new FormControl('payInFull'),
          facc_payment_terms_change_letter: new FormControl(true),
        });

        // Create initialFormData with a formData object that we can modify
        const formDataObject = {
          facc_payment_terms_payment_terms: 'original_value',
        } as unknown as IFinesAccPaymentTermsAmendState;
        const initialFormData: IFinesAccPaymentTermsAmendForm = {
          formData: formDataObject,
          nestedFlow: false,
        };

        // Create the validator first
        const validator = changeLetterWithoutChangesValidator(initialFormData);

        // Now modify the formData reference to null after validator creation
        // This simulates a scenario where the data becomes unavailable
        (initialFormData as unknown as { formData: null }).formData = null;

        const result = validator(testForm);

        // The validator should handle this gracefully - if it reaches hasFormFieldsChanged
        // with null formData, it should return true (line 67), causing no validation error
        expect(result).toBeNull();
      });

      it('should preserve other validation errors when clearing noChangesMade error', () => {
        const form = component.form;
        const changeLetterControl = form.get('facc_payment_terms_change_letter');

        // First, create the noChangesMade error condition
        form.get('facc_payment_terms_change_letter')?.setValue(true);
        form.updateValueAndValidity();

        // Manually add another validation error to simulate multiple errors
        changeLetterControl?.setErrors({
          ...changeLetterControl.errors,
          someOtherError: true,
        });

        // Verify both errors exist
        expect(changeLetterControl?.errors?.['noChangesMade']).toBeTruthy();
        expect(changeLetterControl?.errors?.['someOtherError']).toBeTruthy();

        // Remove the noChangesMade error condition by making a form change
        form.get('facc_payment_terms_payment_terms')?.setValue('instalmentsOnly');
        form.updateValueAndValidity();

        // Verify noChangesMade error is cleared but other error remains
        expect(changeLetterControl?.errors?.['noChangesMade']).toBeFalsy();
        expect(changeLetterControl?.errors?.['someOtherError']).toBeTruthy();
      });

      it('should set errors to null when noChangesMade is the only error being cleared', () => {
        const form = component.form;
        const changeLetterControl = form.get('facc_payment_terms_change_letter');

        // First, create the noChangesMade error condition
        form.get('facc_payment_terms_change_letter')?.setValue(true);
        form.updateValueAndValidity();

        // Verify error exists
        expect(changeLetterControl?.errors?.['noChangesMade']).toBeTruthy();
        expect(Object.keys(changeLetterControl?.errors || {}).length).toBe(1);

        // Remove the noChangesMade error condition by making a form change
        form.get('facc_payment_terms_payment_terms')?.setValue('instalmentsOnly');
        form.updateValueAndValidity();

        // Verify errors object is set to null when no errors remain
        expect(changeLetterControl?.errors).toBeNull();
      });
    });
  });

  describe('Days in Default Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    describe('daysInDefaultListener', () => {
      it('should set up initial validators when daysInDefaultListener is called', () => {
        const updateValidatorsSpy = vi.fn();
        component['updateDaysInDefaultValidators'] = updateValidatorsSpy;

        // Call the private method
        component['daysInDefaultListener']();

        expect(updateValidatorsSpy).toHaveBeenCalled();
      });

      it('should call updateDaysInDefaultValidators when has_days_in_default changes', () => {
        const hasDaysInDefaultControl = component.form.get('facc_payment_terms_has_days_in_default');
        const updateValidatorsSpy = vi.fn();
        component['updateDaysInDefaultValidators'] = updateValidatorsSpy;

        // Call daysInDefaultListener to set up the subscription
        component['daysInDefaultListener']();

        // Trigger value change
        hasDaysInDefaultControl?.setValue(true);

        expect(updateValidatorsSpy).toHaveBeenCalled();
      });
    });

    describe('updateDaysInDefaultValidators', () => {
      beforeEach(() => {
        component.isYouth = false; // Default to not youth
      });

      it('should add required validators when checkbox is checked and person is not youth', () => {
        const hasDaysInDefaultControl = component.form.get('facc_payment_terms_has_days_in_default');
        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');
        const defaultDaysInJailControl = component.form.get('facc_payment_terms_default_days_in_jail');

        hasDaysInDefaultControl?.setValue(true);
        component['updateDaysInDefaultValidators']();

        // Check that required validators are added
        suspendedCommittalDateControl?.setValue('');
        defaultDaysInJailControl?.setValue('');

        expect(suspendedCommittalDateControl?.hasError('required')).toBeTruthy();
        expect(defaultDaysInJailControl?.hasError('required')).toBeTruthy();
      });

      it('should not add required validators when checkbox is checked but person is youth', () => {
        component.isYouth = true;
        const hasDaysInDefaultControl = component.form.get('facc_payment_terms_has_days_in_default');
        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');
        const defaultDaysInJailControl = component.form.get('facc_payment_terms_default_days_in_jail');

        hasDaysInDefaultControl?.setValue(true);
        component['updateDaysInDefaultValidators']();

        // Check that required validators are not added for youth
        suspendedCommittalDateControl?.setValue('');
        defaultDaysInJailControl?.setValue('');

        expect(suspendedCommittalDateControl?.hasError('required')).toBeFalsy();
        expect(defaultDaysInJailControl?.hasError('required')).toBeFalsy();
      });

      it('should not add required validators when checkbox is unchecked', () => {
        const hasDaysInDefaultControl = component.form.get('facc_payment_terms_has_days_in_default');
        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');
        const defaultDaysInJailControl = component.form.get('facc_payment_terms_default_days_in_jail');

        hasDaysInDefaultControl?.setValue(false);
        component['updateDaysInDefaultValidators']();

        // Check that required validators are not added
        suspendedCommittalDateControl?.setValue('');
        defaultDaysInJailControl?.setValue('');

        expect(suspendedCommittalDateControl?.hasError('required')).toBeFalsy();
        expect(defaultDaysInJailControl?.hasError('required')).toBeFalsy();
      });

      it('should validate future dates for suspended committal date', () => {
        mockDateService['isDateInTheFuture'].mockReturnValue(true);

        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');

        component['updateDaysInDefaultValidators']();

        suspendedCommittalDateControl?.setValue('31/12/2025');
        suspendedCommittalDateControl?.updateValueAndValidity();

        expect(suspendedCommittalDateControl?.hasError('invalidFutureDate')).toBeTruthy();
      });

      it('should not validate future dates when date is not in future', () => {
        mockDateService['isDateInTheFuture'].mockReturnValue(false);

        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');

        component['updateDaysInDefaultValidators']();

        suspendedCommittalDateControl?.setValue('01/01/2024');
        suspendedCommittalDateControl?.updateValueAndValidity();

        expect(suspendedCommittalDateControl?.hasError('invalidFutureDate')).toBeFalsy();
      });

      it('should not validate future dates when value is empty', () => {
        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');

        component['updateDaysInDefaultValidators']();

        suspendedCommittalDateControl?.setValue('');
        suspendedCommittalDateControl?.updateValueAndValidity();

        expect(suspendedCommittalDateControl?.hasError('invalidFutureDate')).toBeFalsy();
      });

      it('should not validate future dates when date is invalid', () => {
        mockDateService['isValidDate'].mockReturnValue(false);

        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');

        component['updateDaysInDefaultValidators']();

        suspendedCommittalDateControl?.setValue('invalid-date');
        suspendedCommittalDateControl?.updateValueAndValidity();

        expect(suspendedCommittalDateControl?.hasError('invalidFutureDate')).toBeFalsy();
      });

      it('should maintain base validators for default days in jail', () => {
        const defaultDaysInJailControl = component.form.get('facc_payment_terms_default_days_in_jail');

        component['updateDaysInDefaultValidators']();

        // Test max length validator
        defaultDaysInJailControl?.setValue('123456'); // More than 5 characters
        expect(defaultDaysInJailControl?.hasError('maxlength')).toBeTruthy();

        // Test numeric pattern validator
        defaultDaysInJailControl?.setValue('abc');
        expect(defaultDaysInJailControl?.hasError('numericalTextPattern')).toBeTruthy();
      });

      it('should clear existing validators before setting new ones', () => {
        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');
        const defaultDaysInJailControl = component.form.get('facc_payment_terms_default_days_in_jail');

        vi.spyOn(suspendedCommittalDateControl!, 'clearValidators');
        vi.spyOn(defaultDaysInJailControl!, 'clearValidators');

        component['updateDaysInDefaultValidators']();

        expect(suspendedCommittalDateControl!.clearValidators).toHaveBeenCalled();
        expect(defaultDaysInJailControl!.clearValidators).toHaveBeenCalled();
      });

      it('should update validity after setting validators', () => {
        const suspendedCommittalDateControl = component.form.get('facc_payment_terms_suspended_committal_date');
        const defaultDaysInJailControl = component.form.get('facc_payment_terms_default_days_in_jail');

        vi.spyOn(suspendedCommittalDateControl!, 'updateValueAndValidity');
        vi.spyOn(defaultDaysInJailControl!, 'updateValueAndValidity');

        component['updateDaysInDefaultValidators']();

        expect(suspendedCommittalDateControl!.updateValueAndValidity).toHaveBeenCalled();
        expect(defaultDaysInJailControl!.updateValueAndValidity).toHaveBeenCalled();
      });
    });
  });
});
