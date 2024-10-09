export interface IOpalFinesResults {
  active: boolean;
  imposition_allocation_order: number | null;
  imposition_creditor: string;
  result_id: string;
  result_title: string;
  result_title_cy: string | null;
  result_type: string;
}

export interface IOpalFinesResultsRefData {
  count: number;
  refData: IOpalFinesResults[];
}
