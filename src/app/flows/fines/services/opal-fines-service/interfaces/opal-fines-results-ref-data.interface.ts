export interface IOpalFinesResults {
  active: boolean;
  imposition_allocation_order: number;
  imposition_creditor: string;
  result_id: string;
  result_title: string;
  result_title_cy: string;
  result_type: string;
}

export interface IOpalFinesResultsRefData {
  count: number;
  refData: IOpalFinesResults[];
}
