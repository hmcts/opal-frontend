import type { IOpalFinesBusinessUnitRefData } from '../../../services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

export const FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK: IOpalFinesBusinessUnitRefData = {
  count: 4,
  refData: [
    {
      business_unit_id: 77,
      business_unit_code: '0046',
      business_unit_name: 'Camberwell Green',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [],
      welsh_language: false,
    },
    {
      business_unit_id: 78,
      business_unit_code: '0047',
      business_unit_name: 'N E Region',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [],
      welsh_language: false,
    },
    {
      business_unit_id: 65,
      business_unit_code: '0034',
      business_unit_name: 'Camden and Islington',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [],
      welsh_language: false,
    },
    {
      business_unit_id: 73,
      business_unit_code: '0042',
      business_unit_name: 'West London',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [],
      welsh_language: false,
    },
  ],
};
