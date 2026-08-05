import { IOpalFinesReportInstance } from './opal-fines-report-instance.interface';

export interface IOpalFinesReportInstancesResponse {
  report_instances?: IOpalFinesReportInstance[];
  instances?: IOpalFinesReportInstance[];
  refData?: IOpalFinesReportInstance[];
  count?: number;
  total_count?: number;
  total?: number;
  max_results?: number;
  limit?: number;
  has_more?: boolean;
}
