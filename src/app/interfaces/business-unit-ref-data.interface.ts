export interface IConfigurationItems {
  itemName: string;
  itemValue: string;
  itemValues: string[];
}

export interface IBusinessUnit {
  businessUnitCode: string;
  businessUnitType: string;
  accountNumberPrefix: null | string;
  opalDomain: null | string;
  businessUnitId: number;
  businessUnitName: string;
  configurationItems: IConfigurationItems[];
  welshLanguage: boolean | null;
}

export interface IBusinessUnitRefData {
  count: number;
  refData: IBusinessUnit[];
}
