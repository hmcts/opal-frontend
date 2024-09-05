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
  cy.contains('a', linkName);
});
Then('I do not see a back button or back link', () => {
  cy.contains('a', /back/i).should('not.exist');
  cy.contains('button', /back/i).should('not.exist');
});

Then('I see {string} below the {string} header', (defendantType: string, accountType: string) => {
  cy.contains('fieldset', accountType).find('app-govuk-radio').invoke('text').should('contains', defendantType);
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
