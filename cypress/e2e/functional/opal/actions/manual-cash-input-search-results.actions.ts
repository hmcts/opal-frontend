import { ManualCashInputLocators } from '../../../../shared/selectors/finance.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { AccountDetailsAtAGlanceActions } from './account-details/details.at-a-glance.actions';
import { ManualCashInputActions } from './manual-cash-input.actions';

const log = createScopedLogger('ManualCashInputSearchResultsActions');
const SEARCH_RESULTS_PATH = '/fines/manual-cash-input/create/till/payment/category/criminal/matches';
const DEFENDANT_ACCOUNT_SEARCH_ENDPOINT = '**/opal-fines-service/defendant-accounts/search';
const SEARCH_RESULTS_RESPONSE = {
  count: 1,
  defendant_accounts: [
    {
      organisation_flag: false,
      business_unit_name: 'Bury St. Edmunds',
      business_unit_id: 1,
      prosecutor_case_reference: 'PCR19274548',
      last_enforcement_action: 'bwtd',
      organisation_name: null,
      defendant_title: 'Mr',
      national_insurance_number: 'JK567890C',
      parent_guardian_surname: 'DOE',
      parent_guardian_firstnames: 'Jane',
      account_number: '130001BU',
      defendant_account_id: 1,
      defendant_surname: 'SMITH_1',
      defendant_firstnames: 'John Michael_1',
      birth_date: '1985-06-01',
      aliases: [],
      address_line_1: '1 High Street',
      postcode: 'RG1 9RT',
      account_balance: 714,
    },
  ],
};
const ACCOUNT_HEADER_RESPONSE = {
  version: '1',
  defendant_account_id: '1',
  defendant_account_party_id: '1',
  parent_guardian_party_id: null,
  collection_order: false,
  account_number: '130001BU',
  account_type: 'Fine',
  originator_type: 'TFO',
  originator_name: 'Test Court',
  prosecutor_case_reference: 'PCR19274548',
  fixed_penalty_ticket_number: null,
  account_status_reference: { account_status_code: 'L', account_status_display_name: 'Live' },
  business_unit_summary: {
    business_unit_id: 1,
    business_unit_code: '0001',
    business_unit_name: 'Bury St. Edmunds',
    welsh_speaking: 'N',
  },
  payment_state_summary: { imposed_amount: 714, arrears_amount: 0, paid_amount: 0, account_balance: 714 },
  party_details: {
    party_id: '1',
    organisation_flag: false,
    organisation_details: null,
    individual_details: {
      title: 'Mr',
      forenames: 'John Michael_1',
      surname: 'SMITH_1',
      date_of_birth: '1985-06-01',
      age: null,
      national_insurance_number: 'JK567890C',
      individual_aliases: [],
    },
  },
  is_youth: false,
  debtor_type: 'PERSON',
  has_consolidated_accounts: false,
};
const ACCOUNT_AT_A_GLANCE_RESPONSE = {
  version: null,
  defendant_account_id: '1',
  account_number: '130001BU',
  account_status_code: 'L',
  account_balance: 714,
  debtor_type: 'PERSON',
  is_youth: false,
  party_details: {
    party_id: '1',
    organisation_flag: false,
    organisation_details: null,
    individual_details: {
      title: 'Mr',
      forenames: 'John Michael_1',
      surname: 'SMITH_1',
      date_of_birth: '1985-06-01',
      age: null,
      national_insurance_number: 'JK567890C',
      individual_aliases: [],
    },
  },
  address: {
    address_line_1: '1 High Street',
    address_line_2: null,
    address_line_3: null,
    address_line_4: null,
    address_line_5: null,
    postcode: 'RG1 9RT',
  },
  language_preferences: null,
  payment_terms: {
    payment_terms_type: { payment_terms_type_code: 'B', payment_terms_type_display_name: 'By date' },
    effective_date: null,
    instalment_period: null,
    lump_sum_amount: null,
    instalment_amount: null,
  },
  enforcement_status: {
    last_enforcement_action: null,
    collection_order_made: false,
    default_days_in_jail: 0,
    enforcement_override: null,
    last_movement_date: null,
  },
  comments_and_notes: null,
};

