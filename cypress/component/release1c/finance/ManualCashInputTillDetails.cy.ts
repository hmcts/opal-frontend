import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinanceLocators, ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3485', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const TILLS_ENDPOINT = '/opal-fines-service/tills';
const UNSAVED_CHANGES_MESSAGE =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';

const assertTrimmedText = (selector: string, expectedText: string): void => {
  cy.get(selector)
    .invoke('text')
    .then((text) => expect(text.trim()).to.equal(expectedText));
};

const assertTillRoute = (destination: string): void => {
  cy.get('@financeRouter')
    .its('url')
    .should(
      'eq',
      [
        '',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        destination,
      ].join('/'),
    );
};

const openTillDetails = (): void => {
  cy.intercept({ method: 'GET', pathname: TILLS_ENDPOINT }, { tills: [] }).as('getManualCashInputTills');
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  cy.get(FinanceLocators.manualCashInputLink).click();
  cy.wait('@getManualCashInputTills');
  cy.get(Mci.createTillButton).click();
  cy.get(Mci.continueButton).click();
  assertTillRoute(FINES_MCI_ROUTING_PATHS.children.details);
};

describe('Manual Cash Input - Till Details', () => {
  it('(AC1, AC2a, AC2b, AC2c) displays the selected business unit and empty-till guidance', { tags: TAGS }, () => {
    openTillDetails();

    cy.get(Mci.tillDetails)
      .find('h1')
      .invoke('text')
      .then((text) => expect(text.trim()).to.equal('Till details'));
    assertTrimmedText(Mci.tillDetailsBusinessUnitKey, 'Business unit');
    assertTrimmedText(Mci.tillDetailsBusinessUnitValue, 'Camden and Islington');
    cy.get(Mci.tillDetails)
      .contains('h2', 'Payments')
      .should('have.text', 'Payments')
      .next('p')
      .invoke('text')
      .then((text) => expect(text.trim()).to.equal('There are no payments'));
    cy.get(Mci.tillDetails)
      .contains('h2', 'Create till')
      .should('have.text', 'Create till')
      .next('p')
      .invoke('text')
      .then((text) => expect(text.trim()).to.equal('You must add at least 1 payment to the till.'));
  });

  it('(AC2d, partial) starts the Payment Category journey when Add payment is selected', { tags: TAGS }, () => {
    openTillDetails();

    cy.get(Mci.addPaymentButton).should('contain.text', 'Add payment').click();
    assertTillRoute(FINES_MCI_ROUTING_PATHS.children.paymentCategory);
    // PO-3486 must replace the current Payment category placeholder with the Payment Category screen.
    // Add the destination-screen assertions here when that UI is available.
  });

  it('(AC2e, partial) starts the Delete Till journey when Delete till is selected', { tags: TAGS }, () => {
    openTillDetails();

    cy.get(Mci.deleteTillLink).should('contain.text', 'Delete till').click();
    assertTillRoute(FINES_MCI_ROUTING_PATHS.children.cancel);
    // PO-3487 must replace the current Cancel till creation placeholder with the Delete Till screen.
    // Add the destination-screen assertions here when that UI is available.
  });

  it('(AC3: RGAC1, RGAC2, RGAC3) warns before unintended navigation, browser exit, or refresh', { tags: TAGS }, () => {
    openTillDetails();
    cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leavePageConfirm'));

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
    cy.get('@leavePageConfirm')
      .should('have.been.calledOnce')
      .and('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
    cy.get(Mci.tillDetails).should('be.visible');

    cy.window().then((window) => {
      const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

      expect(window.dispatchEvent(beforeUnloadEvent), 'beforeunload event dispatch').to.be.false;
      expect(beforeUnloadEvent.defaultPrevented, 'beforeunload warning').to.be.true;
    });
  });
});
