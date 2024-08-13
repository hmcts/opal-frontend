export interface IOpalFinesBusinessUnit {
  businessUnitCode: string;
  businessUnitType: string;
  accountNumberPrefix: null | string;
  opalDomain: null | string;
  businessUnitId: number;
  businessUnitName: string;
}

export interface IOpalFinesBusinessUnitRefData {
  count: number;
  refData: IOpalFinesBusinessUnit[];
}
