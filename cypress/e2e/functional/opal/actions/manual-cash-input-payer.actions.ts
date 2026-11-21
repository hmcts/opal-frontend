import { ManualCashInputLocators as Mci } from '../../../../shared/selectors/finance.locators';

const TILL_PATH = '/fines/manual-cash-input/create/till/';
const LEAVE_WARNING = 'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
const ADDRESS = {
  addressLine1: '1 Example Road',
  addressLine2: 'Building-2',
  addressLine3: 'Example Town',
  postcode: 'AB1 2CD',
};

/** Browser interactions for the suspense payer journey, using application routes and visible fields. */
export class ManualCashInputPayerActions {
  /**
   * Replaces a payer field value to exercise validation and correction.
   * @param field - Payer form field identifier.
   * @param value - Value to enter in the field.
   */
  public setField(field: string, value: string): void {
    cy.get(Mci.payerField(field)).clear().type(value);
  }

  /**
   * Verifies validation blocks navigation and identifies the field in both error locations.
   * @param field - Payer form field identifier.
   * @param message - Expected validation message.
   */
  public assertFieldError(field: string, message: string): void {
    this.assertPayerPage();
    cy.get(Mci.errorSummary).should('be.visible').and('contain.text', message);
    cy.get(Mci.fieldError(field)).should('be.visible').and('contain.text', message);
  }

  /** Records valid suspense details with the requested business reason.
   * @param reason - Suspense reason selected on the payment form.
   */
  public submitSuspense(reason: string): void {
    cy.location('pathname').should('eq', `${TILL_PATH}suspense-details`);
    cy.get(Mci.suspenseAmount).clear().type('123.45');
    cy.get(Mci.suspenseRadio('payerType', 'defendant')).check();
    cy.get(Mci.suspenseRadio('methodOfPayment', 'notesCoins')).check();
    cy.get(Mci.suspenseRadio('reason', reason)).check();
    if (reason === 'unidentified') cy.get(Mci.suspenseRelevantDetails).type('Unallocated payment');
    cy.get(Mci.continueButton).click();
  }

  /** Confirms the actual payer form is displayed. */
  public assertPayerPage(): void {
    cy.location('pathname').should('eq', `${TILL_PATH}payer-details`);
    cy.get(Mci.payerPage)
      .should('be.visible')
      .within(() => {
        cy.contains('h1', 'Payer details').should('be.visible');
      });
  }

  /** Confirms the payer form displays the business unit selected for the till. */
  public assertBusinessUnit(): void {
    this.assertPayerPage();
    cy.get(Mci.payerBusinessUnit).should('have.text', 'Camden and Islington');
  }

  /** Selects a payer type and checks its conditional fields.
   * @param type - Individual or company payer type.
   */
  public selectType(type: string): void {
    cy.get(Mci.payerType(type)).check().should('be.checked');
    if (type === 'individual') {
      ['title', 'firstNames', 'lastName'].forEach((field) => cy.get(Mci.payerField(field)).should('be.visible'));
      cy.get(Mci.payerField('companyName')).should('not.exist');
    } else {
      cy.get(Mci.payerField('companyName')).should('be.visible');
      ['title', 'firstNames', 'lastName'].forEach((field) => cy.get(Mci.payerField(field)).should('not.exist'));
    }
  }

  /** Enters the required payer name and, when requested, the optional fields.
   * @param type - Individual or company payer type.
   * @param details - Whether to populate full or minimal payer details.
   */
  public enterPayer(type: string, details: string): void {
    this.selectType(type);
    cy.get(Mci.payerField(type === 'individual' ? 'lastName' : 'companyName')).type('Example');
    if (details === 'full') {
      if (type === 'individual') {
        cy.get(Mci.payerField('title')).select('Mrs');
        cy.get(Mci.payerField('firstNames')).type('Anne-Marie');
      }
      Object.entries(ADDRESS).forEach(([field, value]) => cy.get(Mci.payerField(field)).type(value));
    }
  }

  /** Submits payer details without bypassing any route guards. */
  public submitPayer(): void {
    cy.get(Mci.payerPage).find(Mci.continueButton).click();
  }

