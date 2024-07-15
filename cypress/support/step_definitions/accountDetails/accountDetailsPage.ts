import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then(
  'should display business unit account {string} I selected from Business unit and defendant type page',
  (businessUnit: string) => {
    cy.get('#accountDetailsBusinessUnitKey').should('have.text', 'Business unit');
    cy.get('#accountDetailsBusinessUnitValue').should('have.text', businessUnit);
  },
);

Then(
  'should display defendant type {string} I selected from Business unit and defendant type page',
  (defendantType) => {
    cy.get('#accountDetailsDefendantTypeKey').should('have.text', 'Defendant type');
    cy.get('#accountDetailsDefendantTypeValue').should('have.text', defendantType);
  },
);

Then('I see {string} on the section heading', (sectionHeading: string) => {
  cy.get('h2').should('contain', sectionHeading);
});
When('I check text under review and publish', (sectionText: string) => {
  //cy.get('p').should('contain', sectionText);
  cy.contains('p').should('contain', sectionText);
  // .then(txt=>{
  //  const versionTxt = txt.find('p').text()
  //  expect(versionTxt).to.equal(sectionText)
  // })
});

Then('I click cancel on Contact details page', () => {
  cy.get('a').contains('Cancel').click();
});

Then('{string} button is clicked, nothing happens', (button: string) => {
  cy.get('#reviewAccountButton').should('contain', button).click();
});

When('{string} link is clicked, nothing happens', (linkText: string) => {
  cy.contains('Cancel account creation').should('contain', linkText).click();
});
Then('I see {string} button above {string}', (buttonText: string, linkText: string) => {
  cy.get('p').should('have.text', linkText).prev().should('have.text', buttonText);
});
