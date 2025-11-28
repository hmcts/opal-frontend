// e2e/functional/opal/flows/common-flow.ts
/**
 * @fileoverview CommonFlow
 *
 * Small, reusable flows that are shared across multiple Opal features.
 *
 * Notes:
 * - Flow methods orchestrate one or more CommonActions calls.
 * - Logging is centralised via the shared `log` helper to keep Cypress output readable.
 */

import { log } from '../../../../support/utils/log.helper';
import { CommonActions } from '../actions/common/common.actions';

export class CommonFlow {
  private readonly common = new CommonActions();

  /**
   * Cancels the in-progress edit operation and returns the user
   * to the relevant details page, ensuring any unsaved changes are discarded.
   */
  public cancelEditAndLeave(): void {
    log('method', 'cancelEditAndLeave()');
    log('cancel', 'Cancelling edit and returning to details page');
    this.common.cancelEditing(true);
  }
}
