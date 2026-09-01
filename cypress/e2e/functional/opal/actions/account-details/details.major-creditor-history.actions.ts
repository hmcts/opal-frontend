import { ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_ELEMENTS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.history-and-notes.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { AccountDetailsNavActions } from './details.nav.actions';

const log = createScopedLogger('MajorCreditorHistoryActions');

/** Actions for the Major Creditor History and notes tab. */
export class MajorCreditorHistoryActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;
  private readonly detailsNav = new AccountDetailsNavActions();

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
}