/** Cypress actions for the Manual Cash Input Search Results screen. */
export class ManualCashInputSearchResultsActions {
  private readonly accountAtAGlance = new AccountDetailsAtAGlanceActions();

  /** Supplies complete BU configuration through the existing till setup action. */
  public createTillForAccountChecks(): void {
    cy.fixture('manualCashInput/confirm-account').then((fixture) => {
      new ManualCashInputActions().startCreateTill(fixture.businessUnits);
    });
  }

  /**
   * Opens a fixture-backed account through the real Search Results selection journey.
   * @param state - Synthetic selected-account state.
   * @param masterState - Synthetic master-account state.
   */
  public openAccountForPayment(state: string, masterState = 'eligible'): void {
    const statuses: Record<string, string> = {
      eligible: 'L',
      consolidated: 'CS',
      'written off': 'WO',
    };
    if (!statuses[state] || !statuses[masterState]) throw new Error('Unsupported synthetic MCI account state');
    cy.fixture('manualCashInput/confirm-account').then((fixture) => {
      const installAccount = (id: string, accountState: string): void => {
        const details = structuredClone(fixture.details);
        const header = structuredClone(fixture.header);
        details.defendant_account_id = id;
        details.account_number = id === '1' ? '12345678' : '87654321';
        details.account_status_code = statuses[accountState];
        if (id === '2') {
          details.party_details.individual_details.forenames = 'Master';
        }
        header.defendant_account_id = id;
        header.defendant_account_party_id = id;
        header.account_number = details.account_number;
        header.party_details = structuredClone(details.party_details);
        header.account_status_reference.account_status_code = details.account_status_code;
        header.payment_state_summary.account_balance = details.account_balance;
        cy.intercept('GET', `**/defendant-accounts/${id}/header-summary`, {
          statusCode: 200,
          headers: { ETag: `qa3530-header-${id}` },
          body: header,
        }).as(`mciHeader${id}`);
        cy.intercept('GET', `**/defendant-accounts/${id}/at-a-glance`, {
          statusCode: 200,
          headers: { ETag: `qa3530-details-${id}` },
          body: details,
        }).as(`mciDetails${id}`);
      };
      installAccount('1', state);
      installAccount('2', masterState);
      cy.intercept('GET', '**/defendant-accounts/1/master', { defendant_account_id: '2' }).as('mciMasterLookup');
      cy.intercept('POST', DEFENDANT_ACCOUNT_SEARCH_ENDPOINT, {
        count: 1,
        defendant_accounts: [fixture.searchAccount],
      }).as('mciConfirmSearch');
      cy.get(ManualCashInputLocators.searchAccount.lastName).type('Example');
      cy.get(ManualCashInputLocators.searchAccount.searchButton).click();
      cy.wait('@mciConfirmSearch').its('response.statusCode').should('eq', 200);
      cy.get(ManualCashInputLocators.searchResults.accountCheckbox(1)).check();
      cy.get(ManualCashInputLocators.searchResults.continue).click();
      cy.wait(['@mciHeader1', '@mciDetails1']);
      cy.get(ManualCashInputLocators.account.page).should('be.visible');
    });
  }

  /**
   * Checks the selected account summary and whether payment confirmation is allowed.
   * @param accountNumber - Expected displayed account number.
   * @param heading - Expected page heading.
   */
  public assertPaymentAccount(accountNumber: string, heading: string): void {
    cy.get(ManualCashInputLocators.account.heading).should('have.text', heading);
    cy.get(ManualCashInputLocators.account.businessUnit).should('have.text', 'Camden and Islington');
    cy.get(ManualCashInputLocators.account.value('account-number')).should('contain.text', accountNumber);
    if (heading === 'Confirm account') {
      cy.get(ManualCashInputLocators.account.confirm).should('be.visible').and('be.enabled');
      cy.get(ManualCashInputLocators.account.warning).should('not.exist');
    } else {
      cy.get(ManualCashInputLocators.account.confirm).should('not.exist');
    }
  }

