import { type FinesReportsReportSummaryDisplayRowType } from '../types/fines-reports-report-summary-display-row-type.type';

export interface IFinesReportsReportSummaryDisplayRow {
  key: string;
  value: number | string | null;
  type: FinesReportsReportSummaryDisplayRowType;
}
