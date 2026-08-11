import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { PrimaryNavigationLocators as PrimaryNav } from '../../shared/selectors/primary-navigation.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const FINANCE_JIRA_LABEL = '@JIRA-LABEL:Auto-Payments Processing Filess';
const FINANCE_JIRA_EPIC = '@JIRA-EPIC:PO-2468';

const buildTags = (...tags: string[]): string[] => [...tags, FINANCE_JIRA_EPIC, FINANCE_JIRA_LABEL];

describe('Finance dashboard', () => {
  it(
    'AC1 navigates to Finance when the Finance primary-navigation item is selected',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2582', '@JIRA-EPIC:PO-2468')],
    },
    () => {
      setupFinancePageComponent();

      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.finance)).should('be.visible').click();
      cy.contains('h1', 'Finance').should('be.visible');
    },
  );

  it(
    '(AC1a) should display the Finance landing page',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2582', '@JIRA-EPIC:PO-2468')],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.contains('h1', 'Finance').should('be.visible');
    },
  );

  it(
    '(AC1b, AC1bi) should display Cash and Automatic Cash Input when the user has the payment permission in one business unit',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2582', '@JIRA-EPIC:PO-2468')],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.contains('h2', 'Cash').should('be.visible');
      cy.get('#automaticCashInputLink').should('be.visible').and('contain.text', 'Automatic Cash Input');
    },
  );

  it(
    '(AC1bii) should not display Automatic Cash Input when the user has no payment permission',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2582', '@JIRA-EPIC:PO-2468')],
    },
    () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        paymentPermissionBusinessUnitIds: [],
      });

      cy.get('#automaticCashInputLink').should('not.exist');
    },
  );
});
