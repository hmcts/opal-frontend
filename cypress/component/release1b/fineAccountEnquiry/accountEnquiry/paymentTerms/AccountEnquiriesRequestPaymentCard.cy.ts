import { createDefendantHeaderMockWithName } from '../mocks/defendant_details_mock';
import {
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from 'cypress/component/CommonIntercepts/CommonUserState.mocks';

import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS as PAYMENT_TERMS_TAB } from '../../../../../shared/selectors/account-enquiry/account.enquiry.payment-terms.locators';
import { interceptDefendantHeader, interceptPaymentTerms } from '../intercept/defendantAccountIntercepts';
import {
  interceptAuthenticatedUser,
  interceptResultByCode,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { IComponentProperties } from '../setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from '../setup/SetupComponent';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { APP_MODE_FEATURE_FLAG } from '@app/flows/fines/constants/environment-feature-flags.constant';
import { RELEASE_1B_1_1_FEATURE_FLAG } from '@app/flows/fines/constants/release-feature-flags.constant';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

describe('Account Enquiry Payment Terms - Payment card', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });
  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'payment-terms',
    interceptedRoutes: [
      '/access-denied',
      '../note/add',
      '../debtor/individual/amend',
      '../debtor/parentGuardian/amend',
      '../payment-terms/amend',
      '../party/:partyId',
      '../party/:partyId/amend',
      '../',
      // Add more routes here as needed
    ],
  };

  it(
    'Last enforcement action prevents the adding of a payment card',
    { tags: [...buildTags('@JIRA-STORY:PO-1802'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4385'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('John', 'Smith'));
      headerMock.debtor_type = 'individual';
      headerMock.payment_state_summary.account_balance = -500.58;
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'DW';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('DW');
      setupAccountEnquiryComponent({
        ...componentProperties,
        accountId: accountId,
      });
      cy.get('router-outlet').should('exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Request payment card').click();
      cy.get('h1').should('contain.text', 'You cannot request a payment card.');
      cy.get('p').should('contain.text', 'The last enforcement action prevents you from adding a payment card.');
      cy.get('p').should('contain.text', 'DW');
    },
  );

  it(
    'No permission in BU prevents the adding of a payment card',
    { tags: [...buildTags('@JIRA-STORY:PO-1802'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4386'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('John', 'Smith'));
      headerMock.debtor_type = 'individual';
      headerMock.payment_state_summary.account_balance = -500.58;
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({
        ...componentProperties,
        accountId: accountId,
      });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Request payment card').click();
      cy.get('h1').contains('You cannot request a payment card.');
      cy.get('p').contains('Your business unit does not allow payment card requests.');
    },
  );

  it(
    'AC1a: User can request a payment card and sees the confirmation screen',
    { tags: [...buildTags('@JIRA-STORY:PO-1700'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4387'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.payment_state_summary.account_balance = -500.58;
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({
        ...componentProperties,
        accountId: accountId,
      });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Request payment card').click();
      cy.get('h1').should('contain.text', 'Do you want to request a payment card for the defendant?');
      cy.contains('button', 'Yes - request a payment card').should('exist');
      cy.contains('a', 'No - cancel').should('exist');
    },
  );

  it(
    'shows a warning when a payment card has already been requested today',
    { tags: [...buildTags('@JIRA-STORY:PO-11120')] },
    () => {
      const testDate = new Date();
      const today = [
        testDate.getFullYear(),
        String(testDate.getMonth() + 1).padStart(2, '0'),
        String(testDate.getDate()).padStart(2, '0'),
      ].join('-');

      const headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.payment_state_summary.account_balance = -500.58;
      const paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';
      paymentTermsMock.payment_card_last_requested = today;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({
        ...componentProperties,
        accountId,
        globalStoreFactory: () => {
          const store = new GlobalStore();
          store.setFeatureFlags({
            [RELEASE_1B_1_1_FEATURE_FLAG]: true,
            [APP_MODE_FEATURE_FLAG]: 'legacy',
          });
          return store;
        },
      });

      cy.get('#payment-card-requested-today-warning')
        .should('be.visible')
        .and('contain.text', 'A payment card has already been requested today. You can still request another payment card if needed.');
    },
  );

  it(
    'AC1bi: Cancel returns to Payment terms with no changes made',
    { tags: [...buildTags('@JIRA-STORY:PO-1700'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4388'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.payment_state_summary.account_balance = -500.58;
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({
        ...componentProperties,
        accountId: accountId,
      });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Request payment card').click();
      cy.contains('a', 'No - cancel').click();

      cy.get(PAYMENT_TERMS_TAB.tabName).should('contain.text', 'Payment terms');
      cy.get('opal-lib-moj-alert[type="success"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('contain.text', '11 October 2025');
    },
  );
});
