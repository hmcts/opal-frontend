import { Then, When } from '@badeball/cypress-cucumber-preprocessor/';
import manualAccountPageObjects from '../../projectConfig/manual_account_page';
import contactDetails from '../../projectConfig/contact_details_page';

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

// When('I select cancel on the pop up window',() => {
//   cy.on('uncaught:exception', () => {
//   const stubMessage = cy.stub()
//   stubMessage.onFirstCall().returns(false)
//   cy.on('window:confirm', stubMessage)
//   })
// })

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
Then('I see {string} above the defendant type heading', (businessUnitText: string) => {
  cy.get('#defendantType')
    .should('contain.text', 'Defendant type')
    .parent()
    .parent()
    .parent()
    .find('p')
    .should('have.text', businessUnitText);
});
Then('I see the business unit is {string}', (businessUnit: string) => {
  cy.get('#accountDetailsBusinessUnitValue').should('have.text', businessUnit);
});
Then('I see the defendant type is {string}', (defendantType: string) => {
  cy.get('#accountDetailsDefendantTypeValue').should('have.text', defendantType);
});
Then('I see the business unit heading is {string}', (businessUnitHeading: string) => {
  cy.get('#businessUnit-hint').prev().should('contains.text', businessUnitHeading);
});
Then('I see the business unit help text is {string}', (businessUnitHelpText: string) => {
  cy.get('#businessUnit-hint').should('contains.text', businessUnitHelpText);
});
Then('I see the search box below the business unit help text', () => {
  cy.get('#businessUnit-hint')
    .next()
    .children()
    .children('input')
    .should('have.attr', 'id', 'businessUnit-autocomplete');
});
Then('I enter {string} into the business unit search box', (businessUnit: string) => {
  cy.get('#businessUnit-autocomplete').type(businessUnit);
  cy.get('#businessUnit-autocomplete__listbox').should('not.contain', 'No results found');
  cy.get('#businessUnit-autocomplete').type('{downArrow}{enter}');
});
Then('I see the value {string} in the business unit search box', (businessUnit: string) => {
  cy.get('#businessUnit-autocomplete').should('have.value', businessUnit);
});
Then('I see the defendant type heading is {string}', (businessUnitHeading: string) => {
  cy.get('#defendantTypeHint').prev().should('contains.text', businessUnitHeading);
});
Then('I see the defendant type help text is {string}', (businessUnitHelpText: string) => {
  cy.get('#defendantTypeHint').should('contains.text', businessUnitHelpText);
});
Then('I see the {string} radio button below the defendant type help text', (radioButton: string) => {
  cy.get('#defendantTypeHint').next().contains('label', radioButton);
});

When('I enter primary email address {string}', (primaryEmail: string) => {
  contactDetails.enterPrimaryEmail(primaryEmail);
});

When('I enter secondary email address {string}', (secondaryEmail: string) => {
  contactDetails.enterSecondaryEmail(secondaryEmail);
});
When('I enter mobile telephone number {string}', (mobileTelephone: string) => {
  contactDetails.enterMobileTelephone(mobileTelephone);
});
When('I enter home telephone number {string}', (homeTelephone: string) => {
  contactDetails.enterHomeTelephone(homeTelephone);
});
When('I enter business telephone number {string}', (businessTelephone: string) => {
  contactDetails.enterBusinessTelephone(businessTelephone);
});

Then(
  'I verify {string},{string},{string},{string},{string} on contact details page',
  (primaryEmail, secondaryEmail, mobileTelephone, homeTelephone, businessTelephone: string) => {
    cy.get('#primaryEmailAddress').should('have.value', primaryEmail);
    cy.get('#secondaryEmailAddress').should('have.value', secondaryEmail);
    cy.get('#mobileTelephoneNumber').should('have.value', mobileTelephone);
    cy.get('#homeTelephoneNumber').should('have.value', homeTelephone);
    cy.get('#businessTelephoneNumber').should('have.value', businessTelephone);
  },
);

