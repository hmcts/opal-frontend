import type { BusinessUnitSummaryCommon } from './generated/opal-fines-business-unit-summary-common.interface';

export interface IOpalFinesBusinessUnitConfigurationItems {
  item_name: string | null;
  item_value: string | null;
  item_values: string[] | null;
}

// Generated summary plus legacy fields we still surface in the UI/mappers.
export type IOpalFinesBusinessUnit = Omit<BusinessUnitSummaryCommon, 'business_unit_id' | 'welsh_speaking'> & {
  business_unit_id: number;
  business_unit_id_display?: string | null;
  welsh_speaking?: string | null;
  welsh_language?: boolean | null;
  business_unit_code?: string | null;
  business_unit_type?: string | null;
  account_number_prefix?: string | null;
  opal_domain?: string | null;
  configuration_items?: IOpalFinesBusinessUnitConfigurationItems[];
};

export interface IOpalFinesBusinessUnitRefData {
  count: number;
  refData: IOpalFinesBusinessUnit[];
}

export interface IOpalFinesBusinessUnitConfigurationItemsNonSnakeCase {
  itemName: string | null;
  itemValue: string | null;
  itemValues: string[] | null;
}

export interface IOpalFinesBusinessUnitNonSnakeCase {
  businessUnitCode?: string | null;
  businessUnitType?: string | null;
  accountNumberPrefix?: null | string;
  opalDomain?: null | string;
  businessUnitId: number;
  businessUnitName: string;
  configurationItems?: IOpalFinesBusinessUnitConfigurationItemsNonSnakeCase[];
  welshLanguage?: boolean | null;
}
