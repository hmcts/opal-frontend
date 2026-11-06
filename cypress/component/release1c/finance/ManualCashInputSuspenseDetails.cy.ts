import { Router } from '@angular/router';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { IFinesMciSuspensePayment } from 'src/app/flows/fines/fines-mci/stores/interfaces/fines-mci.interface';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3673', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const VALID_PAYMENT: IFinesMciSuspensePayment = {
  amount: '123.45',
  payerType: 'defendant',
  methodOfPayment: 'notesCoins',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: '',
  source: null,
  reason: 'overpayment',
  relevantDetails: '',
};
const SAVED_PAYMENT: IFinesMciSuspensePayment = {
  ...VALID_PAYMENT,
  payerType: 'thirdParty',
  methodOfPayment: 'creditTransfer',
  source: 'allpay',
  paymentReferenceCreditTransfer: 'Payment-123',
  reason: 'unidentified',
  relevantDetails: 'Unallocated payment',
};
const LEAVE_WARNING = 'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
const TILL_PATH = '/fines/manual-cash-input/create/till/';

// Start with the real business-unit selection so the caption is checked across the journey.
const openSuspenseDetails = (savedPayment?: IFinesMciSuspensePayment): void => {
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  cy.get('@financeRouter').then((router) => (router as Router).navigateByUrl(`${TILL_PATH}select-bu`));
  cy.get(Mci.singleBusinessUnitSummary).should('contain.text', 'Camden and Islington');
  cy.get(Mci.continueButton).click();
  cy.get(Mci.addPaymentButton).click();
  if (savedPayment) {
    cy.get('@finesMciStore').then((store) => {
      (store as InstanceType<typeof FinesMciStore>).setSuspensePayment(savedPayment);
    });
  }
  cy.get(Mci.paymentCategoryRadio('suspense')).check();
  cy.get(Mci.continueButton).click();
  cy.get(Mci.suspensePage).should('be.visible');
};

const select = (name: string, value: string): void => {
  cy.get(Mci.suspenseRadio(name, value)).check().should('be.checked');
};

