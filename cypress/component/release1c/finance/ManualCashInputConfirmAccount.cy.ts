import { of } from 'rxjs';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { MCI_CONFIRM_COMPANY_MOCK, MCI_CONFIRM_INDIVIDUAL_MOCK } from './mocks/manual-cash-input-confirm-account.mock';
import { openMciAccount, MCI_CRIMINAL_URL, mciAccountHeader, mciSearchAccount } from './setup/SetupMciAccount';

const TAGS = ['@JIRA-STORY:PO-3530', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];

const BUSINESS_UNIT = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
const assertValue = (row: string, expected: string): void => {
  cy.get(Mci.account.value(row)).should(($value) => {
    expect($value.text().replace(/\s+/g, ' ').trim()).to.equal(expected);
  });
};

describe('Manual Cash Input - Confirm account summary', () => {
  it('(AC1, AC1b, AC2) displays fresh individual details instead of stale search/header data', { tags: TAGS }, () => {
    const details = structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK);
    openMciAccount(details, {
      configureService: (service) => {
        // Deliberately disagree with the fresh details to prove which source the screen uses.
        const staleResult = {
          ...mciSearchAccount(details),
          defendant_firstnames: 'Previous',
          defendant_surname: 'Name',
          account_balance: 9876,
        };
        (service.getDefendantAccounts as sinon.SinonStub).returns(of({ count: 1, defendant_accounts: [staleResult] }));
        (service.getDefendantAccountHeadingData as sinon.SinonStub).returns(
          of(mciAccountHeader({ ...details, account_status_code: 'WO', account_balance: 0 })),
        );
      },
    });

    cy.get(Mci.account.heading).should('have.text', 'Confirm account');
    cy.get(Mci.account.businessUnit).should('have.text', BUSINESS_UNIT.business_unit_name);
    cy.get(Mci.account.warning).should('not.exist');
    assertValue('account-number', '130001BU');
    assertValue('name', 'Ms Alex Morgan EXAMPLE');
    assertValue('aliases', 'First EXAMPLE Second ALIAS');
    cy.get(Mci.account.value('aliases')).find('br').should('have.length', 1);
    assertValue('date-of-birth', '03 February 1980');
    assertValue('address', '1 Example Street Example District Example Town AB1 2CD');
    cy.get(Mci.account.value('address')).find('br').should('have.length', 3);
    assertValue('balance', '£1,234.56');
    assertValue('enforcement-action', 'Warrant Issued (EA-001)');
    assertValue('payment-terms', 'By date');
    assertValue('pay-by-date', '15 December 2026');
    cy.get(Mci.account.value('frequency')).should('not.exist');
    cy.get(Mci.account.value('instalments')).should('not.exist');
    cy.get(Mci.account.value('start-date')).should('not.exist');
    assertValue('comments', 'Account reviewed. First note. Second note. Third note.');
    cy.get(Mci.account.value('comments')).find('br').should('have.length', 3);
    cy.get(Mci.account.confirm).should('be.visible').and('be.enabled');
  });

  it('(AC2) displays company details and ordered trading names without a date of birth', { tags: TAGS }, () => {
    openMciAccount(structuredClone(MCI_CONFIRM_COMPANY_MOCK));

    cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/account/1/company`);
    assertValue('name', 'Example Trading Ltd');
    assertValue('aliases', 'First Trading Name Second Trading Name');
    cy.get(Mci.account.value('aliases')).find('br').should('have.length', 1);
    cy.get(Mci.account.value('date-of-birth')).should('not.exist');
    cy.get(Mci.account.confirm).should('be.enabled');
  });

  it('(AC2a) displays em dashes for missing optional details', { tags: TAGS }, () => {
    const details = structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK);
    details.party_details.individual_details!.individual_aliases = [];
    details.party_details.individual_details!.date_of_birth = null;
    details.address = {
      address_line_1: '',
      address_line_2: null,
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      postcode: null,
    };
    details.enforcement_status.last_enforcement_action = null;
    details.payment_terms.effective_date = null;
    details.comments_and_notes = null;
    openMciAccount(details);

    ['aliases', 'date-of-birth', 'address', 'enforcement-action', 'pay-by-date', 'comments'].forEach((row) =>
      assertValue(row, '—'),
    );
    cy.get(Mci.account.confirm).should('be.enabled');
  });

  (
    [
      { description: 'instalments', code: 'I', displayName: 'Instalments', lumpSum: null },
      { description: 'lump sum plus instalments', code: 'B', displayName: 'Lump sum plus instalments', lumpSum: 100 },
    ] as const
  ).forEach(({ description, code, displayName, lumpSum }) => {
    it(`(AC2) displays frequency, amount and start date for ${description}`, { tags: TAGS }, () => {
      const details = structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK);
      details.payment_terms = {
        payment_terms_type: { payment_terms_type_code: code, payment_terms_type_display_name: 'Instalments' },
        effective_date: '15/12/2026',
        lump_sum_amount: lumpSum,
        instalment_amount: 25.5,
        instalment_period: { instalment_period_code: 'M', instalment_period_display_name: 'Monthly' },
      };
      openMciAccount(details);

      assertValue('payment-terms', displayName);
      assertValue('frequency', 'Monthly');
      assertValue('instalments', '£25.50');
      assertValue('start-date', '15 December 2026');
      cy.get(Mci.account.value('pay-by-date')).should('not.exist');
    });
  });

  it('(AC2a) displays em dashes for missing instalment frequency, amount and start date', { tags: TAGS }, () => {
    const details = structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK);
    details.payment_terms.effective_date = null;
    details.payment_terms.payment_terms_type = {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'Instalments',
    };
    openMciAccount(details);

    assertValue('frequency', '—');
    assertValue('instalments', '—');
    assertValue('start-date', '—');
  });
});

describe('Manual Cash Input - Confirm account navigation', () => {
  it('(AC3) confirms the selected account and opens criminal payment details', { tags: TAGS }, () => {
    openMciAccount();
    cy.get(Mci.account.confirm).click();

    cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/payment-details/1`);
    cy.contains('h1', 'Payment details').should('be.visible');
    cy.get('@finesMciStore').then((store) => {
      expect((store as InstanceType<typeof FinesMciStore>).selectedCriminalAccount()?.defendant_account_id).to.equal(1);
    });
  });

  it('(AC11) returns to the retained search results without repeating the search', { tags: TAGS }, () => {
    openMciAccount();
    cy.get('@getDefendantAccounts')
      .its('callCount')
      .then((searchCalls) => {
        cy.get(Mci.backLink).click();

        cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/matches`);
        cy.get(Mci.searchResults.accountNumbers).should('have.length', 1).and('contain.text', '130001BU');
        cy.get('@getDefendantAccounts').its('callCount').should('eq', searchCalls);
      });
    cy.get(Mci.searchResults.accountCheckbox(1)).check();
    cy.get(Mci.searchResults.continue).click();
    cy.get(Mci.account.heading).should('have.text', 'Confirm account');
    cy.get('@getAtAGlance').should('have.been.calledTwice');
  });

  it('(AC12) links the selected account to enquiry in a new tab', { tags: TAGS }, () => {
    openMciAccount();

    cy.get(Mci.account.enquiryLink)
      .should('be.visible')
      .and('contain.text', 'view the account in a new tab')
      .and('have.attr', 'href', '/fines/account/defendant/1/details')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it('(AC13) cancels the payment, clears search state and retains the till and business unit', { tags: TAGS }, () => {
    openMciAccount();
    cy.get('@finesMciStore').then((store) => {
      const mciStore = store as InstanceType<typeof FinesMciStore>;
      expect(mciStore.criminalSearch()).not.to.be.null;
      expect(mciStore.criminalSearchResults()).not.to.be.null;
      expect(mciStore.draftJourney()).to.equal('criminal');
      const tills = structuredClone(mciStore.tills());
      cy.get(Mci.account.cancel).click();

      cy.get('@financeRouter').its('url').should('eq', '/fines/manual-cash-input/create/till/details');
      cy.get(Mci.tillDetails).should('be.visible');
      cy.then(() => {
        expect(mciStore.criminalSearch()).to.be.null;
        expect(mciStore.criminalSearchResults()).to.be.null;
        expect(mciStore.selectedCriminalAccount()).to.be.null;
        expect(mciStore.selectedCriminalAccountAtAGlance()).to.be.null;
        expect(mciStore.selectedCriminalAccountHeader()).to.be.null;
        expect(mciStore.draftJourney()).to.be.null;
        expect(mciStore.businessUnit()).to.deep.equal(BUSINESS_UNIT);
        expect(mciStore.tills()).to.deep.equal(tills);
      });
    });
  });
});

describe('PO-3532 - Manual Cash Input Payment Details', () => {
  const openPaymentDetails = (): void => {
    const account = structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK);
    account.account_balance = -1234.56;
    openMciAccount(account);
    cy.get(Mci.account.confirm).click();
    cy.get(Mci.criminalPaymentDetails.page).should('be.visible');
  };
  const completeRequiredPaymentFields = (method?: string, payer = 'defendant', source = 'allpay'): void => {
    cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
    cy.get(Mci.criminalPaymentDetails.payerRadio(payer)).check({ force: true });
    if (method) {
      cy.get(Mci.criminalPaymentDetails.methodRadio(method)).check({ force: true });
      if (method === 'creditTransfer') cy.get(Mci.criminalPaymentDetails.sourceRadio(source)).check({ force: true });
    }
  };
  const assertPaymentDetailsRemainsOpen = (): void => {
    cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/payment-details/1`);
    cy.get(Mci.criminalPaymentDetails.heading).should('have.text', 'Payment details');
  };
  const MCI_TILL_DETAILS_URL = '/fines/manual-cash-input/create/till/details';
  const UNSAVED_CHANGES_WARNING =
    'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
  const assertRadioOptionIsVisible = (selector: string): void => {
    cy.get(selector).parents('.govuk-radios__item').should('be.visible');
  };
  const assertErrorSummaryLinkFocus = (message: string, fieldId: string): void => {
    cy.get(Mci.errorSummary).contains('a', message).click();
    cy.focused().should('have.id', fieldId);
  };

  const paymentReferences = [
    {
      method: 'postalOrder',
      field: 'paymentReferencePostalOrder',
      input: Mci.criminalPaymentDetails.postalOrderReference,
    },
    { method: 'cheque', field: 'paymentReferenceCheque', input: Mci.criminalPaymentDetails.chequeReference },
    {
      method: 'creditTransfer',
      field: 'paymentReferenceCreditTransfer',
      input: Mci.criminalPaymentDetails.creditTransferReference,
    },
  ] as const;

  it(
    '(AC1, AC1ai) confirms an account and displays Payment Details with the selected business unit',
    {
      tags: ['@JIRA-STORY:PO-3532', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'],
    },
    () => {
      openPaymentDetails();

      cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/payment-details/1`);
      cy.get(Mci.criminalPaymentDetails.heading).should('have.text', 'Payment details');
      cy.get(Mci.criminalPaymentDetails.businessUnit).should('have.text', BUSINESS_UNIT.business_unit_name);
      cy.get('@finesMciStore').then((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).selectedCriminalAccount()?.defendant_account_id).to.equal(
          1,
        );
      });
    },
  );

  it(
    '(AC2) displays the payment fields and reveals only fields relevant to the selected options',
    {
      tags: ['@JIRA-STORY:PO-3532', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'],
    },
    () => {
      openPaymentDetails();

      cy.get(Mci.criminalPaymentDetails.amount).should('be.visible').and('have.attr', 'inputmode', 'decimal');
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.payerRadio('defendant'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.payerRadio('thirdParty'));
      cy.get(Mci.criminalPaymentDetails.thirdPartyName).should('not.be.visible');
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.methodRadio('notesCoins'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.methodRadio('postalOrder'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.methodRadio('cheque'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.methodRadio('creditTransfer'));
      cy.get(Mci.criminalPaymentDetails.postalOrderReference).should('not.be.visible');
      cy.get(Mci.criminalPaymentDetails.chequeReference).should('not.be.visible');
      cy.get(Mci.criminalPaymentDetails.creditTransferReference).should('not.be.visible');
      cy.get(Mci.criminalPaymentDetails.sourceRadio('allpay')).should('not.be.visible');

      cy.get(Mci.criminalPaymentDetails.payerRadio('thirdParty')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.thirdPartyName).should('be.visible');

      cy.get(Mci.criminalPaymentDetails.methodRadio('postalOrder')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.postalOrderReference).should('be.visible');
      cy.get(Mci.criminalPaymentDetails.chequeReference).should('not.be.visible');
      cy.get(Mci.criminalPaymentDetails.creditTransferReference).should('not.be.visible');

      cy.get(Mci.criminalPaymentDetails.methodRadio('cheque')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.chequeReference).should('be.visible');
      cy.get(Mci.criminalPaymentDetails.postalOrderReference).should('not.be.visible');

      cy.get(Mci.criminalPaymentDetails.methodRadio('creditTransfer')).check({ force: true });
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.sourceRadio('allpay'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.sourceRadio('NatWest'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.sourceRadio('British Telecom'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.sourceRadio('Barclaycard'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.sourceRadio('DWP/AEA'));
      assertRadioOptionIsVisible(Mci.criminalPaymentDetails.sourceRadio('Other'));
      cy.get(Mci.criminalPaymentDetails.creditTransferReference).should('be.visible');
    },
  );

  it(
    '(AC2) limits the amount to 18 digits before the decimal and two after',
    {
      tags: ['@JIRA-STORY:PO-3532', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.payerRadio('defendant')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.methodRadio('notesCoins')).check({ force: true });

      cy.get(Mci.criminalPaymentDetails.amount).type('1234567890123456789.12');
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.amountError).should(
        'have.text',
        'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after.',
      );
      assertPaymentDetailsRemainsOpen();

      cy.get(Mci.criminalPaymentDetails.amount).clear().type('1.234');
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.amountError).should(
        'have.text',
        'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after.',
      );
      assertPaymentDetailsRemainsOpen();
    },
  );

  it(
    '(AC3) displays the exact overpayment when the entered amount exceeds the account balance',
    {
      tags: ['@JIRA-STORY:PO-3532', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'],
    },
    () => {
      openPaymentDetails();

      cy.get(Mci.criminalPaymentDetails.overpayment).should('not.exist');
      cy.get(Mci.criminalPaymentDetails.amount).type('1234.56');
      cy.get(Mci.criminalPaymentDetails.overpayment).should('not.exist');

      cy.get(Mci.criminalPaymentDetails.amount).clear().type('1250.00');
      cy.get(Mci.criminalPaymentDetails.overpayment)
        .should('be.visible')
        .and('contain.text', 'This amount contains a £15.44 overpayment.');
    },
  );

  it(
    '(AC4a, AC4b) requires a numeric amount and keeps the user on Payment Details when it is missing or invalid',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC4a',
        '@AC4b',
      ],
    },
    () => {
      openPaymentDetails();
      const paymentDetailsUrl = `${MCI_CRIMINAL_URL}/payment-details/1`;

      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.amountError).should('have.text', 'Enter amount');
      cy.get('@financeRouter').its('url').should('eq', paymentDetailsUrl);
      cy.get(Mci.criminalPaymentDetails.heading).should('have.text', 'Payment details');

      cy.get(Mci.criminalPaymentDetails.amount).type('12x');
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.amountError).should('have.text', 'Enter only numbers and decimals');
      cy.get('@financeRouter').its('url').should('eq', paymentDetailsUrl);
      cy.get(Mci.criminalPaymentDetails.heading).should('have.text', 'Payment details');
    },
  );

  it(
    '(AC4a, AC4b) rejects a negative payment amount and does not show an overpayment',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC4a',
        '@AC4b',
      ],
    },
    () => {
      openPaymentDetails();

      cy.get(Mci.criminalPaymentDetails.amount).type('-10');
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.amountError).should('have.text', 'Amount cannot be a negative value');
      cy.get(Mci.criminalPaymentDetails.overpayment).should('not.exist');
      assertPaymentDetailsRemainsOpen();
    },
  );

  it(
    '(AC5a) requires the user to select who the payment was received from',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC5a',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
      cy.get(Mci.criminalPaymentDetails.methodRadio('notesCoins')).check({ force: true });
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.payerError)
        .should('be.visible')
        .and('contain.text', 'Select who the payment was received from');
      assertPaymentDetailsRemainsOpen();
    },
  );

  it(
    '(AC5b) requires a name when the payment is received from a third party',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC5b',
      ],
    },
    () => {
      openPaymentDetails();
      completeRequiredPaymentFields('notesCoins', 'thirdParty');
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.thirdPartyNameError).should('have.text', 'Enter name');
      assertPaymentDetailsRemainsOpen();
    },
  );

  it(
    '(AC5c, AC5d) validates the third-party name characters and 50-character limit',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC5c',
        '@AC5d',
      ],
    },
    () => {
      openPaymentDetails();
      completeRequiredPaymentFields('notesCoins', 'thirdParty');
      cy.get(Mci.criminalPaymentDetails.thirdPartyName).type('Payer@123');
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.thirdPartyNameError).should(
        'have.text',
        'Name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      );
      assertPaymentDetailsRemainsOpen();

      cy.get(Mci.criminalPaymentDetails.thirdPartyName).clear().type('A'.repeat(51));
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.thirdPartyNameError).should('have.text', 'Name must be 50 characters or fewer');
      assertPaymentDetailsRemainsOpen();
    },
  );

  paymentReferences.forEach(({ method }) => {
    it(
      `(AC6) allows the optional ${method} reference to be left blank`,
      {
        tags: [
          '@JIRA-STORY:PO-3532',
          '@JIRA-LABEL:manual-cash-input',
          '@JIRA-EPIC:PO-2439',
          '@R1CFinancialMovements',
          '@AC6',
        ],
      },
      () => {
        openPaymentDetails();
        completeRequiredPaymentFields(method);
        cy.get(Mci.continueButton).click();

        cy.get('@financeRouter').its('url').should('eq', '/fines/manual-cash-input/create/till/check-payment');
        cy.contains('h1', 'Check payment').should('be.visible');
      },
    );
  });

  it(
    '(AC6a) requires a method of payment',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC6a',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
      cy.get(Mci.criminalPaymentDetails.payerRadio('defendant')).check({ force: true });
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.methodError)
        .should('be.visible')
        .and('contain.text', 'Select a method of payment');
      assertPaymentDetailsRemainsOpen();
    },
  );

  it(
    '(AC6b) requires a source for credit transfer',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC6b',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
      cy.get(Mci.criminalPaymentDetails.payerRadio('defendant')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.methodRadio('creditTransfer')).check({ force: true });
      cy.get(Mci.continueButton).click();

      cy.get(Mci.criminalPaymentDetails.sourceError).should('be.visible').and('contain.text', 'Select a source');
      assertPaymentDetailsRemainsOpen();
    },
  );

  paymentReferences.forEach(({ method, field, input }) => {
    it(
      `(AC6c, AC6d) validates ${method} reference characters and the 50-character limit`,
      {
        tags: [
          '@JIRA-STORY:PO-3532',
          '@JIRA-LABEL:manual-cash-input',
          '@JIRA-EPIC:PO-2439',
          '@R1CFinancialMovements',
          '@AC6c',
          '@AC6d',
        ],
      },
      () => {
        openPaymentDetails();
        completeRequiredPaymentFields(method);
        cy.get(input).type('Ref@123');
        cy.get(Mci.continueButton).click();

        cy.get(Mci.criminalPaymentDetails.referenceError(field)).should(
          'have.text',
          'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
        );
        assertPaymentDetailsRemainsOpen();

        cy.get(input).clear().type('A'.repeat(51));
        cy.get(Mci.continueButton).click();

        cy.get(Mci.criminalPaymentDetails.referenceError(field)).should(
          'have.text',
          'Payment reference must be 50 characters or fewer',
        );
        assertPaymentDetailsRemainsOpen();
      },
    );
  });

  it(
    '(AC7) continues to Check Payment when all payment details are valid',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC7',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
      cy.get(Mci.criminalPaymentDetails.payerRadio('thirdParty')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.thirdPartyName).type("Payer-1 O'Brien");
      cy.get(Mci.criminalPaymentDetails.methodRadio('creditTransfer')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.sourceRadio('allpay')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.creditTransferReference).type('Transfer-123');
      cy.get(Mci.continueButton).click();

      cy.get('@financeRouter').its('url').should('eq', '/fines/manual-cash-input/create/till/check-payment');
      cy.contains('h1', 'Check payment').should('be.visible');
      cy.get('@finesMciStore').then((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).criminalPayment()).to.deep.equal({
          amount: '25.00',
          payerType: 'thirdParty',
          thirdPartyName: "Payer-1 O'Brien",
          methodOfPayment: 'creditTransfer',
          paymentReferencePostalOrder: '',
          paymentReferenceCheque: '',
          paymentReferenceCreditTransfer: 'Transfer-123',
          source: 'allpay',
        });
      });
    },
  );

  it(
    '(AC8) returns to Confirm Account when Back is selected on an untouched form',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC8',
      ],
    },
    () => {
      openPaymentDetails();
      cy.window().then((window) => cy.stub(window, 'confirm').as('backNavigationConfirm'));

      cy.get(Mci.backLink).click();

      cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/account/1/individual`);
      cy.get(Mci.account.heading).should('have.text', 'Confirm account');
      cy.get('@backNavigationConfirm').should('not.have.been.called');
    },
  );

  it(
    '(AC8a, AC8ai, AC8aii) warns before Back and either retains or discards entered data',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC8a',
        '@AC8ai',
        '@AC8aii',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
      cy.window().then((window) => {
        const confirm = cy.stub(window, 'confirm');
        confirm.onFirstCall().returns(false);
        confirm.onSecondCall().returns(true);
        cy.wrap(confirm).as('backNavigationConfirm');
      });

      cy.get(Mci.backLink).click();

      cy.get('@backNavigationConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_WARNING);
      assertPaymentDetailsRemainsOpen();
      cy.get(Mci.criminalPaymentDetails.amount).should('have.value', '25.00');

      cy.get(Mci.backLink).click();

      cy.get('@backNavigationConfirm')
        .should('have.been.calledTwice')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_WARNING);
      cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/account/1/individual`);
      cy.get(Mci.account.heading).should('have.text', 'Confirm account');
      cy.get('@finesMciStore').then((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).criminalPayment()).to.be.null;
      });
    },
  );

  it(
    '(AC9) cancels an untouched payment and returns to Till Details without a warning',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC9',
      ],
    },
    () => {
      openPaymentDetails();
      cy.window().then((window) => cy.stub(window, 'confirm').as('cancelNavigationConfirm'));

      cy.get(Mci.criminalPaymentDetails.cancelLink).click();

      cy.get('@financeRouter').its('url').should('eq', MCI_TILL_DETAILS_URL);
      cy.get(Mci.tillDetails).should('be.visible');
      cy.get('@cancelNavigationConfirm').should('not.have.been.called');
    },
  );

  it(
    '(AC9a, AC9ai, AC9aii) warns before Cancel and either retains or discards entered data',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC9a',
        '@AC9ai',
        '@AC9aii',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
      cy.window().then((window) => {
        const confirm = cy.stub(window, 'confirm');
        confirm.onFirstCall().returns(false);
        confirm.onSecondCall().returns(true);
        cy.wrap(confirm).as('cancelNavigationConfirm');
      });

      cy.get(Mci.criminalPaymentDetails.cancelLink).click();

      cy.get('@cancelNavigationConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_WARNING);
      assertPaymentDetailsRemainsOpen();
      cy.get(Mci.criminalPaymentDetails.amount).should('have.value', '25.00');

      cy.get(Mci.criminalPaymentDetails.cancelLink).click();

      cy.get('@cancelNavigationConfirm')
        .should('have.been.calledTwice')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_WARNING);
      cy.get('@financeRouter').its('url').should('eq', MCI_TILL_DETAILS_URL);
      cy.get(Mci.tillDetails).should('be.visible');
      cy.get('@finesMciStore').then((store) => {
        const mciStore = store as InstanceType<typeof FinesMciStore>;
        expect(mciStore.criminalPayment()).to.be.null;
        expect(mciStore.draftJourney()).to.be.null;
        expect(mciStore.criminalSearch()).to.be.null;
        expect(mciStore.criminalSearchResults()).to.be.null;
      });
    },
  );

  it(
    '(AC10a EMAC1) links validation summary messages to their fields and focuses the selected field',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC10a',
        '@EMAC1',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.continueButton).click();

      cy.get(Mci.errorSummary).should('be.visible').and('contain.text', 'Enter amount');
      cy.get(Mci.errorSummaryTitle).should('have.text', 'There is a problem');
      assertErrorSummaryLinkFocus('Enter amount', 'amount');
      assertErrorSummaryLinkFocus('Select who the payment was received from', 'payerType-criminal-payer-defendant');
      assertErrorSummaryLinkFocus('Select a method of payment', 'methodOfPayment-criminal-method-notes-coins');

      cy.get(Mci.criminalPaymentDetails.payerRadio('thirdParty')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.methodRadio('creditTransfer')).check({ force: true });
      cy.get(Mci.continueButton).click();

      cy.get(Mci.errorSummary).should('contain.text', 'Enter name').and('contain.text', 'Select a source');
      assertErrorSummaryLinkFocus('Enter name', 'thirdPartyName');
      assertErrorSummaryLinkFocus('Select a source', 'source-allpay');

      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
      cy.get(Mci.criminalPaymentDetails.thirdPartyName).type('Payer 1');
      cy.get(Mci.criminalPaymentDetails.sourceRadio('allpay')).check({ force: true });
      cy.get(Mci.criminalPaymentDetails.creditTransferReference).type('Ref@123');
      cy.get(Mci.continueButton).click();

      cy.get(Mci.errorSummary).should('contain.text', 'Payment reference must only include letters');
      assertErrorSummaryLinkFocus(
        'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
        'paymentReferenceCreditTransfer',
      );
    },
  );

  it(
    '(AC10b RGAC1) protects entered payment details during route changes',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC10b',
        '@RGAC1',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');
      cy.window().then((window) => {
        const confirm = cy.stub(window, 'confirm');
        confirm.onFirstCall().returns(false);
        confirm.onSecondCall().returns(true);
        cy.wrap(confirm).as('routeChangeConfirm');
      });

      cy.get('@financeRouter')
        .then((router) =>
          (router as { navigateByUrl: (url: string) => Promise<boolean> }).navigateByUrl(MCI_TILL_DETAILS_URL),
        )
        .should('be.false');
      cy.get('@routeChangeConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_WARNING);
      assertPaymentDetailsRemainsOpen();
      cy.get(Mci.criminalPaymentDetails.amount).should('have.value', '25.00');

      cy.get('@financeRouter')
        .then((router) =>
          (router as { navigateByUrl: (url: string) => Promise<boolean> }).navigateByUrl(MCI_TILL_DETAILS_URL),
        )
        .should('be.true');
      cy.get('@routeChangeConfirm').should('have.been.calledTwice');
      cy.get('@financeRouter').its('url').should('eq', MCI_TILL_DETAILS_URL);
    },
  );

  it(
    '(AC10b RGAC2, RGAC3) protects entered payment details from browser exit and refresh',
    {
      tags: [
        '@JIRA-STORY:PO-3532',
        '@JIRA-LABEL:manual-cash-input',
        '@JIRA-EPIC:PO-2439',
        '@R1CFinancialMovements',
        '@AC10b',
        '@RGAC2',
        '@RGAC3',
      ],
    },
    () => {
      openPaymentDetails();
      cy.get(Mci.criminalPaymentDetails.amount).type('25.00');

      cy.window().then((window) => {
        const browserExitEvent = new Event('beforeunload', { cancelable: true });
        const refreshEvent = new Event('beforeunload', { cancelable: true });

        expect(window.dispatchEvent(browserExitEvent), 'browser-exit warning').to.be.false;
        expect(browserExitEvent.defaultPrevented, 'browser exit is prevented').to.be.true;
        expect(window.dispatchEvent(refreshEvent), 'refresh warning').to.be.false;
        expect(refreshEvent.defaultPrevented, 'refresh is prevented').to.be.true;
      });

      assertPaymentDetailsRemainsOpen();
      cy.get(Mci.criminalPaymentDetails.amount).should('have.value', '25.00');
    },
  );
});
