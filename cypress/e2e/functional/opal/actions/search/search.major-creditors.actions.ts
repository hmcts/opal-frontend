// e2e/functional/opal/actions/search/search.major-creditors.actions.ts
/**
 * @file AccountSearchMajorCreditorsActions
 * @description Actions for the **Major creditors** search panel on the Account Search page.
 *
 * Scope:
 * - Asserting that the major creditors panel is present and visible.
 * - Uses CommonActions for consistent timeouts and logging.
 */

import { AccountSearchMajorCreditorsLocators as L } from '../../../../../shared/selectors/account-search/account.search.major-creditors.locators';
import { CommonActions } from '../common/common.actions';
import { typeAndSelectAutocompleteOption } from '../common/autocomplete.helper';

/** Actions for the Major Creditors panel within Account Search. */
export class AccountSearchMajorCreditorsActions {
  private readonly commonActions = new CommonActions();

  /**
   * Ensure the Major Creditors panel root exists before interacting with it.
   */
  public assertOnSearchPage(): void {
    const sel = L.panel?.root;
    if (!sel) throw new TypeError('assertOnSearchPage: Locator L.panel.root is required but missing.');
    cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Types into the major creditor autocomplete and selects the matching option.
   *
   * @param value - The visible major creditor value to select from the autocomplete.
   */
  public setMajorCreditor(value: string): void {
    typeAndSelectAutocompleteOption({
      inputSelector: L.autocomplete.input,
      listboxSelector: L.autocomplete.listbox,
      value,
      label: 'Major creditor',
      timeoutOptions: this.commonActions.getTimeoutOptions(),
    });
  }
}
