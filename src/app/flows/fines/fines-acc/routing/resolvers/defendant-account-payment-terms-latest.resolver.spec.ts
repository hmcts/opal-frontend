import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';
import { defendantAccountPaymentTermsLatestResolver } from './defendant-account-payment-terms-latest.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { MOCK_PAYMENT_TERMS_DATA } from './mocks/defendant-account-payment-terms-data.mock';
import { MOCK_RESULT_DATA } from './mocks/defendant-account-payment-terms-result-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('defendantAccountPaymentTermsLatestResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let mockRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    const routerSpy = {
      createUrlTree: vi.fn().mockName('Router.createUrlTree'),
    };
    const opalFinesServiceSpy = {
      getDefendantAccountPaymentTermsLatest: vi.fn().mockName('OpalFines.getDefendantAccountPaymentTermsLatest'),
      getResult: vi.fn().mockName('OpalFines.getResult'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: OpalFines, useValue: opalFinesServiceSpy },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockRouter = TestBed.inject(Router) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockOpalFinesService = TestBed.inject(OpalFines) as any;

    mockRoute = {
      paramMap: {
        get: vi.fn(),
      },
    } as unknown as ActivatedRouteSnapshot;

    mockRouter.createUrlTree.mockReturnValue({} as never);
  });

  it('should fetch payment terms data and enforcement result then return raw data', async () => {
    (mockRoute.paramMap.get as Mock).mockReturnValue('12345');
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.mockReturnValue(of(MOCK_PAYMENT_TERMS_DATA));
    mockOpalFinesService.getResult.mockReturnValue(of(MOCK_RESULT_DATA));

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
        });
      } else {
        throw new Error('Expected Observable but got something else');
      }
    });
  });

  it('should handle whitespace-only enforcement action', async () => {
    (mockRoute.paramMap.get as Mock).mockReturnValue('12345');
    const paymentTermsDataWhitespaceEnforcement = {
      ...MOCK_PAYMENT_TERMS_DATA,
      last_enforcement: '   ',
    };
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.mockReturnValue(
      of(paymentTermsDataWhitespaceEnforcement),
    );
    mockOpalFinesService.getResult.mockReturnValue(of(MOCK_RESULT_DATA));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((data) => {
          expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('   ');
          expect(data).toEqual({
            paymentTermsData: paymentTermsDataWhitespaceEnforcement,
            resultData: MOCK_RESULT_DATA,
          });
        });
      } else {
        throw new Error('Expected Observable but got something else');
      }
    });
  });

  it('should convert accountId string to number', async () => {
    (mockRoute.paramMap.get as Mock).mockReturnValue('98765');
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.mockReturnValue(of(MOCK_PAYMENT_TERMS_DATA));
    mockOpalFinesService.getResult.mockReturnValue(of(MOCK_RESULT_DATA));

    TestBed.runInInjectionContext(() => {
      const result = defendantAccountPaymentTermsLatestResolver(mockRoute, {} as never);

      if (result && typeof result === 'object' && 'subscribe' in result) {
        result.subscribe(() => {
          expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalledWith(98765);
        });
      } else {
        throw new Error('Expected Observable but got something else');
      }
    });
  });
});
