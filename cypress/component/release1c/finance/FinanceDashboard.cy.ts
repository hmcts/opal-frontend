import { Router } from '@angular/router';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { RELEASE_1C_SUSPENSE_FEATURE_FLAG } from 'src/app/flows/fines/constants/release-feature-flags.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { PrimaryNavigationLocators as PrimaryNav } from '../../../shared/selectors/primary-navigation.locators';
import { FinanceLocators } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const FINANCE_JIRA_LABEL = '@JIRA-LABEL:Auto-Payments Processing Filess';
const FINANCE_JIRA_EPIC = '@JIRA-EPIC:PO-2468';
const FINANCE_RELEASE_TAG = '@R1CFinancialMovements';
const INBOUND_FILES_TAGS = ['@JIRA-STORY:PO-8673', '@JIRA-EPIC:PO-3952', '@JIRA-LABEL:inbound-interface-files'];

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

  it(
    'shows the Inbound files link for a user with View Interface Files permission',
    { tags: INBOUND_FILES_TAGS },
    () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        permissionIds: [FINES_PERMISSIONS['view-interface-files']],
      });

      cy.get(FinanceLocators.inboundFilesLink)
        .should('be.visible')
        .and('contain.text', FinanceLocators.labels.inboundFiles)
        .and('have.attr', 'href', '/fines/finance/inbound-files/search');
    },
  );

  it(
    'hides the Inbound files link when the user lacks View Interface Files permission',
    { tags: INBOUND_FILES_TAGS },
    () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        permissionIds: [],
      });

      cy.get(FinanceLocators.inboundFilesLink).should('not.exist');
    },
  );

  it(
    'shows Upload variant banking files to a user with the upload permission',
    { tags: ['@JIRA-STORY:PO-8684', '@JIRA-EPIC:PO-3952', '@JIRA-LABEL:finance', '@R1CBankingInterfaces'] },
    () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        permissionIds: [FINES_PERMISSIONS['upload-variant-banking-files']],
      });

      cy.get(FinanceLocators.uploadVariantBankingFilesLink)
        .should('be.visible')
        .and('have.attr', 'href', '/fines/finance/variant-banking-files/upload');
    },
  );

  it(
    'hides Upload variant banking files when the user lacks the upload permission',
    { tags: ['@JIRA-STORY:PO-8684', '@JIRA-EPIC:PO-3952', '@JIRA-LABEL:finance', '@R1CBankingInterfaces'] },
    () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        permissionIds: [],
      });

      cy.get(FinanceLocators.uploadVariantBankingFilesLink).should('not.exist');
    },
  );
});

describe(
  'Finance dashboard - Manage Suspense Items',
  { tags: ['@JIRA-STORY:PO-9762', '@JIRA-LABEL:navigation', '@R1CSuspense'] },
  () => {
    const permissionScenarios = [
      { name: 'View only', permissionIds: [FINES_PERMISSIONS['view-suspense-items']] },
      { name: 'Manage only', permissionIds: [FINES_PERMISSIONS['manage-suspense-items']] },
      {
        name: 'both View and Manage',
        permissionIds: [FINES_PERMISSIONS['view-suspense-items'], FINES_PERMISSIONS['manage-suspense-items']],
      },
    ];

    permissionScenarios.forEach(({ name, permissionIds }) => {
      it(`(AC6b, AC6c) displays one Manage Suspense Items link with ${name} permission`, () => {
        setupFinancePageComponent({
          dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          permissionIds,
          paymentPermissionBusinessUnitIds: [],
        });

        cy.get(PrimaryNav.itemByText(PrimaryNav.labels.finance)).should('be.visible');
        cy.contains(FinanceLocators.suspenseHeading, FinanceLocators.labels.suspense).should('be.visible');
        cy.get(FinanceLocators.manageSuspenseItemsLink)
          .should('have.length', 1)
          .and('be.visible')
          .and('have.text', FinanceLocators.labels.manageSuspenseItems)
          .and('have.attr', 'href', '/fines/suspense-item/search');
      });

      it(`(AC6f) hides Manage Suspense Items when Suspense is disabled despite ${name} permission`, () => {
        setupFinancePageComponent({
          dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          permissionIds,
          featureFlags: { [RELEASE_1C_SUSPENSE_FEATURE_FLAG]: false },
        });

        cy.contains('h1', 'Finance').should('be.visible');
        cy.get(FinanceLocators.manageSuspenseItemsLink).should('not.exist');
        cy.contains(FinanceLocators.suspenseHeading, FinanceLocators.labels.suspense).should('not.exist');
        cy.get(FinanceLocators.manualCashInputLink).should('be.visible');
      });
    });

    it('(AC6d) hides Manage Suspense Items when the user has no suspense permission in any business unit', () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        permissionIds: [],
      });

      cy.contains('h1', 'Finance').should('be.visible');
      cy.get(FinanceLocators.manageSuspenseItemsLink).should('not.exist');
      cy.contains(FinanceLocators.suspenseHeading, FinanceLocators.labels.suspense).should('not.exist');
      cy.get(FinanceLocators.manualCashInputLink).should('be.visible');
    });

    permissionScenarios.slice(0, 2).forEach(({ name, permissionIds }) => {
      it(`(AC6e) navigates to Search for Suspense Item with ${name} permission`, () => {
        setupFinancePageComponent({
          dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          permissionIds,
          paymentPermissionBusinessUnitIds: [],
        });

        cy.get(FinanceLocators.manageSuspenseItemsLink).should('have.attr', 'target', '_self').click();

        cy.get<Router>('@financeRouter').its('url').should('eq', '/fines/suspense-item/search');
        cy.contains('h1', 'Search for suspense item').should('be.visible');
      });
    });
  },
);
