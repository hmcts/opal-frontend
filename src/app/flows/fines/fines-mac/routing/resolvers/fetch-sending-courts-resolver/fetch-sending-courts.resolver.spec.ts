import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable, of } from 'rxjs';
import { fetchSendingCourtsResolver } from './fetch-sending-courts.resolver';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { firstValueFrom } from 'rxjs';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';

describe('fetchSendingCourtsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesLocalJusticeAreaRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchSendingCourtsResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getLocalJusticeAreas']);
    mockOpalFinesService.getLocalJusticeAreas.and.returnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should resolve local justice areas from the service', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesLocalJusticeAreaRefData>);
    expect(result).toEqual(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalled();
  });
});
