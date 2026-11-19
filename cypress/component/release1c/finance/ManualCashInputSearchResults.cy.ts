import { of } from 'rxjs';
import { Router, Routes } from '@angular/router';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { FinesMciPaymentCategoryCriminalAccountComponent } from 'src/app/flows/fines/fines-mci/fines-mci-payment-category-criminal-account/fines-mci-payment-category-criminal-account.component';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { IOpalFinesAccountDefendantAtAGlance } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { IOpalFinesAccountDefendantDetailsHeader } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesDefendantAccountResponse } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3490', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const BUSINESS_UNIT = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
const SEARCH_RESULTS_TABLE = 'app-fines-mci-payment-category-criminal-matches-table-wrapper table';
const CRIMINAL_ROUTE = [
  FINES_MCI_ROUTING_PATHS.children.create,
  FINES_MCI_ROUTING_PATHS.children.till,
  FINES_MCI_ROUTING_PATHS.children.payment,
  FINES_MCI_ROUTING_PATHS.children.category,
  FINES_MCI_ROUTING_PATHS.children.criminal,
].join('/');
const SEARCH_ROUTE = [
  '/',
  FINES_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.children.create,
  FINES_MCI_ROUTING_PATHS.children.till,
  FINES_MCI_ROUTING_PATHS.children.payment,
  FINES_MCI_ROUTING_PATHS.children.category,
  FINES_MCI_ROUTING_PATHS.children.criminal,
  FINES_MCI_ROUTING_PATHS.children.search,
];

const addAccountRouteToTestRouter = (router: Router): void => {
  const mciRoute = [FINES_ROUTING_PATHS.root, FINES_MCI_ROUTING_PATHS.root].join('/');
  const routes: Routes = router.config.map((route) => {
    if (route.path !== mciRoute) {
      return route;
    }

    return {
      ...route,
      children: route.children?.map((childRoute) =>
        childRoute.path === CRIMINAL_ROUTE
          ? {
              ...childRoute,
              children: [
                ...(childRoute.children ?? []),
                {
                  path: 'account/:accountId/:type',
                  component: FinesMciPaymentCategoryCriminalAccountComponent,
                },
              ],
            }
          : childRoute,
      ),
    };
  });

  router.resetConfig(routes);
};

