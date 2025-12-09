import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { defendantAccountPaymentTermsLatestResolver } from './defendant-account-payment-terms-latest.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { IFinesAccPaymentTermsAmendForm } from '../../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-form.interface';

describe('defendantAccountPaymentTermsLatestResolver', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  let mockRoute: ActivatedRouteSnapshot;

  const mockPaymentTermsData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
    version: '1.0',
    payment_terms: {
      days_in_default: null,
      date_days_in_default_imposed: null,
      extension: false,
      reason_for_extension: null,
      payment_terms_type: {
        payment_terms_type_code: 'I',
        payment_terms_type_display_name: 'Instalments',
      },
      effective_date: '2025-01-15',
      instalment_period: {
        instalment_period_code: 'M',
        instalment_period_display_name: 'Monthly',
      },
      lump_sum_amount: 0.0,
      instalment_amount: 50.0,
      posted_details: {
        posted_date: '2025-01-01',
        posted_by: 'TEST001',
        posted_by_name: 'Test User',
      },
    },
    payment_card_last_requested: null,
    last_enforcement: 'ENF123',
  };

  const mockResultData: IOpalFinesResultRefData = {
    result_id: 'ENF123',
    result_title: 'Test Enforcement Action',
    result_title_cy: 'Gweithred Orfodi Prawf',
    result_type: 'ENFORCEMENT',
    active: true,
    imposition: false,
    imposition_category: undefined,
    imposition_allocation_priority: undefined,
    imposition_accruing: false,
    imposition_creditor: undefined,
    enforcement: true,
    enforcement_override: false,
    further_enforcement_warn: false,
    further_enforcement_disallow: false,
    enforcement_hold: false,
    requires_enforcer: true,
    generates_hearing: false,
    generates_warrant: undefined,
    collection_order: false,
    extend_ttp_disallow: false,
    extend_ttp_preserve_last_enf: false,
    prevent_payment_card: false,
    lists_monies: false,
    result_parameters: '{}',
    allow_payment_terms: undefined,
    requires_employment_data: undefined,
    allow_additional_action: undefined,
    enf_next_permitted_actions: undefined,
    requires_lja: undefined,
    manual_enforcement: undefined,
  };

  const mockTransformedForm: IFinesAccPaymentTermsAmendForm = {
    formData: {
      facc_payment_terms_payment_terms: 'instalmentsOnly',
      facc_payment_terms_pay_by_date: null,
      facc_payment_terms_lump_sum_amount: null,
      facc_payment_terms_instalment_amount: 50.0,
      facc_payment_terms_instalment_period: 'M',
      facc_payment_terms_start_date: '15/01/2025',
      facc_payment_terms_payment_card_request: null,
      facc_payment_terms_prevent_payment_card: null,
      facc_payment_terms_has_days_in_default: null,
      facc_payment_terms_suspended_committal_date: null,
      facc_payment_terms_default_days_in_jail: null,
      facc_payment_terms_reason_for_change: null,
      facc_payment_terms_change_letter: null,
    },
    nestedFlow: false,
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    const opalFinesServiceSpy = jasmine.createSpyObj('OpalFines', [
      'getDefendantAccountPaymentTermsLatest',
      'getResult',
    ]);
    const payloadServiceSpy = jasmine.createSpyObj('FinesAccPayloadService', [
      'transformPaymentTermsPayload',
      'transformPayload',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: OpalFines, useValue: opalFinesServiceSpy },
        { provide: FinesAccPayloadService, useValue: payloadServiceSpy },
      ],
    });

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockOpalFinesService = TestBed.inject(OpalFines) as jasmine.SpyObj<OpalFines>;
    mockPayloadService = TestBed.inject(FinesAccPayloadService) as jasmine.SpyObj<FinesAccPayloadService>;

    mockRoute = {
      paramMap: {
        get: jasmine.createSpy('get'),
      },
    } as unknown as ActivatedRouteSnapshot;

    mockRouter.createUrlTree.and.returnValue({} as never);
    mockPayloadService.transformPaymentTermsPayload.and.returnValue(mockTransformedForm);
    mockPayloadService.transformPayload.and.returnValue(mockPaymentTermsData);
  });

  it('should return a redirect command to defendant details when accountId is not provided', () => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue(null);

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      expect(result).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  it('should fetch payment terms data and enforcement result then return transformed form data', (done) => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue('12345');
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(mockPaymentTermsData));
    mockOpalFinesService.getResult.and.returnValue(of(mockResultData));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((data) => {
          expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalledWith(12345);
          expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('ENF123');
          expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(mockPaymentTermsData, jasmine.any(Object));
          expect(mockPayloadService.transformPaymentTermsPayload).toHaveBeenCalled();
          expect(data).toEqual(mockTransformedForm);
          done();
        });
      } else {
        fail('Expected Observable but got something else');
      }
    });
  });

  it('should return a redirect command when no enforcement action exists', (done) => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue('12345');
    const paymentTermsDataNoEnforcement = {
      ...mockPaymentTermsData,
      last_enforcement: null,
    };
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(paymentTermsDataNoEnforcement));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((data) => {
          expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalledWith(12345);
          expect(mockOpalFinesService.getResult).not.toHaveBeenCalled();
          expect(mockPayloadService.transformPaymentTermsPayload).not.toHaveBeenCalled();
          expect(mockRouter.createUrlTree).toHaveBeenCalled();
          expect(data).toBeInstanceOf(RedirectCommand);
          done();
        });
      } else {
        fail('Expected Observable but got something else');
      }
    });
  });

  it('should return a redirect command when getResult fails', (done) => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue('12345');
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(mockPaymentTermsData));
    mockOpalFinesService.getResult.and.returnValue(throwError(() => new Error('Result fetch failed')));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((data) => {
          expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalledWith(12345);
          expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('ENF123');
          expect(mockPayloadService.transformPaymentTermsPayload).not.toHaveBeenCalled();
          expect(mockRouter.createUrlTree).toHaveBeenCalled();
          expect(data).toBeInstanceOf(RedirectCommand);
          done();
        });
      } else {
        fail('Expected Observable but got something else');
      }
    });
  });

  it('should return a redirect command when payment terms data fetch fails', (done) => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue('12345');
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(
      throwError(() => new Error('Payment terms fetch failed')),
    );

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((data) => {
          expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalledWith(12345);
          expect(mockRouter.createUrlTree).toHaveBeenCalled();
          expect(data).toBeInstanceOf(RedirectCommand);
          done();
        });
      } else {
        fail('Expected Observable but got something else');
      }
    });
  });

  it('should handle empty enforcement action string', (done) => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue('12345');
    const paymentTermsDataEmptyEnforcement = {
      ...mockPaymentTermsData,
      last_enforcement: '',
    };
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(paymentTermsDataEmptyEnforcement));
    mockOpalFinesService.getResult.and.returnValue(of(mockResultData));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((data) => {
          expect(mockOpalFinesService.getResult).not.toHaveBeenCalled();
          expect(mockPayloadService.transformPaymentTermsPayload).not.toHaveBeenCalled();
          expect(mockRouter.createUrlTree).toHaveBeenCalled();
          expect(data).toBeInstanceOf(RedirectCommand);
          done();
        });
      } else {
        fail('Expected Observable but got something else');
      }
    });
  });

  it('should handle whitespace-only enforcement action', (done) => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue('12345');
    const paymentTermsDataWhitespaceEnforcement = {
      ...mockPaymentTermsData,
      last_enforcement: '   ',
    };
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(
      of(paymentTermsDataWhitespaceEnforcement),
    );
    mockOpalFinesService.getResult.and.returnValue(of(mockResultData));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe(() => {
          expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('   ');
          expect(mockPayloadService.transformPayload).toHaveBeenCalled();
          expect(mockPayloadService.transformPaymentTermsPayload).toHaveBeenCalled();
          done();
        });
      } else {
        fail('Expected Observable but got something else');
      }
    });
  });

  it('should convert accountId string to number', (done) => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue('98765');
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(mockPaymentTermsData));
    mockOpalFinesService.getResult.and.returnValue(of(mockResultData));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe(() => {
          expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalledWith(98765);
          done();
        });
      } else {
        fail('Expected Observable but got something else');
      }
    });
  });
});
