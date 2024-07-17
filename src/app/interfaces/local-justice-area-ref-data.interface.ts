interface LocalJusticeArea {
  localJusticeAreaId: number;
  ljaCode: string;
  name: string;
  addressLine1: string;
  postcode: string;
}

export interface ILocalJusticeAreaRefData {
  count: number;
  refData: LocalJusticeArea[];
}
