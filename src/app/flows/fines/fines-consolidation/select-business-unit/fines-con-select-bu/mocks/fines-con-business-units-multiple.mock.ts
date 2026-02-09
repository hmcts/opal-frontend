import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

/**
 * Mock data for multiple business units
 */
export const FINES_CON_BUSINESS_UNITS_MULTIPLE_MOCK: IOpalFinesBusinessUnitRefData = {
  count: 2,
  refData: [
    {
      business_unit_id: 1,
      business_unit_name: 'Unit 1',
      business_unit_code: 'U1',
      business_unit_type: 'TEST',
      account_number_prefix: 'U1',
      opal_domain: 'unit1.local',
      configuration_items: [],
      welsh_language: false,
    },
    {
      business_unit_id: 2,
      business_unit_name: 'Unit 2',
      business_unit_code: 'U2',
      business_unit_type: 'TEST',
      account_number_prefix: 'U2',
      opal_domain: 'unit2.local',
      configuration_items: [],
      welsh_language: false,
    },
  ],
};
