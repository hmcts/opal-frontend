import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { defendantAccountPaymentTermsLatestResolver } from './defendant-account-payment-terms-latest.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import {
  MOCK_PAYMENT_TERMS_DATA,
  MOCK_RESULT_DATA,
  MOCK_TRANSFORMED_FORM,
} from './mocks/defendant-account-payment-terms-latest.mocks';

describe('defendantAccountPaymentTermsLatestResolver', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  let mockRoute: ActivatedRouteSnapshot;

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
    mockPayloadService.transformPaymentTermsPayload.and.returnValue(MOCK_TRANSFORMED_FORM);
    mockPayloadService.transformPayload.and.returnValue(MOCK_PAYMENT_TERMS_DATA);
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
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(MOCK_PAYMENT_TERMS_DATA));
    mockOpalFinesService.getResult.and.returnValue(of(MOCK_RESULT_DATA));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((data) => {
          expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalledWith(12345);
          expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('ENF123');
          expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
            MOCK_PAYMENT_TERMS_DATA,
            jasmine.any(Object),
          );
          expect(mockPayloadService.transformPaymentTermsPayload).toHaveBeenCalled();
          expect(data).toEqual(MOCK_TRANSFORMED_FORM);
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
      ...MOCK_PAYMENT_TERMS_DATA,
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
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(MOCK_PAYMENT_TERMS_DATA));
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
      ...MOCK_PAYMENT_TERMS_DATA,
      last_enforcement: '',
    };
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(paymentTermsDataEmptyEnforcement));
    mockOpalFinesService.getResult.and.returnValue(of(MOCK_RESULT_DATA));

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
      ...MOCK_PAYMENT_TERMS_DATA,
      last_enforcement: '   ',
    };
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(
      of(paymentTermsDataWhitespaceEnforcement),
    );
    mockOpalFinesService.getResult.and.returnValue(of(MOCK_RESULT_DATA));

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
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(MOCK_PAYMENT_TERMS_DATA));
    mockOpalFinesService.getResult.and.returnValue(of(MOCK_RESULT_DATA));

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
