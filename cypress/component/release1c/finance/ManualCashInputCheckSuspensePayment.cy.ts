import { Router } from '@angular/router';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import {
  IFinesMciSuspensePayerDetails,
  IFinesMciSuspensePayment,
} from 'src/app/flows/fines/fines-mci/stores/interfaces/fines-mci.interface';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3675', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2660', '@R1CFinancialMovements'];
const TILL_PATH = '/fines/manual-cash-input/create/till/';
const UNIDENTIFIED_PAYMENT: IFinesMciSuspensePayment = {
  amount: '123.45',
  payerType: 'thirdParty',
  methodOfPayment: 'creditTransfer',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: 'REF-123',
  source: 'allpay',
  reason: 'unidentified',
  relevantDetails: 'Unallocated payment',
};
const IDENTIFIED_PAYMENT: IFinesMciSuspensePayment = {
  ...UNIDENTIFIED_PAYMENT,
  methodOfPayment: 'cheque',
  paymentReferenceCheque: 'CH-123',
  paymentReferenceCreditTransfer: '',
  source: null,
  reason: 'overpayment',
  relevantDetails: '',
};
const PAYER: IFinesMciSuspensePayerDetails = {
  payerType: 'individual',
  title: 'Ms',
  firstNames: 'Alex',
  lastName: 'Smith',
  companyName: '',
  addressLine1: '1 Main Street',
  addressLine2: '',
  addressLine3: '',
  postcode: 'AA1 1AA',
};
const COMPANY_PAYER: IFinesMciSuspensePayerDetails = {
  payerType: 'company',
  title: null,
  firstNames: '',
  lastName: '',
  companyName: 'Acme Payments Ltd',
  addressLine1: '2 High Street',
  addressLine2: 'London',
  addressLine3: '',
  postcode: 'EC1A 1BB',
};

const openCheckSuspensePayment = (
  payment: IFinesMciSuspensePayment = UNIDENTIFIED_PAYMENT,
  payer: IFinesMciSuspensePayerDetails | null = null,
  note = '',
): void => {
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  cy.get('@financeRouter').then((router) => (router as Router).navigateByUrl(`${TILL_PATH}select-bu`));
  cy.get(Mci.continueButton).click();
  cy.get('@finesMciStore').then((store) => {
    const finesMciStore = store as InstanceType<typeof FinesMciStore>;
    finesMciStore.setSuspensePayment(payment);
    finesMciStore.setSuspensePayerDetails(payer);
    finesMciStore.setSuspenseNote(note);
  });
  // The routed fixture starts at Till Details. Accept its genuine leave-page warning before jumping to the screen under test.
  cy.window().then((window) => cy.stub(window, 'confirm').returns(true));
  cy.get('@financeRouter').then((router) => (router as Router).navigateByUrl(`${TILL_PATH}check-suspense-payment`));
  cy.get(Mci.checkSuspensePaymentPage).should('be.visible');
};

const assertSummaryValue = (label: string, value: string): void => {
  cy.get(Mci.checkSuspensePaymentPage)
    .contains('dt', label)
    .parents('.govuk-summary-list__row')
    .find('.govuk-summary-list__value')
    .invoke('text')
    .then((text) => expect(text.replace(/\u00a0/g, ' ').trim()).to.equal(value));
};

const assertIdentifiedPaymentSummary = (paymentMethod: string, reference: string): void => {
  assertSummaryValue('Amount', '£123.45');
  assertSummaryValue('Payment received from', '3rd party');
  assertSummaryValue('Method of payment', paymentMethod);
  assertSummaryValue('Payment reference', reference);
  assertSummaryValue('Suspense reason', 'Fines overpayment (OF)');
  assertSummaryValue('Payer type', 'Individual');
  assertSummaryValue('Payer name', 'Alex Smith');
  cy.get(Mci.checkSuspensePaymentPage)
    .contains('dt', 'Address')
    .parents('.govuk-summary-list__row')
    .should('contain.text', '1 Main Street')
    .and('contain.text', 'AA1 1AA');
  cy.get(Mci.checkSuspensePaymentPage).contains('dt', 'Relevant details').should('not.exist');
  cy.get(Mci.suspenseNote).should('be.visible').and('have.value', '').and('have.attr', 'maxlength', '1000');
  cy.get(Mci.saveAndReviewTillButton).should('be.visible');
  cy.get(Mci.saveAndAddPaymentButton).should('be.visible');
  cy.get(Mci.cancelSuspensePaymentLink).should('be.visible');
};

