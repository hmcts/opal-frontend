import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { fetchProsecutorsResolver } from './fetch-prosecutors.resolver';
import { of, firstValueFrom, Observable } from 'rxjs';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesProsecutorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor-ref-data.interface';

describe('fetchIssuingAuthoritiesResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesProsecutorRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchProsecutorsResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let finesMacStore: FinesMacStoreType;
  const mockBusinessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getProsecutors']);
    mockOpalFinesService.getProsecutors.and.returnValue(of(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK));

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

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesProsecutorRefData>);
    expect(result).toEqual(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK);
    expect(mockOpalFinesService.getProsecutors).toHaveBeenCalledWith(mockBusinessUnit.business_unit_id);
  });
});
