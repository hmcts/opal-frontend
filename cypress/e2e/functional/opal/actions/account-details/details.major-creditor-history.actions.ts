import { ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_ELEMENTS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.history-and-notes.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { AccountDetailsNavActions } from './details.nav.actions';

const log = createScopedLogger('MajorCreditorHistoryActions');

type MajorCreditorHistoryAndNotesResponse = {
  version: string;
  history_items: Array<Record<string, unknown>>;
};

/** Actions for the Major Creditor History and notes tab. */
export class MajorCreditorHistoryActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;
  private static readonly LINKED_DEFENDANT_ACCOUNT_ID = 123123;
  private readonly detailsNav = new AccountDetailsNavActions();

  /**
   * Builds the major creditor history and notes response.
   *
   * @returns The major creditor history and notes response.
   */
  private buildHistoryAndNotesResponse(): MajorCreditorHistoryAndNotesResponse {
    return {
      version: 'e2e-major-creditor-history-and-notes',
      history_items: [
        {
          type: 'Financial',
          amount: '50',
          postedDetails: {
            posted_by_name: 'Finance officer',
            posted_date: '2025-03-12T08:30:00.900Z',
          },
          details: {
            transactionType: {
              transactionType: 'PAYMNT',
            },
            defendantAccountNumber: '2500000BV',
            defendantAccountId: String(MajorCreditorHistoryActions.LINKED_DEFENDANT_ACCOUNT_ID),
          },
        },
        {
          type: 'Financial',
          amount: '-25',
          postedDetails: {
            posted_by_name: 'Older finance officer',
            posted_date: '2025-03-11T09:15:00.000Z',
          },
          details: {
            transactionType: {
              transactionType: 'BACS',
            },
            paymentReference: 'MJH0000004',
          },
        },
      ],
    };
  }

  /** Stubs deterministic Major Creditor History and notes data for table, filter, and link assertions. */
  public stubHistoryAndNotesTabData(): void {
    const fullResponse = this.buildHistoryAndNotesResponse();
    const filteredResponse: MajorCreditorHistoryAndNotesResponse = {
      ...fullResponse,
      history_items: fullResponse.history_items.slice(1),
    };

    log('intercept', 'Stubbing Major Creditor History and notes API response');

    cy.intercept('GET', '**/major-creditor-accounts/*/history*', (req) => {
      req.reply({
        statusCode: 200,
        body: req.query['dateFrom'] || req.query['dateTo'] ? filteredResponse : fullResponse,
      });
    }).as('getMajorCreditorHistory');
  }

  /** Opens the tab and verifies that its history endpoint returns a valid response. */
  public openHistoryAndNotesTab(): void {
    log('navigate', 'Opening Major Creditor History and notes tab');

    cy.intercept('GET', '**/major-creditor-accounts/*/history*').as('getMajorCreditorHistory');
    this.detailsNav.goToHistoryAndNotesTab();
    this.detailsNav.assertHistoryAndNotesTabIsActive();

    cy.wait('@getMajorCreditorHistory', { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).then(
      ({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(response?.statusCode).to.equal(200);
        expect(response?.body).to.satisfy(
          (body: unknown) =>
            typeof body === 'object' && body !== null && ('historyItems' in body || 'history_items' in body),
        );
      },
    );
  }

  /** Verifies that the Major Creditor History and notes shell is displayed. */
  public assertHistoryAndNotesShellVisible(): void {
    log('assert', 'Asserting Major Creditor History and notes shell is visible');

    cy.get(L.tabRoot, { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).should('be.visible');
    cy.get(L.tabHeading).should('contain.text', 'History and notes');
    cy.get(L.filterSummaryText).should('be.visible').and('contain.text', 'Show filter');
  }

  /** Asserts the deterministic Major Creditor History and notes rows are visible. */
  public assertHistoryAndNotesItemsLoaded(): void {
    log('assert', 'Asserting Major Creditor History and notes table rows');

    cy.get(L.tableRows, { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).should('have.length', 2);
    cy.get(L.firstDateCell).should('contain.text', '12 Mar 2025');
    cy.get(L.firstUserCell).should('contain.text', 'Finance officer');
    cy.get(L.firstTypeCell).should('contain.text', 'Financial');
    cy.get(L.firstDetailsCell).should('contain.text', 'Payment received');
    cy.get(L.firstDetailsCell).find('a').should('contain.text', '2500000BV');
    cy.get(L.firstAmountCell).should('contain.text', '£50.00').and('contain.text', 'CR');
  }

  /** Applies a date filter and verifies the query sent to the Major Creditor History endpoint. */
  public applyDateFilter(): void {
    log('action', 'Filtering Major Creditor History and notes by date');

    cy.get(L.filterSummaryText, { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).should('be.visible').click();
    cy.get(L.dateFromInput, { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).type('11/03/2025');
    cy.get(L.dateToInput, { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).type('11/03/2025');
    cy.get(L.filterButton, { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).click();

    cy.wait('@getMajorCreditorHistory', { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).then(
      ({ request, response }) => {
        expect(request.query['dateFrom']).to.equal('2025-03-11');
        expect(request.query['dateTo']).to.equal('2025-03-11');
        expect(response?.statusCode).to.equal(200);
      },
    );
  }

  /** Asserts the table reflects the filtered Major Creditor History and notes response. */
  public assertHistoryAndNotesFilteredByDate(): void {
    log('assert', 'Asserting filtered Major Creditor History and notes table');

    cy.get(L.tableRows, { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).should('have.length', 1);
    cy.get(L.firstUserCell).should('contain.text', 'Older finance officer');
    cy.get(L.firstDetailsCell).should('contain.text', 'BACS payment');
    cy.get(L.firstDetailsCell)
      .invoke('text')
      .then((text) => text.replace(/\s+/g, ' ').trim())
      .should('contain', 'Payment reference: MJH0000004');
  }

  /** Opens the first account-linked detail and asserts the new-tab defendant account target. */
  public openFirstAccountLinkInNewTabAndAssert(): void {
    const expectedPath = `/fines/account/defendant/${MajorCreditorHistoryActions.LINKED_DEFENDANT_ACCOUNT_ID}/details`;

    log('open', 'Opening Major Creditor History and notes account link in a new tab', { expectedPath });

    cy.window().then((win) => {
      cy.stub(win, 'open').as('majorCreditorHistoryWindowOpen');
    });

    cy.get(L.detailsLinks, { timeout: MajorCreditorHistoryActions.DEFAULT_TIMEOUT }).should('be.visible').click();
    cy.get('@majorCreditorHistoryWindowOpen').should('have.been.calledOnceWith', expectedPath, '_blank');
  }
}
