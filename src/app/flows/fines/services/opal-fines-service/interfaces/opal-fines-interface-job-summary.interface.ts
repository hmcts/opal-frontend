export interface IOpalFinesInterfaceJobSummary {
  business_unit_name: string;
  completed_datetime: string | null;
  created_datetime: string;
  file_name: string;
  interface_file_id: number;
  interface_job_id: number;
  source: string;
  status: string;
}
