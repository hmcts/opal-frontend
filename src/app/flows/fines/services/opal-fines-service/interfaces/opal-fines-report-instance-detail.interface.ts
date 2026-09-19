import { type IOpalFinesReportInstanceBusinessUnit } from './opal-fines-report-instance-business-unit.interface';
import { type IOpalFinesReportInstanceReportReference } from './opal-fines-report-instance-report-reference.interface';
import { type IOpalFinesReportInstanceRequestedBy } from './opal-fines-report-instance-requested-by.interface';
import { type IOpalFinesReportInstanceStatus } from './opal-fines-report-instance-status.interface';

export interface IOpalFinesReportInstanceDetail {
  instance_id: number;
  requested_at: string;
  generated_at?: string;
  requested_by: IOpalFinesReportInstanceRequestedBy;
  name: string;
  business_units: IOpalFinesReportInstanceBusinessUnit[];
  status: IOpalFinesReportInstanceStatus;
  number_of_records?: number;
  is_downloadable: boolean;
  errors?: Array<Record<string, unknown>>;
  report_parameters?: Record<string, unknown>;
  retain_until?: string;
  report: IOpalFinesReportInstanceReportReference;
}
