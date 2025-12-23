/**
 * @fileoverview Draft accounts flows shared across checker/inputter views.
 */
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { CheckAndValidateDraftsActions } from '../actions/draft-account/check-and-validate-drafts.actions';
import { CommonActions } from '../actions/common/common.actions';
import { DashboardActions } from '../actions/dashboard.actions';

const log = createScopedLogger('DraftAccountsFlow');

/**
 * Flow helpers that orchestrate draft account actions.
 */
export class DraftAccountsFlow {
  private readonly dashboard = new DashboardActions();
  private readonly checker = new CheckAndValidateDraftsActions();
  private readonly common = new CommonActions();

  /**
   * Opens Check and Validate Draft Accounts and asserts the review header.
   * @example
   *   flow.openCheckAndValidateWithHeader();
   */
  openCheckAndValidateWithHeader(): void {
    log('navigate', 'Opening Check and Validate with header assertion');
    this.dashboard.goToCheckAndValidateDraftAccounts();
    this.common.assertHeaderContains('Review accounts');
  }

  /**
   * Opens a draft account by defendant name and asserts the resulting header.
   * @param defendantName - Name to click in the table.
   * @param expectedHeader - Header text expected on the details page.
   * @example
   *   flow.openDraftAndAssertHeader('GREEN, Oliver', 'Mr Oliver GREEN');
   */
  openDraftAndAssertHeader(defendantName: string, expectedHeader: string): void {
    log('navigate', 'Opening draft and asserting header', { defendantName, expectedHeader });
    this.checker.openDefendant(defendantName);
    this.common.assertHeaderContains(expectedHeader);
  }
}
