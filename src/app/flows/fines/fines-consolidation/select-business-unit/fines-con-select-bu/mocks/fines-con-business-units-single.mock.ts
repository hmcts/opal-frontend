import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

/**
 * Mock data for single business unit
 */
export const FINES_CON_BUSINESS_UNITS_SINGLE_MOCK: IOpalFinesBusinessUnitRefData = {
  count: 1,
  refData: [
    {
      business_unit_id: 1,
      business_unit_name: 'Test Business Unit',
      business_unit_code: 'TEST',
      business_unit_type: 'TEST',
      account_number_prefix: 'T',
      opal_domain: 'test.local',
      configuration_items: [],
      welsh_language: false,
    },
  ],
};
