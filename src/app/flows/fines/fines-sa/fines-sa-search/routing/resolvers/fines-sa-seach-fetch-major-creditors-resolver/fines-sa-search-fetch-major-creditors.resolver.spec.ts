import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { finesSaSearchFetchMajorCreditorsResolver } from './fines-sa-search-fetch-major-creditors.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { firstValueFrom, Observable, of } from 'rxjs';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FinesSaStoreType } from '../../../../stores/types/fines-sa.type';
import { FinesSaStore } from '../../../../stores/fines-sa.store';

describe('finesSaSearchFetchMajorCreditorsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesMajorCreditorRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesSaSearchFetchMajorCreditorsResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getMajorCreditors']);
    mockOpalFinesService.getMajorCreditors.and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });

    mockFinesSaStore = TestBed.inject(FinesSaStore);
  });

  it('should return {} when no business unit ids appear in store', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesMajorCreditorRefData>);
    expect(result).toEqual({ count: 0, refData: [] } as IOpalFinesMajorCreditorRefData);
  });

  it('should return {} when business unit ids is in store', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFinesSaStore.setBusinessUnitIds([1, 2, 3]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesMajorCreditorRefData>);

    expect(result).toEqual({ count: 0, refData: [] } as IOpalFinesMajorCreditorRefData);
  });

  it('should return {} when business unit ids is in store', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFinesSaStore.setBusinessUnitIds([1]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesMajorCreditorRefData>);

    expect(result).toEqual(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK);
    expect(mockOpalFinesService.getMajorCreditors).toHaveBeenCalledWith(1);
  });
});
