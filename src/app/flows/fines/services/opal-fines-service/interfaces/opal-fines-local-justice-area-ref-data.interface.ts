interface IOpalFinesLocalJusticeArea {
  localJusticeAreaId: number;
  ljaCode: string;
  name: string;
  addressLine1: string;
  postcode: string;
}

export interface IOpalFinesLocalJusticeAreaRefData {
  count: number;
  refData: IOpalFinesLocalJusticeArea[];
}
