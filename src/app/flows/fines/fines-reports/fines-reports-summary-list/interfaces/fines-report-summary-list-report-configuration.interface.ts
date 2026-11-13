import { type FinesPermissionCode } from '@app/constants/fines-permissions.constant';
export interface IFinesReportSummaryListReportConfiguration {
  id: string;
  reportTypeId: string;
  heading: string;
  title: string;
  permissionCodes: FinesPermissionCode[];
  canCreate: boolean;
}
