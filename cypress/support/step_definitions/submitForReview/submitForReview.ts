import { After, Then } from '@badeball/cypress-cucumber-preprocessor';

let createdAccount: string[] = [];
Then('I click the {string} button and capture the created account number', (buttonName: string) => {
  cy.intercept('POST', '/opal-fines-service/draft-accounts').as('createAccount');
  cy.contains('button', buttonName).click();
  cy.wait('@createAccount').then((interception) => {
    const createdAccountId = interception.response?.body.draft_account_id;
    if (createdAccountId) {
      createdAccount.push(createdAccountId);
      cy.log('Created Account ID: ' + createdAccountId);
    }
    expect(interception.response?.statusCode).to.equal(201);
  });
});

afterEach(() => {
  if (createdAccount.length > 0) {
    createdAccount.forEach((accountId) => {
      cy.request('DELETE', `/opal-fines-service/draft-accounts/${accountId}?ignoreMissing=true`);
      createdAccount = createdAccount.filter((id) => id !== accountId);
    });
  }
});
