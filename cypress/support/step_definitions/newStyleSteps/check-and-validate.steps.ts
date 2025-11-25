// check-and-validate.steps.ts (ESM)
// ==================================
// Step definitions for Check and Validate Draft Accounts functionality.
// These steps handle verification of failed accounts table data and related UI elements.

import { Then } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { CheckAndValidateLocators } from '../../../shared/selectors/check-and-validate.locators';

/**
 * Verifies that a defendant name appears in the failed accounts table.
 *
 * @step Then I see {string} in the failed accounts table
 * @description
 * Simple verification that a specific defendant name is visible in the failed accounts table.
 *
 * @param defendantName - The name of the defendant that should be visible
 *
 * @example
 * Then I see "SMITHFAILED, James" in the failed accounts table
 */
Then('I see {string} in the failed accounts table', (defendantName: string) => {
  // Look for the defendant name in any table row using centralized locators
  cy.get(CheckAndValidateLocators.table.root).contains('tr', defendantName).should('be.visible');
});

Then('the Date of Birth should display {string}', (expectedDob) => {
  cy.get('@defendantRow')
    .find('td')
    .eq(1) // Column index for DOB
    .should('contain', expectedDob);
});

Then('the Account type should be {string}', (expectedType) => {
  cy.get('@defendantRow')
    .find('td')
    .eq(3) // Column index for Account type
    .should('have.text', expectedType);
});

Then('the Business Unit should be {string}', (expectedUnit) => {
  cy.get('@defendantRow')
    .find('td')
    .eq(4) // Column index for business unit
    .should('contain', expectedUnit);
});

/**
 * Verifies AC1ai - Defendant name format for individual defendants in failed accounts table
 * Format validation: <LAST NAME>, <forenames>
 *
 * @step Then I verify defendant {string} follows individual name format with surname {string} and forenames {string}
 * @description
 * Validates AC1ai requirement - Column 1 "Defendant" displays defendant name as <LAST NAME>, <forenames> for individual defendants
 * Also verifies the defendant appears in the table and logs row data for debugging
 *
 * @param expectedFullName - The expected full name in format "SURNAME, Forenames"
 * @param surname - The defendant's surname (last name)
 * @param forenames - The defendant's forenames (first names)
 *
 * @example
 * Then I verify defendant "JOHN, Sara" follows individual name format with surname "JOHN" and forenames "Sara"
 */
Then(
  'I verify defendant {string} follows individual name format with surname {string} and forenames {string}',
  (expectedFullName: string, surname: string, forenames: string) => {
    // AC1ai: Verify the format is <LAST NAME>, <forenames>
    const expectedFormat = `${surname.toUpperCase()}, ${forenames}`;

    cy.log(`AC1ai Validation - Expected format: "${expectedFormat}", Provided: "${expectedFullName}"`);

    // Validate the name follows the correct format
    expect(expectedFullName).to.equal(
      expectedFormat,
      `AC1ai Failed: Defendant name should follow format "<LAST NAME>, <forenames>" but got "${expectedFullName}"`,
    );

    // Wait for table to be visible and contain data using centralized locators
    cy.get(CheckAndValidateLocators.table.rows).should('have.length.greaterThan', 0);

    // Verify the defendant name appears in the Defendant column using centralized locator
    cy.get(CheckAndValidateLocators.columns.defendant).should('contain', expectedFullName).and('be.visible');

    // Find the specific row containing our defendant and log all column data
    cy.get(CheckAndValidateLocators.table.rows)
      .contains('td', expectedFullName)
      .parent('tr')
      .as('defendantRow')
      .should('be.visible')
      .within(() => {
        // Log all column values for debugging using CheckAndValidateLocators.expectedHeaders
        cy.get('td').each(($el, index) => {
          const columnName = CheckAndValidateLocators.expectedHeaders[index] || `Column ${index + 1}`;
          cy.log(`${columnName}: ${$el.text().trim()}`);
        });
      });

    cy.log(`AC1ai Validation PASSED: Defendant "${expectedFullName}" found in correct format in Defendant column`);
  },
);

/**
 * Verifies all Fixed Penalty Failed account summary sections and values are displayed in order
 *
 * @step Then I verify all Fixed Penalty Failed account summary sections and values are displayed in order
 * @description
 * Comprehensive verification of failed Fixed Penalty account details page including:
 * - Page heading with defendant name
 * - Section order validation
 * - All summary data verification
 *
 * @example
 * Then I verify all Fixed Penalty Failed account summary sections and values are displayed in order
 */
Then('I verify all Fixed Penalty Failed account summary sections and values are displayed in order', () => {
  // Check the page heading
  cy.get(CheckAndValidateLocators.failedAccountDetails.pageHeading)
    .should('contain', 'Mr Micheal FOLLY')
    .and('be.visible');

  // Verify the sections are displayed in the correct order
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryCardTitles).each(($el, index) => {
    cy.wrap($el).should('contain', CheckAndValidateLocators.failedAccountDetails.expectedSections[index]);
  });

  // Section 1 - Account Details (No heading)
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.businessUnit).should('contain', 'Camberwell Green');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.accountType).should('contain', 'Fixed Penalty');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.defendantType).should(
    'contain',
    'Adult or youth only',
  );

  // Section 2 - Issuing Authority and Court Details
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.issuingAuthority)
    .should('exist')
    .and('contain', 'Aberdeen JP Court (9251)');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.enforcementCourt)
    .should('exist')
    .and('contain', 'Court 777 Camberwell CH09 (777)');

  // Section 3 - Personal Details
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.foreName).should('contain', 'James');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.surname).should('contain', 'WATSON');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.dob).should('contain', '15 May 2002 (Adult)');

  // Section 4 - Offence Details
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.noticeNumber).should('contain', 'AB123AB');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.offenceType).should('contain', 'Vehicle');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.registrationNumber).should('contain', 'CO12MPY');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.drivingLicenceNumber).should(
    'contain',
    'VQCDE123456AA1B1',
  );
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.noticeNumber).should('contain', 'NPH987654');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.noticeDate).should('contain', '01 November 2025');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.dateOfOffence).should('contain', '01 November 2025');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.timeOfOffence).should('contain', '12:30');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.placeOfOffence).should('contain', 'William Street');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.amountImposed).should('contain', '£200.00');

  // Section 5 - Account comments and notes
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.accountComment).should('contain', 'TestComment');
  cy.get(CheckAndValidateLocators.failedAccountDetails.summaryData.accountNote).should('contain', 'Test account note');
});
