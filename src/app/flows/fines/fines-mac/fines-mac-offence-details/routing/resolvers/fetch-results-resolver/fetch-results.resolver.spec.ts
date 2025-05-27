import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { fetchResultsResolver } from './fetch-results.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { of, firstValueFrom, Observable } from 'rxjs';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../../../constants/fines-mac-offence-details-result-codes.constant';

describe('fetchResultsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesResultsRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchResultsResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getResults']);
    mockOpalFinesService.getResults.and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should resolve results from the service using result code array', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesResultsRefData>);
    expect(result).toEqual(OPAL_FINES_RESULTS_REF_DATA_MOCK);
    expect(mockOpalFinesService.getResults).toHaveBeenCalledWith(
      Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES),
    );
  });
});
