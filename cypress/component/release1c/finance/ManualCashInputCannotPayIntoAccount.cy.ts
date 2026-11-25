import { of } from 'rxjs';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { MCI_CONFIRM_INDIVIDUAL_MOCK, MCI_CONFIRM_COMPANY_MOCK } from './mocks/manual-cash-input-confirm-account.mock';
import { MCI_CRIMINAL_URL, openMciAccount, mciAccountHeader, mciSearchAccount } from './setup/SetupMciAccount';

const TAGS = ['@JIRA-STORY:PO-3530', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const PO_3682_TAGS = [
  '@JIRA-STORY:PO-3682',
  '@JIRA-LABEL:manual-cash-input',
  '@JIRA-EPIC:PO-2660',
  '@R1CFinancialMovements',
];
const BUSINESS_UNIT = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
const INHIBITED_BU = {
  ...BUSINESS_UNIT,
  configuration_items: [{ item_name: 'RESULTS_TO_INHIBIT_PAYMENTS', item_value: null, item_values: ['EA-001'] }],
};
const REQUIRED_CHOICE = 'Select whether to pay into the live account or into suspense';
const RESTRICTIONS = [
  { ac: 'AC5b', reason: 'written off', status: 'WO', balance: 100, warning: 'Account has been written off in full' },
  { ac: 'AC5c', reason: 'zero balance', status: 'L', balance: 0, warning: 'Account has a zero balance' },
  {
    ac: 'AC5e',
    reason: 'transfer not acknowledged',
    status: 'TO',
    balance: 100,
    warning: 'Account has been transferred out',
  },
  {
    ac: 'AC5f',
    reason: 'transfer acknowledged',
    status: 'TA',
    balance: 100,
    warning: 'Account has been transferred out',
  },
  {
    ac: 'AC5g',
    reason: 'transfer to Scotland/NI',
    status: 'TS',
    balance: 100,
    warning: 'Account has been transferred out',
  },
  {
    ac: 'AC5d',
    reason: 'inhibited enforcement',
    status: 'L',
    balance: 100,
    warning: 'Account is subject to inhibit related enforcement actions: Warrant Issued (EA-001)',
    inhibited: true,
  },
];
const childAccount = () => ({ ...structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK), account_status_code: 'CS' });
const masterAccount = () => ({
  ...structuredClone(MCI_CONFIRM_COMPANY_MOCK),
  defendant_account_id: '2',
  account_number: '130002BU',
});

const assertRestricted = (warning: string): void => {
  cy.get(Mci.account.heading).should('have.text', 'You cannot pay into this account');
  cy.get(Mci.account.warning).should('be.visible').and('contain.text', warning);
  cy.get(Mci.account.businessUnit).should('have.text', BUSINESS_UNIT.business_unit_name);
  cy.get(Mci.account.confirm).should('not.exist');
};

const chooseMaster = (): void => {
  cy.get(Mci.account.masterRadio).check();
  cy.get(Mci.account.continue).click();
};

describe('Manual Cash Input - Non-consolidated restrictions', () => {
  RESTRICTIONS.forEach(({ ac, reason, status, balance, warning, inhibited }) => {
    it(`(AC4, ${ac}, AC6, AC10) blocks ${reason} and offers suspense`, { tags: TAGS }, () => {
      openMciAccount(
        { ...structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK), account_status_code: status, account_balance: balance },
        { businessUnit: inhibited ? INHIBITED_BU : BUSINESS_UNIT },
      );

      assertRestricted(warning);
      Object.entries({
        'account-number': '130001BU',
        name: 'Ms Alex Morgan EXAMPLE',
        aliases: 'First EXAMPLE Second ALIAS',
        'date-of-birth': '03 February 1980',
        address: '1 Example Street Example District Example Town AB1 2CD',
        balance: balance === 0 ? '£0.00' : '£100.00',
        'enforcement-action': 'Warrant Issued (EA-001)',
        'payment-terms': 'By date',
        'pay-by-date': '15 December 2026',
        comments: 'Account reviewed. First note. Second note. Third note.',
      }).forEach(([row, expected]) => {
        cy.get(Mci.account.value(row)).should(($value) => {
          expect($value.text().replace(/\s+/g, ' ').trim()).to.equal(expected);
        });
      });
      cy.get(Mci.account.enquiryLink)
        .should('have.attr', 'href', '/fines/account/defendant/1/details')
        .and('have.attr', 'target', '_blank')
        .and('have.attr', 'rel', 'noopener noreferrer');
      cy.get(Mci.account.suspense).should('be.visible');
      cy.get(Mci.account.nextSteps).should('not.exist');
      cy.get(Mci.account.suspense).click();
      cy.get('@financeRouter').its('url').should('eq', '/fines/manual-cash-input/create/till/suspense-details');
    });
  });

  it('(AC5c) blocks a fresh zero balance when search and header balances are positive', { tags: TAGS }, () => {
    const fresh = { ...structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK), account_balance: 0 };
    openMciAccount(fresh, {
      configureService: (service) => {
        const stale = { ...fresh, account_balance: 100 };
        (service.getDefendantAccounts as sinon.SinonStub).returns(
          of({ count: 1, defendant_accounts: [mciSearchAccount(stale)] }),
        );
        (service.getDefendantAccountHeadingData as sinon.SinonStub).returns(of(mciAccountHeader(stale)));
      },
    });
    assertRestricted('Account has a zero balance');
    cy.get(Mci.account.value('balance')).should('contain.text', '£0.00');
  });

  it('(AC5d) permits a last action that only partially matches an inhibited code', { tags: TAGS }, () => {
    openMciAccount(structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK), {
      businessUnit: {
        ...BUSINESS_UNIT,
        configuration_items: [{ item_name: 'RESULTS_TO_INHIBIT_PAYMENTS', item_value: null, item_values: ['EA-0010'] }],
      },
    });
    cy.get(Mci.account.heading).should('have.text', 'Confirm account');
    cy.get(Mci.account.warning).should('not.exist');
    cy.get(Mci.account.confirm).should('be.enabled');
  });

  it('(AC6a) retains em dashes for missing optional data on a restricted account', { tags: TAGS }, () => {
    const details = {
      ...structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK),
      account_status_code: 'WO',
      comments_and_notes: null,
    };
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
    openMciAccount(details);
    assertRestricted('Account has been written off in full');
    ['aliases', 'date-of-birth', 'address', 'enforcement-action', 'pay-by-date', 'comments'].forEach((row) =>
      cy
        .get(Mci.account.value(row))
        .invoke('text')
        .should('match', /^\s*—\s*$/),
    );
  });
});

