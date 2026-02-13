import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError, of } from 'rxjs';

import { FinesAccPaymentTermsAmendComponent } from './fines-acc-payment-terms-amend.component';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { DateTime } from 'luxon';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK } from './mocks/fines-acc-payment-terms-amend-form.mock';
import { FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK } from './mocks/fines-acc-payment-terms-amend-payload.mock';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-map-transform-items-config.constant';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM } from './constants/fines-acc-payment-terms-amend-form.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('FinesAccPaymentTermsAmendComponent', () => {
  let component: FinesAccPaymentTermsAmendComponent;
  let fixture: ComponentFixture<FinesAccPaymentTermsAmendComponent>;
  let mockRouter: ReturnType<typeof createSpyObj>;
  let mockActivatedRoute: ActivatedRoute;
  let mockOpalFinesService: ReturnType<typeof createSpyObj>;
  let mockPayloadService: ReturnType<typeof createSpyObj>;
  let mockFinesAccountStore: {
    account_id: ReturnType<typeof vi.fn>;
    business_unit_id: ReturnType<typeof vi.fn>;
    base_version: ReturnType<typeof vi.fn>;
    account_number: ReturnType<typeof vi.fn>;
    party_name: ReturnType<typeof vi.fn>;
    defendantType: ReturnType<typeof vi.fn>;
    accountDetails: ReturnType<typeof vi.fn>;
    paymentTerms: ReturnType<typeof vi.fn>;
  };
  let mockUtilsService: ReturnType<typeof createSpyObj>;
  let mockDateService: ReturnType<typeof createSpyObj>;

  beforeEach(async () => {
    mockRouter = createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: { data: {} },
      params: of({}),
      queryParams: of({}),
      data: of({}),
    } as unknown as ActivatedRoute;
    mockOpalFinesService = createSpyObj('OpalFines', [
      'postDefendantAccountPaymentTerms',
      'clearCache',
      'getBusinessUnitById',
      'getConfigurationItemValue',
    ]);
    mockPayloadService = createSpyObj('FinesAccPayloadService', [
      'buildPaymentTermsAmendPayload',
      'transformPaymentTermsPayload',
      'transformPayload',
    ]);
    mockFinesAccountStore = {
      account_id: vi.fn().mockReturnValue(123456),
      business_unit_id: vi.fn().mockReturnValue('TEST_UNIT'),
      base_version: vi.fn().mockReturnValue('version123'),
      account_number: vi.fn().mockReturnValue('TEST123456'),
      party_name: vi.fn().mockReturnValue('John Doe'),
      defendantType: vi.fn().mockReturnValue('individual'),
      accountDetails: vi.fn().mockReturnValue({}),
      paymentTerms: vi.fn().mockReturnValue({}),
    };
    mockUtilsService = createSpyObj('UtilsService', ['scrollToTop']);
    mockDateService = createSpyObj('DateService', [
      'isValidDate',
      'isDateInThePast',
      'isDateInTheFuture',
      'getDateNow',
      'toFormat',
      'getPreviousDate',
    ]);

    // Setup default return values
    mockPayloadService['buildPaymentTermsAmendPayload'].mockReturnValue(FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK);
    mockPayloadService['transformPaymentTermsPayload'].mockReturnValue(FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK);
    mockPayloadService['transformPayload'].mockReturnValue({});
    mockOpalFinesService['postDefendantAccountPaymentTerms'].mockReturnValue(
      of(FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK),
    );
    mockOpalFinesService['getBusinessUnitById'].mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK));
    mockOpalFinesService['getConfigurationItemValue'].mockReturnValue('Y');

    // Setup DateService mock return values
    mockDateService['getDateNow'].mockReturnValue(DateTime.fromISO('2024-01-02'));
    mockDateService['toFormat'].mockReturnValue('02/01/2024');
    mockDateService['getPreviousDate'].mockReturnValue('01/01/2024');
    mockDateService['isValidDate'].mockReturnValue(true);
    mockDateService['isDateInThePast'].mockReturnValue(false);
    mockDateService['isDateInTheFuture'].mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentTermsAmendComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: FinesAccountStore, useValue: mockFinesAccountStore },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPaymentTermsAmendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('transformResolvedData', () => {
    it('should call transformPaymentTermsPayload when resolved data is available', () => {
      const mockResolvedData = {
        paymentTermsData: { test: 'data' },
        resultData: { result: 'data' },
      };

      component['activatedRoute'].snapshot.data = {
        paymentTermsFormData: mockResolvedData,
      };

      const result = component['transformResolvedData']();

      expect(mockPayloadService['transformPayload']).toHaveBeenCalledWith(
        mockResolvedData.paymentTermsData,
        FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
      );
      expect(mockPayloadService['transformPaymentTermsPayload']).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual(FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK);
    });

    it('should return default form when resolved data is missing', () => {
      component['activatedRoute'].snapshot.data = {};

      const result = component['transformResolvedData']();

      expect(mockPayloadService['transformPayload']).not.toHaveBeenCalled();
      expect(mockPayloadService['transformPaymentTermsPayload']).not.toHaveBeenCalled();
      expect(result).toEqual(FINES_ACC_PAYMENT_TERMS_AMEND_FORM);
    });
  });

  describe('handlePaymentTermsSubmit', () => {
    it('should successfully submit payment terms amendment when validation passes', () => {
      component.handlePaymentTermsSubmit(FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK);

      expect(mockPayloadService['buildPaymentTermsAmendPayload']).toHaveBeenCalledWith(
        FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK.formData,
      );
      expect(mockOpalFinesService['postDefendantAccountPaymentTerms']).toHaveBeenCalledWith(
        123456,
        FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK,
        'TEST_UNIT',
        'version123',
      );
    });

    it('should navigate when validation fails (missing account data)', () => {
      mockFinesAccountStore.account_id.mockReturnValue(null);

      component.handlePaymentTermsSubmit(FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK);

      // Should not call the API when validation fails
      expect(mockOpalFinesService['postDefendantAccountPaymentTerms']).not.toHaveBeenCalled();
    });

    it('should build payload with correct form data', () => {
      component.handlePaymentTermsSubmit(FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK);

      expect(mockPayloadService['buildPaymentTermsAmendPayload']).toHaveBeenCalledWith({
        facc_payment_terms_payment_terms: 'payInFull',
        facc_payment_terms_pay_by_date: '2025-01-15',
        facc_payment_terms_lump_sum_amount: null,
        facc_payment_terms_instalment_amount: null,
        facc_payment_terms_instalment_period: null,
        facc_payment_terms_start_date: null,
        facc_payment_terms_payment_card_request: null,
        facc_payment_terms_prevent_payment_card: null,
        facc_payment_terms_has_days_in_default: null,
        facc_payment_terms_suspended_committal_date: null,
        facc_payment_terms_default_days_in_jail: 30,
        facc_payment_terms_reason_for_change: 'Payment plan adjustment',
        facc_payment_terms_change_letter: null,
      });
    });
  });

  describe('validateRequiredData', () => {
    it('should return true when all required data is present', () => {
      const result = component['validateRequiredData']();

      expect(result).toBe(true);
      expect(mockFinesAccountStore.account_id).toHaveBeenCalled();
      expect(mockFinesAccountStore.business_unit_id).toHaveBeenCalled();
      expect(mockFinesAccountStore.base_version).toHaveBeenCalled();
    });

    it('should return false when defendantAccountId is missing', () => {
      mockFinesAccountStore.account_id.mockReturnValue(null);

      const result = component['validateRequiredData']();

      expect(result).toBe(false);
    });

    it('should return false when businessUnitId is missing', () => {
      mockFinesAccountStore.business_unit_id.mockReturnValue(null);

      const result = component['validateRequiredData']();

      expect(result).toBe(false);
    });

    it('should return false when ifMatch is missing', () => {
      mockFinesAccountStore.base_version.mockReturnValue(null);

      const result = component['validateRequiredData']();

      expect(result).toBe(false);
    });

    it('should return false when multiple values are missing', () => {
      mockFinesAccountStore.account_id.mockReturnValue(null);
      mockFinesAccountStore.business_unit_id.mockReturnValue(null);

      const result = component['validateRequiredData']();

      expect(result).toBe(false);
    });
  });

  describe('submitPaymentTermsAmendment', () => {
    it('should call API with correct parameters and handle success', () => {
      component['submitPaymentTermsAmendment'](FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK);

      expect(mockOpalFinesService['postDefendantAccountPaymentTerms']).toHaveBeenCalledWith(
        123456,
        FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK,
        'TEST_UNIT',
        'version123',
      );
      expect(mockOpalFinesService['clearCache']).toHaveBeenCalledWith('defendantAccountPaymentTermsLatestCache$');
    });

    it('should handle API errors gracefully', () => {
      mockOpalFinesService['postDefendantAccountPaymentTerms'].mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      component['submitPaymentTermsAmendment'](FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK);

      expect(mockUtilsService['scrollToTop']).toHaveBeenCalled();
      expect(component.stateUnsavedChanges).toBe(true);
      expect(mockOpalFinesService['clearCache']).not.toHaveBeenCalled();
    });

    it('should retrieve account data for API call', () => {
      component['submitPaymentTermsAmendment'](FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK);

      expect(mockFinesAccountStore.account_id).toHaveBeenCalled();
      expect(mockFinesAccountStore.business_unit_id).toHaveBeenCalled();
      expect(mockFinesAccountStore.base_version).toHaveBeenCalled();
    });
  });

  describe('navigateToDetails', () => {
    it('should call routerNavigate with correct parameters', () => {
      vi.spyOn(component, 'routerNavigate' as never);

      component['navigateToDetails']();

      expect(component['routerNavigate']).toHaveBeenCalledWith(
        component['finesDefendantRoutingPaths'].children.details,
        false,
        undefined,
        undefined,
        'payment-terms',
      );
    });
  });

  describe('handleUnsavedChanges', () => {
    it('should set stateUnsavedChanges to true when unsavedChanges is true', () => {
      component.handleUnsavedChanges(true);

      expect(component.stateUnsavedChanges).toBe(true);
    });

    it('should set stateUnsavedChanges to false when unsavedChanges is false', () => {
      component.stateUnsavedChanges = true; // Set initial state to true

      component.handleUnsavedChanges(false);

      expect(component.stateUnsavedChanges).toBe(false);
    });

    it('should handle multiple state changes correctly', () => {
      expect(component.stateUnsavedChanges).toBeUndefined(); // Initial state

      component.handleUnsavedChanges(true);
      expect(component.stateUnsavedChanges).toBe(true);

      component.handleUnsavedChanges(false);
      expect(component.stateUnsavedChanges).toBe(false);

      component.handleUnsavedChanges(true);
      expect(component.stateUnsavedChanges).toBe(true);
    });
  });
});
