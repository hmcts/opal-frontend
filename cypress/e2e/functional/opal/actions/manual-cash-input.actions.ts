import { FinanceLocators, ManualCashInputLocators } from '../../../../shared/selectors/finance.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';

const log = createScopedLogger('ManualCashInputActions');
const TILLS_ENDPOINT = '/opal-fines-service/tills';
const UNSAVED_CHANGES_WARNING =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
const MANUAL_CASH_INPUT_TILLS_RESPONSE = {
  tills: [
    {
      till_id: 1001,
      till_number: 9002,
      payments_count: 3,
      amount: 125.5,
      business_unit_name: 'Camden and Islington',
      processed_by: 'Alex Smith',
      date_processed: '2026-01-10T13:30:00.000Z',
    },
    {
      till_id: 1002,
      till_number: 9001,
      payments_count: 1,
      amount: 10,
      business_unit_name: 'Westminster - North',
      processed_by: 'Sam Jones',
      date_processed: '2026-01-09T09:05:00.000Z',
    },
  ],
};

/** Cypress actions for the Manual Cash Input create-till journey. */
export class ManualCashInputActions {
  /** Opens Manual Cash Input with a deterministic empty till list. */
  public openCreateAndAllocate(): void {
    log('action', 'Opening Manual Cash Input create and allocate');
    cy.intercept({ method: 'GET', pathname: TILLS_ENDPOINT }, { tills: [] }).as('manualCashInputTills');
    cy.get(FinanceLocators.manualCashInputLink).should('be.visible').click();
    cy.wait('@manualCashInputTills').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Manual cash input').should('be.visible');
  }

  /** Opens Manual Cash Input with deterministic outstanding tills for table and route-guard coverage. */
  public openCreateAndAllocateWithOutstandingTills(): void {
    log('action', 'Opening Manual Cash Input with outstanding tills');
    cy.intercept({ method: 'GET', pathname: TILLS_ENDPOINT }, MANUAL_CASH_INPUT_TILLS_RESPONSE).as(
      'manualCashInputTills',
    );
    cy.get(FinanceLocators.manualCashInputLink).should('be.visible').click();
    cy.wait('@manualCashInputTills').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Manual cash input').should('be.visible');
  }

  /** Selects a till and declines the native unsaved-changes warning raised by Back. */
  public selectTillAndDeclineBackNavigation(): void {
    this.respondToBackNavigation(false);
  }

  /** Selects a till and accepts the native unsaved-changes warning raised by Back. */
  public selectTillAndAcceptBackNavigation(): void {
    this.respondToBackNavigation(true);
  }

  /** Confirms that declining the warning preserves the till selection. */
  public assertSelectionIsRetained(): void {
    cy.contains('h1', 'Manual cash input').should('be.visible');
    cy.get(ManualCashInputLocators.tillCheckbox(1001)).should('be.checked');
    cy.get(ManualCashInputLocators.selectedCount)
      .invoke('text')
      .then((text) => expect(text.replace(/\s+/g, ' ').trim()).to.equal('1 of 2 selected'));
  }

  /** Confirms that accepting the warning returns the user to the Finance landing page. */
  public assertFinanceLandingPageIsDisplayed(): void {
    cy.contains('h1', 'Finance').should('be.visible');
  }

  /** Sorts the table and reloads the browser page. */
  public sortTillsAndRefresh(): void {
    log('action', 'Sorting Manual Cash Input tills then refreshing the page');

    // Default date ordering is 9002 then 9001; sorting Till number must reverse the rendered row order.
    cy.get(ManualCashInputLocators.tillNumberCells).then(($cells) =>
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal(['9002', '9001']),
    );
    cy.contains(ManualCashInputLocators.tableHeadings, 'Till number').find('button').click();
    cy.contains(ManualCashInputLocators.tableHeadings, 'Till number').should('have.attr', 'aria-sort', 'ascending');
    cy.get(ManualCashInputLocators.tillNumberCells).then(($cells) =>
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal(['9001', '9002']),
    );

    cy.reload();
    cy.wait('@manualCashInputTills').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Manual cash input').should('be.visible');
  }

  /** Confirms that no table column remains sorted after a browser refresh. */
  public assertTillSortingIsReset(): void {
    cy.contains(ManualCashInputLocators.tableHeadings, 'Till number').should('have.attr', 'aria-sort', 'none');
  }

  /** Starts the Create Till journey from the create-and-allocate screen. */
  public startCreateTill(): void {
    log('action', 'Starting Manual Cash Input Create Till');
    cy.get(ManualCashInputLocators.createTillButton).should('be.visible').click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/select-bu');
    cy.contains('h1', 'Create till').should('be.visible');
  }

  /**
   * Drives the Back link through the browser-native confirmation dialog.
   * @param acceptLeave Whether to accept the warning and leave the screen.
   */
  private respondToBackNavigation(acceptLeave: boolean): void {
    let confirmationWasRaised = false;

    log('action', 'Responding to Manual Cash Input unsaved-changes warning', { acceptLeave });
    cy.once('window:confirm', (message) => {
      confirmationWasRaised = true;
      expect(String(message).replace(/\s+/g, ' ').trim()).to.equal(UNSAVED_CHANGES_WARNING);
      return acceptLeave;
    });

    cy.get(ManualCashInputLocators.tillCheckbox(1001)).check({ force: true });
    cy.get(ManualCashInputLocators.backLink).should('be.visible').click();
    cy.then(() => expect(confirmationWasRaised, 'native unsaved-changes warning').to.be.true);
  }
}
