import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { fetchEnforcementCourtsResolver } from './fetch-enforcement-courts.resolver';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { of, firstValueFrom, Observable } from 'rxjs';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

describe('fetchEnforcementCourtsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesCourtRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchEnforcementCourtsResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let finesMacStore: FinesMacStoreType;
  const mockBusinessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getCourts']);
    mockOpalFinesService.getCourts.and.returnValue(of(OPAL_FINES_COURT_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setBusinessUnit(mockBusinessUnit);
  });

  it('should resolve courts from the service using the businessUnitId from route data', async () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = {};
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesCourtRefData>);
    expect(result).toEqual(OPAL_FINES_COURT_REF_DATA_MOCK);
    expect(mockOpalFinesService.getCourts).toHaveBeenCalledWith(mockBusinessUnit.business_unit_id);
  });
});