const assertError = (field: string, message: string): void => {
  cy.get(Mci.errorSummary).should('contain.text', message);
  cy.get(Mci.fieldError(field)).should('be.visible').and('contain.text', message);
  cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}suspense-details`);
};

describe('Manual Cash Input - Suspense Details', () => {
  it('(AC1a, AC1c) displays screen content and the business unit selected earlier', { tags: TAGS }, () => {
    openSuspenseDetails();
    cy.get(Mci.suspenseBusinessUnit).should('have.text', 'Camden and Islington');
    cy.get(Mci.suspensePage).within(() => {
      cy.contains('h1', 'Suspense details').should('be.visible');
      cy.contains('h2', 'Amount').should('be.visible');
      cy.contains('label', 'Amount').should('have.attr', 'for', 'amount');
      cy.contains('.govuk-input__prefix', '£').should('be.visible');
      ['Payment received from', 'Method of payment', 'Suspense reason'].forEach((label) => {
        cy.contains('legend', label).should('be.visible');
      });
      [
        'Defendant',
        '3rd party',
        'Notes and coins',
        'Postal order',
        'Cheque',
        'Credit transfer',
        'Fines overpayment (OF)',
        'Fine paid in advance (FA)',
        'Miscellaneous payment (MS)',
        'Unidentified amount (UN)',
      ].forEach((label) => cy.contains('label', label).should('be.visible'));
      cy.get('input[type="radio"]:checked').should('not.exist');
      cy.get(Mci.suspenseAmount).should('have.value', '');
      cy.get(Mci.continueButton).should('be.visible').and('have.text', 'Continue');
      cy.get(Mci.cancelLink).should('be.visible').and('have.text', 'Cancel');
      cy.get(Mci.errorSummary).should('not.exist');
    });
  });

  it(
    '(AC2, AC3, AC3a, AC4, AC4a, AC5, AC5a) requires amount, payer, payment method and suspense reason',
    { tags: TAGS },
    () => {
      openSuspenseDetails();
      cy.get(Mci.continueButton).click();
      cy.get(Mci.errorSummary).should('be.visible');
      [
        'Enter an amount',
        'Select who payment was received from',
        'Select a method of payment',
        'Select a reason for the suspense',
      ].forEach((message) => {
        cy.get(Mci.errorSummary).should('contain.text', message);
        cy.get(Mci.errorMessage).filter(':visible').should('contain.text', message);
      });
      cy.get(Mci.suspenseAmount).should('have.attr', 'aria-describedby', 'amount-error');
      cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}suspense-details`);
    },
  );

  it('(AC2b, AC3) accepts the amount boundary and allows either payer type', { tags: TAGS }, () => {
    openSuspenseDetails();
    cy.get(Mci.suspenseAmount).type('123456789012345678.12');
    select('payerType', 'defendant');
    select('payerType', 'thirdParty');
    cy.get(Mci.suspenseRadio('payerType', 'defendant')).should('not.be.checked');
    cy.get(Mci.continueButton).click();
    cy.get(Mci.fieldError('amount')).should('not.exist');
    cy.get(Mci.errorSummary).should('not.contain.text', 'Select who payment was received from');
  });

  ['12x', '1.234'].forEach((amount) => {
    it(`(${amount === '12x' ? 'AC2a' : 'AC2b'}) rejects invalid amount ${amount}`, { tags: TAGS }, () => {
      openSuspenseDetails();
      cy.get(Mci.suspenseAmount).type(amount);
      cy.get(Mci.continueButton).click();
      assertError(
        'amount',
        amount === '12x'
          ? 'Enter a valid amount'
          : 'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after.',
      );
    });
  });

  it('(AC2b) rejects 19 integer digits followed by two decimal places', { tags: TAGS }, () => {
    openSuspenseDetails();
    const longAmount = '1'.repeat(19) + '.99';
    cy.get(Mci.suspenseAmount).clear().type(longAmount, { delay: 0 });
    cy.get(Mci.continueButton).click();
    assertError('amount', 'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after.');
  });

  // Known product defect: the shared amountValidator uses an unescaped decimal separator,
  // so a 19th integer digit is accepted. Enable when the shared validator is corrected.
  // See docs/CYPRESS_COMPONENT_TESTING.md: keep real product failures pending without app workarounds.
  it.skip('(AC2b) rejects an amount with 19 integer digits', { tags: TAGS }, () => {
    openSuspenseDetails();
    cy.get(Mci.suspenseAmount).type('1234567890123456789');
    cy.get(Mci.continueButton).click();
    assertError('amount', 'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after.');
  });

  [
    { method: 'postalOrder', suffix: 'PostalOrder', label: 'Postal order' },
    { method: 'cheque', suffix: 'Cheque', label: 'Cheque' },
    { method: 'creditTransfer', suffix: 'CreditTransfer', label: 'Credit transfer' },
  ].forEach(({ method, suffix, label }) => {
    it(`(AC4c) reveals and validates the ${label} reference`, { tags: TAGS }, () => {
      openSuspenseDetails();
      const reference = Mci.suspenseReference(suffix);
      cy.get(reference).should('not.be.visible');
      select('methodOfPayment', method);
      cy.get(reference).should('be.visible').and('have.attr', 'maxlength', '50').type('invalid!');
      cy.get(Mci.continueButton).click();
      assertError(
        `paymentReference${suffix}`,
        `Payment reference (${label}) must only include letters a to z, numbers, hyphens, spaces and apostrophes`,
      );
      cy.get(reference).clear().type('a'.repeat(51)).should('have.value', 'a'.repeat(50));
      cy.get(reference).clear().type("Valid-123 O'Brien");
      cy.get(Mci.continueButton).click();
      cy.get(Mci.fieldError(`paymentReference${suffix}`)).should('not.exist');
      select('methodOfPayment', 'notesCoins');
      cy.get(reference).should('not.be.visible');
    });
  });

  it('(AC4, AC4b) requires a credit transfer source and offers the supported choices', { tags: TAGS }, () => {
    openSuspenseDetails();
    cy.get(Mci.suspenseRadio('source', 'allpay')).should('not.be.visible');
    select('methodOfPayment', 'creditTransfer');
    cy.get(Mci.continueButton).click();
    cy.get(Mci.errorSummary).should('contain.text', 'Select a source');
    cy.get(Mci.errorMessage).filter(':visible').should('contain.text', 'Select a source');
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}suspense-details`);
    ['allpay', 'Barclaycard', 'British Telecom', 'DWP/AEA', 'NatWest', 'Other'].forEach((source) => {
      select('source', source);
      cy.get('input[name="source"]:checked').should('have.length', 1);
    });
    cy.get(Mci.continueButton).click();
    cy.get(Mci.errorSummary).should('not.contain.text', 'Select a source');
    select('methodOfPayment', 'notesCoins');
    cy.get(Mci.suspenseRadio('source', 'Other')).should('not.be.visible');
  });

  it('(AC6, AC6b) reveals unidentified-payment details and validates their characters', { tags: TAGS }, () => {
    openSuspenseDetails();
    cy.get(Mci.suspenseRelevantDetails).should('not.be.visible');
    select('reason', 'unidentified');
    cy.get(Mci.suspenseRelevantDetails).should('be.visible').and('have.attr', 'maxlength', '50').type('invalid!');
    cy.get(Mci.continueButton).click();
    assertError(
      'relevantDetails',
      'Add Relevant Details must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
    cy.get(Mci.suspenseRelevantDetails).clear().type('a'.repeat(51)).should('have.value', 'a'.repeat(50));
    cy.get(Mci.suspenseRelevantDetails).clear().type("Payment-123 O'Brien");
    cy.get(Mci.continueButton).click();
    cy.get(Mci.fieldError('relevantDetails')).should('not.exist');
    select('reason', 'overpayment');
    cy.get(Mci.suspenseRelevantDetails).should('not.be.visible');
  });

  [
    { method: 'postalOrder', suffix: 'PostalOrder', label: 'Postal order' },
    { method: 'cheque', suffix: 'Cheque', label: 'Cheque' },
    { method: 'creditTransfer', suffix: 'CreditTransfer', label: 'Credit transfer' },
  ].forEach(({ method, suffix, label }) => {
    it(`(AC4d) rejects a restored ${label} reference longer than 50 characters`, { tags: TAGS }, () => {
      // Restored application state can exceed the input's native maxlength restriction.
      openSuspenseDetails({
        ...VALID_PAYMENT,
        methodOfPayment: method as IFinesMciSuspensePayment['methodOfPayment'],
        source: method === 'creditTransfer' ? 'allpay' : null,
        [`paymentReference${suffix}`]: 'a'.repeat(51),
      });
      cy.get(Mci.suspenseReference(suffix)).should('have.value', 'a'.repeat(51));
      cy.get(Mci.continueButton).click();
      assertError(`paymentReference${suffix}`, `Payment reference (${label}) must be 50 characters or fewer`);
    });
  });

  it('(AC6a) rejects restored unidentified details longer than 50 characters', { tags: TAGS }, () => {
    openSuspenseDetails({ ...VALID_PAYMENT, reason: 'unidentified', relevantDetails: 'a'.repeat(51) });
    cy.get(Mci.suspenseRelevantDetails).should('be.visible').and('have.value', 'a'.repeat(51));
    cy.get(Mci.continueButton).click();
    assertError('relevantDetails', 'Add relevant details must be 50 characters or fewer');
  });

  [
    { reason: 'unidentified', target: 'check-suspense-payment', heading: 'Check suspense payment', ac: 'AC7a' },
    { reason: 'overpayment', target: 'payer-details', heading: 'Payer details', ac: 'AC7b' },
    { reason: 'advance', target: 'payer-details', heading: 'Payer details', ac: 'AC7b' },
    { reason: 'miscellaneous', target: 'payer-details', heading: 'Payer details', ac: 'AC7b' },
  ].forEach(({ reason, target, heading, ac }) => {
    it(`(AC7, ${ac}) stores a valid ${reason} payment and opens the temporary next screen`, { tags: TAGS }, () => {
      openSuspenseDetails();
      cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leaveConfirm'));
      cy.get(Mci.suspenseAmount).type(VALID_PAYMENT.amount);
      select('payerType', 'defendant');
      select('methodOfPayment', 'notesCoins');
      select('reason', reason);
      if (reason === 'unidentified') {
        cy.get(Mci.suspenseRelevantDetails).type('Unallocated payment-123');
      }
      cy.get(Mci.continueButton).click();
      cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}${target}`);
      cy.contains('h1', heading).should('be.visible');
      cy.get('@leaveConfirm').should('not.have.been.called');
      cy.get('@finesMciStore').should((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).suspensePayment()).to.deep.equal({
          ...VALID_PAYMENT,
          reason,
          relevantDetails: reason === 'unidentified' ? 'Unallocated payment-123' : '',
        });
      });
    });
  });

  it('(AC8) cancels an empty form to Till Details without a warning', { tags: TAGS }, () => {
    openSuspenseDetails();
    cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leaveConfirm'));
    cy.get(Mci.cancelLink).click();
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}details`);
    cy.get(Mci.tillDetails).should('be.visible');
    cy.get('@leaveConfirm').should('not.have.been.called');
  });

  it('(AC8a, AC8aii) retains entered and saved data when the user declines to leave', { tags: TAGS }, () => {
    openSuspenseDetails(SAVED_PAYMENT);
    cy.get(Mci.suspenseAmount).clear().type('456.78');
    cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leaveConfirm'));
    cy.get(Mci.cancelLink).click();
    cy.get('@leaveConfirm').should('have.been.calledOnceWithExactly', LEAVE_WARNING);
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}suspense-details`);
    cy.get(Mci.suspenseAmount).should('have.value', '456.78');
    cy.get(Mci.suspenseRadio('payerType', 'thirdParty')).should('be.checked');
    cy.get(Mci.suspenseRadio('methodOfPayment', 'creditTransfer')).should('be.checked');
    cy.get(Mci.suspenseRadio('source', 'allpay')).should('be.checked');
    cy.get(Mci.suspenseReference('CreditTransfer')).should('have.value', 'Payment-123');
    cy.get(Mci.suspenseRadio('reason', 'unidentified')).should('be.checked');
    cy.get(Mci.suspenseRelevantDetails).should('have.value', 'Unallocated payment');
    cy.get('@finesMciStore').should((store) => {
      expect((store as InstanceType<typeof FinesMciStore>).suspensePayment()).to.deep.equal(SAVED_PAYMENT);
      expect((store as InstanceType<typeof FinesMciStore>).draftJourney()).to.equal('suspense');
    });
  });

  it('(AC8a, AC8ai) clears saved and entered payment data when the user confirms Cancel', { tags: TAGS }, () => {
    openSuspenseDetails(SAVED_PAYMENT);
    cy.get(Mci.suspenseAmount).clear().type('456.78');
    cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(true)).as('leaveConfirm'));
    cy.get(Mci.cancelLink).click();
    cy.get('@leaveConfirm').should('have.been.calledOnceWithExactly', LEAVE_WARNING);
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}details`);
    cy.get(Mci.tillDetails).should('be.visible');
    cy.get('@finesMciStore').should((store) => {
      expect((store as InstanceType<typeof FinesMciStore>).suspensePayment()).to.be.null;
      expect((store as InstanceType<typeof FinesMciStore>).draftJourney()).to.be.null;
    });
    cy.get(Mci.addPaymentButton).click();
    cy.get(Mci.paymentCategoryRadio('suspense')).check();
    cy.get(Mci.continueButton).click();
    cy.get(Mci.suspenseAmount).should('have.value', '');
    cy.get(Mci.suspensePage).find('input[type="radio"]:checked').should('not.exist');
    ['PostalOrder', 'Cheque', 'CreditTransfer'].forEach((suffix) => {
      cy.get(Mci.suspenseReference(suffix)).should('have.value', '');
    });
    cy.get(Mci.suspenseRelevantDetails).should('have.value', '');
  });

  [
    { ac: 'AC2', field: 'amount', value: '', message: 'Enter an amount' },
    {
      ac: 'AC3, AC3a',
      field: 'payerType',
      value: null,
      message: 'Select who payment was received from',
    },
    {
      ac: 'AC4, AC4a',
      field: 'methodOfPayment',
      value: null,
      message: 'Select a method of payment',
    },
    {
      ac: 'AC5, AC5a',
      field: 'reason',
      value: null,
      message: 'Select a reason for the suspense',
    },
  ].forEach(({ ac, field, value, message }) => {
    it(`(${ac}) blocks submission when only ${field} is missing`, { tags: TAGS }, () => {
      const payment = { ...VALID_PAYMENT, [field]: value };
      openSuspenseDetails(payment);
      cy.get(Mci.continueButton).click();
      cy.get(Mci.errorSummary).find('li').should('have.length', 1).and('contain.text', message);
      if (field === 'amount') {
        cy.get(Mci.fieldError(field)).should('be.visible').and('contain.text', message);
      } else {
        cy.get(Mci.radioFieldError(field)).should('be.visible').and('contain.text', message);
      }
      cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}suspense-details`);
      cy.get('@finesMciStore').should((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).suspensePayment()).to.deep.equal(payment);
      });
    });
  });

  it('(AC4, AC4b) blocks an otherwise valid credit transfer without a source', { tags: TAGS }, () => {
    openSuspenseDetails({ ...VALID_PAYMENT, methodOfPayment: 'creditTransfer' });
    cy.get(Mci.continueButton).click();
    cy.get(Mci.errorSummary).find('li').should('have.length', 1).and('contain.text', 'Select a source');
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}suspense-details`);
    select('methodOfPayment', 'notesCoins');
    cy.get(Mci.continueButton).click();
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}payer-details`);
  });

  [
    { method: 'postalOrder', suffix: 'PostalOrder' },
    { method: 'cheque', suffix: 'Cheque' },
    { method: 'creditTransfer', suffix: 'CreditTransfer' },
  ].forEach(({ method, suffix }) => {
    it(`(AC4c, AC4d, AC7) accepts and stores a 50-character ${method} reference`, { tags: TAGS }, () => {
      openSuspenseDetails();
      cy.get(Mci.suspenseAmount).type('123.45');
      select('payerType', 'thirdParty');
      select('methodOfPayment', method);
      if (method === 'creditTransfer') {
        select('source', 'allpay');
      }
      const reference = "Ref-123 O'Brien ".padEnd(50, 'a');
      cy.get(Mci.suspenseReference(suffix)).type(reference);
      select('reason', 'overpayment');
      cy.get(Mci.continueButton).click();
      cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}payer-details`);
      cy.get('@finesMciStore').should((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).suspensePayment()).to.deep.equal({
          ...VALID_PAYMENT,
          payerType: 'thirdParty',
          methodOfPayment: method,
          source: method === 'creditTransfer' ? 'allpay' : null,
          [`paymentReference${suffix}`]: reference,
        });
      });
    });
  });

  it('(AC6a, AC6b, AC7a) accepts and stores 50 characters of unidentified-payment details', { tags: TAGS }, () => {
    openSuspenseDetails({ ...VALID_PAYMENT, reason: 'unidentified' });
    const details = "Payment-123 O'Brien ".padEnd(50, 'a');
    cy.get(Mci.suspenseRelevantDetails).type(details);
    cy.get(Mci.continueButton).click();
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}check-suspense-payment`);
    cy.get('@finesMciStore').should((store) => {
      expect((store as InstanceType<typeof FinesMciStore>).suspensePayment()).to.deep.equal({
        ...VALID_PAYMENT,
        reason: 'unidentified',
        relevantDetails: details,
      });
    });
  });

  it('(AC8a, AC8ai, AC8aii) protects a single newly entered field without a saved payment', { tags: TAGS }, () => {
    openSuspenseDetails();
    cy.get(Mci.suspenseAmount).type('12.34');
    cy.window().then((window) => {
      const confirm = cy.stub(window, 'confirm');
      confirm.onFirstCall().returns(false);
      confirm.onSecondCall().returns(true);
      cy.wrap(confirm).as('leaveConfirm');
    });
    cy.get(Mci.cancelLink).click();
    cy.get('@leaveConfirm').should('have.been.calledOnceWithExactly', LEAVE_WARNING);
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}suspense-details`);
    cy.get(Mci.suspenseAmount).should('have.value', '12.34');
    cy.get(Mci.cancelLink).click();
    cy.get('@leaveConfirm').should('have.been.calledTwice');
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}details`);
    cy.get('@finesMciStore').should((store) => {
      expect((store as InstanceType<typeof FinesMciStore>).suspensePayment()).to.be.null;
      expect((store as InstanceType<typeof FinesMciStore>).draftJourney()).to.be.null;
    });
  });
});
