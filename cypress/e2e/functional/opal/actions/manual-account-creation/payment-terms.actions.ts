/**
 * @fileoverview Actions for Manual Account Creation - Payment terms task.
 * Provides helpers to set collection order, pay-by dates, and submit.
 */
import { ManualPaymentTermsLocators as L } from '../../../../../shared/selectors/manual-account-creation/payment-terms.locators';
import { calculateWeeksInFuture, calculateWeeksInPast } from '../../../../../support/utils/dateUtils';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export class ManualPaymentTermsActions {
  private readonly common = new CommonActions();

  /**
   * Sets collection order, pay in full, and pay by date fields.
   */
  completePayInFullWithCollectionOrder(options: {
    collectionOrder: 'Yes' | 'No';
    collectionOrderWeeksInPast: number;
    payByWeeksInFuture: number;
  }): void {
    log('type', 'Completing payment terms', options);

    this.setCollectionOrder(options.collectionOrder, options.collectionOrderWeeksInPast);
    this.selectPayInFull();
    this.setPayByDate(options.payByWeeksInFuture);
  }

  /**
   * Selects whether a collection order exists and, when applicable, enters a past date.
   * @param choice - "Yes" or "No" collection order selection.
   * @param weeksInPast - Weeks ago to backdate the collection order date (only when choice is "Yes").
   */
  private setCollectionOrder(choice: 'Yes' | 'No', weeksInPast: number): void {
    const isYes = choice.toLowerCase() === 'yes';
    const selector = isYes ? L.collectionOrder.yes : L.collectionOrder.no;
    log('select', 'Setting collection order', { choice });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });

    if (isYes) {
      const dateString = calculateWeeksInPast(weeksInPast);
      log('type', 'Setting collection order date', { dateString });
      cy.get(L.collectionOrder.date, this.common.getTimeoutOptions())
        .should('be.visible')
        .clear({ force: true })
        .type(dateString, { delay: 0 });
    }
  }

  /**
   * Chooses the "Pay in full" option.
   * @remarks Use after setting collection order to keep flows consistent.
   */
  private selectPayInFull(): void {
    log('select', 'Selecting Pay in full');
    cy.get(L.payInFull, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Sets the pay-by date a given number of weeks in the future.
   * @param weeksInFuture - Positive week offset for the pay-by date.
   */
  private setPayByDate(weeksInFuture: number): void {
    const dateString = calculateWeeksInFuture(weeksInFuture);
    log('type', 'Setting pay by date', { dateString });
    cy.get(L.payByDate, this.common.getTimeoutOptions())
      .should('be.visible')
      .clear({ force: true })
      .type(dateString, { delay: 0 });
  }
}
