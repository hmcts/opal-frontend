export interface IOpalFinesReportInstancesParams {
  from_date?: string | null;
  to_date?: string | null;
  business_units?: (string | number)[];
  user_id?: string | number | null;
  report_id?: string | number | null;
}
