import { IOpalFinesResultRefData } from '../../../../services/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { MOCK_RESULT_DATA } from './fines-acc-result-data.mock';

/**
 * Mock result data with prevent_payment_card set to true
 */
export const MOCK_RESULT_DATA_WITH_PREVENT_PAYMENT_CARD: IOpalFinesResultRefData = {
  ...MOCK_RESULT_DATA,
  prevent_payment_card: true,
};
