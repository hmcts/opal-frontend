import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesApiStore } from 'src/app/flows/fines/fines-api/stores/fines-api.store';
import { FinanceLocators } from '../../../shared/selectors/finance.locators';
import { AutomaticCashInputLocators } from '../../../shared/selectors/automatic-cash-input.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const AUTOMATIC_CASH_INPUT_JIRA_LABEL = '@JIRA-LABEL:Auto-Payments Processing Filess';
const AUTOMATIC_CASH_INPUT_JIRA_EPIC = '@JIRA-EPIC:PO-2468';
const AUTOMATIC_CASH_INPUT_RELEASE_TAG = '@R1CFinancialMovements';
const CURRENT_UNSAVED_CHANGES_MESSAGE =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';

describe('Automatic Cash Input - Select Business Units', () => {
  it(
    '(AC1) navigates from Finance to Select Business Units when Automatic Cash Input is selected',
    {
      tags: [
        '@JIRA-STORY:PO-2584',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();

      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.selectBusinessUnits,
          ].join('/'),
        );
      cy.get(AutomaticCashInputLocators.heading).should('contain.text', 'Automatic Cash Input');
      cy.get(AutomaticCashInputLocators.selectBusinessUnitsLegend).should('contain.text', 'Select business units');
    },
  );

  it(
    '(AC2) displays the Automatic Cash Input - Select Business Units screen',
    {
      tags: [
        '@JIRA-STORY:PO-2584',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();

      cy.get(AutomaticCashInputLocators.heading).should('contain.text', 'Automatic Cash Input');
      cy.get(AutomaticCashInputLocators.selectBusinessUnitsLegend).should('contain.text', 'Select business units');
      cy.get(AutomaticCashInputLocators.table).should('be.visible');
      cy.contains(AutomaticCashInputLocators.tableHeadings, 'Business unit').should('be.visible');
      cy.contains(AutomaticCashInputLocators.tableHeadings, 'Files to process').should('be.visible');
      cy.contains(AutomaticCashInputLocators.tableHeadings, 'Tills to allocate').should('be.visible');
      cy.get(AutomaticCashInputLocators.selectAllCheckbox).should('exist');
      cy.get(AutomaticCashInputLocators.continueButton).should('be.visible').and('contain.text', 'Continue');
      cy.get(AutomaticCashInputLocators.cancelLink).should('be.visible').and('contain.text', 'Cancel');
    },
  );

  it(
    '(AC3b) displays a business unit with zero files to process and zero tills to allocate',
    {
      tags: [
        '@JIRA-STORY:PO-2584',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();

      cy.get(AutomaticCashInputLocators.businessUnitNameCell(65)).should('contain.text', 'Camden and Islington');
      cy.get(AutomaticCashInputLocators.businessUnitFileCountCell(65))
        .invoke('text')
        .then((text) => expect(text.trim()).to.equal('0'));
      cy.get(AutomaticCashInputLocators.businessUnitTillCountCell(65))
        .invoke('text')
        .then((text) => expect(text.trim()).to.equal('0'));
    },
  );

  it(
    '(AC4, AC4a) requires a business unit selection before continuing to Process files and allocate tills',
    {
      tags: [
        '@JIRA-STORY:PO-2584',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.continueButton).click();

      cy.get(AutomaticCashInputLocators.businessUnitSelectionError).should(
        'contain.text',
        'Select at least 1 business unit',
      );
      cy.get(AutomaticCashInputLocators.errorSummary)
        .should('be.visible')
        .and('contain.text', 'Select at least 1 business unit');
      cy.get(AutomaticCashInputLocators.errorSummaryTitle).should('have.text', 'There is a problem');
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.selectBusinessUnits,
          ].join('/'),
        );

      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();

      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.processAllocate,
          ].join('/'),
        );
      cy.get(AutomaticCashInputLocators.businessUnitSelectionError).should('not.exist');
      cy.contains('p', 'Placeholder for Automatic Cash Input - Process files and allocate tills').should('be.visible');
      // TODO(PO-2585): Replace the placeholder assertion when the Process files and allocate tills page is implemented.
      // cy.get('h1').should('contain.text', 'Automatic Cash Input - Process files and allocate tills');
    },
  );

  it(
    '(AC5) returns to Finance when Cancel is selected without business unit selections',
    {
      tags: [
        '@JIRA-STORY:PO-2584',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.cancelLink).click();

      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ].join('/'),
        );
      cy.contains('h1', 'Finance').should('be.visible');
    },
  );

  it(
    '(AC5a, AC5ai, AC5aii) confirms data loss before cancelling selected business units',
    {
      tags: [
        '@JIRA-STORY:PO-2584',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm');

        leavePageConfirm.onFirstCall().returns(false);
        leavePageConfirm.onSecondCall().returns(true);
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });

      cy.get(AutomaticCashInputLocators.cancelLink).click();

      cy.get('@leavePageConfirm').should('have.been.calledOnce');
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.selectBusinessUnits,
          ].join('/'),
        );
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).should('be.checked');

      cy.get(AutomaticCashInputLocators.cancelLink).click();

      cy.get('@leavePageConfirm').should('have.been.calledTwice');
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ].join('/'),
        );
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).selectedBusinessUnitIds()).to.deep.equal([]);
      });
    },
  );

  it(
    '(AC6 RGAC1) keeps selections when another application route change is cancelled, then clears them when confirmed',
    {
      tags: [
        '@JIRA-STORY:PO-2584',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm');

        leavePageConfirm.onFirstCall().returns(false);
        leavePageConfirm.onSecondCall().returns(true);
        cy.wrap(leavePageConfirm).as('applicationRouteConfirm');
      });

      cy.get('@financeRouter')
        .then((router) =>
          (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate([
            '/',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ]),
        )
        .should('be.false');

      cy.get('@applicationRouteConfirm').should('have.been.calledWithExactly', CURRENT_UNSAVED_CHANGES_MESSAGE);
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).should('be.checked');

      cy.get('@financeRouter')
        .then((router) =>
          (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate([
            '/',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ]),
        )
        .should('be.true');

      cy.contains('h1', 'Finance').should('be.visible');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).selectedBusinessUnitIds()).to.deep.equal([]);
      });
    },
  );

  it(
    '(AC6 RGAC2, RGAC3) prevents browser unload while business unit selections are unsaved',
    {
      tags: [
        '@JIRA-STORY:PO-2584',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });

      cy.window().then((window) => {
        const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

        window.dispatchEvent(beforeUnloadEvent);

        expect(beforeUnloadEvent.defaultPrevented).to.be.true;
      });
    },
  );
});
