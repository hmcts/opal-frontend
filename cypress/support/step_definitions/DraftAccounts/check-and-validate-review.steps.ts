/**
 * @file check-and-validate-review.steps.ts
 * @description Step definitions for Check and Validate draft account review flows (checker view).
 * Keeps steps thin by delegating to actions/intercepts with shared logging.
 *
 * @remarks
 * - Avoids selectors in steps; all UI work is in actions.
 * - Uses DataTable mapping helpers to keep steps table-driven.
 * - Stubs for failed accounts and PATCH failures live here for reuse.
 */
import { DataTable, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { CheckAndValidateReviewActions } from '../../../e2e/functional/opal/actions/draft-account/check-and-validate-review.actions';
import { CheckAndValidateDraftsActions } from '../../../e2e/functional/opal/actions/draft-account/check-and-validate-drafts.actions';
import { DraftAccountsInterceptActions } from '../../../e2e/functional/opal/actions/draft-account/draft-accounts.intercepts';
import { DraftAccountsFlow } from '../../../e2e/functional/opal/flows/draft-accounts.flow';
import { log } from '../../utils/log.helper';
import { applyUniqPlaceholder } from '../../utils/stringUtils';
import { ManualReviewAccountActions } from '../../../e2e/functional/opal/actions/manual-account-creation/review-account.actions';

const review = () => new CheckAndValidateReviewActions();
const checkerList = () => new CheckAndValidateDraftsActions();
const intercepts = () => new DraftAccountsInterceptActions();
const draftsFlow = () => new DraftAccountsFlow();
const manualReview = () => new ManualReviewAccountActions();

/**
 * Maps a Cucumber DataTable into a trimmed key/value object.
 * @param table - Cucumber DataTable with two columns: key | value.
 * @returns Object of key/value pairs with whitespace trimmed.
 */
const mapTableToObject = (table: DataTable) =>
  Object.fromEntries(
    table
      .rows()
      .map(([key, value]) => [key.trim(), (value ?? '').trim()])
      .filter(([key]) => Boolean(key)),
  );

/**
 * @step Record a decision (approve/reject) on the draft account using a table.
 * @description Delegates to review actions to select decision, enter rejection reason, and submit.
 * @example
 *   When I record the following decision on the draft account:
 *     | Decision | Reject |
 *     | Reason   | Text   |
 */
When('I record the following decision on the draft account:', (table: DataTable) => {
  const raw = table.raw().map((row) => row.map((cell) => (cell ?? '').trim()));
  const findRow = (predicate: (value: string) => boolean) =>
    raw.find(([first]) => predicate((first ?? '').toLowerCase()));
  const pickValue = (row?: string[]) => row?.slice(1).find((cell) => Boolean(cell?.trim()));

  const decisionRow = findRow((first) => first === 'decision');
  let decisionRaw = pickValue(decisionRow);
  if (!decisionRaw) {
    decisionRaw = raw.flat().find((cell) => ['approve', 'reject'].includes(cell.toLowerCase()));
  }
  const normalizedDecision = (decisionRaw || '').trim().toLowerCase();
  if (!['approve', 'reject'].includes(normalizedDecision)) {
    throw new Error(`Unsupported decision "${decisionRaw}". Expected "Approve" or "Reject".`);
  }
  const decision = normalizedDecision as 'approve' | 'reject';

  const reasonRow = findRow((first) => first === 'reason' || first.includes('reason'));
  const reason = pickValue(reasonRow);

  log('step', 'Recording draft decision', { decision, hasReason: Boolean(reason) });
  draftsFlow().recordDecision(decision, reason);
});

/**
 * @step Assert the checker success banner message.
 * @param message - Expected banner text.
 */
Then('the draft success banner is {string}', (message: string) => {
  const resolved = applyUniqPlaceholder(message);
  log('assert', 'Asserting checker success banner', { message: resolved });
  checkerList().assertSuccessBannerMessage(resolved);
});

/**
 * @step Assert a specific review history/timeline entry.
 * @param position - 1-based entry position.
 * @param table - Table of expected fields (title/description).
 */
Then('the draft review history item {int} is:', (position: number, table: DataTable) => {
  const expectations = mapTableToObject(table);
  log('assert', 'Asserting review history item', { position, expectations });
  review().assertTimelineEntry(position, expectations);
});

/**
 * Opens the delete account flow from the review page.
 * @step Open the delete account flow from the review page.
 */
const openDeleteFromReview = () => {
  log('navigate', 'Opening delete flow from review');
  review().openDeleteAccount();
};

When('I delete the draft account from review', openDeleteFromReview);
When('I open draft deletion from review', openDeleteFromReview);

/**
 * @step Open draft deletion from review and assert confirmation page.
 */
When('I delete the draft account from review and see the confirmation page', () => {
  log('navigate', 'Opening delete from review and asserting confirmation');
  draftsFlow().deleteFromReviewAndAssertConfirmation();
});

/**
 * @step Assert the delete confirmation page is displayed.
 */
Then('I should be on the draft delete confirmation page', () => {
  log('assert', 'Asserting delete confirmation page');
  review().assertOnDeleteConfirmation();
});

/**
 * @step Submit draft deletion with a reason provided via table.
 * @param table - Table containing a Reason row.
 */
When('I confirm draft deletion with reason:', (table: DataTable) => {
  const raw = table.raw().map((row) => row.map((cell) => (cell ?? '').trim()));
  const reasonRow = raw.find(([first]) => (first ?? '').toLowerCase() === 'reason');
  const reason =
    reasonRow?.slice(1).find((cell) => Boolean(cell)) ||
    raw
      .flat()
      .filter((cell) => (cell ?? '').toLowerCase() !== 'reason')
      .find((cell) => Boolean(cell));
  if (!reason) {
    throw new Error('Reason is required to confirm deletion');
  }
  log('step', 'Confirming draft deletion', { reason });
  review().confirmDeletionWithReason(reason);
});

/**
 * @step Populate the deletion reason without submitting.
 * @param table - Table containing a Reason row.
 */
When('I provide the draft deletion reason:', (table: DataTable) => {
  const raw = table.raw().map((row) => row.map((cell) => (cell ?? '').trim()));
  const reasonRow = raw.find(([first]) => (first ?? '').toLowerCase() === 'reason');
  const reason =
    reasonRow?.slice(1).find((cell) => Boolean(cell)) ||
    raw
      .flat()
      .filter((cell) => (cell ?? '').toLowerCase() !== 'reason')
      .find((cell) => Boolean(cell));
  if (!reason) {
    throw new Error('Reason is required to populate deletion reason');
  }
  log('step', 'Populating draft deletion reason', { reason });
  review().enterDeleteReason(reason);
});

/**
 * @step Cancel the delete confirmation choosing either Ok or Cancel on the dialog.
 * @param choice - "Ok" to leave, "Cancel" to stay.
 */
When('I cancel draft deletion choosing {string}', (choice: string) => {
  const normalized = choice.trim().toLowerCase() === 'ok' ? 'Ok' : 'Cancel';
  log('navigate', 'Cancelling draft deletion', { choice: normalized });
  review().cancelDeletion(normalized as 'Ok' | 'Cancel');
});

/**
 * @step Assert the global error banner is shown on the draft page.
 */
Then('I should see the draft global error banner', () => {
  log('assert', 'Asserting global error banner');
  review().assertGlobalErrorBanner();
});

/**
 * @step Stub failed draft account listings and details.
 * @description Ensures the Failed tab has predictable data.
 */
Given('failed draft accounts are stubbed with one result', () => {
  log('intercept', 'Stubbing failed draft accounts');
  intercepts().stubFailedDraftSummaries();
  intercepts().stubFailedDraftDetails();
});

/**
 * @step Stub PATCH draft decision updates to fail with a status code.
 * @param statusCode - HTTP status (e.g., 400).
 */
Given('draft account decision updates fail with status {int}', (statusCode: number) => {
  log('intercept', 'Stubbing PATCH draft decision failure', { statusCode });
  intercepts().stubPatchDraftAccountError(statusCode);
});

/**
 * @step Assert that the Delete account link is present on the review page.
 */
Then('I see the "Delete account" link', () => {
  log('assert', 'Asserting Delete account link is visible');
  review().assertDeleteLinkVisible();
});

/**
 * @step Click the "Check account" button.
 */
When('I click the "Check account" button', () => {
  log('navigate', 'Clicking Check account button');
  // Use the manual account review actions flow for the check account interaction
  manualReview().clickCheckAccount();
});

/**
 * @step Assert the Delete account link is not visible.
 */
Then('I do not see the "Delete account" link', () => {
  log('assert', 'Asserting Delete account link is not present');
  review().assertDeleteLinkNotVisible();
});
