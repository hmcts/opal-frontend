import { IOpalFinesBusinessUnitOutstandingAutoPaymentCounts } from '../interfaces/opal-fines-business-unit-outstanding-auto-payment-counts.interface';

export const OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK: IOpalFinesBusinessUnitOutstandingAutoPaymentCounts =
  {
    business_units: [
      {
        business_unit_id: 77,
        business_unit_name: 'Camberwell Green',
        file_count: 4,
        till_count: 1,
      },
      {
        business_unit_id: 65,
        business_unit_name: 'Camden and Islington',
        file_count: 0,
        till_count: 0,
      },
      {
        business_unit_id: 78,
        business_unit_name: 'N E Region',
        file_count: 8,
        till_count: 2,
      },
      {
        business_unit_id: 73,
        business_unit_name: 'West London',
        file_count: 1,
        till_count: 0,
      },
      {
        business_unit_id: 80,
        business_unit_name: 'Westminster - North (Wells Street)',
        file_count: 0,
        till_count: 3,
      },
    ],
  };