  /** Confirms the temporary Check Suspense Payment destination. */
  public assertCheckPayment(): void {
    cy.location('pathname').should('eq', `${TILL_PATH}check-suspense-payment`);
    cy.contains('h1', 'Check suspense payment').should('be.visible');
    cy.get(Mci.payerPage).should('not.exist');
  }

  /** Responds to a native warning, or verifies that none was raised on an empty form.
   * @param action - Back or Cancel page action.
   * @param response - Whether to confirm, decline, or expect no warning.
   */
  public leavePayer(action: string, response: string): void {
    let confirmationRaised = false;
    const confirm = (message: string): boolean => {
      confirmationRaised = true;
      expect(message).to.equal(LEAVE_WARNING);
      return response === 'confirm';
    };
    cy.once('window:confirm', confirm);
    cy.get(Mci.payerPage)
      .find(action === 'Back' ? Mci.backLink : Mci.cancelLink)
      .click();
    cy.then(() => {
      expect(confirmationRaised, 'payer data-loss confirmation').to.equal(response !== 'none');
      cy.removeListener('window:confirm', confirm);
    });
  }

  /** Verifies that declining navigation retains every populated field.
   * @param type - Individual or company payer type.
   */
  public assertPayerRetained(type: string): void {
    this.assertPayerPage();
    cy.get(Mci.payerType(type)).should('be.checked');
    cy.get(Mci.payerField(type === 'individual' ? 'lastName' : 'companyName')).should('have.value', 'Example');
    if (type === 'individual') {
      cy.get(Mci.payerField('title')).should('have.value', 'Mrs');
      cy.get(Mci.payerField('firstNames')).should('have.value', 'Anne-Marie');
    }
    Object.entries(ADDRESS).forEach(([field, value]) => cy.get(Mci.payerField(field)).should('have.value', value));
  }

  /** Verifies the destination of a successful Back or Cancel action.
   * @param action - Back or Cancel page action.
   */
  public assertLeaveDestination(action: string): void {
    if (action === 'Back') {
      cy.location('pathname').should('eq', `${TILL_PATH}suspense-details`);
      cy.get(Mci.suspensePage).should('be.visible');
      cy.get(Mci.suspenseAmount).should('have.value', '123.45');
      cy.get(Mci.suspenseRadio('reason', 'overpayment')).should('be.checked');
    } else {
      cy.location('pathname').should('eq', `${TILL_PATH}details`);
      cy.get(Mci.tillDetails).should('be.visible');
    }
  }

  /** Returns from the retained suspense draft to the payer form. */
  public continueFromSuspense(): void {
    cy.get(Mci.suspensePage).find(Mci.continueButton).click();
  }

  /** Verifies a cancelled payment draft was cleared using the reopened form. */
  public assertSuspenseBlank(): void {
    cy.get(Mci.suspensePage).should('be.visible');
    cy.get(Mci.suspenseAmount).should('have.value', '');
    cy.get(Mci.suspensePage).find('input[type="radio"]:checked').should('not.exist');
    ['PostalOrder', 'Cheque', 'CreditTransfer'].forEach((suffix) =>
      cy.get(Mci.suspenseReference(suffix)).should('have.value', ''),
    );
    cy.get(Mci.suspenseRelevantDetails).should('have.value', '');
  }

  /** Verifies no payer values reappear after the discarded form is reopened. */
  public assertPayerBlank(): void {
    this.assertPayerPage();
    cy.get(Mci.payerType('individual')).should('not.be.checked');
    cy.get(Mci.payerType('company')).should('not.be.checked');
    Object.keys(ADDRESS).forEach((field) => cy.get(Mci.payerField(field)).should('have.value', ''));
    this.selectType('individual');
    cy.get(Mci.payerField('title')).should('have.prop', 'selectedIndex', -1);
    ['firstNames', 'lastName'].forEach((field) => cy.get(Mci.payerField(field)).should('have.value', ''));
    this.selectType('company');
    cy.get(Mci.payerField('companyName')).should('have.value', '');
  }

  /** Checks the representative required-field error used in the accessibility journey. */
  public assertPayerTypeRequired(): void {
    this.assertPayerPage();
    cy.get(Mci.errorSummary).should('be.visible').and('contain.text', 'Select payer type');
    cy.get(Mci.radioFieldError('payerType')).should('be.visible').and('contain.text', 'Select payer type');
  }
}
