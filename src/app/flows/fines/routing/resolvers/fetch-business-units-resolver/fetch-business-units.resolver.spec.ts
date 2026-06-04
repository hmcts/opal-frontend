import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { fetchBusinessUnitsResolver } from './fetch-business-units.resolver';
import { firstValueFrom, Observable, of } from 'rxjs';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '@app/flows/fines/fines-reports/fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

const createUserStateWithPermissionInBusinessUnits = (
  permissionId: number,
  businessUnitIds: readonly number[],
): IOpalUserState => {
  const userState = structuredClone(OPAL_USER_STATE_MOCK);

  userState.business_unit_users = userState.business_unit_users.map((businessUnitUser) => ({
    ...businessUnitUser,
    permissions: businessUnitIds.includes(businessUnitUser.business_unit_id)
      ? [
          {
            permission_id: permissionId,
            permission_name: `Permission ${permissionId}`,
          },
        ]
      : [],
  }));

  return userState;
};

describe('fetchBusinessUnitsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchBusinessUnitsResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let globalStore: GlobalStoreType;

  beforeEach(() => {
    mockOpalFinesService = {
      getBusinessUnits: vi.fn().mockName('OpalFines.getBusinessUnits'),
      getBusinessUnitsByPermission: vi.fn().mockName('OpalFines.getBusinessUnitsByPermission'),
    };
    mockOpalFinesService.getBusinessUnits.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(OPAL_USER_STATE_MOCK);
  });

  it('should call getBusinessUnits with the correct permission from route data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: { permission: 'PERMISSION_XYZ' } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    await executeResolver(route, mockRouterStateSnapshot);

    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith('PERMISSION_XYZ');
  });

  it('should resolve business units data from the service', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: { permission: 'TEST_PERMISSION' } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    const result = await firstValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>,
    );
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });

  it('should call getBusinessUnits without args when no permission is provided', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} }; // no permission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    await executeResolver(route, mockRouterStateSnapshot);

    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalledWith();
  });

  it('should filter business units for operational reports using the logged-in user permissions', async () => {
    globalStore.setUserState(
      createUserStateWithPermissionInBusinessUnits(FINES_PERMISSIONS['operational-report-by-enforcement'], [67, 71]),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = {
      data: {},
      parent: {
        paramMap: {
          get: () => FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    const result = await firstValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>,
    );

    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalledWith();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
    expect(result).toEqual({
      count: 2,
      refData: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData.filter((businessUnit) =>
        [67, 71].includes(businessUnit.business_unit_id),
      ),
    });
  });

  it('should resolve business units data when no permission is provided', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} }; // no permission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    const result = await firstValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>,
    );
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });
});
