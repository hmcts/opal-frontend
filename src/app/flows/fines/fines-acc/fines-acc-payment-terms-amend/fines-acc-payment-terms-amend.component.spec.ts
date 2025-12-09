import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError } from 'rxjs';

import { FinesAccPaymentTermsAmendComponent } from './fines-acc-payment-terms-amend.component';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import {
  MOCK_FORM_DATA,
  MOCK_PAYLOAD,
  createMockOpalFinesService,
  createMockPayloadService,
  createMockFinesAccountStore,
  createMockUtilsService,
  createMockRouter,
  createMockActivatedRoute,
} from './mocks/fines-acc-payment-terms-amend.mocks';

describe('FinesAccPaymentTermsAmendComponent', () => {
  let component: FinesAccPaymentTermsAmendComponent;
  let fixture: ComponentFixture<FinesAccPaymentTermsAmendComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesAccountStore: any;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockRouter = createMockRouter();
    mockActivatedRoute = createMockActivatedRoute();
    mockOpalFinesService = createMockOpalFinesService();
    mockPayloadService = createMockPayloadService();
    mockFinesAccountStore = createMockFinesAccountStore();
    mockUtilsService = createMockUtilsService();

    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentTermsAmendComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: FinesAccountStore, useValue: mockFinesAccountStore },
        { provide: UtilsService, useValue: mockUtilsService },
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
    it('should successfully submit payment terms amendment', () => {
      component.handlePaymentTermsSubmit(MOCK_FORM_DATA);

      expect(mockPayloadService.buildPaymentTermsAmendPayload).toHaveBeenCalledWith(MOCK_FORM_DATA.formData);
      expect(mockFinesAccountStore.account_id).toHaveBeenCalled();
      expect(mockFinesAccountStore.business_unit_id).toHaveBeenCalled();
      expect(mockFinesAccountStore.base_version).toHaveBeenCalled();
      expect(mockOpalFinesService.putDefendantAccountPaymentTerms).toHaveBeenCalledWith(
        123456,
        MOCK_PAYLOAD,
        'TEST_UNIT',
        'version123',
      );
      expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountPaymentTermsLatestCache$');
      expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should navigate to details when defendantAccountId is missing', () => {
      mockFinesAccountStore.account_id.and.returnValue(null);

      component.handlePaymentTermsSubmit(MOCK_FORM_DATA);

      expect(mockRouter.navigate).toHaveBeenCalled();
      expect(mockOpalFinesService.putDefendantAccountPaymentTerms).not.toHaveBeenCalled();
    });

    it('should navigate to details when businessUnitId is missing', () => {
      mockFinesAccountStore.business_unit_id.and.returnValue(null);

      component.handlePaymentTermsSubmit(MOCK_FORM_DATA);

      expect(mockRouter.navigate).toHaveBeenCalled();
      expect(mockOpalFinesService.putDefendantAccountPaymentTerms).not.toHaveBeenCalled();
    });

    it('should navigate to details when ifMatch is missing', () => {
      mockFinesAccountStore.base_version.and.returnValue(null);

      component.handlePaymentTermsSubmit(MOCK_FORM_DATA);

      expect(mockRouter.navigate).toHaveBeenCalled();
      expect(mockOpalFinesService.putDefendantAccountPaymentTerms).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', () => {
      mockOpalFinesService.putDefendantAccountPaymentTerms.and.returnValue(throwError(() => new Error('API Error')));

      component.handlePaymentTermsSubmit(MOCK_FORM_DATA);

      expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
      expect(component.stateUnsavedChanges).toBe(true);
      expect(mockOpalFinesService.clearCache).not.toHaveBeenCalled();
    });

    it('should build payload with correct form data', () => {
      component.handlePaymentTermsSubmit(MOCK_FORM_DATA);

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
