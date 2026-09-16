import { FinanceActions, FinanceBankingInterfaceLink } from '../actions/finance/finance.actions';

/** Flow helpers for Finance landing-page journeys. */
export class FinanceFlow {
  private readonly actions = new FinanceActions();

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
