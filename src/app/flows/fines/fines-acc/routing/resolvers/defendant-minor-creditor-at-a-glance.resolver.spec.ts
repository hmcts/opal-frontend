import { TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountMinorCreditorAtAGlance } from '../../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-account-minor-creditor-at-a-glance-with-defendant.mock';
import { minorCreditorAccountAtAGlanceResolver } from './defendant-minor-creditor-at-a-glance.resolver';

describe('minorCreditorAccountAtAGlanceResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getMinorCreditorAccountAtAGlance: vi.fn().mockName('OpalFines.getMinorCreditorAccountAtAGlance'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should resolve at-a-glance data when accountId exists', async () => {
    const accountId = '77';
    mockOpalFinesService.getMinorCreditorAccountAtAGlance.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({ accountId }) } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        minorCreditorAccountAtAGlanceResolver(route, state) as Observable<IOpalFinesAccountMinorCreditorAtAGlance>,
      ),
    );

    expect(mockOpalFinesService.getMinorCreditorAccountAtAGlance).toHaveBeenCalledWith(77);
    expect(result).toEqual(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK);
  });

  it('should throw when accountId route param is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({}) } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;

    expect(() => TestBed.runInInjectionContext(() => minorCreditorAccountAtAGlanceResolver(route, state))).toThrowError(
      'Account ID is required',
    );
    expect(mockOpalFinesService.getMinorCreditorAccountAtAGlance).not.toHaveBeenCalled();
  });

  it('should propagate service errors', async () => {
    mockOpalFinesService.getMinorCreditorAccountAtAGlance.mockReturnValue(
      throwError(() => new Error('Failed to fetch at-a-glance')),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({ accountId: '99' }) } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;

    await expect(
      TestBed.runInInjectionContext(() =>
        firstValueFrom(
          minorCreditorAccountAtAGlanceResolver(route, state) as Observable<IOpalFinesAccountMinorCreditorAtAGlance>,
        ),
      ),
    ).rejects.toThrow('Failed to fetch at-a-glance');

    expect(mockOpalFinesService.getMinorCreditorAccountAtAGlance).toHaveBeenCalledWith(99);
  });
});
