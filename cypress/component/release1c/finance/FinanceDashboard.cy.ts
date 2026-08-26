import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { PrimaryNavigationLocators as PrimaryNav } from '../../shared/selectors/primary-navigation.locators';
import { FinanceLocators } from '../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const FINANCE_JIRA_LABEL = '@JIRA-LABEL:Auto-Payments Processing Filess';
const FINANCE_JIRA_EPIC = '@JIRA-EPIC:PO-2468';
const FINANCE_RELEASE_TAG = '@R1CFinancialMovements';

const buildTags = (...tags: string[]): string[] => [
  ...tags,
  FINANCE_JIRA_EPIC,
  FINANCE_JIRA_LABEL,
  FINANCE_RELEASE_TAG,
];

const buildManualCashInputTags = (...tags: string[]): string[] => [
  ...tags,
  '@JIRA-LABEL:navigation',
  '@JIRA-EPIC:PO-2439',
  FINANCE_RELEASE_TAG,
];

describe('Finance dashboard', () => {
  it(
    'AC1 navigates to Finance when the Finance primary-navigation item is selected',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2582')],
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
      tags: [...buildTags('@JIRA-STORY:PO-2582')],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.contains('h1', 'Finance').should('be.visible');
    },
  );

  it(
    '(AC1b, AC1bi) should display Cash and Automatic Cash Input when the user has the payment permission in one business unit',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2582')],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.contains(FinanceLocators.cashHeading, FinanceLocators.labels.cash).should('be.visible');
      cy.get(FinanceLocators.automaticCashInputLink)
        .should('be.visible')
        .and('contain.text', FinanceLocators.labels.automaticCashInput);
    },
  );

  it(
    '(AC1bii) should not display Automatic Cash Input when the user has no payment permission',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2582')],
    },
    () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        paymentPermissionBusinessUnitIds: [],
      });

      cy.get(FinanceLocators.automaticCashInputLink).should('not.exist');
    },
  );

  it(
    '(AC1, AC1a, AC1b) displays Manual cash input under Cash when the user has the payment permission in any business unit',
    {
      tags: [...buildManualCashInputTags('@JIRA-STORY:PO-3480')],
    },
    () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        paymentPermissionBusinessUnitIds: [16],
      });

      cy.contains(FinanceLocators.cashHeading, FinanceLocators.labels.cash)
        .should('be.visible')
        .next('ul')
        .find(FinanceLocators.manualCashInputLink)
        .should('be.visible')
        .and('contain.text', FinanceLocators.labels.manualCashInput);
    },
  );

  it(
    '(AC1ai) does not display Manual cash input when the user has no payment permission in any business unit',
    {
      tags: [...buildManualCashInputTags('@JIRA-STORY:PO-3480')],
    },
    () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        paymentPermissionBusinessUnitIds: [],
      });

      cy.get(FinanceLocators.manualCashInputLink).should('not.exist');
    },
  );
});
