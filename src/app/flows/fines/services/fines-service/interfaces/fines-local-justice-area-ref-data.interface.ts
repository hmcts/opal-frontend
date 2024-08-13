interface IFinesLocalJusticeArea {
  localJusticeAreaId: number;
  ljaCode: string;
  name: string;
  addressLine1: string;
  postcode: string;
}

export interface IFinesLocalJusticeAreaRefData {
  count: number;
  refData: IFinesLocalJusticeArea[];
}