  /**
   * Verifies the payment restriction text independently from the page heading.
   * @param warning - Expected restriction text.
   */
  public assertPaymentWarning(warning: string): void {
    cy.get(ManualCashInputLocators.account.warning).should('be.visible').and('contain.text', warning);
  }

  /**
   * Confirms the account and checks the account-specific placeholder destination.
   * @param id - Selected defendant account ID.
   */
  public confirmPaymentAccount(id: string): void {
    cy.get(ManualCashInputLocators.account.confirm).click();
    cy.location('pathname').should(
      'eq',
      `/fines/manual-cash-input/create/till/payment/category/criminal/payment-details/${id}`,
    );
    cy.contains('h1', 'Payment details').should('be.visible');
  }

  /**
   * Submits a consolidated next step, or leaves it blank for validation.
   * @param choice - Master, suspense or none for validation.
   */
  public continuePaymentNextStep(choice: string): void {
    if (choice === 'master') cy.get(ManualCashInputLocators.account.masterRadio).check();
    else if (choice === 'suspense') cy.get(ManualCashInputLocators.account.suspenseRadio).check();
    else if (choice !== 'none') throw new Error(`Unsupported consolidated choice: ${choice}`);
    cy.get(ManualCashInputLocators.account.continue).click();
    if (choice === 'master') {
      cy.wait(['@mciMasterLookup', '@mciHeader2', '@mciDetails2']);
      cy.location('pathname').should(
        'eq',
        '/fines/manual-cash-input/create/till/payment/category/criminal/account/2/individual',
      );
    }
  }

  /** Checks both validation locations and keyboard focus/link behaviour. */
  public assertPaymentChoiceError(): void {
    const message = 'Select whether to pay into the live account or into suspense';
    cy.get(ManualCashInputLocators.account.errorSummary).should('contain.text', message).and('have.focus');
    cy.get(ManualCashInputLocators.account.errorLink).should(($link) => {
      expect($link.text().trim()).to.equal(message);
    });
    cy.get(ManualCashInputLocators.account.inlineError).should('contain.text', message);
    cy.get(ManualCashInputLocators.account.errorLink).click();
    cy.get(ManualCashInputLocators.account.masterRadio).should('have.focus');
  }

  /**
   * Follows either suspense action to the destination specified by PO-3530.
   * @param consolidated - Whether the screen has consolidated next-step radios.
   */
  public payAccountIntoSuspense(consolidated: boolean): void {
    if (consolidated) this.continuePaymentNextStep('suspense');
    else cy.get(ManualCashInputLocators.account.suspense).click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create-allocate');
    cy.contains('h1', 'Manual cash input').should('be.visible');
  }

  /**
   * Checks the original results after page or browser Back.
   * @param browserBack - Whether to use browser Back instead of the page link.
   */
  public returnToPaymentResults(browserBack: boolean): void {
    if (browserBack) cy.go('back');
    else cy.get(ManualCashInputLocators.backLink).click();
    cy.location('pathname').should('eq', SEARCH_RESULTS_PATH);
    cy.get(ManualCashInputLocators.searchResults.accountNumbers)
      .should('have.length', 1)
      .and('contain.text', '12345678');
    cy.get('@mciConfirmSearch.all').should('have.length', 1);
  }

  /** Checks Cancel returns to the till and permits starting another payment. */
  public cancelPaymentAccountAndStartNewPayment(): void {
    cy.get(ManualCashInputLocators.account.cancel).click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/details');
    cy.get(ManualCashInputLocators.tillDetailsBusinessUnitValue).should('contain.text', 'Camden and Islington');
    const actions = new ManualCashInputActions();
    actions.addPayment();
    actions.continueWithPaymentCategory('criminal');
    cy.get(ManualCashInputLocators.searchAccount.lastName).should('have.value', '');
    cy.get(ManualCashInputLocators.searchAccount.accountNumber).should('have.value', '');
  }

