import { OpalFinesReportInstanceStatus } from '../types/opal-fines-report-instance-status.type';
import { OpalFinesReportSupportedFileType } from '../types/opal-fines-report-supported-file-type.type';

export interface IOpalFinesReportInstance {
  instance_id?: string | number;
  instanceId?: string | number;
  report_id?: string | number;
  reportId?: string | number;
  report_type_id?: string | number;
  report_permissions?: string[];
  created_at?: string;
  created_timestamp?: string;
  generatedAt?: string;
  requested_at?: string;
  requestedAt?: string;
  created_by?: string;
  requested_by_name?: string;
  requested_by?: {
    name?: string;
    user_id?: string | number;
  };
  requestedBy?: {
    name?: string;
    userId?: string | number;
  };
  name?: string;
  report_name?: string;
  business_unit?: string;
  business_units?: (
    | string
    | {
        business_unit_id?: string | number;
        business_unit_code?: string | number;
        business_unit_name?: string;
        name?: string;
      }
  )[];
  businessUnits?: {
    businessUnitId?: string | number;
    businessUnitCode?: string | number;
    business_unit_id?: string | number;
    business_unit_code?: string | number;
    name?: string;
    businessUnitName?: string;
    business_unit_name?: string;
  }[];
  business_units_details?: {
    business_unit_id?: string | number;
    business_unit_code?: string | number;
    business_unit_name?: string;
  }[];
  status?: OpalFinesReportInstanceStatus | {
    code?: OpalFinesReportInstanceStatus | string;
    displayName?: string;
    display_name?: string;
  };
  generation_status?: OpalFinesReportInstanceStatus;
  number_of_records?: number;
  numberOfRecords?: number;
  no_of_records?: number;
  is_downloadable?: boolean;
  isDownloadable?: boolean;
  supported_types?: OpalFinesReportSupportedFileType[];
  supported_file_types?: OpalFinesReportSupportedFileType[];
  supportedFileTypes?: OpalFinesReportSupportedFileType[];
}
