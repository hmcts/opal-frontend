import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, firstValueFrom } from 'rxjs';
import { defendantAccountEnforcementStatusResolver } from './defendant-account-enforcement-status.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('defendantAccountEnforcementStatusResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let mockRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    const opalFinesServiceSpy = {
      getDefendantAccountEnforcementStatus: vi.fn().mockName('OpalFines.getDefendantAccountEnforcementStatus'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: opalFinesServiceSpy }],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockOpalFinesService = TestBed.inject(OpalFines) as any;

    mockRoute = {
      paramMap: {
        get: vi.fn(),
      },
    } as unknown as ActivatedRouteSnapshot;
  });

  it('should fetch enforcement status data using numeric accountId and return service response', async () => {
    (mockRoute.paramMap.get as Mock).mockReturnValue('12345');
    mockOpalFinesService.getDefendantAccountEnforcementStatus.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
    );

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(defendantAccountEnforcementStatusResolver(mockRoute, {} as never) as never),
    );

    expect(mockOpalFinesService.getDefendantAccountEnforcementStatus).toHaveBeenCalledWith(12345);
    expect(result).toEqual(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
  });
});