  /**
   * Mirrors the established new-tab test: verify target, then follow in Cypress's tab.
   * @param id - Defendant account ID displayed on the payment screen.
   */
  public openPaymentAccountEnquiry(id: string): void {
    cy.get(ManualCashInputLocators.account.enquiryLink)
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer')
      .and('have.attr', 'href', `/fines/account/defendant/${id}/details`)
      .invoke('removeAttr', 'target')
      .click();
    cy.location('pathname').should('eq', `/fines/account/defendant/${id}/details`);
    this.accountAtAGlance.assertAtAGlancePageVisible();
    this.accountAtAGlance.assertAccountNumberCaption(id === '1' ? '12345678' : '87654321');
  }

  /** Performs a deterministic successful search and verifies that Search Results is displayed. */
  public searchForMatchingDefendantAndOpenResults(): void {
    log('prepare', 'Stubbing one matching criminal defendant account');
    cy.intercept('POST', DEFENDANT_ACCOUNT_SEARCH_ENDPOINT, SEARCH_RESULTS_RESPONSE).as(
      'manualCashInputDefendantSearch',
    );

    cy.get(ManualCashInputLocators.searchAccount.lastName).type('Smith');
    cy.get(ManualCashInputLocators.searchAccount.searchButton).click();
    cy.wait('@manualCashInputDefendantSearch').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', SEARCH_RESULTS_PATH);
    cy.contains('h1', 'Search results').should('be.visible');
  }

  /** Submits account-number and company criteria together, opening the invalid-combination outcome. */
  public submitCombinedCompanySearch(): void {
    const search = ManualCashInputLocators.searchAccount;

    cy.get(search.companiesTab).click();
    cy.get(search.accountNumber).type('12345678');
    cy.get(search.companyName).type('Acme Ltd');
    cy.get(search.searchButton).click();
    cy.contains('h1', 'There is a problem').should('be.visible');
  }

  /** Selects Go back from the invalid-combination outcome. */
  public returnToSearchFromInvalidCombination(): void {
    cy.contains('.govuk-grid-column-two-thirds a.govuk-link', 'Go back').should('be.visible').click();
  }

  /** Confirms the search page, active company tab, and submitted company criteria are restored. */
  public assertCompanySearchCriteriaRetained(): void {
    const search = ManualCashInputLocators.searchAccount;

    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/payment/category/criminal/search');
    cy.get(search.heading).should('be.visible').and('have.text', 'Search for an account');
    cy.get(search.companiesTab).should('be.visible').and('have.attr', 'aria-selected', 'true');
    cy.get(search.accountNumber).should('have.value', '12345678');
    cy.get(search.companyName).should('have.value', 'Acme Ltd');
  }

  /** Follows the result link and verifies its new-tab destination renders Account Enquiry. */
  public openFirstAccountResultInNewTab(): void {
    cy.intercept('GET', '**/defendant-accounts/1/header-summary', {
      statusCode: 200,
      headers: { ETag: 'e2e-manual-cash-input-account-header' },
      body: ACCOUNT_HEADER_RESPONSE,
    }).as('manualCashInputAccountHeader');
    cy.intercept('GET', '**/defendant-accounts/1/at-a-glance', {
      statusCode: 200,
      headers: { ETag: 'e2e-manual-cash-input-account-at-a-glance' },
      body: ACCOUNT_AT_A_GLANCE_RESPONSE,
    }).as('manualCashInputAccountAtAGlance');

    cy.get('#criminalAccountNumber a')
      .should('be.visible')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'href', '/fines/account/defendant/1/details')
      // Keep the _blank assertion above; remove it only so Cypress can follow the Angular link in this tab.
      .invoke('removeAttr', 'target')
      .click();

    cy.location('pathname').should('eq', '/fines/account/defendant/1/details');
    cy.wait('@manualCashInputAccountHeader', { timeout: 15_000 }).its('response.statusCode').should('eq', 200);
    cy.wait('@manualCashInputAccountAtAGlance', { timeout: 15_000 }).its('response.statusCode').should('eq', 200);
    this.accountAtAGlance.assertAtAGlancePageVisible();
  }
}
