import { Then, When } from '@badeball/cypress-cucumber-preprocessor/';
import manualAccountPageObjects from '../../projectConfig/manual_account_page';

Then('I navigate to Manual Account Creation', () => {
  cy.get('#manualAccountCreationLink').should('contain', 'Manually Create Account').click();
});

Then('I see {string} on the page header', (bodyHeader) => {
  cy.get('h1').should('contain', bodyHeader);
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

When('{string} is clicked, nothing happens', (linkText: string) => {
  let initialUrl: string;
  cy.url().then((url) => {
    initialUrl = url.toString();
    cy.get('a').contains(linkText).should('have.attr', 'onclick', 'return false;');
    cy.get('a').contains(linkText).click();
    cy.url().should('eq', initialUrl);
  });
});
When('The button {string} is clicked, nothing happens', (linkText: string) => {
  let initialUrl: string;
  cy.url().then((url) => {
    initialUrl = url.toString();
    cy.get('button').contains(linkText).click();
    cy.url().should('eq', initialUrl);
  });
});

Then('I click on {string} link', (linkText: string) => {
  cy.get('a').contains(linkText).click();
});
When('{string} is clicked', (linkText: string) => {
  cy.get('a').contains(linkText).click();
});

When('I enter employer name {string}', (employerName: string) => {
  manualAccountPageObjects.enterEmployerName(employerName);
});
Then('I enter employee reference number or nino {string}', (employeeNino: string) => {
  manualAccountPageObjects.enterEmployeeReferenceNumber(employeeNino);
});
Then('I enter employer email address {string}', (employerEmail: string) => {
  manualAccountPageObjects.enterEmployerEmail(employerEmail);
});
Then('I enter employer telephone number {string}', (employerTelephone: string) => {
  manualAccountPageObjects.enterEmployerTelephone(employerTelephone);
});
Then('I enter employer address line1 {string}', (employerAddress1: string) => {
  manualAccountPageObjects.enterEmployerAddressLine1(employerAddress1);
});
Then('I enter employer address line2 {string}', (employerAddress2: string) => {
  manualAccountPageObjects.enterEmployerAddressLine2(employerAddress2);
});

Then('I enter employer address line3 {string}', (employerAddress3: string) => {
  manualAccountPageObjects.enterEmployerAddressLine3(employerAddress3);
});
Then('I enter employer address line4 {string}', (employerAddress4: string) => {
  manualAccountPageObjects.enterEmployerAddressLine4(employerAddress4);
});
Then('I enter employer address line5 {string}', (employerAddress5: string) => {
  manualAccountPageObjects.enterEmployerAddressLine5(employerAddress5);
});
Then('I enter employer postcode {string}', (employerPostCode: string) => {
  manualAccountPageObjects.enterEmployerPostcode(employerPostCode);
});
Then('I save and return to tasks', () => {
  cy.get('submitForm').click();
});
Then('I verify employer name, employer postcode is empty', () => {
  cy.get('#employerName').should('be.empty');
  cy.get('#employerPostcode').should('be.empty');
});

Then('I verify employer name, employer reference, employer address is empty', () => {
  cy.get('#employerName').should('be.empty');
  cy.get('#employeeReference').should('be.empty');
  cy.get('#employerAddress1').should('be.empty');
});

Then('I click save and return to tasks', () => {
  cy.get('#submitForm').click();
});

Then(
  'I verify {string},{string},{string},{string},{string},{string},{string},{string},{string},{string} values saved',
  (
    employerName: string,
    employeeNino: string,
    employerEmail: string,
    employerTelephone: string,
    employerAddress1: string,
    employerAddress2: string,
    employerAddress3: string,
    employerAddress4: string,
    employerAddress5: string,
    employerPostCode: string,
  ) => {
    cy.get('#employerName').should('have.value', employerName);
    cy.get('#employeeReference').should('have.value', employeeNino);
    cy.get('#employerEmailAddress').should('have.value', employerEmail);
    cy.get('#employerTelephone').should('have.value', employerTelephone);
    cy.get('#employerAddress1').should('have.value', employerAddress1);
    cy.get('#employerAddress2').should('have.value', employerAddress2);
    cy.get('#employerAddress3').should('have.value', employerAddress3);
    cy.get('#employerAddress4').should('have.value', employerAddress4);
    cy.get('#employerAddress5').should('have.value', employerAddress5);
    cy.get('#employerPostcode').should('have.value', employerPostCode);
  },
);

When('I enter incorrect employer name {string}', (incorrectEmpName: string) => {
  manualAccountPageObjects.enterEmployerName(incorrectEmpName);
});

When('I enter incorrect employee reference number of nino {string}', (incorrectEmpNino: string) => {
  manualAccountPageObjects.enterEmployeeReferenceNumber(incorrectEmpNino);
});

When('I enter incorrect employer email address {string}', (incorrectEmail: string) => {
  manualAccountPageObjects.enterEmployerEmail(incorrectEmail);
});
When('I enter incorrect employer telephone number {string}', (incorrectTelephone: string) => {
  manualAccountPageObjects.enterEmployerTelephone(incorrectTelephone);
});
When('I enter incorrect employer address line 1 {string}', (incorrectAddressLine1: string) => {
  manualAccountPageObjects.enterEmployerAddressLine1(incorrectAddressLine1);
});
When('I enter incorrect employer address line 2 {string}', (incorrectAddressLine2: string) => {
  manualAccountPageObjects.enterEmployerAddressLine2(incorrectAddressLine2);
});
When('I enter incorrect employer address line 3 {string}', (incorrectAddressLine3: string) => {
  manualAccountPageObjects.enterEmployerAddressLine3(incorrectAddressLine3);
});
When('I enter incorrect employer address line 4 {string}', (incorrectAddressLine4: string) => {
  manualAccountPageObjects.enterEmployerAddressLine4(incorrectAddressLine4);
});
When('I enter incorrect employer address line 5 {string}', (incorrectAddressLine5: string) => {
  manualAccountPageObjects.enterEmployerAddressLine5(incorrectAddressLine5);
});
When('I enter incorrect employer postcode {string}', (incorrectPostCode: string) => {
  manualAccountPageObjects.enterEmployerPostcode(incorrectPostCode);
});
Then('I verify the error message', () => {
  manualAccountPageObjects.verifyErrorSummary();
  //cy.get('[class="govuk-error-message"]').should('have.text',errorMessage);
  manualAccountPageObjects.verifyEmployerDetailsErrorMessages();
});

When('I select OK on the pop up window', () => {
  cy.get('a').contains('Cancel').click();
  cy.on('window:confirm', (windowMessage: string) => {
    expect(windowMessage).to.equal(
      'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
    );
  });
});

When('I select cancel on the pop up window', () => {
  cy.get('a').contains('Cancel').click();
  cy.on('window:confirm', (windowMessage: string) => {
    const isWindowMessageEqual =
      windowMessage ===
      'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.';
    if (isWindowMessageEqual) {
      cy.log('Window message is equal');
      return false;
    }
    if (!isWindowMessageEqual) {
      return true;
    }
  });
});

Then('I update employer name {string}', (employerName: string) => {
  cy.get('#employerName').clear();
  manualAccountPageObjects.enterEmployerName(employerName);
});
Then('I update employee reference number or nino {string}', (employeeNino: string) => {
  cy.get('#employeeReference').clear();
  manualAccountPageObjects.enterEmployeeReferenceNumber(employeeNino);
});
Then('I update employer email address {string}', (employerEmail: string) => {
  cy.get('#employerEmailAddress').clear();
  manualAccountPageObjects.enterEmployerEmail(employerEmail);
});
Then('I update employer telephone number {string}', (employerTelephone: string) => {
  cy.get('#employerTelephone').clear();
  manualAccountPageObjects.enterEmployerTelephone(employerTelephone);
});
Then('I update employer address line1 {string}', (employerAddress1: string) => {
  cy.get('#employerAddress1').clear();
  manualAccountPageObjects.enterEmployerAddressLine1(employerAddress1);
});
Then('I update employer address line2 {string}', (employerAddress2: string) => {
  cy.get('#employerAddress2').clear();
  manualAccountPageObjects.enterEmployerAddressLine2(employerAddress2);
});
Then('I update employer address line3 {string}', (employerAddress3: string) => {
  cy.get('#employerAddress3').clear();
  manualAccountPageObjects.enterEmployerAddressLine3(employerAddress3);
});
Then('I update employer address line4 {string}', (employerAddress4: string) => {
  cy.get('#employerAddress4').clear();
  manualAccountPageObjects.enterEmployerAddressLine4(employerAddress4);
});
Then('I update employer address line5 {string}', (employerAddress5: string) => {
  cy.get('#employerAddress5').clear();
  manualAccountPageObjects.enterEmployerAddressLine5(employerAddress5);
});
Then('I update employer postcode {string}', (employerPostCode: string) => {
  cy.get('#employerPostcode').clear();
  manualAccountPageObjects.enterEmployerPostcode(employerPostCode);
});
