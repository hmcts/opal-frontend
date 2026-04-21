import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { OPAL_FINES_RESULTS_PARAMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-params.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { fetchResultsWithParamsResolver } from './fetch-results-with-params.resolver';

describe('fetchResultsWithParamsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesResultsRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchResultsWithParamsResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getResults: vi.fn().mockName('OpalFines.getResults'),
    };
    mockOpalFinesService.getResults.mockReturnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should call getResults with an empty result-code list and route data params', async () => {
    const route = {
      data: {
        resultsParams: OPAL_FINES_RESULTS_PARAMS_MOCK,
      },
    } as unknown as ActivatedRouteSnapshot;

    await executeResolver(route, {} as never);

    expect(mockOpalFinesService.getResults).toHaveBeenCalledWith([], OPAL_FINES_RESULTS_PARAMS_MOCK);
  });

  it('should resolve results data from the service', async () => {
    const route = {
      data: {
        resultsParams: OPAL_FINES_RESULTS_PARAMS_MOCK,
      },
    } as unknown as ActivatedRouteSnapshot;

    const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<IOpalFinesResultsRefData>);

    expect(result).toEqual(OPAL_FINES_RESULTS_REF_DATA_MOCK);
  });
});
