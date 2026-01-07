import { IOpalFinesBusinessUnitConfigurationItemsNonSnakeCase } from './opal-fines-business-unit-configuration-items-non-snake-case.interface';

export interface IOpalFinesBusinessUnitNonSnakeCase {
  businessUnitCode: string;
  businessUnitType: string;
  accountNumberPrefix: null | string;
  opalDomain: null | string;
  businessUnitId: number;
  businessUnitName: string;
  configurationItems: IOpalFinesBusinessUnitConfigurationItemsNonSnakeCase[];
  welshLanguage: boolean | null;
}
