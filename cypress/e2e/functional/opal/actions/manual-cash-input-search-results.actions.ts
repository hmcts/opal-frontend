import { ManualCashInputLocators } from '../../../../shared/selectors/finance.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { AccountDetailsAtAGlanceActions } from './account-details/details.at-a-glance.actions';

const log = createScopedLogger('ManualCashInputSearchResultsActions');
const SEARCH_RESULTS_PATH = '/fines/manual-cash-input/create/till/payment/category/criminal/matches';
const DEFENDANT_ACCOUNT_SEARCH_ENDPOINT = '**/opal-fines-service/defendant-accounts/search';
const SEARCH_RESULTS_RESPONSE = {
  count: 1,
  defendant_accounts: [
    {
      organisation_flag: false,
      business_unit_name: 'Bury St. Edmunds',
      business_unit_id: 'BU001',
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
    business_unit_id: 'BU001',
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
