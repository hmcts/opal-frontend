import { Router } from '@angular/router';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { IFinesMciSuspensePayment } from 'src/app/flows/fines/fines-mci/stores/interfaces/fines-mci.interface';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3674', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const PATH = '/fines/manual-cash-input/create/till/';
const WARNING = 'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
const PAYMENT: IFinesMciSuspensePayment = {
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
const EMPTY_PAYER = {
  payerType: null,
  title: null,
  firstNames: '',
  lastName: '',
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  postcode: '',
};
const FIELDS = [
  { field: 'firstNames', label: 'First names', max: 20, type: 'individual', namesOnly: true },
  { field: 'lastName', label: 'Last name', max: 30, type: 'individual', namesOnly: true },
  { field: 'companyName', label: 'Company name', max: 50, type: 'company', namesOnly: false },
  { field: 'addressLine1', label: 'Address line 1', max: 30, type: 'individual', namesOnly: false },
  { field: 'addressLine2', label: 'Address line 2', max: 30, type: 'company', namesOnly: false },
  { field: 'addressLine3', label: 'Address line 3', max: 30, type: 'individual', namesOnly: false },
  { field: 'postcode', label: 'Post code', max: 8, type: 'company', namesOnly: false },
];

const assertRoute = (target = 'payer-details'): void => {
  cy.get('@financeRouter').its('url').should('eq', `${PATH}${target}`);
};
const withStore = (assertion: (store: InstanceType<typeof FinesMciStore>) => void): void => {
  cy.get('@finesMciStore').should((store) => assertion(store as InstanceType<typeof FinesMciStore>));
};
// Enter through the selected business unit and real Suspense Details form.
const openPayer = (reason: IFinesMciSuspensePayment['reason'] = 'overpayment'): void => {
  setupFinancePageComponent();
  cy.get('@financeRouter').then((router) => (router as Router).navigateByUrl(`${PATH}select-bu`));
  cy.get(Mci.singleBusinessUnitSummary).should('contain.text', 'Camden and Islington');
  cy.get(Mci.continueButton).click();
  cy.get(Mci.addPaymentButton).click();
  cy.get('@finesMciStore').then((store) => {
    (store as InstanceType<typeof FinesMciStore>).setSuspensePayment({ ...PAYMENT, reason });
  });
  cy.get(Mci.paymentCategoryRadio('suspense')).check();
  cy.get(Mci.continueButton).click();
  cy.get(Mci.suspensePage).should('be.visible');
  cy.get(Mci.continueButton).click();
};
const selectType = (type: string): void => {
  cy.get(Mci.payerType(type)).check();
};
const fillRequired = (type: string): void => {
  selectType(type);
  cy.get(Mci.payerField(type === 'individual' ? 'lastName' : 'companyName')).type('Example');
};
const assertError = (field: string, message: string): void => {
  cy.get(Mci.errorSummary).should('be.visible').and('contain.text', message);
  cy.get(Mci.fieldError(field)).should('be.visible').and('contain.text', message);
  assertRoute();
};

describe('Manual Cash Input - Payer Details (Suspense)', () => {
  ['overpayment', 'advance', 'miscellaneous'].forEach((reason) => {
    it(`(AC1, AC1c) opens the actual payer form for ${reason} with the selected business unit`, { tags: TAGS }, () => {
      openPayer(reason as IFinesMciSuspensePayment['reason']);
      assertRoute();
      cy.get(Mci.payerPage).should('be.visible');
      cy.get(Mci.payerBusinessUnit).should('have.text', 'Camden and Islington');
      cy.get(Mci.payerType('individual')).should('be.enabled').and('not.be.checked');
      cy.get(Mci.payerPage).contains('label', 'Individual').should('be.visible');
      cy.get(Mci.payerType('company')).should('be.enabled').and('not.be.checked');
      cy.get(Mci.payerPage).contains('label', 'Company').should('be.visible');
    });
  });

  it('(AC1) bypasses payer details for an unidentified amount', { tags: TAGS }, () => {
    openPayer('unidentified');
    assertRoute('check-suspense-payment');
    cy.contains('h1', 'Check suspense payment').should('be.visible');
    cy.get(Mci.payerPage).should('not.exist');
  });

  it('(AC1a, AC1b) displays the payer screen content and conditional fields', { tags: TAGS }, () => {
    openPayer();
    cy.get(Mci.payerPage).within(() => {
      cy.contains('h1', 'Payer details').should('be.visible');
      cy.contains('legend', 'Payer type').should('be.visible');
      cy.contains('h2', 'Address').should('be.visible');
      cy.get(Mci.backLink).should('be.visible').and('contain.text', 'Back');
      cy.get(Mci.continueButton).should('be.visible').and('have.text', 'Continue');
      cy.get(Mci.cancelLink).should('be.visible').and('have.text', 'Cancel');
      cy.get(Mci.errorSummary).should('not.exist');
      FIELDS.filter(({ field }) => field.startsWith('address') || field === 'postcode').forEach(({ field, label }) => {
        cy.contains('label', label).should('be.visible').and('have.attr', 'for', field);
        cy.get(Mci.payerField(field)).should('be.visible').and('have.value', '');
      });
      ['title', 'firstNames', 'lastName', 'companyName'].forEach((field) =>
        cy.get(Mci.payerField(field)).should('not.exist'),
      );
      selectType('individual');
      [
        ['title', 'Title'],
        ['firstNames', 'First names'],
        ['lastName', 'Last name'],
      ].forEach(([field, label]) => {
        cy.contains('label', label).should('be.visible').and('have.attr', 'for', field);
        cy.get(Mci.payerField(field)).should('be.visible');
      });
      cy.contains('Include their middle names').should('be.visible');
      cy.get(Mci.payerField('title'))
        .find('option')
        .then((options) => {
          expect([...options].map((option) => option.textContent?.trim())).to.include.members([
            'Mr',
            'Mrs',
            'Miss',
            'Ms',
          ]);
        });
      cy.get(Mci.payerField('companyName')).should('not.exist');
      selectType('company');
      cy.contains('label', 'Company name').should('be.visible').and('have.attr', 'for', 'companyName');
      cy.get(Mci.payerField('companyName')).should('be.visible').and('have.value', '');
      ['title', 'firstNames', 'lastName'].forEach((field) => cy.get(Mci.payerField(field)).should('not.exist'));
      cy.get(Mci.payerType('individual')).should('not.be.checked');
      selectType('individual');
      cy.get(Mci.payerField('companyName')).should('not.exist');
      cy.get(Mci.payerField('lastName')).should('be.visible');
    });
  });

  [
    { ac: 'AC2a', type: null, field: 'payerType', message: 'Select payer type' },
    { ac: 'AC2b', type: 'individual', field: 'lastName', message: 'Enter last name' },
    { ac: 'AC2c', type: 'company', field: 'companyName', message: 'Enter company name' },
  ].forEach(({ ac, type, field, message }) => {
    it(`(${ac}) blocks submission with missing ${field}`, { tags: TAGS }, () => {
      openPayer();
      if (type) selectType(type);
      cy.get(Mci.continueButton).click();
      assertError(field, message);
      cy.get(Mci.errorSummary).find('li').should('have.length', 1);
      withStore((store) => expect(store.suspensePayerDetails()).to.be.null);
    });
  });

  FIELDS.forEach(({ field, label, max, type, namesOnly }) => {
    it(`(AC2d, AC2e) rejects invalid characters in ${field} and accepts permitted characters`, { tags: TAGS }, () => {
      openPayer();
      fillRequired(type);
      const suffix = namesOnly
        ? 'letters a to z, hyphens, spaces and apostrophes'
        : 'letters a to z, numbers, hyphens, spaces and apostrophes';
      (namesOnly ? ['A1', 'A!'] : ['A!']).forEach((invalidValue) => {
        cy.get(Mci.payerField(field)).clear().type(invalidValue);
        cy.get(Mci.continueButton).click();
        assertError(field, `${label} must only include ${suffix}`);
      });
      const value = namesOnly ? "A-B O'C" : "A-1 O'C";
      cy.get(Mci.payerField(field)).clear().type(value);
      cy.get(Mci.continueButton).click();
      assertRoute('check-suspense-payment');
      withStore((store) => expect(store.suspensePayerDetails()?.[field as keyof typeof EMPTY_PAYER]).to.equal(value));
    });

    it(`(AC2f) rejects ${max + 1} characters and accepts ${max} in ${field}`, { tags: TAGS }, () => {
      openPayer();
      fillRequired(type);
      cy.get(Mci.payerField(field))
        .clear()
        .type('a'.repeat(max + 1), { delay: 0 });
      cy.get(Mci.continueButton).click();
      assertError(field, `${label} must be ${max} characters or fewer`);
      cy.get(Mci.payerField(field)).should('have.value', 'a'.repeat(max + 1));
      cy.get(Mci.payerField(field)).clear().type('a'.repeat(max), { delay: 0 });
      cy.get(Mci.continueButton).click();
      assertRoute('check-suspense-payment');
      withStore((store) =>
        expect(store.suspensePayerDetails()?.[field as keyof typeof EMPTY_PAYER]).to.equal('a'.repeat(max)),
      );
    });
  });

  ['individual', 'company'].forEach((type) => {
    it(`(AC1b, AC3) submits ${type} with optional fields empty`, { tags: TAGS }, () => {
      openPayer();
      fillRequired(type);
      cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leaveConfirm'));
      cy.get(Mci.continueButton).click();
      assertRoute('check-suspense-payment');
      cy.contains('h1', 'Check suspense payment').should('be.visible');
      cy.get('@leaveConfirm').should('not.have.been.called');
      withStore((store) =>
        expect(store.suspensePayerDetails()).to.deep.equal({
          ...EMPTY_PAYER,
          payerType: type,
          [type === 'individual' ? 'lastName' : 'companyName']: 'Example',
        }),
      );
    });
  });

  it('(AC1b, AC3) stores title, first names and all optional address fields', { tags: TAGS }, () => {
    openPayer();
    fillRequired('individual');
    cy.get(Mci.payerField('title')).select('Mrs');
    const entered = {
      firstNames: "Anne-Marie O'Neil",
      addressLine1: "1 King's Road",
      addressLine2: 'Building-2',
      addressLine3: 'Example Town',
      postcode: 'AB1 2CD',
    };
    Object.entries(entered).forEach(([field, value]) => cy.get(Mci.payerField(field)).type(value));
    cy.get(Mci.continueButton).click();
    assertRoute('check-suspense-payment');
    withStore((store) =>
      expect(store.suspensePayerDetails()).to.deep.equal({
        ...EMPTY_PAYER,
        ...entered,
        payerType: 'individual',
        title: 'Mrs',
        lastName: 'Example',
      }),
    );
  });

  [
    { action: 'Back', selector: Mci.backLink, target: 'suspense-details', ac: 'AC4' },
    { action: 'Cancel', selector: Mci.cancelLink, target: 'details', ac: 'AC5' },
  ].forEach(({ action, selector, target, ac }) => {
    it(`(${ac}) ${action} on an empty form returns without a warning`, { tags: TAGS }, () => {
      openPayer();
      cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leaveConfirm'));
      cy.get(selector).click();
      assertRoute(target);
      cy.get('@leaveConfirm').should('not.have.been.called');
    });

    it(
      `(${ac}a, ${ac}ai, ${ac}aii) ${action} retains data on decline and clears it on confirmation`,
      { tags: TAGS },
      () => {
        openPayer();
        fillRequired('individual');
        cy.get(Mci.payerField('firstNames')).type('Example');
        cy.get(Mci.payerField('addressLine1')).type('1 Example Road');
        cy.window().then((window) => {
          const confirm = cy.stub(window, 'confirm');
          confirm.onFirstCall().returns(false);
          confirm.onSecondCall().returns(true);
          cy.wrap(confirm).as('leaveConfirm');
        });
        cy.get(selector).click();
        cy.get('@leaveConfirm').should('have.been.calledOnceWithExactly', WARNING);
        assertRoute();
        cy.get(Mci.payerType('individual')).should('be.checked');
        cy.get(Mci.payerField('lastName')).should('have.value', 'Example');
        cy.get(Mci.payerField('firstNames')).should('have.value', 'Example');
        cy.get(Mci.payerField('addressLine1')).should('have.value', '1 Example Road');
        withStore((store) => expect(store.suspensePayment()).to.deep.equal(PAYMENT));
        cy.get(selector).click();
        cy.get('@leaveConfirm').should('have.been.calledTwice');
        assertRoute(target);
        withStore((store) => {
          expect(store.suspensePayerDetails()).to.be.null;
          expect(store.suspensePayment()).to.deep.equal(action === 'Cancel' ? null : PAYMENT);
          expect(store.draftJourney()).to.equal(action === 'Cancel' ? null : 'suspense');
        });
        if (action === 'Back') {
          cy.get(Mci.continueButton).click();
        } else {
          cy.get(Mci.addPaymentButton).click();
          cy.get('@finesMciStore').then((store) =>
            (store as InstanceType<typeof FinesMciStore>).setSuspensePayment(PAYMENT),
          );
          cy.get(Mci.paymentCategoryRadio('suspense')).check();
          cy.get(Mci.continueButton).click();
          cy.get(Mci.continueButton).click();
        }
        cy.get(Mci.payerType('individual')).should('not.be.checked');
        selectType('individual');
        ['firstNames', 'lastName', 'addressLine1'].forEach((field) =>
          cy.get(Mci.payerField(field)).should('have.value', ''),
        );
      },
    );
  });

  it('checks accessibility for initial, individual, company and validation states', { tags: TAGS }, () => {
    openPayer();
    cy.document().then((document) => {
      document.documentElement.lang = 'en';
    });
    cy.injectAxe({ axeCorePath: 'node_modules/axe-core/axe.min.js' });
    const check = (): void => {
      cy.checkA11y(Mci.payerPage, {
        includedImpacts: ['critical', 'serious', 'moderate'],
        rules: { 'aria-allowed-attr': { enabled: false } },
      });
    };
    check();
    selectType('individual');
    check();
    cy.get(Mci.continueButton).click();
    check();
    selectType('company');
    check();
    cy.get(Mci.continueButton).click();
    check();
  });
});
