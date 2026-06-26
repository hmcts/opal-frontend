import { FinesReportsReportSummaryStatus } from '../types/fines-reports-report-summary-status.type';
import { IFinesReportsReportSummaryNamedValue } from './fines-reports-report-summary-named-value.interface';

export interface IFinesReportsReportSummaryInstance {
  report_instance_id: string;
  report_id: string;
  report_reference: string;
  report_type: string;
  status: FinesReportsReportSummaryStatus;
  date_created: string;
  business_units: string[];
  number_of_records: number | null;
  created_by: string;
  criteria: IFinesReportsReportSummaryNamedValue[];
  errors?: IFinesReportsReportSummaryNamedValue[];
}
