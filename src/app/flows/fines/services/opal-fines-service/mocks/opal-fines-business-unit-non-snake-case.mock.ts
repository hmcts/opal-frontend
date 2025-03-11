import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

export const OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK: IOpalFinesBusinessUnitNonSnakeCase = {
  businessUnitId: 61,
  businessUnitName: 'Historical Debt',
  businessUnitCode: '80',
  businessUnitType: 'Accounting Division',
  accountNumberPrefix: null,
  opalDomain: 'Fines',
  configurationItems: [
    {
      itemName: 'Item1',
      itemValue: 'Item1',
      itemValues: [],
    },
  ],
  welshLanguage: false,
};
