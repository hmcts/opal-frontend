import {
  interceptAuthenticatedUser,
  interceptBusinessUnits,
  interceptUserState,
} from '../../CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import { setupFinesMacRouteComponent } from 'cypress/component/CommonSetup/FinesMac/FinesMacSetup';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Search Account Component', () => {
  it('Time between tab changes should be less than 250ms cy.wrap', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    setupFinesMacRouteComponent();

    const tabs = [
      { heading: 'Individuals', selector: '#tab-individuals', hash: '#individuals', time: 0 },
      { heading: 'Companies', selector: '#tab-companies', hash: '#companies', time: 0 },
      { heading: 'Minor creditors', selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { heading: 'Major creditors', selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
      { heading: 'Minor creditors', selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { heading: 'Major creditors', selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
      { heading: 'Minor creditors', selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { heading: 'Major creditors', selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
    ];

    cy.wrap(tabs).each((tab: { selector: string; hash: string; time: number }) => {
      let start = 0;

      cy.window().then((win) => {
        start = win.performance.now();
      });

      cy.get(tab.selector).should('exist').should('be.visible').click();

      cy.window().then((win) => {
        cy.get('opal-lib-govuk-tabs-panel > * > h1').should('have.text', tab.heading);
        const elapsed = win.performance.now() - start;

        tab.time = elapsed;

        expect(elapsed, ``).to.be.lessThan(250);
      });
    });

    cy.then(() => {
      cy.log(tabs.map((tab) => `${tab.hash}: ${tab.time.toFixed(2)}ms`).join('\n'));
    });
  });
  it('Time between tab changes should be less than 250ms', { tags: [] }, () => {
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
  });
});
