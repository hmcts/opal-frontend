import { OpalFinesReportSupportedFileType } from '../types/opal-fines-report-supported-file-type.type';

export interface IOpalFinesReport {
  report_id: string | number;
  report_title: string;
  report_group?: string;
  audited_report?: boolean;
  report_parameters?: unknown;
  supports_multiple_business_units?: boolean;
  supports_multi_bu?: boolean;
  is_bespoke_journey?: boolean;
  generic_parameters?: unknown;
  shown_as_worklist?: boolean;
  retention_period?: string;
  can_manually_create?: boolean;
  report_permission?: string;
  permission?: string;
  supported_file_types?: OpalFinesReportSupportedFileType[];
}
