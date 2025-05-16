@ManualAccountCreation @AccountCommentsAndNotes @PO-272 @PO-344 @PO-345 @PO-469 @PO-499 @PO-500
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

  Scenario: (AC.4, AC.5) Entered data persists in the session [@PO-272, @PO-344, @PO-345, @PO-469, @PO-499, @PO-500]
    Then I see "Account comments and notes" on the page header

    When I click the "Return to account details" button
    Then I see the status of "Account comments and notes" is "Not provided"

    When I click on the "Account comments and notes" link
    And I enter "Test comments" into the "Add comment" text field
    And I enter "Test notes" into the "Add account notes" text field

    And I click the "Return to account details" button

    Then I see the status of "Account comments and notes" is "Provided"

    When I click on the "Account comments and notes" link
    And I see "Test comments" in the "Add comment" text field
    And I see "Test notes" in the "Add account notes" text field

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth" radio button
    And I click the "Continue" button

    Then I see the status of "Account comments and notes" is "Not provided"

    When I click on the "Account comments and notes" link
    And I see "" in the "Add comment" text field
    And I see "" in the "Add account notes" text field

  Scenario: (AC.6, AC.7) Unsaved data is cleared when cancel is clicked [@PO-272, @PO-344, @PO-345, @PO-469, @PO-499, @PO-500]
    And I enter "Test comments" into the "Add comment" text field
    And I enter "Test notes" into the "Add account notes" text field

    Then I click Cancel, a window pops up and I click Cancel

    Then I see "Account comments and notes" on the page header
    And I see "Test comments" in the "Add comment" text field
    And I see "Test notes" in the "Add account notes" text field

    Then I click Cancel, a window pops up and I click Ok

    Then I see the status of "Account comments and notes" is "Not provided"

    When I click on the "Account comments and notes" link
    And I see "" in the "Add comment" text field
    And I see "" in the "Add account notes" text field

  Scenario: (AC.8) grey navigation button routes to correct page [@PO-272, @PO-469, @PO-499, @PO-500]
    Then I see "Account comments and notes" on the page header

    When I click the "Return to account details" button
    Then I see the status of "Account comments and notes" is "Not provided"

    #Add Court details
    Then I click on the "Court details" link
    And I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
    And I enter "1234" into the "Prosecutor Case Reference (PCR)" field
    And I enter "West London VPFPO" into the "Enforcement court" search box

    Then I click the "Return to account details" button

    Then I see the status of "Court details" is "Provided"

    #Add Personal details
    When I click on the "Personal details" link
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address line 1" field
    Then I click the "Return to account details" button

    Then I see the status of "Personal details" is "Provided"


    #Add Offence details
    When I click on the "Offence details" link
    And I enter a date 2 weeks into the past into the "Date of sentence" date field
    And I enter "TP11003" into the "Offence code" field
    And I enter "Fine (FO)" into the "Result code" search box
    And I enter "200" into the "Amount imposed" payment field
    And I enter "100" into the "Amount paid" payment field
    And I click the "Review offence" button

    When I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Offence details" is "Provided"

    #Add Payment terms
    Then I click on the "Payment terms" link
    And I see "Payment terms" on the page header
    And I select the "Yes" radio button
    And I enter a date 1 weeks into the past into the "Date of collection order" date field
    And I select the "Pay in full" radio button
    And I enter a date 28 weeks into the future into the "Enter pay by date" date field

    Then I click the "Return to account details" button

    Then I see the status of "Payment terms" is "Provided"

    #Validate Account comments and notes grey nav button route
    When I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header

    Then I see the "Review and submit account details" button
    When I click the "Review and submit account details" button

    Then I see "Check account details" on the page header

  Scenario: Account Comments and Notes - Axe Core
    Then I check accessibility

