@ManualAccountCreation @AccountCommentsAndNotes @PO-272 @PO-469 @PO-499 @PO-500
Feature: Manual account creation - Account Comments and Notes
  #This feature file contains tests for the Account Comments and Notes page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the AccountCommentsAndNotesComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the AccountCommentsAndNotesComponent.cy.ts component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth" radio button
    And I click the "Continue" button

    Then I click on the "Account comments and notes" link
    And I see "Account comments and notes" on the page header

  Scenario: (AC.4, AC.5) Entered data persists in the session [@PO-272, @PO-469, @PO-499, @PO-500]
    Then I see "Account comments and notes" on the page header

    When I click the "Return to account details" button
    Then I see the status of "Account comments and notes" is "Not provided"

    When I click on the "Account comments and notes" link
    And I enter "Test comments" into the "Comments" field
    And I enter "Test notes" into the "Notes" field

    And I click the "Return to account details" button

    Then I see the status of "Account comments and notes" is "Provided"

    When I click on the "Account comments and notes" link
    And I see "Test comments" in the "Comments" field
    And I see "Test notes" in the "Notes" field

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth" radio button
    And I click the "Continue" button

    Then I see the status of "Account comments and notes" is "Not provided"

    When I click on the "Account comments and notes" link
    And I see "" in the "Comments" field
    And I see "" in the "Notes" field

  Scenario: (AC.6, AC.7) Unsaved data is cleared when cancel is clicked [@PO-272, @PO-469, @PO-499, @PO-500]
    Then I see "Account comments and notes" on the page header

    When I click on the "Account comments and notes" link
    And I enter "Test comments" into the "Comments" field
    And I enter "Test notes" into the "Notes" field

    Then I click Cancel, a window pops up and I click Cancel

    Then I see "Account comments and notes" on the page header
    And I see "Test comments" in the "Comments" field
    And I see "Test notes" in the "Notes" field

    Then I click Cancel, a window pops up and I click Ok

    Then I see the status of "Account comments and notes" is "Not provided"

    When I click on the "Account comments and notes" link
    And I see "" in the "Comments" field
    And I see "" in the "Notes" field

  Scenario: Account Comments and Notes - Axe Core
    Then I check accessibility

