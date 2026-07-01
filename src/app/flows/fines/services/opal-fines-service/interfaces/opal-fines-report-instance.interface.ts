import { OpalFinesReportInstanceStatus } from '../types/opal-fines-report-instance-status.type';
import { OpalFinesReportSupportedFileType } from '../types/opal-fines-report-supported-file-type.type';

export interface IOpalFinesReportInstance {
  instance_id: string | number;
  report_id: string | number;
  report_type_id?: string | number;
  report_permissions?: string[];
  created_at?: string;
  created_timestamp?: string;
  requested_at?: string;
  created_by?: string;
  requested_by_name?: string;
  name?: string;
  report_name?: string;
  business_unit?: string;
  business_units?: string[];
  status?: OpalFinesReportInstanceStatus;
  generation_status?: OpalFinesReportInstanceStatus;
  number_of_records?: number;
  no_of_records?: number;
  is_downloadable?: boolean;
  supported_types?: OpalFinesReportSupportedFileType[];
  supported_file_types?: OpalFinesReportSupportedFileType[];
}
