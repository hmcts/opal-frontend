@ManualAccountCreation @ParentGuardianDetails @PO-344 @PO-364 @PO-436
Feature: Manual account creation - Parent Guardian Details
  #This feature file contains tests for the Parent guardian details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the CompanyDetailsComponent.cy.ts component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    And  I click on the "Parent or guardian details" link

  Scenario: (AC.6, AC.5) Entered data persists in the session [@PO-344, @PO-364, @PO-436]
    When I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I select the "Add aliases" checkbox
    And I set the "Alias 1", "First names" to "ALIAS 1 FNAME"
    And I set the "Alias 1", "Last name" to "ALIAS 1 LNAME"
    And I select add another alias
    And I set the "Alias 2", "First names" to "ALIAS 2 FNAME"
    And I set the "Alias 2", "Last name" to "ALIAS 2 LNAME"

    And I enter a date of birth 18 years ago

    And I enter "Addr1" into the "Address line 1" field
    And I enter "Addr2" into the "Address line 2" field
    And I enter "Addr3" into the "Address line 3" field
    And I enter "TE1 1ST" into the "Postcode" field

    And I enter "CarMake" into the "Make and model" field
    And I enter "CARREG" into the "Registration number" field

    When I click the "Return to account details" button

    Then I see the status of "Parent or guardian details" is "Provided"

    When I click on the "Parent or guardian details" link
    And I see "FNAME" in the "First names" field
    And I see "LNAME" in the "Last name" field
    And I validate the "Add aliases" checkbox is checked
    And I see "Alias 1", "First names" is set to "ALIAS 1 FNAME"
    And I see "Alias 1", "Last name" is set to "ALIAS 1 LNAME"
    And I see "Alias 2", "First names" is set to "ALIAS 2 FNAME"
    And I see "Alias 2", "Last name" is set to "ALIAS 2 LNAME"


    And I see "Addr1" in the "Address line 1" field
    And I see "Addr2" in the "Address line 2" field
    And I see "Addr3" in the "Address line 3" field
    And I see "TE1 1ST" in the "Postcode" field

    And I see "CarMake" in the "Make and model" field
    And I see "CARREG" in the "Registration number" field

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    Then I see the status of "Parent or guardian details" is "Not provided"

    When I click on the "Parent or guardian details" link
    And I see "" in the "First names" field
    And I see "" in the "Last name" field
    And I validate the "Add aliases" checkbox is not checked

    And I see "" in the "Address line 1" field
    And I see "" in the "Address line 2" field
    And I see "" in the "Address line 3" field
    And I see "" in the "Postcode" field

    And I see "" in the "Make and model" field
    And I see "" in the "Registration number" field

  Scenario: (AC.5) Grey navigation links routes correctly [@PO-344, @PO-436]
    When I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address line 1" field
    And I click the "Add contact details" button

    Then I see "Parent or guardian contact details" on the page header

  Scenario: (AC.6, AC.7, AC.7, AC.8) Unsaved data is cleared when cancel is clicked [@PO-344, @PO-364, @PO-436]
    When I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I select the "Add aliases" checkbox
    And I set the "Alias 1", "First names" to "ALIAS 1 FNAME"
    And I set the "Alias 1", "Last name" to "ALIAS 1 LNAME"
    And I select add another alias
    And I set the "Alias 2", "First names" to "ALIAS 2 FNAME"
    And I set the "Alias 2", "Last name" to "ALIAS 2 LNAME"

    And I enter a date of birth 18 years ago

    And I enter "Addr1" into the "Address line 1" field
    And I enter "Addr2" into the "Address line 2" field
    And I enter "Addr3" into the "Address line 3" field
    And I enter "TE1 1ST" into the "Postcode" field

    And I enter "CarMake" into the "Make and model" field
    And I enter "CARREG" into the "Registration number" field

    Then I click Cancel, a window pops up and I click Ok

    Then I see the status of "Parent or guardian details" is "Not provided"

    When I click on the "Parent or guardian details" link
    And I see "" in the "First names" field
    And I see "" in the "Last name" field
    And I validate the "Add aliases" checkbox is not checked

    And I see "" in the "Address line 1" field
    And I see "" in the "Address line 2" field
    And I see "" in the "Address line 3" field
    And I see "" in the "Postcode" field

    And I see "" in the "Make and model" field
    And I see "" in the "Registration number" field

    Then I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address line 1" field

    When I click Cancel, a window pops up and I click Cancel

    And I see "FNAME" in the "First names" field
    And I see "LNAME" in the "Last name" field
    And I see "Addr1" in the "Address line 1" field

    Then I click the "Return to account details" button

    Then I see the status of "Parent or guardian details" is "Provided"

    When I click on the "Parent or guardian details" link

    Then I enter "FNAME EDITED" into the "First names" field
    And I enter "Addr2" into the "Address line 2" field

    When I click Cancel, a window pops up and I click Ok

    Then I see "Account details" on the page header

    When I click on the "Parent or guardian details" link
    And I see "FNAME" in the "First names" field
    And I see "LNAME" in the "Last name" field
    And I see "Addr1" in the "Address line 1" field
    And I see "" in the "Address line 2" field

    Then I clear the "First names" field
    And I click the "Return to account details" button
    Then I see the error message "Enter parent or guardian's first name(s)" above the "First names" field

    When I click Cancel, a window pops up and I click Cancel

    Then I see "" in the "First names" field
    And I see the error message "Enter parent or guardian's first name(s)" above the "First names" field

  Scenario: Parent guardian details - Axe Core
    Then I check accessibility


