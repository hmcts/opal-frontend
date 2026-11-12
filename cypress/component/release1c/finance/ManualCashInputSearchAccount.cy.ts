import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { IOpalFinesDefendantAccountResponse } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { of } from 'rxjs';
import 'cypress-axe';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3489', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const UNSAVED_CHANGES_MESSAGE =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
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
const openCriminalSearch = (searchResponse?: IOpalFinesDefendantAccountResponse): void => {
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  cy.get('@opalFines').then((opalFines) => {
    const getDefendantAccounts = cy.stub(opalFines as OpalFines, 'getDefendantAccounts');
    cy.wrap(getDefendantAccounts).as('getDefendantAccounts');
    if (searchResponse) {
      getDefendantAccounts.returns(of(searchResponse));
    }
  });
  cy.get('@finesMciStore').then((store) => {
    (store as InstanceType<typeof FinesMciStore>).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
  });
  cy.get('@financeRouter')
    .then((router) => (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(SEARCH_ROUTE))
    .should('be.true');
};

const submitInvalidSearchAndAssertError = (message: string): void => {
  cy.get(Mci.searchAccount.searchButton).click();
  cy.get('.govuk-error-summary').should('be.visible').and('contain.text', message);
  cy.get('.govuk-error-summary__title').should('have.text', 'There is a problem');
  cy.get('.govuk-error-message').should('be.visible').and('contain.text', message);
  cy.get(Mci.searchAccount.heading).should('be.visible');
  cy.get('@getDefendantAccounts').should('not.have.been.called');
};

describe('Manual Cash Input - Search for an Account', () => {
  it('(AC2) stays on the search screen without triggering a search when submitted empty', { tags: TAGS }, () => {
    openCriminalSearch();

    cy.get(Mci.searchAccount.accountNumber).should('have.value', '');
    cy.get(Mci.searchAccount.lastName).should('have.value', '');
    cy.get(Mci.searchAccount.firstNames).should('have.value', '');
    cy.get(Mci.searchAccount.searchButton).click();
    cy.get(Mci.searchAccount.heading).should('be.visible').and('have.text', 'Search for an account');
    cy.get('@getDefendantAccounts').should('not.have.been.called');
  });

  it(
    '(AC3a, AC11 EMAC1) shows the account number format message in the summary and next to the field',
    { tags: TAGS },
    () => {
      openCriminalSearch();
      cy.get(Mci.searchAccount.accountNumber).type('1234567');
      submitInvalidSearchAndAssertError('Enter account number in the correct format such as 12345678 or 12345678A');
    },
  );

  it('(AC3b) shows the account number character message for a non-alphanumeric value', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.accountNumber).type('1234567?');
    submitInvalidSearchAndAssertError('Account number must only contain letters or numbers');
  });

  it('(AC3c) shows the first names character message for an invalid value', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.firstNames).type('José');
    submitInvalidSearchAndAssertError(
      'First Names must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
    );
  });

  it('(AC3d) shows the last name character message for an invalid value', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.lastName).type('O’Connor');
    submitInvalidSearchAndAssertError(
      'Last Name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
    );
  });

  it('(AC3e) shows the company name character message for an invalid value', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.companiesTab).click();
    cy.get(Mci.searchAccount.companyName).type('InvalidéName');
    submitInvalidSearchAndAssertError(
      'Company Name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
    );
  });

  it('(AC4a) shows the account number length message when more than 9 characters are entered', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.accountNumber).type('1234567890');
    submitInvalidSearchAndAssertError('Account number must be 9 characters or fewer');
  });

  it('(AC4b) shows the last name length message when more than 30 characters are entered', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.lastName).type('A'.repeat(31));
    submitInvalidSearchAndAssertError('Last name must be 30 characters or fewer');
  });

  it('(AC4c) shows the first names length message when more than 20 characters are entered', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.firstNames).type('A'.repeat(21));
    submitInvalidSearchAndAssertError('First names must be 20 characters or fewer');
  });

  it('(AC4d) shows the company name length message when more than 50 characters are entered', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.companiesTab).click();
    cy.get(Mci.searchAccount.companyName).type('A'.repeat(51));
    submitInvalidSearchAndAssertError('Company name must be 50 characters or fewer');
  });

  it('(AC5a) requires a last name when first names are entered without one', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.firstNames).type('John');
    submitInvalidSearchAndAssertError('Enter last name');
  });

  it('(AC5b) requires a last name when individual aliases are included without one', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.individualAliases).check({ force: true });
    submitInvalidSearchAndAssertError('Enter last name');
  });

  it('(AC5c) requires a last name for exact last-name matching', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.lastNameExactMatch).check({ force: true });
    submitInvalidSearchAndAssertError('Enter last name');
  });

  it('(AC5c) requires first names for exact first-name matching', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.firstNamesExactMatch).check({ force: true });
    submitInvalidSearchAndAssertError('Enter first name');
  });

  it('(AC5d) requires a company name when company aliases are included without one', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.companiesTab).click();
    cy.get(Mci.searchAccount.companyAliases).check({ force: true });
    submitInvalidSearchAndAssertError('Enter company name');
  });

  it('(AC5e) requires a company name for exact company-name matching', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.companiesTab).click();
    cy.get(Mci.searchAccount.companyNameExactMatch).check({ force: true });
    submitInvalidSearchAndAssertError('Enter company name');
  });

  it(
    '(AC6) opens Invalid Search Combination when account number and individual criteria are combined',
    { tags: TAGS },
    () => {
      openCriminalSearch();
      cy.get(Mci.searchAccount.accountNumber).type('12345678');
      cy.get(Mci.searchAccount.lastName).type('Smith');
      cy.get(Mci.searchAccount.searchButton).click();

      cy.contains('h1', 'Search criteria cannot be combined').should('be.visible');
      cy.contains('Placeholder for PO-3529.').should('be.visible');
      cy.get('@getDefendantAccounts').should('not.have.been.called');
    },
  );

  it(
    '(AC6) opens Invalid Search Combination when account number and company criteria are combined',
    { tags: TAGS },
    () => {
      openCriminalSearch();
      cy.get(Mci.searchAccount.companiesTab).click();
      cy.get(Mci.searchAccount.accountNumber).type('12345678');
      cy.get(Mci.searchAccount.companyName).type('Acme Ltd');
      cy.get(Mci.searchAccount.searchButton).click();

      cy.contains('h1', 'Search criteria cannot be combined').should('be.visible');
      cy.contains('Placeholder for PO-3529.').should('be.visible');
      cy.get('@getDefendantAccounts').should('not.have.been.called');
    },
  );

  it('(AC7) opens Invalid Search Results when no accounts match', { tags: TAGS }, () => {
    openCriminalSearch({ count: 0, defendant_accounts: [] });
    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.searchButton).click();

    cy.contains('h1', 'No matching criminal accounts').should('be.visible');
    cy.contains('Placeholder for PO-3528.').should('be.visible');
    cy.get('@getDefendantAccounts').should('have.been.calledOnce');
  });

  it('(AC8) opens Invalid Search Results when more than 100 accounts match', { tags: TAGS }, () => {
    openCriminalSearch({ ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK, count: 101 });
    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.searchButton).click();

    cy.contains('h1', 'More than 100 matching criminal accounts').should('be.visible');
    cy.contains('Placeholder for PO-3528.').should('be.visible');
    cy.get('@getDefendantAccounts').should('have.been.calledOnce');
  });

  it('(AC9) opens Search Results when at least one account matches', { tags: TAGS }, () => {
    openCriminalSearch({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
      count: 1,
      defendant_accounts: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts.slice(0, 1),
    });
    cy.get(Mci.searchAccount.lastName).type('Smith');
    cy.get(Mci.searchAccount.searchButton).click();

    cy.contains('h1', 'Matching criminal accounts').should('be.visible');
    cy.contains('Placeholder for PO-3490.').should('be.visible');
    cy.get('@getDefendantAccounts').should('have.been.calledOnce');
  });

  it(
    '(AC10) returns to Till Details without a warning when Cancel is selected with no search data',
    { tags: TAGS },
    () => {
      openCriminalSearch();
      cy.get('@finesMciStore').then((store) => {
        (store as InstanceType<typeof FinesMciStore>).setDraftJourney('criminal');
      });
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm');
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });

      cy.get(Mci.searchAccount.cancelLink).click();

      cy.contains('h1', 'Till details').should('be.visible');
      cy.get('@leavePageConfirm').should('not.have.been.called');
      cy.get('@finesMciStore').then((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).draftJourney()).to.be.null;
      });
    },
  );

  it(
    '(AC10a, AC10ai, AC11 RGAC1) confirms Cancel returns to Till Details and clears entered search data',
    { tags: TAGS },
    () => {
      openCriminalSearch();
      cy.get('@finesMciStore').then((store) => {
        (store as InstanceType<typeof FinesMciStore>).setDraftJourney('criminal');
      });
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm').returns(true);
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });
      cy.get(Mci.searchAccount.lastName).type('Smith');

      cy.get(Mci.searchAccount.cancelLink).click();

      cy.get('@leavePageConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
      cy.contains('h1', 'Till details').should('be.visible');
      cy.get('@finesMciStore').then((store) => {
        const finesMciStore = store as InstanceType<typeof FinesMciStore>;
        expect(finesMciStore.criminalSearch()).to.be.null;
        expect(finesMciStore.draftJourney()).to.be.null;
      });
      cy.get(Mci.searchAccount.lastName).should('not.exist');
    },
  );

  it(
    '(AC10a, AC10aii, AC11 RGAC1) stays on Search for an Account and retains entered data when Cancel is declined',
    { tags: TAGS },
    () => {
      openCriminalSearch();
      cy.get('@finesMciStore').then((store) => {
        (store as InstanceType<typeof FinesMciStore>).setDraftJourney('criminal');
      });
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm').returns(false);
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });
      cy.get(Mci.searchAccount.lastName).type('Smith');

      cy.get(Mci.searchAccount.cancelLink).click();

      cy.get('@leavePageConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
      cy.get(Mci.searchAccount.heading).should('be.visible');
      cy.get(Mci.searchAccount.lastName).should('have.value', 'Smith');
      cy.get('@finesMciStore').then((store) => {
        expect((store as InstanceType<typeof FinesMciStore>).draftJourney()).to.equal('criminal');
      });
    },
  );

  it('(AC11 RGAC2, RGAC3) warns on browser exit or refresh and retains entered search data', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.get(Mci.searchAccount.lastName).type('Smith');

    cy.window().then((window) => {
      const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

      expect(window.dispatchEvent(beforeUnloadEvent), 'beforeunload event dispatch').to.be.false;
      expect(beforeUnloadEvent.defaultPrevented, 'beforeunload warning').to.be.true;
    });
    cy.get(Mci.searchAccount.lastName).should('have.value', 'Smith');
  });

  it('(AC12) has no critical, serious, or moderate Axe violations on either search tab', { tags: TAGS }, () => {
    openCriminalSearch();
    cy.document().then((document) => {
      document.documentElement.lang = 'en';
    });

    cy.injectAxe({ axeCorePath: 'node_modules/axe-core/axe.min.js' });
    cy.checkA11y('#main-content', { includedImpacts: ['critical', 'serious', 'moderate'] });

    cy.get(Mci.searchAccount.companiesTab).click();
    cy.checkA11y('#main-content', { includedImpacts: ['critical', 'serious', 'moderate'] });
  });
});
