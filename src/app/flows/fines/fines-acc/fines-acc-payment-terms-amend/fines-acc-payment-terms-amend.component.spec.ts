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

describe('FinesAccPaymentTermsAmendComponent', () => {
  let component: FinesAccPaymentTermsAmendComponent;
  let fixture: ComponentFixture<FinesAccPaymentTermsAmendComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  let mockFinesAccountStore: {
    account_id: jasmine.Spy;
    business_unit_id: jasmine.Spy;
    base_version: jasmine.Spy;
    account_number: jasmine.Spy;
    party_name: jasmine.Spy;
    defendantType: jasmine.Spy;
    accountDetails: jasmine.Spy;
    paymentTerms: jasmine.Spy;
  };
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { data: {} },
      params: of({}),
      queryParams: of({}),
      data: of({}),
    });
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', [
      'postDefendantAccountPaymentTerms',
      'clearCache',
      'getBusinessUnitById',
      'getConfigurationItemValue',
    ]);
    mockPayloadService = jasmine.createSpyObj('FinesAccPayloadService', ['buildPaymentTermsAmendPayload']);
    mockFinesAccountStore = {
      account_id: jasmine.createSpy('account_id').and.returnValue(123456),
      business_unit_id: jasmine.createSpy('business_unit_id').and.returnValue('TEST_UNIT'),
      base_version: jasmine.createSpy('base_version').and.returnValue('version123'),
      account_number: jasmine.createSpy('account_number').and.returnValue('TEST123456'),
      party_name: jasmine.createSpy('party_name').and.returnValue('John Doe'),
      defendantType: jasmine.createSpy('defendantType').and.returnValue('individual'),
      accountDetails: jasmine.createSpy('accountDetails').and.returnValue({}),
      paymentTerms: jasmine.createSpy('paymentTerms').and.returnValue({}),
    };
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['scrollToTop']);
    mockDateService = jasmine.createSpyObj('DateService', [
      'isValidDate',
      'isDateInThePast',
      'isDateInTheFuture',
      'getDateNow',
      'toFormat',
      'getPreviousDate',
    ]);

    // Setup default return values
    mockPayloadService.buildPaymentTermsAmendPayload.and.returnValue(FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK);
    mockOpalFinesService.postDefendantAccountPaymentTerms.and.returnValue(
      of(FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK),
    );
    mockOpalFinesService.getBusinessUnitById.and.returnValue(of(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK));
    mockOpalFinesService.getConfigurationItemValue.and.returnValue('Y');

    // Setup DateService mock return values
    mockDateService.getDateNow.and.returnValue(DateTime.fromISO('2024-01-02'));
    mockDateService.toFormat.and.returnValue('02/01/2024');
    mockDateService.getPreviousDate.and.returnValue('01/01/2024');
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.isDateInThePast.and.returnValue(false);
    mockDateService.isDateInTheFuture.and.returnValue(false);

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handlePaymentTermsSubmit', () => {
    it('should successfully submit payment terms amendment when validation passes', () => {
      component.handlePaymentTermsSubmit(FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK);

      expect(mockPayloadService.buildPaymentTermsAmendPayload).toHaveBeenCalledWith(
        FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK.formData,
      );
      expect(mockOpalFinesService.postDefendantAccountPaymentTerms).toHaveBeenCalledWith(
        123456,
        FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK,
        'TEST_UNIT',
        'version123',
      );
    });

    it('should navigate when validation fails (missing account data)', () => {
      mockFinesAccountStore.account_id.and.returnValue(null);

      component.handlePaymentTermsSubmit(FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK);

      // Should not call the API when validation fails
      expect(mockOpalFinesService.postDefendantAccountPaymentTerms).not.toHaveBeenCalled();
    });

    it('should build payload with correct form data', () => {
      component.handlePaymentTermsSubmit(FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK);

      expect(mockPayloadService.buildPaymentTermsAmendPayload).toHaveBeenCalledWith({
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
      mockFinesAccountStore.account_id.and.returnValue(null);

      const result = component['validateRequiredData']();

      expect(result).toBe(false);
    });

    it('should return false when businessUnitId is missing', () => {
      mockFinesAccountStore.business_unit_id.and.returnValue(null);

      const result = component['validateRequiredData']();

      expect(result).toBe(false);
    });

    it('should return false when ifMatch is missing', () => {
      mockFinesAccountStore.base_version.and.returnValue(null);

      const result = component['validateRequiredData']();

      expect(result).toBe(false);
    });

    it('should return false when multiple values are missing', () => {
      mockFinesAccountStore.account_id.and.returnValue(null);
      mockFinesAccountStore.business_unit_id.and.returnValue(null);

      const result = component['validateRequiredData']();

      expect(result).toBe(false);
    });
  });

  describe('submitPaymentTermsAmendment', () => {
    it('should call API with correct parameters and handle success', () => {
      component['submitPaymentTermsAmendment'](FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK);

      expect(mockOpalFinesService.postDefendantAccountPaymentTerms).toHaveBeenCalledWith(
        123456,
        FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK,
        'TEST_UNIT',
        'version123',
      );
      expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountPaymentTermsLatestCache$');
    });

    it('should handle API errors gracefully', () => {
      mockOpalFinesService.postDefendantAccountPaymentTerms.and.returnValue(throwError(() => new Error('API Error')));

      component['submitPaymentTermsAmendment'](FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK);

      expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
      expect(component.stateUnsavedChanges).toBe(true);
      expect(mockOpalFinesService.clearCache).not.toHaveBeenCalled();
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
      spyOn(component, 'routerNavigate' as never);

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
