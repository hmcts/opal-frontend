export interface IOpalFinesInterfaceJobsSummaryParams {
  business_unit_ids: number[];
  statuses?: string[];
  completed_date_from?: string | null;
  completed_date_to?: string | null;
  interface_name?: string | null;
}
