import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { map } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '@app/flows/fines/fines-reports/fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';

const filterBusinessUnitsByPermissionIds = (
  refData: readonly IOpalFinesBusinessUnit[],
  userState: IOpalUserState,
  permissionIds: readonly number[],
): IOpalFinesBusinessUnit[] => {
  const allowedBusinessUnitIds = new Set(
    userState.business_unit_users
      .filter((businessUnitUser) =>
        businessUnitUser.permissions.some((permission) => permissionIds.includes(permission.permission_id)),
      )
      .map((businessUnitUser) => businessUnitUser.business_unit_id),
  );

  return refData.filter((businessUnit) => allowedBusinessUnitIds.has(businessUnit.business_unit_id));
};

export const fetchBusinessUnitsResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (route: ActivatedRouteSnapshot) => {
  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);
  const reportId = route.paramMap?.get('reportId') ?? route.parent?.paramMap?.get('reportId') ?? '';
  const permission = route.data['permission'];
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId);

  if (permission) {
    return opalFinesService.getBusinessUnitsByPermission(permission).pipe(map((response) => response));
  }

  if (report?.permissionIds.length) {
    const userState = globalStore.userState();

    return opalFinesService.getBusinessUnits().pipe(
      map((response) => {
        const filteredRefData = filterBusinessUnitsByPermissionIds(response.refData, userState, report.permissionIds);

        return {
          count: filteredRefData.length,
          refData: filteredRefData,
        };
      }),
    );
  }

  return opalFinesService.getBusinessUnits().pipe(map((response) => response));
};
