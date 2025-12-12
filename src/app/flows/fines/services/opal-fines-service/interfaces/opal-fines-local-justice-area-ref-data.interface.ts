import { LjaReferenceCommon } from './generated/opal-fines-lja-reference-common.interface';

export interface IOpalFinesLocalJusticeArea extends LjaReferenceCommon {
  local_justice_area_id?: number | null;
  lja_code?: string | null;
  name?: string | null;
  address_line_1?: string | null;
  postcode?: string | null;
}

export interface IOpalFinesLocalJusticeAreaRefData {
  count: number;
  refData: IOpalFinesLocalJusticeArea[];
}
