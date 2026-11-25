import {
  FinanceActions,
  FinanceBankingInterfaceLink,
  SuspensePermissionCombination,
} from '../actions/finance/finance.actions';

/** Flow helpers for Finance landing-page journeys. */
export class FinanceFlow {
  private readonly actions = new FinanceActions();

  /**
   * Confirms the real signed-in account's Suspense permissions.
   * @param combination - Expected View/Manage permission combination for the signed-in user.
   */
  public assertSuspensePermissions(combination: SuspensePermissionCombination): void {
    this.actions.assertSuspensePermissions(combination);
  }

  /** Verifies that Finance offers the Suspense journey. */
  public assertSuspenseSectionVisible(): void {
    this.actions.assertSuspenseSectionVisible();
  }

  /** Verifies that Finance hides the Suspense journey. */
  public assertSuspenseSectionHidden(): void {
    this.actions.assertSuspenseSectionHidden();
  }

  /** Opens the available Suspense journey. */
  public openSuspenseItems(): void {
    this.actions.openSuspenseItems();
  }

  /** Verifies the permitted user's destination. */
  public assertSuspenseSearchPage(): void {
    this.actions.assertSuspenseSearchPage();
  }

  /** Verifies the banking-interface section and all links available to the user. */
  public assertBankingInterfacesSectionAndLinks(): void {
    this.actions.assertBankingInterfacesSectionVisible();
    this.actions.assertBankingInterfaceLinksVisible();
  }

  /**
   * Opens a banking-interface journey from the Finance landing page.
   * @param linkLabel - Visible label of the link to open.
   */
  public openBankingInterfaceLink(linkLabel: FinanceBankingInterfaceLink): void {
    this.actions.openBankingInterfaceLink(linkLabel);
  }
}
