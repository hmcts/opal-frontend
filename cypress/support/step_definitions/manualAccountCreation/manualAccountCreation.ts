import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I navigate to Manual Account Creation', () => {
  cy.get('#finesMacLink').should('contain', 'Manual Account Creation').click();
});

Then('I see {string} on the page header', (bodyHeader) => {
  cy.get('h1').should('contain', bodyHeader);
});

Then('I see {string} on the status heading', (statusHeading: string) => {
  cy.get('h2').should('contain', statusHeading);
});
Then('I navigate back to {string} page', (bodyHeader) => {
  cy.get('[class="govuk-back-link"]').click();
  cy.get('h1').should('contain', bodyHeader);
});

Then('I click continue to Create Account page', () => {
  cy.get('#accountDetailsContinue').click();
});

Then('I see {string} above {string}', (aboveText: string, belowText: string) => {
  cy.get('h1').should('have.text', belowText).prev().should('have.text', aboveText);
});

Then('I save and return to tasks', () => {
  cy.get('submitForm').click();
});
When('I select OK on the pop up window', () => {
  cy.on('window:confirm', (windowMessage) => {
    expect(windowMessage).to.equal(
      'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
    );
  });
});

When('I select cancel on the pop up window', () => {
  cy.on('uncaught:exception', () => {
    cy.on('window:cancel', (windowMessage: string) => {
      cy.get(windowMessage).invoke('show');
      expect(windowMessage).to.equals(
        'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
      );
      // const isWindowMessageEqual =
      //   windowMessage ===
      //   'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.';
      // if (isWindowMessageEqual) {
      //   cy.log('Window message is equal');
      return true;
      // }
      // if (!isWindowMessageEqual) {
      //   return true;
      // }
    });
  });
});

Then('I see the business unit heading is {string}', (businessUnitHeading: string) => {
  cy.get('#fm_create_account_business_unit_id-hint').prev().should('contains.text', businessUnitHeading);
});
Then('I see the business unit help text is {string}', (businessUnitHelpText: string) => {
  cy.get('#fm_create_account_business_unit_id-hint').should('contains.text', businessUnitHelpText);
});
Then('I see the search box below the business unit help text', () => {
  cy.get('#fm_create_account_business_unit_id-hint')
    .next()
    .children()
    .children('input')
    .should('have.attr', 'id', 'fm_create_account_business_unit_id-autocomplete');
});
Then('I enter {string} into the business unit search box', (businessUnit: string) => {
  cy.get('#fm_create_account_business_unit_id-autocomplete').type(businessUnit);
  cy.get('#fm_create_account_business_unit_id-autocomplete').should('not.contain', 'No results found');
  cy.get('#fm_create_account_business_unit_id-autocomplete').type('{downArrow}{enter}');
});
Then('I see the value {string} in the business unit search box', (businessUnit: string) => {
  cy.get('#fm_create_account_business_unit_id-autocomplete').should('have.value', businessUnit);
});
Then('I see the defendant type heading is {string}', (businessUnitHeading: string) => {
  cy.get('#defendantTypeHint').prev().should('contains.text', businessUnitHeading);
});
Then('I see the defendant type help text is {string}', (businessUnitHelpText: string) => {
  cy.get('#defendantTypeHint').should('contains.text', businessUnitHelpText);
});

When('I select title {string} from dropdown', (title: string) => {
  cy.get('select').select(title);
});

Then('I verify the text boxes {string},{string} below the sub heading', (firstName: string, lastName: string) => {
  cy.contains('h1', firstName)
    .invoke('text')
    .then((firstName) => firstName.replace(' ', '').trim());
  cy.contains('h1', lastName)
    .invoke('text')
    .then((lastName) => lastName.replace(' ', '').trim());
});

When('{string} is verified as grey', (addContactDetailsButton: string) => {
  cy.get('#submitForm').should('be.visible', addContactDetailsButton);
  cy.get('#submitForm').should('be.enabled', addContactDetailsButton);
});

Then('I see the status of {string} is {string}', (linkText: string, status: string) => {
  cy.contains('[class="govuk-task-list__name-and-hint"]', linkText)
    .next()
    .contains('[class="govuk-task-list__status"]', status);
});

Then('{string} is verified as disabled', (link: string) => {
  cy.contains('opal-lib-govuk-task-list-item', link).should('be.visible', link);
  cy.contains('opal-lib-govuk-task-list-item > li', link).invoke('is', 'disabled');
});
Then('{string} is verified as enabled', (link: string) => {
  cy.contains('a', link).invoke('is', 'enabled');
});
