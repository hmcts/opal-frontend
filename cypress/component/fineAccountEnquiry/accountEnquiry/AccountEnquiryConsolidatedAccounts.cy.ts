import 'cypress-axe';
import { AccountNavDetailsLocators } from '../../../shared/selectors/account-details/account.nav.details.locators';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import {
  interceptDefendantDetails,
  interceptDefendantHeader,
  interceptAtAGlance,
} from './intercept/defendantAccountIntercepts';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

describe('Account Enquiry consolidated accounts tab', () => {
  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'defendant',
    interceptedRoutes: ['/access-denied'],
  };

  const setupShell = (hasConsolidatedAccounts: boolean) => {
    const headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    headerMock.has_consolidated_accounts = hasConsolidatedAccounts;
    const accountId = headerMock.defendant_account_party_id;

    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptDefendantDetails(accountId, OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK, '123');
    interceptAtAGlance(accountId, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '123');

    setupAccountEnquiryComponent({ ...componentProperties, accountId });
    cy.get(AccountNavDetailsLocators.root).should('exist');
  };

  it(
    "AC1a. should display 'Consolidated accounts' to the right of 'History and notes' when consolidated accounts exist",
    { tags: [...buildTags('@JIRA-STORY:PO-2389'), '@JIRA-EPIC:PO-976'] },
    () => {
      setupShell(true);

      cy.get(AccountNavDetailsLocators.subNav.historyAndNotesTab).should('exist');
      cy.get(AccountNavDetailsLocators.subNav.consolidatedAccountsTab).should('exist');

      cy.get(AccountNavDetailsLocators.subNav.allTabLinks).then(($tabs) => {
        const labels = [...$tabs].map((tab) => tab.textContent?.trim()).filter((label): label is string => !!label);

        expect(labels).to.include('History and notes');
        expect(labels).to.include('Consolidated accounts');
        expect(labels.indexOf('History and notes')).to.be.lessThan(labels.indexOf('Consolidated accounts'));
      });

      cy.injectAxe();
      cy.checkA11y(AccountNavDetailsLocators.subNav.root);
    },
  );

  it(
    "AC2a. should not display 'Consolidated accounts' when no consolidated accounts exist",
    { tags: [...buildTags('@JIRA-STORY:PO-2389'), '@JIRA-EPIC:PO-976'] },
    () => {
      setupShell(false);

      cy.get(AccountNavDetailsLocators.subNav.historyAndNotesTab).should('exist');
      cy.get(AccountNavDetailsLocators.subNav.consolidatedAccountsTab).should('not.exist');

      cy.injectAxe();
      cy.checkA11y(AccountNavDetailsLocators.subNav.root);
    },
  );
});
