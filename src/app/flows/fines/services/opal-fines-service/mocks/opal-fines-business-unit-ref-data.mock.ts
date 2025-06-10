import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

export const OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK: IOpalFinesBusinessUnitRefData = {
  count: 7,
  refData: [
    {
      business_unit_id: 61,
      business_unit_name: 'Historical Debt',
      business_unit_code: '80',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [
        {
          item_name: 'Item1',
          item_value: 'Item1',
          item_values: [],
        },
      ],
      welsh_language: false,
    },
    {
      business_unit_id: 67,
      business_unit_name: 'London Central & South East',
      business_unit_code: '77',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [
        {
          item_name: 'Item2',
          item_value: 'Item2',
          item_values: [],
        },
      ],
      welsh_language: false,
    },
    {
      business_unit_id: 68,
      business_unit_name: 'London Confiscation Orders',
      business_unit_code: '66',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Confiscation',
      configuration_items: [
        {
          item_name: 'Item3',
          item_value: 'Item3',
          item_values: [],
        },
      ],
      welsh_language: false,
    },
    {
      business_unit_id: 69,
      business_unit_name: 'London North East',
      business_unit_code: '78',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [
        {
          item_name: 'Item4',
          item_value: 'Item4',
          item_values: [],
        },
      ],
      welsh_language: false,
    },
    {
      business_unit_id: 70,
      business_unit_name: 'London North West',
      business_unit_code: '65',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [
        {
          item_name: 'Item5',
          item_value: 'Item5',
          item_values: [],
        },
      ],
      welsh_language: false,
    },
    {
      business_unit_id: 71,
      business_unit_name: 'London South West',
      business_unit_code: '73',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'Fines',
      configuration_items: [
        {
          item_name: 'Item6',
          item_value: 'Item6',
          item_values: [],
        },
      ],
      welsh_language: false,
    },
    {
      business_unit_id: 73,
      business_unit_name: 'MBEC London',
      business_unit_code: '67',
      business_unit_type: 'Accounting Division',
      account_number_prefix: null,
      opal_domain: 'RM',
      configuration_items: [
        {
          item_name: 'Item7',
          item_value: 'Item7',
          item_values: [],
        },
      ],
      welsh_language: false,
    },
  ],
};
