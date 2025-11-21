import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I enter {string} into the Issuing Authority search box', (issuingAuthority: string) => {
  cy.get('#fm_fp_court_details_originator_id-autocomplete').type(issuingAuthority);
  cy.get('.autocomplete__option').should('not.contain', 'No results found');
  cy.get('#fm_fp_court_details_originator_id-autocomplete').type('{downArrow}{enter}');
});

Then('I enter {string} into the Enforcement court search box', (enforcementCourt: string) => {
  cy.get('#fm_fp_court_details_imposing_court_id-autocomplete').type(enforcementCourt);
  cy.get('.autocomplete__option').should('not.contain', 'No results found');
  cy.get('#fm_fp_court_details_imposing_court_id-autocomplete').type('{downArrow}{enter}');
});

Then('I enter {string} into the Amount imposed field', (value: string) => {
  cy.get('#fm_fp_offence_details_amount_imposed').type(value);
});

Then('I see {string} in the Amount imposed field', (value: string) => {
  cy.get('#fm_fp_offence_details_amount_imposed').should('have.value', value);
});

Then('I see {string} in the Offence code field', (offenceCode: string) => {
  // Use a more flexible selector that will match across different component structures
  cy.get('div[summaryListRowId="offenceCode"] dd').should('contain', offenceCode);
});

Then('I click the change link for the {string} section', (sectionName: string) => {
  // Find the summary card with the section title and click its change link
  cy.contains('h2.govuk-summary-card__title', sectionName)
    .parents('.govuk-summary-card')
    .find('a')
    .contains('Change')
    .click();
});

Then('I see {string} in the Account comments and notes section', (text: string) => {
  // Find the Account comments and notes section and verify the text content
  cy.contains('h2.govuk-summary-card__title', 'Account comments and notes')
    .parents('.govuk-summary-card')
    .find('dd')
    .should('contain', text);
});

Then('I verify all Fixed Penalty account summary sections and values are displayed in order', () => {
  // Check the page heading
  cy.get('h1.govuk-heading-l').should('contain', 'Mr FakeFixed FAKELAST').and('be.visible');

  // Verify the sections are displayed in the correct order
  const expectedSections = [
    'Issuing authority and court details',
    'Personal details',
    'Offence Details',
    'Account comments and notes',
  ];

  // Get all section headings and check they appear in order
  cy.get('.govuk-summary-card__title').each(($el, index) => {
    cy.wrap($el).should('contain', expectedSections[index]);
  });

  // Section 1 - Account Details (No heading)
  cy.get('[summaryListRowId="businessUnit"] dd').should('contain', 'Camberwell Green');
  cy.get('[summaryListRowId="accountType"] dd').should('contain', 'Fixed Penalty');
  cy.get('[summaryListRowId="defendantType"] dd').should('contain', 'Adult or youth only');

  // Section 2 - Issuing Authority and Court Details
  cy.get('[summaryListRowId="issuingAuthority"] dd').should('exist').and('contain', 'undefined');
  cy.get('[summaryListRowId="enforcementCourt"] dd').should('exist').and('contain', 'Court 777 Camberwell CH09 (777)');

  // Section 3 - Personal Details (Adult/Youth)
  cy.get('[summaryListRowId="title"] dd').should('contain', 'Mr');
  cy.get('[summaryListRowId="forenames"] dd').should('contain', 'FakeFixed');
  cy.get('[summaryListRowId="surname"] dd').should('contain', 'FAKELAST');

  // should display field values with correct formatting (AC2b)
  cy.get('#personalDetailsDobValue').should('contain', '02 November 2005 (Adult)');

  cy.get('[summaryListRowId="address"] dd').should('contain', '63 Fake Street').and('contain', 'AB12FD');

  // Section 5 - Offence Details
  cy.get('[summaryListRowId="noticeNumber"] dd').should('contain', '12344');
  cy.get('[summaryListRowId="offenceType"] dd').should('contain', 'Vehicle');
  cy.get('[summaryListRowId="registrationNumber"] dd').should('contain', 'AB12CD');
  cy.get('[summaryListRowId="drivingLicenceNumber"] dd').should('contain', 'ABCDE123456AA1B1');
  cy.get('[summaryListRowId="noticeNumber"] dd').should('contain', '12344');
  cy.get('[summaryListRowId="noticeDate"] dd').should('contain', '—');
  cy.get('[summaryListRowId="dateOfOffence"] dd').should('contain', '06 November 2025');
  cy.get('[summaryListRowId="timeOfOffence"] dd').should('contain', '10:15');
  cy.get('[summaryListRowId="placeOfOffence"] dd').should('contain', 'Fake Street');
  cy.get('[summaryListRowId="amountImposed"] dd').should('contain', '£100.00');

  // Section 6 - Account comments and notes
  cy.get('[summaryListRowId="accountComment"] dd').should('contain', '—');
  cy.get('[summaryListRowId="accountNote"] dd').should('contain', '—');
});

