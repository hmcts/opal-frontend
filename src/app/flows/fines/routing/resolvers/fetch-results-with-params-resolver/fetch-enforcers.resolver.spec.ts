import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesEnforcersRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcers-ref-data.interface';
import { fetchEnforcersResolver } from './fetch-enforcers.resolver';

const OPAL_FINES_ENFORCERS_REF_DATA_MOCK: IOpalFinesEnforcersRefData = {
  count: 2,
  refData: [
    {
      enforcer_id: 1,
      enforcer_code: 1001,
      name: 'Central Enforcement',
      name_cy: null,
    },
    {
      enforcer_id: 2,
      enforcer_code: 1002,
      name: 'West Enforcement',
      name_cy: null,
    },
  ],
};

describe('fetchEnforcersResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesEnforcersRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchEnforcersResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getEnforcers: vi.fn().mockName('OpalFines.getEnforcers'),
    };
    mockOpalFinesService.getEnforcers.mockReturnValue(of(OPAL_FINES_ENFORCERS_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should call getEnforcers on the opal fines service', async () => {
    await executeResolver({} as never, {} as never);

    expect(mockOpalFinesService.getEnforcers).toHaveBeenCalledWith();
  });

  it('should resolve enforcers data from the service', async () => {
    const result = await firstValueFrom(
      executeResolver({} as never, {} as never) as Observable<IOpalFinesEnforcersRefData>,
    );

    expect(result).toEqual(OPAL_FINES_ENFORCERS_REF_DATA_MOCK);
  });
});
