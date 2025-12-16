import { createScopedSyncLogger } from '../../../../support/utils/log.helper';

const log = createScopedSyncLogger('DraftAccountsInterceptActions');

type DraftAccountSummary = {
  account_status?: string;
};

/**
 * Network stubs for draft account API calls used in E2E specs.
 */
export class DraftAccountsInterceptActions {
  /**
   * Stubs draft account listings to return fixed penalty summaries filtered by status.
   */
  stubFixedPenaltyListings(): void {
    Cypress.env('hasFixedPenaltyListingsStub', true);
    cy.fixture('getDraftAccounts/fixedPenaltyAccounts.json').then((accounts) => {
      cy.intercept('GET', '/opal-fines-service/draft-accounts?*', (req) => {
        const url = new URL(req.url, 'http://localhost');
        const statuses = url.searchParams.getAll('status').map((s) => s.toLowerCase());

        const summaries = (accounts.summaries ?? []) as DraftAccountSummary[];
        const filteredSummaries = summaries.filter((summary) => {
          const status = String(summary.account_status ?? '').toLowerCase();
          if (!statuses.length) return true;
          return statuses.includes(status);
        });

        log('intercept', 'Serving filtered fixed penalty drafts', {
          requestedStatuses: statuses,
          returned: filteredSummaries.length,
        });

        req.reply({
          count: filteredSummaries.length,
          summaries: filteredSummaries,
        });
      }).as('getFixedPenaltyAccounts');
    });
  }

  /**
   * Stubs draft account listings for approved (Published) accounts using supplied summaries.
   * Falls through for other statuses so unrelated calls still hit the real backend.
   */
  stubApprovedDraftListings(summaries: DraftAccountSummary[]): void {
    log('intercept', 'Stubbing approved draft listings', { count: summaries.length });
    cy.intercept('GET', '/opal-fines-service/draft-accounts?*', (req) => {
      const url = new URL(req.url, 'http://localhost');
      const statuses = url.searchParams.getAll('status').map((s) => s.toLowerCase());
      const wantsApproved =
        statuses.length === 0 || statuses.some((status) => status === 'published' || status === 'approved');

      if (!wantsApproved) {
        req.continue();
        return;
      }

      log('intercept', 'Serving approved draft listings', {
        requestedStatuses: statuses,
        returned: summaries.length,
      });

      req.reply({
        count: summaries.length,
        summaries,
      });
    }).as('getApprovedDraftAccounts');
  }
}
