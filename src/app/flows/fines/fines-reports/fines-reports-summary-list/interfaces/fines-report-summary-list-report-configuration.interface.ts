export interface IFinesReportSummaryListReportConfiguration {
  id: string;
  reportTypeId: string;
  heading: string;
  title: string;
  requiresReportMetadata: boolean;
  permissionIds: number[];
  canCreate: boolean;
  isYourReports: boolean;
}
