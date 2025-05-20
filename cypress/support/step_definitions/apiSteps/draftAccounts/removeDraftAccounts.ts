import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given('I remove all draft accounts', () => {
  // First, get all draft accounts
  cy.request({
    method: 'GET',
    url: '/opal-fines-service/draft-accounts',
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 && response.body && response.body.summaries) {
      // Extract all draft account IDs
      const draftAccountIds = response.body.summaries.map((account: any) => account.draft_account_id);
      
      // Delete each draft account
      draftAccountIds.forEach((accountId: string | number) => {
        cy.request({
          method: 'DELETE',
          url: `/opal-fines-service/draft-accounts/${accountId}?ignoreMissing=true`,
          failOnStatusCode: false
        });
      });
      
      cy.log(`Removed ${draftAccountIds.length} draft accounts`);
    } else {
      cy.log('No draft accounts to remove or could not retrieve accounts');
    }
  });
});
