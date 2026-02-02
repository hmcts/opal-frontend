/**
 * @file review-account.actions.ts
 * @description Actions for the Manual Account Creation **Check account details** screen, including
 * navigation from the task list, header assertions, imposition table checks, and submission flows.
 */
import { ManualReviewAccountLocators as L } from '../../../../../shared/selectors/manual-account-creation/review-account.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';
import { applyUniqPlaceholder } from '../../../../../support/utils/stringUtils';
import {
  deriveRequestSummary,
  extractAccountNumber,
  extractCreatedTimestamp,
  extractUpdatedTimestamp,
  recordCreatedAccount,
  recordFailedAccount,
  safeReadDraftId,
  summarizeErrorPayload,
} from '../../../../../support/utils/accountCapture';
import { captureScenarioScreenshot } from '../../../../../support/utils/screenshot';
import { getCurrentScenarioTitle } from '../../../../../support/utils/scenarioContext';

type SummaryRow = { label: string; value: string };
type OffenceRow = {
  imposition: string;
  creditor: string;
  amountImposed: string;
  amountPaid: string;
  balanceRemaining: string;
};

/**
 * Actions for the Manual Account Creation **Check account details** screen.
 */
export class ManualReviewAccountActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Take a named screenshot for evidence on the review screen.
   * @param tag - Short label describing the capture moment.
   */
  private captureReviewScreenshot(tag: string): void {
    captureScenarioScreenshot(`manual-review-${tag}`);
  }

  /**
   * Clicks the Check account button from Account details.
   * @example
   *   review.clickCheckAccount();
   */
  clickCheckAccount(): void {
    log('navigate', 'Opening Check account details from task list');
    cy.get(L.checkAccountButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Asserts the review page header contains the expected text.
   * @param expectedHeader - Header fragment to assert.
   * @example
   *   review.assertOnReviewPage('Check account details');
   */
  assertOnReviewPage(expectedHeader: string = 'Check account details'): void {
    cy.location('pathname', { timeout: this.pathTimeout }).should((path) => {
      expect(path).to.match(/(check-account|review-account)/i);
    });
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Asserts summary list rows by label/value for a given summary list id.
   * @param summaryListId - The summaryListId attribute rendered on the page.
   * @param rows - Label/value expectations.
   * @example
   *   review.assertSummaryList('courtDetails', [{ label: 'Prosecutor Case Reference (PCR)', value: 'ABCD1234A' }]);
   */
  assertSummaryList(summaryListId: string, rows: SummaryRow[]): void {
    // Resolve `{uniq}` placeholders on expected values to match the rendered UI.
    const resolvedRows = rows.map((row) => ({ ...row, value: applyUniqPlaceholder(row.value) }));
    log('assert', 'Asserting review summary list', { summaryListId, rows: resolvedRows });
    if (!rows.length) {
      return;
    }

    cy.get(L.summaryList(summaryListId), this.common.getTimeoutOptions())
      .should('exist')
      .first() // guard against multiple summary lists with the same id on the page
      .should('be.visible')
      .within(() => {
        resolvedRows.forEach(({ label, value }) => {
          cy.contains(L.summaryKey, label, this.common.getTimeoutOptions())
            .should('be.visible')
            .parents(L.summaryRow)
            .first()
            .within(() => {
              cy.get(L.summaryValue, this.common.getTimeoutOptions()).should(($val) => {
                const normalizedText = ($val.text() ?? '').replace(/\s+/g, ' ').trim();
                const expectsNotProvided = value.trim().toLowerCase() === 'not provided';
                if (expectsNotProvided) {
                  const hasNotProvidedIcon = $val.find('[aria-label="Not provided"]').length > 0;
                  expect(hasNotProvidedIcon || /not provided/i.test(normalizedText)).to.equal(
                    true,
                    'Not provided indicator',
                  );
                  return;
                }
                const expectedNormalized = value.replace(/\s+/g, ' ').trim();
                const isCaseInsensitiveMatch =
                  normalizedText.localeCompare(expectedNormalized, undefined, { sensitivity: 'accent' }) === 0;
                const parseDate = (val: string): number | null => {
                  const cleaned = val.replace(/\(.*?\)/g, '').trim();
                  const slashDate = cleaned.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
                  if (slashDate) {
                    const [, dd, mm, yyyy] = slashDate;
                    const utc = Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd));
                    return Number.isNaN(utc) ? null : utc;
                  }
                  const parsed = Date.parse(cleaned);
                  return Number.isNaN(parsed) ? null : new Date(parsed).setUTCHours(0, 0, 0, 0);
                };
                const actualDate = parseDate(normalizedText);
                const expectedDate = parseDate(expectedNormalized);
                const datesMatch = actualDate !== null && expectedDate !== null && actualDate === expectedDate;
                expect(
                  isCaseInsensitiveMatch ||
                    normalizedText.toLowerCase().includes(expectedNormalized.toLowerCase()) ||
                    datesMatch,
                  `Expected "${normalizedText}" to include "${expectedNormalized}" (case-insensitive)`,
                ).to.equal(true);
              });
            });
        });
      });
  }

  /**
   * Asserts offence/imposition rows on the review page.
   * @param rows - Ordered offence rows; the Totals row is handled automatically.
   * @example
   *   review.assertOffenceTable([
   *     {
   *       imposition: 'Compensation',
   *       creditor: 'HMCTS',
   *       amountImposed: '£100.00',
   *       amountPaid: '£50.00',
   *       balanceRemaining: '£50.00',
   *     },
   *   ]);
   */
  assertOffenceTable(rows: OffenceRow[]): void {
    log('assert', 'Asserting offences and impositions table', { rows });
    if (!rows.length) {
      return;
    }

    const detailRows = rows.filter((row) => !/totals/i.test(row.imposition));
    detailRows.forEach((row, index) => {
      cy.get(L.offences.impositionCells, this.common.getTimeoutOptions())
        .eq(index)
        .should('contain.text', row.imposition);
      cy.get(L.offences.creditorCells, this.common.getTimeoutOptions()).eq(index).should('contain.text', row.creditor);
      cy.get(L.offences.amountImposedCells, this.common.getTimeoutOptions())
        .eq(index)
        .should('contain.text', row.amountImposed);
      cy.get(L.offences.amountPaidCells, this.common.getTimeoutOptions())
        .eq(index)
        .should('contain.text', row.amountPaid);
      cy.get(L.offences.balanceRemainingCells, this.common.getTimeoutOptions())
        .eq(index)
        .should('contain.text', row.balanceRemaining);
    });

    const totalsRow = rows.find((row) => /totals/i.test(row.imposition));
    if (totalsRow) {
      cy.get(L.offences.totals.heading, this.common.getTimeoutOptions()).should('contain.text', 'Totals');
      cy.get(L.offences.totals.amountImposed, this.common.getTimeoutOptions()).should(
        'contain.text',
        totalsRow.amountImposed,
      );
      cy.get(L.offences.totals.amountPaid, this.common.getTimeoutOptions()).should(
        'contain.text',
        totalsRow.amountPaid,
      );
      cy.get(L.offences.totals.balanceRemaining, this.common.getTimeoutOptions()).should(
        'contain.text',
        totalsRow.balanceRemaining,
      );
    }
  }

  /**
   * Expands minor creditor details if the summary list is hidden.
   */
  private ensureMinorCreditorDetailsVisible(): void {
    cy.get('body').then(($body) => {
      const summaryExists = $body.find(L.summaryList(L.offences.minorCreditorSummaryId)).length > 0;
      if (summaryExists) {
        return;
      }
      const toggle = $body.find(L.offences.minorCreditorToggle);
      if (toggle.length) {
        cy.contains(L.offences.minorCreditorToggle, /show details/i, this.common.getTimeoutOptions())
          .scrollIntoView()
          .click({ force: true });
      }
    });
  }

  /**
   * Asserts the minor creditor summary list.
   * @param rows - Label/value expectations.
   * @example
   *   review.assertMinorCreditorDetails([{ label: 'Payment method', value: 'Pay by BACS' }]);
   */
  assertMinorCreditorDetails(rows: SummaryRow[]): void {
    log('assert', 'Asserting minor creditor summary', { rows });
    this.ensureMinorCreditorDetailsVisible();
    this.assertSummaryList(L.offences.minorCreditorSummaryId, rows);
  }

  /**
   * Submits the account and captures success/failure metadata for downstream validation.
   * @param assertSuccess - Whether to assert a successful submission.
   * @returns Cypress chainable for the submission flow.
   */
  private submitAndCapture(assertSuccess: boolean): Cypress.Chainable<void> {
    log('navigate', 'Submitting manual account for review');
    this.captureReviewScreenshot('before-submit');
    const scenario = getCurrentScenarioTitle();
    cy.intercept(
      {
        method: /POST|PUT/,
        url: /\/opal-fines-service\/draft-accounts(?:\/.*)?/,
      },
      (req) => req,
    ).as('manualAccountSubmit');

    cy.get(L.submitForReviewButton, this.common.getTimeoutOptions()).should('be.visible').click();

    return cy.wait('@manualAccountSubmit').then(({ request, response }) => {
      const { endpoint, method } = deriveRequestSummary(request);
      const requestBody = request?.body;
      const requestAccountId = requestBody ? safeReadDraftId(requestBody as unknown) : undefined;
      const isUpdate =
        (method || '').toUpperCase() === 'PUT' ||
        /\/opal-fines-service\/draft-accounts\/\d+/.test(endpoint || '') ||
        typeof requestAccountId === 'number';
      const status = response?.statusCode ?? 0;
      const responseAccountId = response ? safeReadDraftId(response.body as unknown) : undefined;
      const endpointMatch = endpoint?.match(/\/draft-accounts\/(\d+)/);
      const endpointAccountId = endpointMatch ? Number(endpointMatch[1]) : undefined;
      const accountId = responseAccountId ?? requestAccountId ?? endpointAccountId;
      const accountNumber = response
        ? extractAccountNumber(response.body as unknown, response.headers as Record<string, unknown>)
        : undefined;
      const createdAtFromResponse = response ? extractCreatedTimestamp(response.body as unknown) : undefined;
      const updatedAtFromResponse = response ? extractUpdatedTimestamp(response.body as unknown) : undefined;

      const isSuccessStatus = status >= 200 && status < 300;
      const recordWithId = (resolvedAccountId?: number): Cypress.Chainable<void> => {
        if (isSuccessStatus && typeof resolvedAccountId === 'number') {
          const resolvedUpdatedAt = isUpdate ? (updatedAtFromResponse ?? new Date().toISOString()) : undefined;
          return recordCreatedAccount(
            {
              source: 'ui',
              accountType: isUpdate ? 'manualUpdate' : 'manualCreate',
              status: isUpdate ? 'Updated' : 'Created',
              accountId: resolvedAccountId,
              accountNumber: accountNumber ?? null,
              createdAt: createdAtFromResponse,
              updatedAt: resolvedUpdatedAt,
              requestSummary: {
                endpoint: endpoint || '/opal-fines-service/draft-accounts',
                method,
              },
              scenario,
            },
            requestBody,
          );
        } else {
          return recordFailedAccount({
            source: 'ui',
            accountType: isUpdate ? 'manualUpdate' : 'manualCreate',
            httpStatus: status || 0,
            errorSummary: summarizeErrorPayload(response?.body as unknown),
            requestSummary: {
              endpoint: endpoint || '/opal-fines-service/draft-accounts',
              method,
            },
            scenario,
          });
        }
      };

      const assertSuccessResponse = (resolvedAccountId?: number): void => {
        if (assertSuccess) {
          expect(response, 'submit response').to.exist;
          expect(status, 'submit status').to.be.gte(200).and.lt(300);
          expect(resolvedAccountId, 'draft account id').to.be.a('number');
        }
      };

      if (isSuccessStatus && typeof accountId !== 'number') {
        return cy.get<number>('@lastCreatedDraftId', { log: false }).then((fallbackId) => {
          assertSuccessResponse(fallbackId);
          return recordWithId(fallbackId);
        });
      }

      assertSuccessResponse(accountId);
      return recordWithId(accountId);
    });
  }

  /**
   * Clicks Submit for review on the review page.
   * @example
   *   review.submitForReview();
   * @returns Cypress chainable for the submit action.
   */
  submitForReview(): Cypress.Chainable<void> {
    return this.submitAndCapture(false);
  }
}