Then('I verify all Fixed Penalty company account summary sections and values are displayed in order', () => {
  // Check the page heading for company
  cy.get('h1.govuk-heading-l').should('contain', 'TestFixedPenaltyCompany').and('be.visible');

  // Verify the sections are displayed in the correct order for company
  const expectedSections = [
    'Issuing authority and court details',
    'Company details',
    'Offence Details',
    'Account comments and notes',
  ];

  // Get all section headings and check they appear in order
  cy.get('.govuk-summary-card__title').each(($el, index) => {
    cy.wrap($el).should('contain', expectedSections[index]);
  });

  // Section 1 - Account Details (No heading)
  cy.get('[summaryListRowId="businessUnit"] dd').should('contain', 'Camberwell Green');
  cy.get('[summaryListRowId="accountType"] dd').should('contain', 'Fixed Penalty');
  cy.get('[summaryListRowId="defendantType"] dd').should('contain', 'Company');

  // Section 2 - Issuing Authority and Court Details
  cy.get('[summaryListRowId="issuingAuthority"] dd').should('exist').and('contain', 'undefined (052)');
  cy.get('[summaryListRowId="enforcementCourt"] dd').should('exist').and('contain', 'Court 777 Camberwell CH09 (777)');

  // Section 3 - Company Details
  cy.get('[summaryListRowId="companyName"] dd').should('contain', 'TestFixedPenaltyCompany');
  cy.get('[summaryListRowId="address"] dd').should('contain', '123 William Street').and('contain', 'WA12HG');

  // Section 4 - Offence Details (Company with vehicle data) - Match actual UI display
  cy.get('[summaryListRowId="noticeNumber"] dd').should('contain', 'AB123AB');
  cy.get('[summaryListRowId="offenceType"] dd').should('contain', 'Vehicle');
  cy.get('[summaryListRowId="registrationNumber"] dd').should('contain', 'CO12MPY');
  cy.get('[summaryListRowId="drivingLicenceNumber"] dd').should('contain', 'VQCDE123456AA1B1');
  cy.get('[summaryListRowId="noticeNumber"] dd').should('contain', 'NPH987654');
  cy.get('[summaryListRowId="noticeDate"] dd').should('contain', '01 November 2025');
  cy.get('[summaryListRowId="dateOfOffence"] dd').should('contain', '01 November 2025');
  cy.get('[summaryListRowId="timeOfOffence"] dd').should('contain', '12:30');
  cy.get('[summaryListRowId="placeOfOffence"] dd').should('contain', 'William Street');
  cy.get('[summaryListRowId="amountImposed"] dd').should('contain', '£200.00');

  // Section 6 - Account comments and notes
  cy.get('[summaryListRowId="accountComment"] dd').should('contain', 'TestComment');
  cy.get('[summaryListRowId="accountNote"] dd').should('contain', 'Test account note');
});