describe('Manual Cash Input - Consolidated next steps and master', () => {
  it('(AC5a, AC7) shows only the two unselected child options', { tags: TAGS }, () => {
    openMciAccount(childAccount());
    assertRestricted('Account has been consolidated.');
    cy.get(Mci.account.masterRadio).should('not.be.checked');
    cy.get(Mci.account.suspenseRadio).should('not.be.checked');
    cy.get(Mci.account.nextSteps).find('input[type="radio"]').should('have.length', 2);
    cy.get(Mci.account.nextSteps)
      .should('contain.text', 'Pay into the live (master) account')
      .and('contain.text', 'Pay into suspense');
    cy.get(Mci.account.suspense).should('not.exist');
  });

  it('(AC7b) validates, focuses the summary, links to the choice and clears the error', { tags: TAGS }, () => {
    openMciAccount(childAccount());
    cy.get(Mci.account.continue).click();
    cy.get(Mci.account.errorSummary).should('be.visible').and('contain.text', REQUIRED_CHOICE).and('have.focus');
    cy.get(Mci.account.errorLink).should(($link) => {
      expect($link.text().trim()).to.equal(REQUIRED_CHOICE);
    });
    cy.get(Mci.account.inlineError).should('contain.text', REQUIRED_CHOICE);
    cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/account/1/individual`);
    cy.get('@getMaster').should('not.have.been.called');
    cy.get(Mci.account.errorLink).click();
    cy.get(Mci.account.masterRadio).should('have.focus').check();
    cy.get(Mci.account.errorSummary).should('not.exist');
    cy.get(Mci.account.inlineError).should('not.exist');
  });

  it('(AC9) opens Suspense Details for the child suspense choice without loading a master', { tags: TAGS }, () => {
    openMciAccount(childAccount());
    cy.get(Mci.account.suspenseRadio).check();
    cy.get(Mci.account.continue).click();
    cy.get('@financeRouter').its('url').should('eq', '/fines/manual-cash-input/create/till/suspense-details');
    cy.get('@getMaster').should('not.have.been.called');
  });

  it(
    '(AC1a) clears criminal payment data from memory when a consolidated child continues to suspense',
    { tags: PO_3682_TAGS },
    () => {
      openMciAccount(childAccount());
      cy.get(Mci.account.suspenseRadio).check();
      cy.get(Mci.account.continue).click();
      cy.get('@financeRouter').its('url').should('eq', '/fines/manual-cash-input/create/till/suspense-details');
      cy.get('@finesMciStore').should((store) => {
        const state = store as InstanceType<typeof FinesMciStore>;
        expect(state.criminalSearch()).to.be.null;
        expect(state.criminalSearchResults()).to.be.null;
        expect(state.selectedCriminalAccount()).to.be.null;
        expect(state.selectedCriminalAccountAtAGlance()).to.be.null;
        expect(state.selectedCriminalAccountHeader()).to.be.null;
        expect(state.draftJourney()).to.equal('suspense');
      });
      cy.get('@getMaster').should('not.have.been.called');
    },
  );

  it(
    '(AC2a) clears criminal payment data from memory when a restricted account continues to suspense',
    { tags: PO_3682_TAGS },
    () => {
      openMciAccount({ ...structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK), account_status_code: 'WO' });
      cy.get(Mci.account.suspense).click();
      cy.get('@financeRouter').its('url').should('eq', '/fines/manual-cash-input/create/till/suspense-details');
      cy.get('@finesMciStore').should((store) => {
        const state = store as InstanceType<typeof FinesMciStore>;
        expect(state.criminalSearch()).to.be.null;
        expect(state.criminalSearchResults()).to.be.null;
        expect(state.selectedCriminalAccount()).to.be.null;
        expect(state.selectedCriminalAccountAtAGlance()).to.be.null;
        expect(state.selectedCriminalAccountHeader()).to.be.null;
        expect(state.draftJourney()).to.equal('suspense');
      });
      cy.get('@getMaster').should('not.have.been.called');
    },
  );

  it(
    '(AC3, AC8a, AC12) replaces child details with an eligible company master and confirms its ID',
    { tags: TAGS },
    () => {
      openMciAccount(childAccount(), { master: masterAccount() });
      chooseMaster();
      cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/account/2/company`);
      cy.get(Mci.account.heading).should('have.text', 'Confirm account');
      cy.get(Mci.account.value('account-number')).should('contain.text', '130002BU');
      cy.get(Mci.account.value('name')).should('contain.text', 'Example Trading Ltd');
      cy.get(Mci.account.value('date-of-birth')).should('not.exist');
      cy.get(Mci.account.businessUnit).should('have.text', BUSINESS_UNIT.business_unit_name);
      cy.get(Mci.account.nextSteps).should('not.exist');
      cy.get(Mci.account.enquiryLink).should('have.attr', 'href', '/fines/account/defendant/2/details');
      cy.get(Mci.account.confirm).click();
      cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/payment-details/2`);
    },
  );

  RESTRICTIONS.forEach(({ reason, status, balance, warning, inhibited }) => {
    it(`(AC8b) blocks a master with ${reason} without child-only controls`, { tags: TAGS }, () => {
      openMciAccount(childAccount(), {
        master: { ...masterAccount(), account_status_code: status, account_balance: balance },
        businessUnit: inhibited ? INHIBITED_BU : BUSINESS_UNIT,
      });
      chooseMaster();
      cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/account/2/company`);
      assertRestricted(warning);
      cy.get(Mci.account.value('account-number')).should('contain.text', '130002BU');
      cy.get(Mci.account.nextSteps).should('not.exist');
      cy.get(Mci.account.suspense).should('be.visible');
    });
  });
});

