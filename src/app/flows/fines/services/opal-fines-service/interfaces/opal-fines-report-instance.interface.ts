export interface IOpalFinesReportInstanceRequestedBy {
  user_id?: string | null;
  name?: string | null;
}

export interface IOpalFinesReportInstanceBusinessUnit {
  business_unit_id: string;
  business_unit_name?: string | null;
  welsh_speaking?: string | null;
}

export interface IOpalFinesReportInstanceStatus {
  code: string;
  display_name: string;
}

export interface IOpalFinesReportInstanceReportReference {
  id: string;
  supported_file_types: string[];
}

export interface IOpalFinesReportInstance {
  instance_id: number;
  requested_at: string;
  generated_at?: string | null;
  requested_by: IOpalFinesReportInstanceRequestedBy;
  name: string;
  business_units: IOpalFinesReportInstanceBusinessUnit[];
  status: IOpalFinesReportInstanceStatus;
  number_of_records?: number | null;
  is_downloadable: boolean;
  errors?: Array<Record<string, unknown>> | null;
  report_parameters?: Record<string, unknown> | null;
  retain_until?: string | null;
  report: IOpalFinesReportInstanceReportReference;
}
