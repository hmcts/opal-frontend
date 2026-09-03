import { ConsolidatedAccountsLocators } from '../../../../../shared/selectors/account-details/account.consolidated-accounts.locators';
import { AccountNavDetailsLocators } from '../../../../../shared/selectors/account-details/account.nav.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsConsolidatedAccountsActions');

const CHILD_ACCOUNT = {
  account_id: 99000000990002,
  account_number: '99009902C',
  date_imposed: '2025-01-12',
  first_name: 'Casey',
  imposed_by: 'Seed Child Court',
  last_name: 'Child',
  reference: 'LOCAL-CONSOL-CHILD',
};

/**
 * Actions for the Account Details Consolidated accounts tab.
 */
export class AccountDetailsConsolidatedAccountsActions {
  private static readonly WAIT_MS = 15_000;

  /**
   * Presents the supplied account as a master account with one consolidated child account.
   *
   * @param accountId - Current defendant account ID.
   * @param header - Current account header payload.
   */
  public stubMasterAccountWithChild(accountId: number, header: Record<string, unknown>): void {
    log('intercept', 'Presenting account as a master account with one consolidated child account', { accountId });

    cy.intercept('GET', `**/defendant-accounts/${accountId}/header-summary`, {
      statusCode: 200,
      headers: { ETag: 'e2e-consolidated-header' },
      body: { ...header, has_consolidated_accounts: true },
    }).as('consolidatedHeaderSummary');

    cy.intercept('GET', `**/defendant-accounts/${accountId}/consolidated-accounts`, {
      statusCode: 200,
      headers: { ETag: 'e2e-consolidated-accounts' },
      body: [CHILD_ACCOUNT],
    }).as('consolidatedAccounts');

    cy.intercept('GET', `**/defendant-accounts/${CHILD_ACCOUNT.account_id}/header-summary`, {
      statusCode: 200,
      headers: { ETag: 'e2e-consolidated-child-header' },
      body: {
        ...header,
        account_number: CHILD_ACCOUNT.account_number,
        defendant_account_id: String(CHILD_ACCOUNT.account_id),
        defendant_account_party_id: String(CHILD_ACCOUNT.account_id),
        account_status_reference: {
          account_status_code: 'CS',
          account_status_display_name: 'Consolidated',
        },
        has_consolidated_accounts: false,
        party_details: {
          party_id: String(CHILD_ACCOUNT.account_id),
          organisation_flag: false,
          organisation_details: null,
          individual_details: {
            title: null,
            forenames: CHILD_ACCOUNT.first_name,
            surname: CHILD_ACCOUNT.last_name,
            date_of_birth: null,
            age: null,
            national_insurance_number: null,
            individual_aliases: null,
          },
        },
      },
    }).as('consolidatedChildHeaderSummary');

    cy.intercept('GET', `**/defendant-accounts/${CHILD_ACCOUNT.account_id}/at-a-glance`, {
      statusCode: 200,
      headers: { ETag: 'e2e-consolidated-child-at-a-glance' },
      body: {
        version: null,
        defendant_account_id: String(CHILD_ACCOUNT.account_id),
        account_number: CHILD_ACCOUNT.account_number,
        debtor_type: 'PERSON',
        is_youth: false,
        party_details: {
          party_id: String(CHILD_ACCOUNT.account_id),
          organisation_flag: false,
          organisation_details: null,
          individual_details: {
            title: null,
            forenames: CHILD_ACCOUNT.first_name,
            surname: CHILD_ACCOUNT.last_name,
            date_of_birth: null,
            national_insurance_number: null,
            individual_aliases: null,
          },
        },
        address: {
          address_line_1: '1 Child Street',
          address_line_2: null,
          address_line_3: null,
          address_line_4: null,
          address_line_5: null,
          postcode: 'CH1 1LD',
        },
        language_preferences: null,
        payment_terms: null,
        enforcement_status: {
          last_enforcement_action: null,
          collection_order_made: false,
          default_days_in_jail: 0,
          enforcement_override: null,
          last_movement_date: null,
        },
        comments_and_notes: null,
      },
    }).as('consolidatedChildAtAGlance');
  }

