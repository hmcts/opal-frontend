import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import manualAccountPageObjects from '../../projectConfig/manual_account_page';
import contactDetails from '../../projectConfig/contact_details_page';
import personalDetails from '../../projectConfig/personal_details_page';

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

Then('I click on the {string} link', (linkText: string) => {
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
When('I enter work telephone number {string}', (workTelephone: string) => {
  contactDetails.enterWorkTelephone(workTelephone);
});

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

When('I enter incorrect work telephone number {string}', (incorrectWorkTelephone: string) => {
  contactDetails.enterWorkTelephone(incorrectWorkTelephone);
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
When('I update work telephone number {string}', (updateWorkTelephone: string) => {
  cy.get('#workTelephoneNumber').clear();
  contactDetails.enterWorkTelephone(updateWorkTelephone);
});
When('I verify primary email, home telephone is empty', () => {
  cy.get('#primaryEmailAddress').should('have.value', '');
  cy.get('#homeTelephoneNumber').should('have.value', '');
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

When('I select title {string} from dropdown', (title: string) => {
  personalDetails.selectTitle(title);
});
When('I enter data into first names and last name in personal details screen', (table: DataTable) => {
  const data = table.rowsHash();

  function typeIfNotBlank(selector: string, value: string) {
    if (value) {
      cy.get(selector).type(value);
    }
  }
  typeIfNotBlank('#firstNames', data['firstNames']);
  typeIfNotBlank('#lastName', data['lastName']);
});
Then('I select add aliases check box', () => {
  cy.get('input[type="checkbox"]').check().should('be.checked');
});
When('I enter alias1 details {string},{string}', (firstName: string, lastName: string) => {
  cy.get('#firstNames_0').type(firstName);
  cy.get('#lastName_0').type(lastName);
});
When('I enter alias2 details {string},{string}', (firstName: string, lastName: string) => {
  cy.get('#firstNames_1').type(firstName);
  cy.get('#lastName_1').type(lastName);
});
When('I enter alias3 details {string},{string}', (firstName: string, lastName: string) => {
  cy.get('#firstNames_2').type(firstName);
  cy.get('#lastName_2').type(lastName);
});
When('I enter alias4 details {string},{string}', (firstName: string, lastName: string) => {
  cy.get('#firstNames_3').type(firstName);
  cy.get('#lastName_3').type(lastName);
});
When('I enter alias5 details {string},{string}', (firstName: string, lastName: string) => {
  cy.get('#firstNames_4').type(firstName);
  cy.get('#lastName_4').type(lastName);
});
When('I select add another alias', () => {
  cy.get('#addAlias-conditional > app-govuk-button > button').click();
});
When('I enter make of the car {string}', (carBrand: string) => {
  cy.get('#makeOfCar').clear().type(carBrand);
});
When('I enter registration number of the car {string}', (carRegistration: string) => {
  cy.get('#registrationNumber').clear().type(carRegistration);
});
When('I enter National insurance number {string}', (nino: string) => {
  personalDetails.enterNINO(nino);
});
When('I enter address line 1 {string}', (addressLine1: string) => {
  personalDetails.enterAddressLine1(addressLine1);
});

When('I enter address line 2 {string}', (addressLine2: string) => {
  cy.get('#addressLine2').should('be.empty');
  cy.get('#addressLine2').type(addressLine2);
});
When('I enter address line 3 {string}', (addressLine3: string) => {
  cy.get('#addressLine3').should('be.empty').type(addressLine3);
});
When('I enter postcode {string}', (postcode: string) => {
  personalDetails.enterPostcode(postcode);
});

Then('I verify {string} sub heading', (aliasText: string) => {
  //cy.get('#addAlias-conditional > fieldset > legend').invoke('text').should('be.equal',aliasText);
  cy.contains('#addAlias-conditional > fieldset > legend', aliasText).invoke('text');
});
Then('I verify the text boxes {string},{string} below the sub heading', (firstName: string, lastName: string) => {
  cy.contains('h1', firstName)
    .invoke('text')
    .then((firstName) => firstName.replace(' ', '').trim());
  cy.contains('h1', lastName)
    .invoke('text')
    .then((lastName) => lastName.replace(' ', '').trim());
});
Then('I see {string} link below the {string} field', (removeLink: string, lastName: string) => {
  //cy.get('#addAlias-conditional > div > a').prev().parent('#addAlias-conditional > fieldset >app-govuk-text-input').invoke('text').should('contains', lastName);
  cy.get('#addAlias-conditional > fieldset >app-govuk-text-input > div >h1 ')
    .find('#addAlias-conditional>div > a')
    .invoke('text')
    .should('contains', removeLink);
});

Then('I select {string} button', (removeButton: string) => {
  cy.contains('a', removeButton).click();
});

Then('I no longer see {string} sub heading', (aliasText: string) => {
  cy.contains('#addAlias-conditional > fieldset > legend', aliasText).should('not.exist', aliasText);
});
Then('I verify the {string} text box below the {string} sub heading', (firstName: string, aliasText: string) => {
  cy.contains('#addAlias-conditional > fieldset > legend', aliasText)
    .next()
    .contains('h1', firstName)
    .invoke('text')
    .then((firstName) => firstName.replace(' ', '').trim());
});
Then(
  'I verify the {string} text box below the {string} sub heading and first names',
  (lastName: string, aliasText: string) => {
    cy.contains('#addAlias-conditional > fieldset > legend', aliasText)
      .next()
      .next()
      .contains('h1', lastName)
      .invoke('text')
      .then((lastName) => lastName.replace(' ', '').trim());
  },
);
Then('I verify the {string} button below the {string}', (removeLink: string, aliasText: string) => {
  cy.contains('#addAlias-conditional > fieldset > legend', aliasText)
    .invoke('text')
    .next()
    .contains('h1', 'First names')
    .invoke('text')
    .then((firstName) => firstName.replace(' ', '').trim())
    .next()
    .contains('h1', 'Last name')
    .invoke('text')
    .then((lastName) => lastName.replace(' ', '').trim())
    .prev()
    .contains('#addAlias-conditional > div > a', removeLink)
    .invoke('text')
    .should('have.text', removeLink);
});
When('I unselect aliases check box', () => {
  cy.get('input[type="checkbox"]').uncheck();
});
Then('I see {string} sub heading', (aliasText: string) => {
  cy.contains('#addAlias-conditional > fieldset > legend', aliasText).invoke('text').should('contains', aliasText);
});

Then('I verify {string} and {string} data should not be existed', (firstName: string, lastName: string) => {
  cy.get('#addAlias-conditional > fieldset >app-govuk-text-input >div>input').should('not.have.value', firstName);
  cy.get('#addAlias-conditional > fieldset >app-govuk-text-input >div>input').should('not.have.value', lastName);
});
When('I verify the error messages {string} for defendant screens', (errorMessage: string) => {
  cy.get('[class="govuk-error-message"]').should('contain', errorMessage);
});
When('I enter data into first names {string} and last name {string}', (firstName: string, lastName: string) => {
  personalDetails.enterFirstNamesInAlias(firstName);
  personalDetails.enterLastNamesInAlias(lastName);
});
When('I enter incorrect National insurance number {string}', (nino: string) => {
  personalDetails.enterNINO(nino);
});
When('I update title {string}', (title: string) => {
  personalDetails.selectTitle(title);
});
When('I update address line 1 {string}', (updateAddLine1: string) => {
  personalDetails.enterAddressLine1(updateAddLine1);
});
When('I enter incorrect address line 1 {string}', (incorrectAddLine1: string) => {
  personalDetails.enterAddressLine1(incorrectAddLine1);
});
When('I update the first names {string}', (updateFirstNames: string) => {
  personalDetails.enterFirstNames(updateFirstNames);
});
When('I update the last name {string}', (updateLastName: string) => {
  personalDetails.enterLastName(updateLastName);
});
When('I enter incorrect data into {string},{string}', (incorrectFirstNames: string, incorrectLastName: string) => {
  personalDetails.enterFirstNames(incorrectFirstNames);
  personalDetails.enterLastName(incorrectLastName);
});
Then(
  'I verify {string},{string},{string} and {string} on contact details',
  (title: string, firstNames: string, lastName: string, addLine1: string) => {
    cy.get('select').invoke('val').should('eq', title);
    cy.get('#firstNames').should('have.value', firstNames);
    cy.get('#lastName').should('have.value', lastName);
    cy.get('#addressLine1').should('have.value', addLine1);
  },
);
Then('I verify {string} and {string} in alias 1', (firstNames: string, lastName: string) => {
  cy.get('#addAlias-conditional > fieldset > app-govuk-text-input >div >input').should('be.empty');
  cy.get('#addAlias-conditional > fieldset > app-govuk-text-input >div >input').should('be.empty');
});

When(
  'I enter data into first names {string} and last name {string} in alias',
  (firstNamesAlias: string, lastNameAlias: string) => {
    personalDetails.enterFirstNamesInAlias(firstNamesAlias);
    personalDetails.enterLastNamesInAlias(lastNameAlias);
  },
);
When(
  'I verify the text boxes {string},{string} below the sub heading {string}',
  (firstNames: string, lastName: string, alias: string) => {
    cy.get('#addAlias-conditional > fieldset >legend')
      .next()
      .children('#addAlias-conditional > fieldset >app-govuk-text-input >')
      .invoke('text')
      .should('contains', firstNames);
    cy.get('#addAlias-conditional > fieldset >legend')
      .next()
      .next()
      .children('#addAlias-conditional > fieldset >app-govuk-text-input >')
      .invoke('text')
      .should('contains', lastName);
  },
);

When('{string} is verified as grey', (addContactDetailsButton: string) => {
  cy.get('#submitForm').should('be.visible', addContactDetailsButton);
  cy.get('#submitForm').should('be.enabled', addContactDetailsButton);
});

Then('I see the status of {string} is {string}', (linkText: string, status: string) => {
  cy.contains('[class="govuk-task-list__name-and-hint"]', linkText)
    .next()
    .contains('[class="govuk-task-list__status"]', status);
});
When('I enter {string} into the {string} search box', (searchText: string, searchBox: string) => {
  cy.contains('app-alphagov-accessible-autocomplete', searchBox, { matchCase: false })
    .find('label')
    .should('be.visible', searchBox)
    .type(searchText);
  //cy.get('ul').should('not.contain', 'No results found');
  cy.contains('app-alphagov-accessible-autocomplete', searchBox, { matchCase: false })
    .find('label')
    .should('be.visible', searchBox)
    .type('{downArrow}{enter}');
});

When('I see {string} under the {string} search box', (text: string, fieldName: string) => {
  cy.contains('app-alphagov-accessible-autocomplete', fieldName)
    .find('label')
    .next()
    .invoke('text')
    .should('contains', text);
});
When('I see {string} under the {string} field', (text: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName).find('input').prev().invoke('text').should('contains', text);
});
