import { type Data } from '@angular/router';
import { type FinesPermissionCode } from '@app/constants/fines-permissions.constant';

export interface IFinesRoutePermissionData extends Data {
  routePermissionCodes: FinesPermissionCode[];
}
