import { IFinesReportsReportSummaryDisplayRow } from './fines-reports-report-summary-display-row.interface';

export interface IFinesReportsReportSummaryViewModel {
  generalRows: IFinesReportsReportSummaryDisplayRow[];
  criteriaRows: IFinesReportsReportSummaryDisplayRow[];
  errorRows: IFinesReportsReportSummaryDisplayRow[];
}
