import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { fetchBusinessUnitsResolver } from './fetch-business-units.resolver';
import { firstValueFrom, Observable, of } from 'rxjs';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

describe('fetchBusinessUnitsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchBusinessUnitsResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getBusinessUnits']);
    mockOpalFinesService.getBusinessUnits.and.returnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should call getBusinessUnits with the correct permission from route data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: { permission: 'PERMISSION_XYZ' } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    await executeResolver(route, mockRouterStateSnapshot);

    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalledWith('PERMISSION_XYZ');
  });

  it('should resolve business units data from the service', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: { permission: 'TEST_PERMISSION' } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    const result = await firstValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>,
    );
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });
});
