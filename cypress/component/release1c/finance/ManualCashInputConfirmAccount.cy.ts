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
