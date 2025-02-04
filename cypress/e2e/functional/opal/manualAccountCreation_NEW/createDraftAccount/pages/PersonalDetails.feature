@ManualAccountCreation @PersonalDetails @PO-360 @PO-369 @PO-433
Feature: Manual account creation - Personal Details
  #This feature file contains tests for the Personal Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the PersonalDetailsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the PersonalDetailsComponent.cy.ts component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I click on the "Personal details" link
    And I see "Personal details" on the page header

  Scenario: Entered data persists in the session
    When I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr Line 1" into the "Address line 1" field
    And I enter "Addr Line 2" into the "Address line 2" field
    And I enter "Addr Line 3" into the "Address line 3" field
    And I enter "TE1 1ST" into the "Postcode" field
    And I enter "01/01/1990" into the Date of birth field
    And I enter "FORD FOCUS" into the "Make and model" field
    And I enter "AB12 CDE" into the "Registration number" field
    And I click the "Return to account details" button

    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Mr" selected in the "Title" dropdown
    And I see "FNAME" in the "First names" field
    And I see "LNAME" in the "Last name" field
    And I see "Addr Line 1" in the "Address line 1" field
    And I see "Addr Line 2" in the "Address line 2" field
    And I see "Addr Line 3" in the "Address line 3" field
    And I see "TE1 1ST" in the "Postcode" field
    And I see "01/01/1990" in the Date of birth field
    And I see "FORD FOCUS" in the "Make and model" field
    And I see "AB12 CDE" in the "Registration number" field

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Personal details" is "Not provided"

    When I click on the "Personal details" link
    And I see there is no selected option in the "Title" dropdown
    And I see "" in the "First names" field
    And I see "" in the "Last name" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Address line 2" field
    And I see "" in the "Address line 3" field
    And I see "" in the "Postcode" field
    And I see "" in the Date of birth field
    And I see "" in the "Make and model" field
    And I see "" in the "Registration number" field

  Scenario: Unsaved data is cleared when cancel is clicked
    When I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr Line 1" into the "Address line 1" field
    And I enter "Addr Line 2" into the "Address line 2" field
    And I enter "Addr Line 3" into the "Address line 3" field
    And I enter "TE1 1ST" into the "Postcode" field
    And I enter "01/01/1990" into the Date of birth field
    And I enter "FORD FOCUS" into the "Make and model" field
    And I enter "AB12 CDE" into the "Registration number" field
    When I click Cancel, a window pops up and I click Ok

    Then I see the status of "Personal details" is "Not provided"

    When I click on the "Personal details" link
    And I see there is no selected option in the "Title" dropdown
    And I see "" in the "First names" field
    And I see "" in the "Last name" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Address line 2" field
    And I see "" in the "Address line 3" field
    And I see "" in the "Postcode" field
    And I see "" in the Date of birth field
    And I see "" in the "Make and model" field
    And I see "" in the "Registration number" field

    Then I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr Line 1" into the "Address line 1" field
    Then I click the "Return to account details" button
    And I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I enter "FNAME EDITED" into the "First names" field
    And I click Cancel, a window pops up and I click Ok

    When I click on the "Personal details" link
    And I see "FNAME" in the "First names" field

    And I enter "FNAME EDITED" into the "First names" field
    And I click Cancel, a window pops up and I click Cancel

    Then I see "FNAME EDITED" in the "First names" field

    When I enter "FNAME" into the "First names" field
    And I click Cancel, a window pops up and I click Ok


    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "FNAME" in the "First names" field
