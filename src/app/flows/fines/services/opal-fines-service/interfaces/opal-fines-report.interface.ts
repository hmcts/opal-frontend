export interface IOpalFinesReport {
  report_id: string;
  report_title: string;
  report_group: string;
  supported_file_types: string[];
  audited_report: boolean;
  report_parameters?: Record<string, unknown>;
  supports_multiple_business_units: boolean;
  is_bespoke_journey: boolean;
  shown_as_worklist: boolean;
  retention_period?: string;
  permission?: string;
  can_manually_create: boolean;
}