describe('Manual Cash Input - Restricted navigation', () => {
  ['WO', 'CS'].forEach((status) => {
    it(`(AC11, AC13) retains results on Back and clears state on Cancel for ${status}`, { tags: TAGS }, () => {
      openMciAccount({ ...childAccount(), account_status_code: status });
      cy.get(Mci.backLink).click();
      cy.get('@financeRouter').its('url').should('eq', `${MCI_CRIMINAL_URL}/matches`);
      cy.get(Mci.searchResults.accountNumbers).should('contain.text', '130001BU');
      cy.get('@getDefendantAccounts').should('have.been.calledOnce');
      cy.get(Mci.searchResults.accountCheckbox(1)).check();
      cy.get(Mci.searchResults.continue).click();
      cy.get(Mci.account.cancel).click();
      cy.get('@financeRouter').its('url').should('eq', '/fines/manual-cash-input/create/till/details');
      cy.get('@finesMciStore').then((store) => {
        const state = store as InstanceType<typeof FinesMciStore>;
        expect(state.criminalSearch()).to.be.null;
        expect(state.criminalSearchResults()).to.be.null;
        expect(state.selectedCriminalAccount()).to.be.null;
        expect(state.selectedCriminalAccountAtAGlance()).to.be.null;
        expect(state.selectedCriminalAccountHeader()).to.be.null;
        expect(state.draftJourney()).to.be.null;
        expect(state.businessUnit()).to.deep.equal(BUSINESS_UNIT);
        expect(state.tills()).to.have.length(1);
      });
    });
  });

  it(
    '(AC11) returns from the master to the original child results and loads a different selection',
    { tags: TAGS },
    () => {
      const other = {
        ...structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK),
        defendant_account_id: '3',
        account_number: '130003BU',
      };
      openMciAccount(childAccount(), { master: masterAccount(), otherAccounts: [other] });
      chooseMaster();
      cy.get(Mci.account.heading).should('have.text', 'Confirm account');
      cy.get(Mci.backLink).click();
      cy.get(Mci.searchResults.accountNumbers)
        .should('have.length', 2)
        .and('contain.text', '130001BU')
        .and('contain.text', '130003BU');
      cy.get('@getDefendantAccounts').should('have.been.calledOnce');
      cy.get(Mci.searchResults.accountCheckbox(3)).check();
      cy.get(Mci.searchResults.continue).click();
      cy.get(Mci.account.value('account-number'))
        .should('contain.text', '130003BU')
        .and('not.contain.text', '130002BU');
    },
  );
});
