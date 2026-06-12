export interface IFinesReportSummaryListReportConfiguration {
  id: string;
  reportTypeId: string;
  heading: string;
  title: string;
  permissionIds: number[];
  canCreate?: boolean;
  isYourReports?: boolean;
}
