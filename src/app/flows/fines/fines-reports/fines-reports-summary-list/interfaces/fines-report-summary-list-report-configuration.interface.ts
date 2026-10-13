export interface IFinesReportSummaryListReportConfiguration {
  id: string;
  reportTypeId: string;
  createHeading: string | null;
  heading: string;
  title: string;
  permissionIds: number[];
  canCreate: boolean;
}
