import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { fetchLocalJusticeAreasResolver } from './fetch-ljas.resolver';

describe('fetchLocalJusticeAreasResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesLocalJusticeAreaRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchLocalJusticeAreasResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getLocalJusticeAreas: vi.fn().mockName('OpalFines.getLocalJusticeAreas'),
    };
    mockOpalFinesService.getLocalJusticeAreas.mockReturnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should call getLocalJusticeAreas on the opal fines service', async () => {
    await executeResolver({} as never, {} as never);

    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith();
  });

  it('should resolve local justice areas data from the service', async () => {
    const result = await firstValueFrom(
      executeResolver({} as never, {} as never) as Observable<IOpalFinesLocalJusticeAreaRefData>,
    );

    expect(result).toEqual(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
  });
});