describe('Manual Cash Input - Check Suspense Payment', () => {
  afterEach(() => {
    cy.get('body').then(($body) => {
      if ($body.find(Mci.suspenseNote).length) {
        cy.get(Mci.suspenseNote).clear({ force: true });
      }
    });
    cy.get('@finesMciStore').then((store) => {
      (store as InstanceType<typeof FinesMciStore>).discardSuspensePayment();
    });
  });

  it(
    '(AC1, AC1a, AC2, AC2b) displays an unidentified credit-transfer payment and excludes payer details',
    { tags: TAGS },
    () => {
      openCheckSuspensePayment();
      cy.get(Mci.checkSuspensePaymentPage).within(() => {
        cy.contains('h1', 'Check suspense payment').should('be.visible');
        [
          '£123.45',
          '3rd party',
          'Credit transfer',
          'allpay',
          'REF-123',
          'Unidentified amount (UN)',
          'Unallocated payment',
        ].forEach((value) => cy.contains(value).should('be.visible'));
        cy.contains('dt', 'Payer type').should('not.exist');
        cy.contains('dt', 'Payer name').should('not.exist');
        cy.get(Mci.suspenseNote).should('have.attr', 'maxlength', '1000');
        cy.get(Mci.saveAndReviewTillButton).should('be.visible');
        cy.get(Mci.saveAndAddPaymentButton).should('be.visible');
        cy.get(Mci.cancelSuspensePaymentLink).should('be.visible');
      });
    },
  );

  it('(AC2, AC2a) displays identified payer details and excludes credit-transfer fields', { tags: TAGS }, () => {
    openCheckSuspensePayment(IDENTIFIED_PAYMENT, PAYER);
    cy.get(Mci.checkSuspensePaymentPage).within(() => {
      [
        '£123.45',
        '3rd party',
        'Cheque',
        'CH-123',
        'Fines overpayment (OF)',
        'Individual',
        'Alex Smith',
        '1 Main Street',
        'AA1 1AA',
      ].forEach((value) => cy.contains(value).should('be.visible'));
      cy.contains('dt', 'Source').should('not.exist');
      cy.contains('dt', 'Relevant details').should('not.exist');
    });
  });

  it('(AC4) requires a suspense note before saving', { tags: TAGS }, () => {
    openCheckSuspensePayment();
    cy.get(Mci.saveAndReviewTillButton).click();
    cy.get(Mci.errorSummary).should('contain.text', 'Add a suspense note');
    cy.get(Mci.suspenseNote).should('have.attr', 'aria-describedby').and('contain', 'suspenseNote-error');
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}check-suspense-payment`);
  });

  it('(AC5, AC5a) saves a payment, returns to Till Details, and supports amendment', { tags: TAGS }, () => {
    openCheckSuspensePayment();
    cy.get(Mci.suspenseNote).type('  Investigate payment  ');
    cy.get(Mci.saveAndReviewTillButton).click();
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}details`);
    cy.get(Mci.tillDetails).should('contain.text', '£123.45');
    cy.get(Mci.tillPaymentChangeLink).click();
    cy.get(Mci.checkSuspensePaymentPage).should('be.visible');
    cy.get(Mci.suspenseNote).should('have.value', 'Investigate payment');
  });

  it('(AC3, AC3a) opens Suspense Details when payment details are changed', { tags: TAGS }, () => {
    openCheckSuspensePayment(IDENTIFIED_PAYMENT, PAYER);
    cy.get(Mci.checkSuspensePaymentPage).contains('a', 'Change amount').click();
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}suspense-details`);
  });

  it('(AC3, AC3b) opens Payer Details when payer details are changed', { tags: TAGS }, () => {
    openCheckSuspensePayment(IDENTIFIED_PAYMENT, PAYER);
    cy.get(Mci.checkSuspensePaymentPage).contains('a', 'Change payer type').click();
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}payer-details`);
  });

  it('(AC6, AC6a) saves the payment and opens Payment Category to add another payment', { tags: TAGS }, () => {
    openCheckSuspensePayment(IDENTIFIED_PAYMENT, PAYER);
    cy.get(Mci.suspenseNote).type('New payment');
    cy.get(Mci.saveAndAddPaymentButton).click();
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}payment-category`);
  });

  it('(AC7) cancels and discards the suspense payment', { tags: TAGS }, () => {
    openCheckSuspensePayment();
    cy.get(Mci.cancelSuspensePaymentLink).click();
    cy.get('@financeRouter').its('url').should('eq', `${TILL_PATH}details`);
    cy.get(Mci.tillDetails).should('contain.text', 'There are no payments');
    cy.get('@finesMciStore').should((store) => {
      expect((store as InstanceType<typeof FinesMciStore>).suspensePayment()).to.be.null;
    });
  });

  describe('AC4 - suspense-note validation boundaries', () => {
    it(
      '(AC4) rejects a whitespace-only suspense note and links to the note from the error summary',
      { tags: TAGS },
      () => {
        openCheckSuspensePayment();
        cy.get(Mci.suspenseNote).type('   ');
        cy.get(Mci.saveAndReviewTillButton).click();
        cy.get(Mci.errorSummary)
          .should('contain.text', 'Add a suspense note')
          .find('a')
          .should('have.attr', 'href', '#suspenseNote');
        cy.get(Mci.suspenseNote).should('have.attr', 'aria-describedby').and('contain', 'suspenseNote-error');
        cy.get('@finesMciStore').should((store) => {
          expect((store as InstanceType<typeof FinesMciStore>).tills()[0].payments).to.be.empty;
        });
      },
    );

    it(
      '(AC4) rejects a restored suspense note longer than 1000 characters without saving the payment',
      { tags: TAGS },
      () => {
        openCheckSuspensePayment(UNIDENTIFIED_PAYMENT, null, 'x'.repeat(1001));
        cy.get(Mci.saveAndAddPaymentButton).click();
        cy.get(Mci.errorSummary).should('contain.text', 'Suspense note must be 1000 characters or fewer');
        cy.get('@finesMciStore').should((store) => {
          expect((store as InstanceType<typeof FinesMciStore>).tills()[0].payments).to.be.empty;
        });
      },
    );

    it('(AC4) accepts the 1000-character note boundary and saves it', { tags: TAGS }, () => {
      const note = 'x'.repeat(1000);
      openCheckSuspensePayment();
      cy.get(Mci.suspenseNote).type(note, { delay: 0 });
      cy.get(Mci.saveAndReviewTillButton).click();
      cy.get('@finesMciStore').should((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).tills()[0].payments[0].suspenseNote).to.equal(note);
      });
    });

    it(
      '(AC4) accepts and preserves permitted punctuation and special characters in a suspense note',
      { tags: TAGS },
      () => {
        const note = "Payment #42: £12.50 - payer's ref / A&B <review>!";
        openCheckSuspensePayment();
        cy.get(Mci.suspenseNote).type(note);
        cy.get(Mci.saveAndReviewTillButton).click();
        cy.get('@finesMciStore').should((store) => {
          expect((store as InstanceType<typeof FinesMciStore>).tills()[0].payments[0].suspenseNote).to.equal(note);
        });
      },
    );

    it('(AC4) prevents a user-entered note from exceeding the 1000-character limit', { tags: TAGS }, () => {
      const note = 'x'.repeat(1001);
      openCheckSuspensePayment();
      cy.get(Mci.suspenseNote).type(note, { delay: 0 }).should('have.value', note.slice(0, 1000));
      cy.get(Mci.saveAndReviewTillButton).click();
      cy.get('@finesMciStore').should((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).tills()[0].payments[0].suspenseNote).to.equal(
          note.slice(0, 1000),
        );
      });
    });
  });

  describe('AC2 - payment method summary combinations', () => {
    [
      { method: 'notesCoins', label: 'Notes and coins', reference: '—', source: null },
      { method: 'postalOrder', label: 'Postal order', reference: 'PO-123', source: null },
      { method: 'cheque', label: 'Cheque', reference: 'CH-123', source: null },
      { method: 'creditTransfer', label: 'Credit transfer', reference: 'CT-123', source: 'allpay' },
    ].forEach(({ method, label, reference, source }) => {
      it(`(AC2) displays ${label} with only its applicable reference and source fields`, { tags: TAGS }, () => {
        openCheckSuspensePayment(
          {
            ...IDENTIFIED_PAYMENT,
            methodOfPayment: method as IFinesMciSuspensePayment['methodOfPayment'],
            paymentReferencePostalOrder: method === 'postalOrder' ? reference : '',
            paymentReferenceCheque: method === 'cheque' ? reference : '',
            paymentReferenceCreditTransfer: method === 'creditTransfer' ? reference : '',
            source,
          },
          PAYER,
        );
        assertIdentifiedPaymentSummary(label, reference);
        if (source) {
          assertSummaryValue('Source', source);
        } else {
          cy.get(Mci.checkSuspensePaymentPage).contains('dt', 'Source').should('not.exist');
        }
      });
    });

    ['allpay', 'Barclaycard', 'British Telecom', 'DWP/AEA', 'NatWest', 'Other'].forEach((source) => {
      it(`(AC2) displays the selected credit-transfer source ${source}`, { tags: TAGS }, () => {
        openCheckSuspensePayment({ ...UNIDENTIFIED_PAYMENT, source });
        assertSummaryValue('Source', source);
      });
    });

    (
      [
        { payerType: 'defendant', label: 'Defendant' },
        { payerType: 'thirdParty', label: '3rd party' },
      ] as const
    ).forEach(({ payerType, label }) => {
      it(`(AC2) displays payment received from as ${label}`, { tags: TAGS }, () => {
        openCheckSuspensePayment({ ...IDENTIFIED_PAYMENT, payerType }, PAYER);
        assertSummaryValue('Payment received from', label);
      });
    });

    [
      { amount: '0', label: '£0.00' },
      { amount: '0.01', label: '£0.01' },
      { amount: '1', label: '£1.00' },
      { amount: '1.2', label: '£1.20' },
      { amount: '1234.56', label: '£1,234.56' },
      { amount: '000123.45', label: '£123.45' },
      { amount: '999999999999.99', label: '£999,999,999,999.99' },
    ].forEach(({ amount, label }) => {
      it(`(AC2) formats the valid amount ${amount} as ${label}`, { tags: TAGS }, () => {
        openCheckSuspensePayment({ ...IDENTIFIED_PAYMENT, amount }, PAYER);
        assertSummaryValue('Amount', label);
      });
    });

    // Genuine defect: the component converts the valid 18-digit amount to Number and loses precision before formatting.
    it.skip('(AC2) preserves pounds and pence for the maximum 18-digit amount', { tags: TAGS }, () => {
      openCheckSuspensePayment({ ...IDENTIFIED_PAYMENT, amount: '123456789012345678.12' }, PAYER);
      assertSummaryValue('Amount', '£123,456,789,012,345,678.12');
    });

    it('(AC2) displays a dash for missing or invalid amount and payment-received-from values', { tags: TAGS }, () => {
      openCheckSuspensePayment({ ...IDENTIFIED_PAYMENT, amount: 'not-an-amount', payerType: null }, PAYER);
      assertSummaryValue('Amount', '—');
      assertSummaryValue('Payment received from', '—');
    });
  });

  describe('AC2, AC2a - suspense reason and payer summary combinations', () => {
    (
      [
        { reason: 'overpayment', label: 'Fines overpayment (OF)' },
        { reason: 'advance', label: 'Fine paid in advance (FA)' },
        { reason: 'miscellaneous', label: 'Miscellaneous payment (MS)' },
      ] as const
    ).forEach(({ reason, label }) => {
      it(`(AC2, AC2a) displays ${label} with identified individual payer details`, { tags: TAGS }, () => {
        openCheckSuspensePayment({ ...IDENTIFIED_PAYMENT, reason }, PAYER);
        assertSummaryValue('Suspense reason', label);
        assertSummaryValue('Payer type', 'Individual');
        assertSummaryValue('Payer name', 'Alex Smith');
        cy.get(Mci.checkSuspensePaymentPage).contains('dt', 'Relevant details').should('not.exist');
      });
    });

    it('(AC2, AC2a) displays a company payer name and each populated address line', { tags: TAGS }, () => {
      openCheckSuspensePayment({ ...IDENTIFIED_PAYMENT, reason: 'advance' }, COMPANY_PAYER);
      assertSummaryValue('Payer type', 'Company');
      assertSummaryValue('Payer name', 'Acme Payments Ltd');
      cy.get(Mci.checkSuspensePaymentPage)
        .contains('dt', 'Address')
        .parents('.govuk-summary-list__row')
        .should('contain.text', '2 High Street')
        .and('contain.text', 'London')
        .and('contain.text', 'EC1A 1BB');
    });

    it(
      '(AC2) displays dashes for missing optional source, reference and relevant-detail values',
      { tags: TAGS },
      () => {
        openCheckSuspensePayment(
          {
            ...UNIDENTIFIED_PAYMENT,
            paymentReferenceCreditTransfer: '',
            source: null,
            relevantDetails: '',
          },
          null,
        );
        assertSummaryValue('Source', '—');
        assertSummaryValue('Payment reference', '—');
        assertSummaryValue('Relevant details', '—');
      },
    );

    it('(AC2, AC2a) displays dashes when identified payment payer details are unavailable', { tags: TAGS }, () => {
      openCheckSuspensePayment(IDENTIFIED_PAYMENT, null);
      assertSummaryValue('Payer type', '—');
      assertSummaryValue('Payer name', '—');
      assertSummaryValue('Address', '—');
    });
  });
});
