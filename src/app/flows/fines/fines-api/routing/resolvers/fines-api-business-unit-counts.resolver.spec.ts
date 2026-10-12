import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-outstanding-auto-payment-counts.mock';
import { IOpalFinesBusinessUnitOutstandingAutoPaymentCounts } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-outstanding-auto-payment-counts.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { finesApiBusinessUnitCountsResolver } from './fines-api-business-unit-counts.resolver';

describe('finesApiBusinessUnitCountsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesBusinessUnitOutstandingAutoPaymentCounts> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesApiBusinessUnitCountsResolver(...resolverParameters));

  let mockOpalFinesService: {
    getBusinessUnitOutstandingAutoPaymentCounts: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getBusinessUnitOutstandingAutoPaymentCounts: vi
        .fn()
        .mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should resolve business unit outstanding auto payment counts from the service', async () => {
    const result = await firstValueFrom(
      executeResolver({} as never, {} as never) as Observable<IOpalFinesBusinessUnitOutstandingAutoPaymentCounts>,
    );

    expect(mockOpalFinesService.getBusinessUnitOutstandingAutoPaymentCounts).toHaveBeenCalled();
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK);
  });

  it('should preserve the backend response order and shape', async () => {
    const response: IOpalFinesBusinessUnitOutstandingAutoPaymentCounts = {
      business_units: [
        {
          business_unit_id: 2,
          business_unit_name: 'Z Business Unit',
          file_count: 4,
          till_count: 5,
        },
        {
          business_unit_id: 1,
          business_unit_name: 'A Business Unit',
          file_count: 0,
          till_count: 0,
        },
      ],
    };
    mockOpalFinesService.getBusinessUnitOutstandingAutoPaymentCounts.mockReturnValue(of(response));

    const result = await firstValueFrom(
      executeResolver({} as never, {} as never) as Observable<IOpalFinesBusinessUnitOutstandingAutoPaymentCounts>,
    );

    expect(result).toBe(response);
    expect(result.business_units.map((businessUnit) => businessUnit.business_unit_name)).toEqual([
      'Z Business Unit',
      'A Business Unit',
    ]);
  });
});
