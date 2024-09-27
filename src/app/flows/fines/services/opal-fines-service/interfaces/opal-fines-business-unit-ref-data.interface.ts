export interface IOpalFinesBusinessUnitConfigurationItems {
  item_name: string | null;
  item_value: string | null;
  item_values: string[] | null;
}

export interface IOpalFinesBusinessUnit {
  business_unit_code: string;
  business_unit_type: string;
  account_number_prefix: null | string;
  opal_domain: null | string;
  business_unit_id: number;
  business_unit_name: string;
  configurationItems: IOpalFinesBusinessUnitConfigurationItems[];
  welsh_language: boolean | null;
}

export interface IOpalFinesBusinessUnitRefData {
  count: number;
  refData: IOpalFinesBusinessUnit[];
}
