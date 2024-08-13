export interface IFinesBusinessUnit {
  businessUnitCode: string;
  businessUnitType: string;
  accountNumberPrefix: null | string;
  opalDomain: null | string;
  businessUnitId: number;
  businessUnitName: string;
}

export interface IFinesBusinessUnitRefData {
  count: number;
  refData: IFinesBusinessUnit[];
}
