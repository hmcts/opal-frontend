export interface IOpalFinesLocalJusticeArea {
  local_justice_area_id: number;
  lja_code: string;
  name: string;
  address_line_1: string;
  postcode: string;
}

export interface IOpalFinesLocalJusticeAreaRefData {
  count: number;
  refData: IOpalFinesLocalJusticeArea[];
}
