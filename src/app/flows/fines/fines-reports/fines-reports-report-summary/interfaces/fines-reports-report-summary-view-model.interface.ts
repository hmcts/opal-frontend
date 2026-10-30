export interface IFinesReportsReportSummaryViewModel {
  reportId: string;
  reportTitle: string;
  reportName: string;
  reportType: string;
  general: {
    status: string;
    dateCreated: number | null;
    businessUnits: string | null;
    numberOfRecords: number | null;
    createdBy: string | null;
  };
  criteriaRows: Array<{ key: string; value: number | string; isCurrency?: boolean }>;
  errorRows: Array<{ key: string; value: string }>;
}