  /**
   * Asserts the consolidated accounts table is visible and contains child account rows.
   */
  public assertChildAccountsTableVisible(): void {
    log('assert', 'Checking consolidated accounts table is visible');

    cy.get(ConsolidatedAccountsLocators.tabRoot, {
      timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS,
    }).should('be.visible');
    cy.get(ConsolidatedAccountsLocators.tableRows, {
      timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS,
    }).should('have.length.at.least', 1);
    cy.get(ConsolidatedAccountsLocators.firstChildAccountLink(0))
      .should('be.visible')
      .and('contain.text', CHILD_ACCOUNT.account_number);
  }

  /**
   * Opens the Consolidated accounts tab and waits for its table payload.
   */
  public openTab(): void {
    log('navigate', 'Opening Consolidated accounts tab');

    cy.get(ConsolidatedAccountsLocators.tabLink, {
      timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS,
    })
      .should('be.visible')
      .click();

    cy.get(ConsolidatedAccountsLocators.activeTabLink)
      .should('be.visible')
      .and('contain.text', 'Consolidated accounts');
    cy.wait('@consolidatedAccounts', { timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS })
      .its('response.statusCode')
      .should('eq', 200);
    cy.get(ConsolidatedAccountsLocators.tabRoot, {
      timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS,
    }).should('be.visible');
  }

  /**
   * Clicks the first child account link and asserts it routes to the At a glance tab.
   */
  public openFirstChildAtAGlance(): void {
    log('open', 'Opening first consolidated child account at At a glance');

    cy.get(ConsolidatedAccountsLocators.firstChildAccountLink(0), {
      timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS,
    })
      .should('be.visible')
      .and('contain.text', CHILD_ACCOUNT.account_number)
      .and(($link) => {
        expect($link.attr('href')).to.eq(`/fines/account/defendant/${CHILD_ACCOUNT.account_id}/details#at-a-glance`);
      })
      .invoke('removeAttr', 'target')
      .click();

    cy.location('pathname', { timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS }).should(
      'eq',
      `/fines/account/defendant/${CHILD_ACCOUNT.account_id}/details`,
    );
    cy.location('hash', { timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS }).should('eq', '#at-a-glance');
    cy.wait('@consolidatedChildHeaderSummary', { timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS })
      .its('response.statusCode')
      .should('eq', 200);
    cy.wait('@consolidatedChildAtAGlance', { timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS })
      .its('response.statusCode')
      .should('eq', 200);
    cy.get(ConsolidatedAccountsLocators.headerCaption, { timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS })
      .should('be.visible')
      .and('contain.text', CHILD_ACCOUNT.account_number);
  }

  /**
   * Asserts the selected child account details are shown for the opened record.
   */
  public assertSelectedChildAccountDetailsVisible(): void {
    log('assert', 'Checking selected child account details are visible');

    cy.get(ConsolidatedAccountsLocators.headerCaption, { timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS })
      .should('be.visible')
      .and('contain.text', CHILD_ACCOUNT.account_number);
  }

  /**
   * Asserts the selected consolidated child account displays the closed account banner.
   */
  public assertSelectedChildAccountStatusBannerVisible(): void {
    log('assert', 'Checking selected child account closed banner is visible');

    cy.get(AccountNavDetailsLocators.banners.accountStatus, {
      timeout: AccountDetailsConsolidatedAccountsActions.WAIT_MS,
    })
      .should('be.visible')
      .and('contain.text', 'Account closed')
      .and('contain.text', 'Account consolidated');
    cy.get(AccountNavDetailsLocators.banners.accountStatusInformationAlert).should('be.visible');
  }
}
