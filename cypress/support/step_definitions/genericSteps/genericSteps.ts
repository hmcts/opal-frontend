import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I click the {string} button and see {string} on the page header', (buttonName: string, bodyHeader: string) => {
  switch (buttonName) {
    case 'Return to account details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      break;
    }
    case 'Add employer details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      cy.get('a').contains('Cancel').click();
      break;
    }
    case 'Add contact details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      cy.get('a').contains('Cancel').click();
      break;
    }
    case 'Add personal details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      cy.get('a').contains('Cancel').click();
      break;
    }
    case 'Add parent or guardian details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      cy.get('a').contains('Cancel').click();
      break;
    }
    case 'Add company details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      cy.get('a').contains('Cancel').click();
      break;
    }
  }
});
Then('I click the {string} button', (buttonName: string) => {
  cy.contains('button', buttonName).click();
});

Then('I go back in the browser', () => {
  cy.go('back');
});

Then('I see the {string} section heading', (sectionName: string) => {
  cy.contains('h2', sectionName);
});
Then('I see the {string} link under the {string} section', (linkName: string, sectionName: string) => {
  cy.contains('h2', sectionName).next().contains('a', linkName);
});
Then('I see the greyed out {string} under the {string} section', (linkName: string, sectionName: string) => {
  cy.contains('h2', sectionName).next().contains('li', linkName);
});
Then('I see the {string} text under the {string} section', (text: string, sectionName: string) => {
  cy.contains('h2', sectionName).next().contains('p', text);
});
Then('I see the {string} button under the {string} section', (buttonName: string, sectionName: string) => {
  cy.contains('h2', sectionName).next().next().contains('button', buttonName);
});
Then('I see the {string} link', (linkName: string) => {
  cy.contains('a', linkName).should('exist');
});
Then('I do not see a back button or back link', () => {
  cy.contains('a', /back/i).should('not.exist');
  cy.contains('button', /back/i).should('not.exist');
});

Then('I see {string} below the {string} header', (defendantType: string, accountType: string) => {
  cy.contains('fieldset', accountType).find('opal-lib-govuk-radio').invoke('text').should('contains', defendantType);
});
Then('I see {string} is {string}', (accountList: string, value: string) => {
  cy.contains('dt', accountList).siblings().invoke('text').should('contains', value);
});
When('I reload the page', () => {
  cy.reload();
});

Then('I see {string} above the {string} field', (subHeading: string, fieldName: string) => {
  cy.contains('fieldset', fieldName).find('legend').invoke('text').should('contains', subHeading);
});

Then('I see {string} help text on the page', (helpText: string) => {
  cy.get('.moj-ticket-panel').should('contain.text', helpText);
});

Then('I do not see {string} help text on the page', (helpText: string) => {
  cy.get('.moj-ticket-panel').should('not.contain.text', helpText);
});

Then('I see {string} hint text on the page', (hintText: string) => {
  cy.get('.govuk-hint').should('contain', hintText);
});

Then('I see {string} text on the page', (text: string) => {
  cy.get('body').should('contain', text);
});

Then('I do not see {string} text on the page', (text: string) => {
  cy.contains(text).should('not.exist', text);
});

When('I see {string} text under the {string} field', (text: string, inputField: string) => {
  cy.get('opal-lib-govuk-text-area[labeltext="' + inputField + '"]')
    .find('textarea')
    .prev()
    .invoke('text')
    .should('contains', text);
});

Then('I see green banner on the top of the page', () => {
  cy.get('div[opal-lib-moj-alert]').should('exist');
});

Then('the account status is {string}', (expectedStatus: string) => {
  cy.get('.govuk-tag[id="status"]').should('be.visible').and('have.text', expectedStatus);
});
Then('I see {string} on the status heading',(expectedStatus:string) => {
  cy.get('h2.govuk-heading-m').should('be.visible').and('have.text', expectedStatus);
})
//div[id="success-message"]
Then('I see success message on the banner {string}',(expectedMessage:string) => {
  cy.get('div[id="success-message"]').should('exist').and('contain',expectedMessage)
})

