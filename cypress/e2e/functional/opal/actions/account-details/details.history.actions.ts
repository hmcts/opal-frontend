import { ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_ELEMENTS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.history-and-notes.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsHistoryActions');

type HistoryAndNotesResponse = {
  version: string;
  history_items: Array<Record<string, unknown>>;
};

/**
 * Actions for the History and notes tab on Account Details.
 */
export class AccountDetailsHistoryActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;

  /**
   * Builds the deterministic History and notes API payload used by E2E tests.
   *
   * @param accountId - Defendant account id to emit in linked history items.
   * @param accountNumber - Defendant account number to render in linked details fragments.
   * @returns Synthetic History and notes API response.
   */
  private buildDefendantHistoryAndNotesResponse(accountId: number, accountNumber: string): HistoryAndNotesResponse {
    return {
      version: 'e2e-history-and-notes',
      history_items: [
        {
          type: 'Financial',
          amount: '50',
          postedDetails: {
            posted_by_name: 'Finance officer',
            posted_date: '2025-03-12T08:30:00.124Z',
          },
          details: {
            transactionType: {
              transactionType: 'CONSOL',
            },
            accountNumber,
            associatedRecordId: String(accountId),
          },
        },
        {
          type: 'Note',
          postedDetails: {
            posted_by_name: 'History note user',
            posted_date: '2025-03-11T09:15:00.000Z',
          },
          details: {
            noteText: 'History note for E2E filter coverage.',
          },
        },
      ],
    };
  }

  /**
   * Builds the deterministic Minor creditor History and notes API payload used by E2E tests.
   *
   * @param accountId - Associated defendant account id emitted by the synthetic transaction.
   * @param accountNumber - Associated defendant account number displayed in transaction details.
   * @returns Synthetic Minor creditor History and notes API response.
   */
  private buildMinorCreditorHistoryAndNotesResponse(accountId: number, accountNumber: string): HistoryAndNotesResponse {
    return {
      version: 'e2e-minor-creditor-history-and-notes',
      history_items: [
        {
          type: 'Financial',
          amount: '50',
          postedDetails: {
            posted_by_name: 'Finance officer',
            posted_date: '2025-03-12T08:30:00.124Z',
          },
          details: {
            transaction_type: 'PAYMNT',
            defendant_account_number: accountNumber,
            defendant_account_id: String(accountId),
          },
        },
        {
          type: 'Notes',
          postedDetails: {
            posted_by_name: 'History note user',
            posted_date: '2025-03-11T09:15:00.000Z',
          },
          details: {
            note_text: 'History note for E2E filter coverage.',
          },
        },
      ],
    };
  }

  /**
   * Stubs the History and notes endpoint for the current account, returning either
   * the full dataset or the note-only filtered dataset based on the request query.
   *
   * @param accountId - Defendant account id to emit in linked history items.
   * @param accountNumber - Defendant account number to render in linked details fragments.
   */
  public stubHistoryAndNotesForCurrentAccount(accountId: number, accountNumber: string): void {
    const defendantResponse = this.buildDefendantHistoryAndNotesResponse(accountId, accountNumber);
    const minorCreditorResponse = this.buildMinorCreditorHistoryAndNotesResponse(accountId, accountNumber);
    const buildFilteredResponse = (response: HistoryAndNotesResponse): HistoryAndNotesResponse => ({
      ...response,
      history_items: response.history_items.filter((item) => String(item.type).toLowerCase().startsWith('note')),
    });

    log('intercept', 'Stubbing History and notes API response', { accountId, accountNumber });

    cy.intercept(
      'GET',
      /\/opal-fines-service\/(?:defendant-accounts|minor-creditor-accounts)\/[^/]+\/history(?:\?.*)?$/,
      (req) => {
        const fullResponse = req.url.includes('/minor-creditor-accounts/') ? minorCreditorResponse : defendantResponse;
        const noteOnlyResponse = buildFilteredResponse(fullResponse);

        const itemTypes = String(req.query['itemTypes'] ?? '').toLowerCase();
        req.reply({
          statusCode: 200,
          body: itemTypes === 'note' ? noteOnlyResponse : fullResponse,
        });
      },
    ).as('historyAndNotes');
  }

  /**
   * Asserts the shared History and notes table columns are visible.
   */
  private assertHistoryAndNotesColumnsVisible(): void {
    cy.get(L.tableHeadings, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT })
      .find('th')
      .then(($headers) => {
        const headers = [...$headers].map((header) => header.textContent?.replace(/\s+/g, ' ').trim() ?? '');
        expect(headers).to.deep.equal(['Date', 'User', 'Type', 'Details', 'Amount']);
      });
  }

  /**
   * Waits for the History and notes endpoint and asserts the tab shell is rendered.
   */
  public assertHistoryAndNotesTabLoaded(): void {
    log('assert', 'Asserting History and notes tab is loaded');

    cy.wait('@historyAndNotes', { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT })
      .its('response.statusCode')
      .should('eq', 200);
    cy.get(L.tabRoot, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).should('be.visible');
    cy.get(L.table, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).should('be.visible');
  }

  /**
   * Asserts the rendered History and notes table row count.
   *
   * @param expectedRows - Expected number of rendered rows.
   */
  public assertHistoryAndNotesRowsLoaded(expectedRows: number): void {
    log('assert', 'Asserting History and notes rows loaded', { expectedRows });

    this.assertHistoryAndNotesColumnsVisible();
    cy.get(L.tableRows, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).should('have.length', expectedRows);
  }

  /**
   * Expands the filter section, selects Notes, submits the filter, and asserts
   * the request was sent with `itemTypes=note`.
   */
  public applyNotesFilter(): void {
    log('action', 'Filtering History and notes to Note items');

    cy.get(L.filterSummaryText, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).should('be.visible').click();
    cy.get(L.notesCheckbox, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).check({ force: true });
    cy.get(L.filterButton, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).click();

    cy.wait('@historyAndNotes', { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).then(
      ({ request, response }) => {
        expect(request.query['itemTypes']).to.equal('note');
        expect(response?.statusCode).to.equal(200);
      },
    );
  }

  /**
   * Asserts the filtered History and notes table only contains Note rows.
   */
  public assertHistoryAndNotesFilteredToNotes(): void {
    log('assert', 'Asserting History and notes table only shows Note rows');

    cy.get(L.tableRows, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).should('have.length', 1);
    cy.get(L.firstTypeCell, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).should('contain.text', 'Note');
    cy.get(L.firstDetailsCell).should('contain.text', 'History note for E2E filter coverage.');
  }

  /**
   * Opens the first linked History and notes detail item and asserts the new-tab target path.
   *
   * @param accountId - Defendant account id expected in the opened route.
   */
  public openFirstAccountLinkInNewTabAndAssert(accountId: number): void {
    const expectedPath = `/fines/account/defendant/${accountId}/details`;

    log('open', 'Opening History and notes account link in a new tab', { accountId, expectedPath });

    cy.window().then((win) => {
      cy.stub(win, 'open').as('historyAndNotesWindowOpen');
    });

    cy.get(L.detailsLinks, { timeout: AccountDetailsHistoryActions.DEFAULT_TIMEOUT }).should('be.visible').click();
    cy.get('@historyAndNotesWindowOpen').should('have.been.calledOnceWith', expectedPath, '_blank');
  }
}
