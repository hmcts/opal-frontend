import { defineStep } from '@badeball/cypress-cucumber-preprocessor';
import { installDraftAccountCleanup, recordCreatedId, readDraftIdFromBody } from '../../../support/draftAccounts';

installDraftAccountCleanup();

/** Escape user-visible text for safe regex matching */
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Simple, exact path matcher for the create request */
function createDraftAccountsRoute() {
  return { method: 'POST', url: '/opal-fines-service/draft-accounts' } as const;
}

/**
 * Clicks a button (by visible text) and captures draft_account_id from the POST response.
 */
function clickAndCapture(buttonText: string) {
  cy.intercept(createDraftAccountsRoute()).as('createAccount');

  cy.contains('button', new RegExp(`^\\s*${escapeRegExp(buttonText)}\\s*$`, 'i'))
    .should('be.visible')
    .and('not.be.disabled')
    .click();

  cy.wait('@createAccount').then(({ request, response }) => {
    expect(response, 'network response').to.exist;
    expect(response!.statusCode, 'POST /draft-accounts status').to.equal(201);

    const id = readDraftIdFromBody(response!.body as unknown);
    recordCreatedId(id);
    cy.log(`Created Account ID: ${id}`);
  });
}

// single registration to avoid duplicates
defineStep('I click the {string} button and capture the created account number', clickAndCapture);