Then(
  'I verify {string},{string},{string} on contact details page',
  (primaryEmail, secondaryEmail, homeTelephone: string) => {
    cy.get('#primaryEmailAddress').should('have.value', primaryEmail);
    cy.get('#secondaryEmailAddress').should('have.value', secondaryEmail);
    cy.get('#homeTelephoneNumber').should('have.value', homeTelephone);
  },
);

When('I enter incorrect primary email address {string}', (incorrectPrimaryEmail: string) => {
  contactDetails.enterPrimaryEmail(incorrectPrimaryEmail);
});

When('I enter incorrect secondary email address {string}', (incorrectSecondaryEmail: string) => {
  contactDetails.enterSecondaryEmail(incorrectSecondaryEmail);
});

When('I enter incorrect mobile telephone number {string}', (incorrectMobileNumber: string) => {
  contactDetails.enterMobileTelephone(incorrectMobileNumber);
});

When('I enter incorrect home telephone number {string}', (incorrectHomeTelephone: string) => {
  contactDetails.enterHomeTelephone(incorrectHomeTelephone);
});

When('I enter incorrect business telephone number {string}', (incorrectBusinessTelephone: string) => {
  contactDetails.enterBusinessTelephone(incorrectBusinessTelephone);
});
When('I update primary email address {string}', (updatePrimaryEmail: string) => {
  cy.get('#primaryEmailAddress').clear();
  contactDetails.enterPrimaryEmail(updatePrimaryEmail);
});
When('I update secondary email address {string}', (updateSecondaryEmail: string) => {
  cy.get('#secondaryEmailAddress').clear();
  contactDetails.enterSecondaryEmail(updateSecondaryEmail);
});
When('I update mobile telephone number {string}', (updateMobileNumber: string) => {
  cy.get('#mobileTelephoneNumber').clear();
  contactDetails.enterMobileTelephone(updateMobileNumber);
});
When('I update home telephone number {string}', (updateHomeTelephone: string) => {
  cy.get('#homeTelephoneNumber').clear();
  contactDetails.enterHomeTelephone(updateHomeTelephone);
});
When('I update business telephone number {string}', (updateBusinessTelephone: string) => {
  cy.get('#businessTelephoneNumber').clear();
  contactDetails.enterBusinessTelephone(updateBusinessTelephone);
});
When('I verify primary email, home telephone is empty', () => {
  cy.get('#primaryEmailAddress').should('have.value', '');
  cy.get('#homeTelephoneNumber').should('have.value', '');
});
Then('I see the {string} section heading', (sectionName: string) => {
  cy.contains('h2', sectionName);
});
Then('I see the {string} link under the {string} section', (linkName: string, sectionName: string) => {
  cy.contains('h2', sectionName).next().contains('a', linkName);
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
Then('I enter more than 30 characters into the {string} field', (fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName).find('input').clear().type('Test'.repeat(10));
});
Then('I see the error message {string} at the top of the page', (errorMessage: string) => {
  cy.get('.govuk-error-summary').should('contain', errorMessage);
});
Then('I see the error message {string} above the {string} field', (errorMessage: string, fieldName: string) => {
  cy.contains('.govuk-error-message', errorMessage).prev().should('contain', fieldName);
});
Then('I see the error message {string} above the Date of birth field', (errorMessage: string) => {
  cy.contains('.govuk-error-message', errorMessage).siblings('label').should('contain', 'Date of birth');
});
Then('I enter {string} into the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName).find('input').clear().type(value);
});
Then('I enter {string} into the Date of birth field', (dob: string) => {
  cy.get('app-scotgov-date-picker').find('input').clear().type(dob);
});
Then('I see {string} in the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName).find('input').should('have.value', value);
});
Then('I see {string} in the Date of birth field', (dob: string) => {
  cy.get('app-scotgov-date-picker').find('input').should('have.value', dob);
});
Then('I click Cancel, a window pops up and I click Ok', () => {
  cy.contains('a', 'Cancel').click();
  cy.on('window:confirm', () => {});
});
Then('I click Cancel, a window pops up and I click Cancel', () => {
  cy.contains('a', 'Cancel').click();
  cy.on('window:confirm', () => {
    return false;
  });
});
