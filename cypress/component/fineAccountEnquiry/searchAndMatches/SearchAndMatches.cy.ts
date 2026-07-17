import {
  interceptAuthenticatedUser,
  interceptBusinessUnits,
  interceptUserState,
} from '../../CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import { setupFinesMacRouteComponent } from 'cypress/component/CommonSetup/FinesMac/FinesMacSetup';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

describe('Search Account Component', { tags: [ACCOUNT_ENQUIRY_JIRA_LABEL] }, () => {
  it(
    'Time between tab changes should be less than 250ms',
    { tags: ['@JIRA-EPIC:PO-2479', '@JIRA-NFR:PO-2547', '@JIRA-STORY:PO-2547', '@JIRA-TEST-KEY:PO-8738'] },
    () => {
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptBusinessUnits();

      setupFinesMacRouteComponent();

      const headingSelector = 'opal-lib-govuk-tabs-panel > * > h1';
      const tabs = [
        { selector: '#tab-companies', hash: '#companies', heading: 'Companies' },
        { selector: '#tab-minor-creditors', hash: '#minor-creditor', heading: 'Minor creditors' },
        { selector: '#tab-major-creditors', hash: '#major-creditor', heading: 'Major creditors' },
        { selector: '#tab-minor-creditors', hash: '#minor-creditor', heading: 'Minor creditors' },
        { selector: '#tab-major-creditors', hash: '#major-creditor', heading: 'Major creditors' },
        { selector: '#tab-minor-creditors', hash: '#minor-creditor', heading: 'Minor creditors' },
        { selector: '#tab-individuals', hash: '#individuals', heading: 'Individuals' },
      ];

      cy.get(headingSelector).should('have.text', 'Individuals');

      cy.wrap(tabs).each((tab: { selector: string; hash: string; heading: string }) => {
        cy.get(tab.selector).should('exist');

        cy.window().then((win) => {
          const element = win.document.querySelector(tab.selector) as HTMLElement;

          expect(element, `${tab.selector} should exist`).to.not.be.null;

          const start = win.performance.now();

          element.click();

          cy.get(headingSelector)
            .should('have.text', tab.heading)
            .then(() => {
              const elapsed = win.performance.now() - start;

              expect(elapsed, `${tab.selector} should complete within 250ms`).to.be.lessThan(250);
            });
        });
      });
    },
  );
});
