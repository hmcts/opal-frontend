import { IFinesReportsReportSummaryDisplayRow } from './fines-reports-report-summary-display-row.interface';

export interface IFinesReportsReportSummaryViewModel {
  reportId: string;
  reportTitle: string;
  reportReference: string;
  reportType: string;
  generalRows: IFinesReportsReportSummaryDisplayRow[];
  criteriaRows: IFinesReportsReportSummaryDisplayRow[];
  errorRows: IFinesReportsReportSummaryDisplayRow[];
}
