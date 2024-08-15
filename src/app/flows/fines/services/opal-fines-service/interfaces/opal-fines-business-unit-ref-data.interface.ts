export interface IOpalFinesBusinessUnit {
  businessUnitCode: string;
  businessUnitType: string;
  accountNumberPrefix: null | string;
  opalDomain: null | string;
  businessUnitId: number;
  businessUnitName: string;
  configurationItems: [];
  welshLanguage: boolean | null;
}

export interface IOpalFinesBusinessUnitRefData {
  count: number;
  refData: IOpalFinesBusinessUnit[];
}
