import merge from 'lodash/merge';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { convertDataTableToNestedObject } from '../../../../../support/utils/table';
import { getDaysAgo } from '../../../../../support/utils/dateUtils';
import { createScopedSyncLogger } from '../../../../../support/utils/log.helper';
import { DraftPayloadType } from '../../../../../support/utils/payloads';

const log = createScopedSyncLogger('DraftAccountsInterceptActions');

type DraftAccountSummary = {
  account_status?: string;
  draft_account_id?: number;
  [key: string]: any;
};

const approvedDraftListings: DraftAccountSummary[] = [];

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
      cy.intercept(
        {
          method: 'GET',
          url: '/opal-fines-service/draft-accounts?*',
        },
        (req) => {
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
   * Stubs the **Approved** tab on Create & Manage Draft Accounts using supplied summaries.
   * Falls through for other statuses so unrelated calls still hit the real backend.
   */
  stubApprovedDraftListings(summaries: DraftAccountSummary[]): void {
    log('intercept', 'Stubbing approved draft listings', { count: summaries.length });
    cy.intercept(
      {
        method: 'GET',
        url: /\/opal-fines-service\/draft-accounts\?.*status=(?:Published|Approved)/i,
      },
      (_req) => {
        log('intercept', 'Serving approved draft listings', { returned: summaries.length });
        _req.reply({
          count: summaries.length,
          summaries,
        });
      },
    );
  }

  /**
   * Adds an approved (Published) account summary for listings using fixture + overrides.
   * @description Populates the Approved tab of **Create and Manage Draft Accounts** via stubbed listings.
   * @param accountType - Account type to load the correct approved fixture for.
   * @param table - DataTable of overrides (dot-path keys).
   */
  createApprovedAccount(accountType: DraftPayloadType, table: DataTable): void {
    log('intercept', 'Creating approved account stub', { accountType });
    const overrides = convertDataTableToNestedObject(table);
    const payloadFile = this.resolveApprovedPayloadFile(accountType);

    cy.fixture(`draftAccounts/${payloadFile}`)
      .then((base) => {
        const merged = merge({}, base, overrides);
        const processed = this.applyDynamicDates(merged);
        const nextId =
          approvedDraftListings.length === 0
            ? (processed['draft_account_id'] ?? 1)
            : (approvedDraftListings[approvedDraftListings.length - 1]['draft_account_id'] as number) + 1;

        return { ...processed, draft_account_id: nextId };
      })
      .then((summary) => {
        approvedDraftListings.push(summary);
        this.stubApprovedDraftListings([...approvedDraftListings]);
        Cypress.env('approvedListingsCache', [...approvedDraftListings]);
        cy.wrap(summary, { log: false }).as('approvedDraftAccount');
      });
  }

  /**
   * Clears any approved draft listings stubs by returning an empty collection.
   * @description Resets approved draft listings to an empty response so specs start from a clean slate.
   * @remarks Also resets the cached approved summaries used by table assertions.
   * @example
   *   intercepts.clearApprovedListings();
   */
  clearApprovedListings(): void {
    log('intercept', 'Clearing approved draft listings stub');
    approvedDraftListings.length = 0;
    Cypress.env('approvedListingsCache', []);
    this.stubApprovedDraftListings([]);
  }

  /**
   * Resolve approved payload fixture filename for the provided account type.
   * @param accountType - Logical account type name.
   * @returns Fixture filename.
   */
  private resolveApprovedPayloadFile(accountType: DraftPayloadType): string {
    switch (accountType) {
      case 'company':
      case 'fixedPenaltyCompany':
        return 'approvedCompanyPayload.json';
      case 'adultOrYouthOnly':
        return 'approvedAccountPayload.json';
      case 'pgToPay':
        return 'approvedParentOrGuardianPayload.json';
      case 'fixedPenalty':
        return 'approvedAccountPayload.json';
      default:
        throw new Error(`Unsupported account type for approved stub: ${accountType}`);
    }
  }

  /**
   * Replaces dynamic date placeholders in the supplied object.
   * @param payload - Fixture payload to process.
   * @returns Payload with resolved date placeholders.
   */
  private applyDynamicDates<T extends Record<string, any>>(payload: T): T {
    const resolve = (value: any): any => {
      if (typeof value === 'string') {
        const match = value.match(/getDaysAgo\((\d+)\)/i);
        if (match) {
          const days = Number(match[1]);
          return getDaysAgo(days);
        }
        return value;
      }

      if (Array.isArray(value)) {
        return value.map(resolve);
      }

      if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, resolve(val)]));
      }

      return value;
    };

    return resolve(payload);
  }
}
