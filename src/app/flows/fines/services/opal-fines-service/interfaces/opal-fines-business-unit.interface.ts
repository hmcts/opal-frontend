import { IOpalFinesBusinessUnitConfigurationItems } from './opal-fines-business-unit-configuration-items.interface';

export interface IOpalFinesBusinessUnit {
  business_unit_code: string;
  business_unit_type: string;
  account_number_prefix: null | string;
  opal_domain: null | string;
  business_unit_id: number;
  business_unit_name: string;
  configuration_items: IOpalFinesBusinessUnitConfigurationItems[];
  welsh_language: boolean | null;
}
