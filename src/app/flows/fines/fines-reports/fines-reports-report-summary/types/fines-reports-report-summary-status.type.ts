import { type FinesReportsReportSummaryNormalisedStatus } from './fines-reports-report-summary-normalised-status.type';

export type FinesReportsReportSummaryStatus =
  | FinesReportsReportSummaryNormalisedStatus
  | 'Requested'
  | 'In progress'
  | 'Ready'
  | 'Error';
