@ManualAccountCreation @EmployerDetails @PO-272 @PO-280 @PO-368 @PO-434 @PO-435
Feature: Manual account creation - Employer Details
  #This feature file contains tests for the Employer Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the EmployerDetailsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the EmployerDetailsComponent.cy.ts component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I click on the "Employer details" link
    And I see "Employer details" on the page header
