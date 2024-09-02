export interface IOpalFinesBusinessUnitConfigurationItems {
  itemName: string | null;
  itemValue: string | null;
  itemValues: string[] | null;
}

export interface IOpalFinesBusinessUnit {
  businessUnitCode: string;
  businessUnitType: string;
  accountNumberPrefix: null | string;
  opalDomain: null | string;
  businessUnitId: number;
  businessUnitName: string;
  configurationItems: IOpalFinesBusinessUnitConfigurationItems[];
  welshLanguage: boolean | null;
}

export interface IOpalFinesBusinessUnitRefData {
  count: number;
  refData: IOpalFinesBusinessUnit[];
}
