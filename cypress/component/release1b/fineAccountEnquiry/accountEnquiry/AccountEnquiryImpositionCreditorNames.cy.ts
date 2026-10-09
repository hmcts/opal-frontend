import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../../CommonIntercepts/CommonUserState.mocks';
import { AccountDetailsImpositionsActions } from '../../../../e2e/functional/opal/actions/account-details/details.impositions.actions';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/defendant_details_at_glance_mock';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import { IMPOSITION_CREDITOR_NAMES_MOCK } from './mocks/imposition-creditor-names.mock';
import {
  interceptAtAGlance,
  interceptDefendantHeader,
  interceptImpositions,
} from './intercept/defendantAccountIntercepts';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ID = DEFENDANT_HEADER_MOCK.defendant_account_party_id;

const setupImpositionsScreen = () => {
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(ACCOUNT_ID, structuredClone(DEFENDANT_HEADER_MOCK), '123');
  interceptAtAGlance(Number(ACCOUNT_ID), structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK), '123');
  interceptImpositions(ACCOUNT_ID, structuredClone(IMPOSITION_CREDITOR_NAMES_MOCK), '123');

  setupAccountEnquiryComponent({
    accountId: ACCOUNT_ID,
    fragments: 'impositions',
    interceptedRoutes: ['/access-denied'],
  });
};

describe('Account Enquiry Imposition creditor names', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  it(
    'PO-10571: displays each creditor type from the revised creditor summary response',
    { tags: ['@JIRA-STORY:PO-10571', '@JIRA-EPIC:PO-979', '@R1B'] },
    () => {
      setupImpositionsScreen();
      new AccountDetailsImpositionsActions().assertCreditorSummaryResponse('@getImpositions', [
        ['PO10571 Company Ltd', 'MN', 'true'],
        ['Alex James Example', 'MN', 'false'],
        ['SurnameOnly', 'MN', 'false'],
        ['PO10571 Major Creditor', 'MJ', ''],
        ['Central Fund', 'CF', ''],
        ['Minor Creditor', 'MN', 'true'],
      ]);
    },
  );
});
