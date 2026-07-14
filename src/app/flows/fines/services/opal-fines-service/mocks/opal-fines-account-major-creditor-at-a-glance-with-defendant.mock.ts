import { IOpalFinesAccountMajorCreditorAtAGlance } from '../interfaces/opal-fines-account-major-creditor-at-a-glance.interface';

export const OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK: IOpalFinesAccountMajorCreditorAtAGlance = {
  version: null,
  major_creditor: {
    address: {
      line_1: '1 Test Road',
      line_2: 'Test',
      line_3: 'Test',
      postcode: 'TE1 1ET',
    },
    code: 'TEST',
    creditor_account_id: 10770000000081,
    name: 'TEST',
    pay_by_bacs: true,
  },
};