const openCriminalSearch = (searchResponse: IOpalFinesDefendantAccountResponse, businessUnit = BUSINESS_UNIT): void => {
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  cy.get('@financeRouter').then((router) => addAccountRouteToTestRouter(router as Router));
  cy.get('@opalFines').then((opalFines) => {
    const getDefendantAccounts = cy.stub(opalFines as OpalFines, 'getDefendantAccounts').returns(of(searchResponse));
    cy.wrap(getDefendantAccounts).as('getDefendantAccounts');
  });
  cy.get('@finesMciStore').then((store) => {
    const finesMciStore = store as InstanceType<typeof FinesMciStore>;

    finesMciStore.setBusinessUnit(businessUnit);
    finesMciStore.ensureTill();
  });
  cy.get('@financeRouter')
    .then((router) => (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(SEARCH_ROUTE))
    .should('be.true');
};

const searchForIndividuals = (response: IOpalFinesDefendantAccountResponse, businessUnit = BUSINESS_UNIT): void => {
  openCriminalSearch(response, businessUnit);
  cy.get(Mci.searchAccount.lastName).type('Smith');
  cy.get(Mci.searchAccount.searchButton).click();
};

const searchForCompany = (response: IOpalFinesDefendantAccountResponse, businessUnit = BUSINESS_UNIT): void => {
  openCriminalSearch(response, businessUnit);
  cy.get(Mci.searchAccount.companiesTab).click();
  cy.get(Mci.searchAccount.companyName).type('Example');
  cy.get(Mci.searchAccount.searchButton).click();
};

const oneAccountSearchResponse = {
  ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
  count: 1,
  defendant_accounts: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts.slice(0, 1),
};
const twoAccountSearchResponse = {
  ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
  count: 2,
  defendant_accounts: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts.slice(0, 2),
};
const INHIBITED_ACTION_BUSINESS_UNIT = {
  ...BUSINESS_UNIT,
  configuration_items: [
    ...BUSINESS_UNIT.configuration_items,
    {
      item_name: 'RESULTS_TO_INHIBIT_PAYMENTS',
      item_value: 'EA-001',
      item_values: ['EA-001'],
    },
  ],
};

const accountAtAGlance = (accountStatusCode: string, accountBalance = 100): IOpalFinesAccountDefendantAtAGlance =>
  ({
    ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
    account_status_code: accountStatusCode,
    account_balance: accountBalance,
  }) as IOpalFinesAccountDefendantAtAGlance;

const setAccountDetailsResponse = (
  atAGlance: IOpalFinesAccountDefendantAtAGlance,
  header: IOpalFinesAccountDefendantDetailsHeader = FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
): void => {
  cy.get('@opalFines').then((opalFines) => {
    cy.stub(opalFines as OpalFines, 'getDefendantAccountAtAGlance').returns(of(atAGlance));
    cy.stub(opalFines as OpalFines, 'getDefendantAccountHeadingData').returns(of(header));
  });
};

const selectAccountAndContinue = (
  atAGlance: IOpalFinesAccountDefendantAtAGlance,
  businessUnit = BUSINESS_UNIT,
): void => {
  searchForIndividuals(oneAccountSearchResponse, businessUnit);
  setAccountDetailsResponse(atAGlance);
  cy.get('#fines-mci-criminal-account-1').check({ force: true });
  cy.contains('button.govuk-button', 'Continue').click();
};

const assertAccountNumberOrder = (expectedAccountNumbers: string[]): void => {
  cy.get(SEARCH_RESULTS_TABLE)
    .find('tbody tr')
    .then(($rows) => {
      const actualAccountNumbers = [...$rows].map((row) =>
        row.querySelector('td[id="criminalAccountNumber"] a')?.textContent?.replace('(opens in a new tab)', '').trim(),
      );

      expect(actualAccountNumbers).to.deep.equal(expectedAccountNumbers);
    });
};

describe('Manual Cash Input - Search Results', () => {
  it('(AC1) navigates to Search results after a successful account search', { tags: TAGS }, () => {
    openCriminalSearch({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
      count: 1,
      defendant_accounts: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts.slice(0, 1),
    });

    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.searchButton).click();

    cy.contains('h1', 'Search results').should('be.visible');
    cy.get(SEARCH_RESULTS_TABLE).should('be.visible');
    cy.get('#fines-mci-criminal-account-selection')
      .should('be.visible')
      .and('contain.text', 'Select 1 account to continue');
    cy.contains('button.govuk-button', 'Continue').should('be.visible');
    cy.contains('a', 'Search again').should('be.visible');
    cy.get(Mci.cancelLink).should('be.visible');
    cy.get('@getDefendantAccounts').should('have.been.calledOnce');
  });

  it('(AC2) displays the selected business unit on Search results', { tags: TAGS }, () => {
    openCriminalSearch({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
      count: 1,
      defendant_accounts: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts.slice(0, 1),
    });

    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.searchButton).click();

    cy.get('.govuk-caption-m').should('have.text', BUSINESS_UNIT.business_unit_name);
  });

  it('(AC3) displays every account returned by the defendant search in the results table', { tags: TAGS }, () => {
    const response = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
      count: 3,
      defendant_accounts: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts.slice(0, 3),
    };
    const accountNumbers = response.defendant_accounts.map(({ account_number }) => account_number);

    openCriminalSearch(response);
    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.searchButton).click();

    cy.get(SEARCH_RESULTS_TABLE).within(() => {
      cy.get('tbody tr').should('have.length', response.defendant_accounts.length);
      accountNumbers.forEach((accountNumber) => cy.get('tbody').should('contain.text', accountNumber));
    });
  });

  it('(AC3a) displays individual account data using the required formats', { tags: TAGS }, () => {
    const account = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_account_id: 901,
      account_number: '12345678',
      defendant_surname: 'Smith',
      defendant_firstnames: 'Morgan',
      birth_date: '2001-02-03',
      address_line_1: '4 Test Street',
      postcode: 'SW1A 1AA',
      account_balance: 1234.5,
      last_enforcement_action: 'bwtd',
      has_collection_order: true,
      aliases: [
        { alias_number: 2, surname: 'SECOND', forenames: 'Alias', organisation_name: null },
        { alias_number: 1, surname: 'FIRST', forenames: 'Alias', organisation_name: null },
      ],
    };

    searchForIndividuals({ count: 1, defendant_accounts: [account] });

    cy.get(`${SEARCH_RESULTS_TABLE} thead`)
      .should('contain.text', 'Account')
      .and('contain.text', 'Name')
      .and('contain.text', 'Aliases')
      .and('contain.text', 'Date of birth')
      .and('contain.text', 'Address line 1')
      .and('contain.text', 'Postcode')
      .and('contain.text', 'Balance')
      .and('contain.text', 'ENF')
      .and('contain.text', 'CO');
    cy.get('#criminalAccountNumber').should('contain.text', '12345678');
    cy.get('#criminalAccountName').should('contain.text', 'SMITH, Morgan');
    cy.get('#criminalAccountAliases div').then(($aliases) => {
      expect([...$aliases].map((alias) => alias.textContent?.trim())).to.deep.equal(['FIRST, Alias', 'SECOND, Alias']);
    });
    cy.get('#criminalAccountDateOfBirth').should('contain.text', '03 Feb 2001');
    cy.get('#criminalAccountAddressLine1').should('contain.text', '4 Test Street');
    cy.get('#criminalAccountPostcode').should('contain.text', 'SW1A 1AA');
    cy.get('#criminalAccountBalance').should('contain.text', '\u00a31,234.50');
    cy.get('#criminalAccountEnf')
      .invoke('text')
      .then((text) => expect(text.trim()).to.equal('BWTD'));
    cy.get('#criminalAccountCo')
      .invoke('text')
      .then((text) => expect(text.trim()).to.equal('Y'));
  });

  it('(AC3a) displays company account data and the missing-value markers', { tags: TAGS }, () => {
    const account = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_account_id: 902,
      account_number: '22345678',
      organisation_flag: true,
      organisation_name: 'Example Limited',
      birth_date: '2001-02-03',
      address_line_1: '5 Company Road',
      postcode: 'EC1A 1AA',
      account_balance: 0,
      has_collection_order: false,
      aliases: [
        { alias_number: 2, surname: null, forenames: null, organisation_name: 'Example Trading' },
        { alias_number: 1, surname: null, forenames: null, organisation_name: 'Example Services' },
      ],
    };

    searchForCompany({ count: 1, defendant_accounts: [account] });

    cy.get('#criminalAccountNumber').should('contain.text', '22345678');
    cy.get('#criminalAccountName').should('contain.text', 'Example Limited');
    cy.get('#criminalAccountAliases div').then(($aliases) => {
      expect([...$aliases].map((alias) => alias.textContent?.trim())).to.deep.equal([
        'Example Services',
        'Example Trading',
      ]);
    });
    cy.get('#criminalAccountDateOfBirth').should('contain.text', '\u2014');
    cy.get('#criminalAccountAddressLine1').should('contain.text', '5 Company Road');
    cy.get('#criminalAccountPostcode').should('contain.text', 'EC1A 1AA');
    cy.get('#criminalAccountBalance').should('contain.text', '\u00a30.00');
    cy.get('#criminalAccountEnf').should('contain.text', 'BWTD');
    cy.get('#criminalAccountCo').should('contain.text', '\u2014');
  });

  it('(AC3a) displays an em dash when an account has no aliases', { tags: TAGS }, () => {
    const account = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_account_id: 903,
      account_number: '32345678',
      aliases: [],
    };

    searchForIndividuals({ count: 1, defendant_accounts: [account] });

    cy.get('#criminalAccountAliases').should('contain.text', '\u2014');
  });

  it('(AC3b) lets a user select and de-select an account checkbox', { tags: TAGS }, () => {
    const response = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
      count: 1,
      defendant_accounts: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts.slice(0, 1),
    };

    searchForIndividuals(response);

    cy.get('label[for="fines-mci-criminal-account-1"]').should('be.visible');
    cy.get('#fines-mci-criminal-account-1')
      .should('not.be.checked')
      .check({ force: true })
      .should('be.checked')
      .uncheck({ force: true })
      .should('not.be.checked');
  });

  it('(AC3c) links each account number to Account Enquiry in a new tab', { tags: TAGS }, () => {
    const response = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
      count: 1,
      defendant_accounts: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts.slice(0, 1),
    };

    searchForIndividuals(response);

    cy.get('#criminalAccountNumber a')
      .should('contain.text', '130001BU')
      .and('contain.text', 'opens in a new tab')
      .and('have.attr', 'href', '/fines/account/defendant/1/details')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it(
    '(AC4, AC8a EMAC1) requires one account and links the error summary to the selection field',
    { tags: TAGS },
    () => {
      searchForIndividuals(oneAccountSearchResponse);
      cy.contains('button.govuk-button', 'Continue').click();

      cy.get('.govuk-error-summary').should('be.visible').and('contain.text', 'Select 1 account');
      cy.get('.govuk-error-summary__title').should('contain.text', 'There is a problem');
      cy.get('.govuk-error-message').should('be.visible').and('contain.text', 'Select 1 account');
      cy.get('.govuk-error-summary__list a').click();
      cy.focused().should('have.attr', 'id', 'fines-mci-criminal-account-selection');
    },
  );

  it('(AC4a) requires only one selected account', { tags: TAGS }, () => {
    searchForIndividuals(twoAccountSearchResponse);
    cy.get('#fines-mci-criminal-account-1').check({ force: true });
    cy.get('#fines-mci-criminal-account-2').check({ force: true });
    cy.contains('button.govuk-button', 'Continue').click();

    cy.get('.govuk-error-summary').should('be.visible').and('contain.text', 'Select only 1 account');
    cy.get('.govuk-error-summary__title').should('have.text', 'There is a problem');
    cy.get('.govuk-error-message').should('be.visible').and('contain.text', 'Select only 1 account');
    cy.get('.govuk-error-summary__list a').click();
    cy.focused().should('have.attr', 'id', 'fines-mci-criminal-account-selection');
  });

  it('(AC5a) opens the consolidated-account restriction screen for a consolidated account', { tags: TAGS }, () => {
    selectAccountAndContinue(accountAtAGlance('CS'));

    cy.get('@financeRouter').its('url').should('include', '/account/1/individual');
    cy.contains('h1', 'You cannot pay into this account \u2013 Account has been consolidated').should('be.visible');
  });

  [
    {
      description: 'a written-off account',
      status: 'WO',
      balance: 100,
      heading: 'You cannot pay into this account \u2013 Account has been written off',
      businessUnit: BUSINESS_UNIT,
    },
    {
      description: 'a zero-balance account',
      status: 'L',
      balance: 0,
      heading: 'You cannot pay into this account \u2013 Account has a zero balance',
      businessUnit: BUSINESS_UNIT,
    },
    {
      description: 'an acknowledged transfer-out account',
      status: 'TA',
      balance: 100,
      heading: 'You cannot pay into this account \u2013 Account has been transferred out',
      businessUnit: BUSINESS_UNIT,
    },
    {
      description: 'a transfer-out in-progress account',
      status: 'TO',
      balance: 100,
      heading: 'You cannot pay into this account \u2013 Transfer out in progress',
      businessUnit: BUSINESS_UNIT,
    },
    {
      description: 'an account transferred to Scotland or Northern Ireland',
      status: 'TS',
      balance: 100,
      heading:
        'You cannot pay into this account \u2013 Account has been transferred out to Scotland or Northern Ireland',
      businessUnit: BUSINESS_UNIT,
    },
    {
      description: 'an account with an inhibited enforcement action',
      status: 'L',
      balance: 100,
      heading: 'You cannot pay into this account \u2013 Account has an inhibited enforcement action',
      businessUnit: INHIBITED_ACTION_BUSINESS_UNIT,
    },
  ].forEach(({ description, status, balance, heading, businessUnit }) => {
    it(`(AC5b) opens the account-with-warnings screen for ${description}`, { tags: TAGS }, () => {
      selectAccountAndContinue(accountAtAGlance(status, balance), businessUnit);

      cy.get('@financeRouter').its('url').should('include', '/account/1/individual');
      cy.contains('h1', heading).should('be.visible');
    });
  });

  it('(AC5c) opens the Confirm account screen when the account has no payment restrictions', { tags: TAGS }, () => {
    selectAccountAndContinue(accountAtAGlance('L', 100));

    cy.get('@financeRouter').its('url').should('include', '/account/1/individual');
    cy.contains('h1', 'Successful confirm account').should('be.visible');
  });

  it('(AC6) returns to Search for an Account with individual criteria retained', { tags: TAGS }, () => {
    openCriminalSearch(oneAccountSearchResponse);
    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.lastNameExactMatch).check({ force: true });
    cy.get(Mci.searchAccount.firstNames).type('Morgan');
    cy.get(Mci.searchAccount.firstNamesExactMatch).check({ force: true });
    cy.get(Mci.searchAccount.individualAliases).check({ force: true });
    cy.get(Mci.searchAccount.searchButton).click();

    cy.contains('a', 'Search again').click();

    cy.get(Mci.searchAccount.lastName).should('have.value', 'Smith');
    cy.get(Mci.searchAccount.lastNameExactMatch).should('be.checked');
    cy.get(Mci.searchAccount.firstNames).should('have.value', 'Morgan');
    cy.get(Mci.searchAccount.firstNamesExactMatch).should('be.checked');
    cy.get(Mci.searchAccount.individualAliases).should('be.checked');
  });

  it('(AC6) returns to Search for an Account with account number criteria retained', { tags: TAGS }, () => {
    openCriminalSearch(oneAccountSearchResponse);
    cy.get(Mci.searchAccount.accountNumber).type('12345678');
    cy.get(Mci.searchAccount.searchButton).click();

    cy.contains('a', 'Search again').click();

    cy.get(Mci.searchAccount.accountNumber).should('have.value', '12345678');
  });

  it('(AC6) returns to Search for an Account with company criteria retained', { tags: TAGS }, () => {
    openCriminalSearch(oneAccountSearchResponse);
    cy.get(Mci.searchAccount.companiesTab).click();
    cy.get(Mci.searchAccount.companyName).type('Example Limited');
    cy.get(Mci.searchAccount.companyNameExactMatch).check({ force: true });
    cy.get(Mci.searchAccount.companyAliases).check({ force: true });
    cy.get(Mci.searchAccount.searchButton).click();

    cy.contains('a', 'Search again').click();

    cy.get(Mci.searchAccount.companyName).should('be.visible').and('have.value', 'Example Limited');
    cy.get(Mci.searchAccount.companyNameExactMatch).should('be.checked');
    cy.get(Mci.searchAccount.companyAliases).should('be.checked');
  });

  it('(AC7) cancels payment creation and returns to Till Details', { tags: TAGS }, () => {
    searchForIndividuals(oneAccountSearchResponse);
    cy.get('@finesMciStore').then((store) => {
      (store as InstanceType<typeof FinesMciStore>).setDraftJourney('criminal');
    });

    cy.get(Mci.cancelLink).click();

    cy.get(Mci.tillDetails).should('be.visible');
    cy.contains('h1', 'Till details').should('be.visible');
    cy.get(Mci.tillDetailsBusinessUnitValue).should('have.text', BUSINESS_UNIT.business_unit_name);
    cy.get('@finesMciStore').then((store) => {
      const finesMciStore = store as InstanceType<typeof FinesMciStore> & {
        criminalSearchResults: () => unknown;
      };

      expect(finesMciStore.criminalSearch()).to.be.null;
      expect(finesMciStore.criminalSearchResults()).to.be.null;
      expect(finesMciStore.draftJourney()).to.be.null;
    });
  });

  it('(AC8b CSAC1, CSAC2, CSAC3) sorts the results table and resets sorting when reopened', { tags: TAGS }, () => {
    const sortedAccounts = [
      {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
        defendant_account_id: 11,
        account_number: '90000001',
        defendant_surname: 'Smith',
        defendant_firstnames: 'Zed',
      },
      {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[1],
        defendant_account_id: 12,
        account_number: '10000001',
        defendant_surname: 'Smith',
        defendant_firstnames: 'Amy',
      },
      {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[2],
        defendant_account_id: 13,
        account_number: '50000001',
        defendant_surname: 'Smith',
        defendant_firstnames: 'Max',
      },
    ];
    const response = { count: sortedAccounts.length, defendant_accounts: sortedAccounts };

    searchForIndividuals(response);

    ['Account', 'Name', 'Aliases', 'Date of birth', 'Address line 1', 'Postcode', 'Balance', 'ENF', 'CO'].forEach(
      (column) => {
        cy.get(SEARCH_RESULTS_TABLE).contains('th', column).find('button').should('be.visible');
      },
    );

    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Account').find('button').click();
    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Account').should('have.attr', 'aria-sort', 'ascending');
    assertAccountNumberOrder(['10000001', '50000001', '90000001']);

    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Account').find('button').click();
    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Account').should('have.attr', 'aria-sort', 'descending');
    assertAccountNumberOrder(['90000001', '50000001', '10000001']);

    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Name').find('button').click();
    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Account').should('have.attr', 'aria-sort', 'none');
    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Name').should('have.attr', 'aria-sort', 'ascending');
    assertAccountNumberOrder(['10000001', '50000001', '90000001']);

    cy.contains('a', 'Search again').click();
    cy.get(Mci.searchAccount.searchButton).click();
    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Account').should('have.attr', 'aria-sort', 'none');
    cy.get(SEARCH_RESULTS_TABLE).contains('th', 'Name').should('have.attr', 'aria-sort', 'none');
    assertAccountNumberOrder(['90000001', '10000001', '50000001']);
  });
});
