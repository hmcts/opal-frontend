export interface IBusinessUnit {
  businessUnitCode: string;
  businessUnitType: string;
  accountNumberPrefix: null | string;
  opalDomain: null | string;
  businessUnitId: number;
  businessUnitName: string;
}

export interface IBusinessUnitRefData {
  count: number;
  refData: IBusinessUnit[];
}
