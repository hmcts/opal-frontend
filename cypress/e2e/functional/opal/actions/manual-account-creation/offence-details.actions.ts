import { ManualOffenceDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/offence-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common.actions';

export class ManualOffenceDetailsActions {
  private readonly common = new CommonActions();

  /**
   * Completes the offence form with a single imposition row.
   */
  fillOffenceDetails(payload: {
    dateOfSentence: string;
    offenceCode: string;
    resultCode: string;
    amountImposed: string;
    amountPaid: string;
  }): void {
    log('type', 'Completing offence details', payload);
    this.typeText(L.dateOfSentenceInput, payload.dateOfSentence, 'Date of sentence');
    this.typeText(L.offenceCodeInput, payload.offenceCode, 'Offence code');
    this.selectResultCode(0, payload.resultCode);
    this.typeText(L.imposition.amountImposedInput(0), payload.amountImposed, 'Amount imposed');
    this.typeText(L.imposition.amountPaidInput(0), payload.amountPaid, 'Amount paid');
  }

  /**
   * Clicks the Review offence submit button.
   */
  clickReviewOffence(): void {
    log('navigate', 'Submitting offence for review');
    cy.get(L.reviewOffenceButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  private typeText(selector: string, value: string, label: string): void {
    cy.get(selector, this.common.getTimeoutOptions())
      .should('be.visible')
      .clear({ force: true })
      .type(value, { delay: 0 });
    log('typed', `Set ${label}`, { value });
  }

  private selectResultCode(index: number, value: string): void {
    log('type', 'Selecting result code', { index, value });
    cy.get(L.imposition.resultCodeInput(index), this.common.getTimeoutOptions())
      .should('be.visible')
      .clear({ force: true })
      .type(value, { delay: 0 });

    cy.get(L.imposition.resultCodeList(index), this.common.getTimeoutOptions()).should('be.visible');
    cy.get(L.imposition.resultCodeInput(index)).type('{downarrow}{enter}');
  }
}
