import { IOpalFinesCentralFund } from '../interfaces/opal-fines-account-central-fund.interface';

/**
 * Mock data for OpalFines central funds response
 */
export const OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK: IOpalFinesCentralFund = {
  business_unit_details: {
    business_unit_id: '77',
    business_unit_name: 'Camberwell Green',
    welsh_speaking: 'N',
  },
  major_creditor: {
    account_number: '00002000J',
    creditor_account_id: 77,
    name: 'Central Funds',
  },
};
