/**
 * @file details.payment-terms.actions.ts
 * @description Actions for the Account Details "Payment terms" tab and amend form.
 */
import { AccountPaymentTermsDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.paymen-terms.details.locators';
import { PAYMENT_TERMS_AMEND_ELEMENTS as A } from '../../../../../shared/selectors/account-enquiries-payment-terms-amend.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('AccountDetailsPaymentTermsActions');

type InstalmentFrequencyCode = 'W' | 'F' | 'M';

export class AccountDetailsPaymentTermsActions {
  private readonly common = new CommonActions();

  public openChangeLink(): void {
    log('navigate', 'Opening amend payment terms form');
    cy.get(L.tabRoot, this.common.getTimeoutOptions()).should('be.visible');
    cy.contains(L.changeLink, 'Change').should('be.visible').click();
  }

  public assertAmendFormVisible(): void {
    log('assert', 'Asserting amend payment terms form is visible');
    cy.get(A.form, this.common.getTimeoutOptions()).should('be.visible');
    cy.get(A.pageHeading, this.common.getTimeoutOptions()).should('contain.text', 'Payment terms');
  }

  public fillInstalmentsOnlyPaymentTerms(options: {
    instalmentAmount: string;
    frequencyCode: InstalmentFrequencyCode;
    startDate: string;
    reason: string;
    requestPaymentCard?: boolean;
  }): void {
    log('input', 'Completing instalments only payment terms', options);

    cy.get(A.instalmentsOnlyRadio, this.common.getTimeoutOptions()).check({ force: true });
    cy.get(A.instalmentAmountInput, this.common.getTimeoutOptions()).clear().type(options.instalmentAmount);

    const frequencySelector = this.getFrequencySelector(options.frequencyCode);
    cy.get(frequencySelector, this.common.getTimeoutOptions()).check({ force: true });

    cy.get(A.startDateInput, this.common.getTimeoutOptions()).clear().type(options.startDate);
    cy.get(A.reasonForChangeTextarea, this.common.getTimeoutOptions()).clear().type(options.reason);

    if (options.requestPaymentCard) {
      cy.get(A.paymentCardCheckbox, this.common.getTimeoutOptions()).check({ force: true });
    }
  }

  public submitChanges(): void {
    log('input', 'Submitting payment terms changes');
    cy.get(A.submitButton, this.common.getTimeoutOptions()).should('be.enabled').click();
  }

  public cancelChanges(): void {
    log('cancel', 'Cancelling payment terms changes');
    cy.get(A.cancelLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  public assertInstalmentSummary(expected: { amount: string; frequency: string; startDate: string }): void {
    log('assert', 'Asserting instalment summary values', expected);
    cy.get(L.fields.instalmentAmount, this.common.getTimeoutOptions()).should('contain.text', expected.amount);
    cy.get(L.fields.instalmentFrequency, this.common.getTimeoutOptions()).should('contain.text', expected.frequency);
    cy.get(L.fields.startDate, this.common.getTimeoutOptions()).should('contain.text', expected.startDate);
  }

  public assertPayByDate(expected: string): void {
    log('assert', 'Asserting pay by date value', { expected });
    cy.get(L.fields.payByDate, this.common.getTimeoutOptions()).should('contain.text', expected);
  }

  public assertInstalmentRowsNotPresent(): void {
    log('assert', 'Asserting instalment rows are not present');
    cy.get(L.fields.instalmentAmount, { timeout: 2000 }).should('not.exist');
    cy.get(L.fields.instalmentFrequency, { timeout: 2000 }).should('not.exist');
  }

  private getFrequencySelector(code: InstalmentFrequencyCode): string {
    switch (code) {
      case 'W':
        return A.frequencyWeeklyRadio;
      case 'F':
        return A.frequencyFortnightlyRadio;
      case 'M':
      default:
        return A.frequencyMonthlyRadio;
    }
  }
}
