export interface ISearchCourt {
  courtId: number;
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postcode: string;
  businessUnitId: number;
  nameCy: string | null;
  addressLine1Cy: string | null;
  addressLine2Cy: string | null;
  addressLine3Cy: string | null;
  courtCode: number;
  parentCourtId: number | null;
  localJusticeAreaId: number;
  nationalCourtCode: string;
}
