export interface IOpalFinesCourt {
  court_id: number;
  court_code: number;
  name: string;
  name_cy: string | null;
  national_court_code: string | null;
  business_unit_id: number;
}

export interface IOpalFinesCourtRefData {
  count: number;
  refData: IOpalFinesCourt[];
}
