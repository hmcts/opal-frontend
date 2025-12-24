import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';
import { defendantAccountPaymentTermsLatestResolver } from './defendant-account-payment-terms-latest.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { MOCK_PAYMENT_TERMS_DATA } from './mocks/defendant-account-payment-terms-data.mock';
import { MOCK_RESULT_DATA } from './mocks/defendant-account-payment-terms-result-data.mock';

describe('defendantAccountPaymentTermsLatestResolver', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    const opalFinesServiceSpy = jasmine.createSpyObj('OpalFines', [
      'getDefendantAccountPaymentTermsLatest',
      'getResult',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: OpalFines, useValue: opalFinesServiceSpy },
      ],
    });

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockOpalFinesService = TestBed.inject(OpalFines) as jasmine.SpyObj<OpalFines>;

    mockRoute = {
      paramMap: {
        get: jasmine.createSpy('get'),
      },
    } as unknown as ActivatedRouteSnapshot;

    mockRouter.createUrlTree.and.returnValue({} as never);
  });

  it('should fetch payment terms data and enforcement result then return raw data', (done) => {
    (mockRoute.paramMap.get as jasmine.Spy).and.returnValue('12345');
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.and.returnValue(of(MOCK_PAYMENT_TERMS_DATA));
    mockOpalFinesService.getResult.and.returnValue(of(MOCK_RESULT_DATA));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((data) => {
          expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalledWith(12345);
          expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('ENF123');
          expect(data).toEqual({
            paymentTermsData: MOCK_PAYMENT_TERMS_DATA,
            resultData: MOCK_RESULT_DATA,
          });
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
        result.subscribe((data) => {
          expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('   ');
          expect(data).toEqual({
            paymentTermsData: paymentTermsDataWhitespaceEnforcement,
            resultData: MOCK_RESULT_DATA,
          });
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
