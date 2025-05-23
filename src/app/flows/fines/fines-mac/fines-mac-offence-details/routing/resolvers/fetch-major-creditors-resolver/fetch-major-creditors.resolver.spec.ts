import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { fetchMajorCreditorsResolver } from './fetch-major-creditors.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacStore } from '../../../../stores/fines-mac.store';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { of, firstValueFrom, Observable } from 'rxjs';
import { FinesMacStoreType } from '../../../../stores/types/fines-mac-store.type';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

describe('fetchMajorCreditorsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesMajorCreditorRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchMajorCreditorsResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let finesMacStore: FinesMacStoreType;
  const mockBusinessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getMajorCreditors']);
    mockOpalFinesService.getMajorCreditors.and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setBusinessUnit(mockBusinessUnit);
  });

  it('should resolve major creditors using business unit ID from store', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesMajorCreditorRefData>);
    expect(result).toEqual(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK);
    expect(mockOpalFinesService.getMajorCreditors).toHaveBeenCalledWith(mockBusinessUnit.business_unit_id);
  });
});
