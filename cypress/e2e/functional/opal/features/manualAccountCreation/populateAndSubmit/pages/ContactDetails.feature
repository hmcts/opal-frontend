@ManualAccountCreation @ContactDetails @PO-272 @PO-344 @PO-345 @PO-419 @PO-371 @PO-370 @PO-358
Feature: Manual account creation - Contact Details
  #This feature file contains tests for the Contact Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the ContactDetailsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the ContactDetailsComponent.cy.ts component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I click on the "Contact details" link
    And I see "Defendant contact details" on the page header

  Scenario: (AC.9) Entered data persists in the session [@PO-272, @PO-344, @PO-345, @PO-419, @PO-371, @PO-370, @PO-358]
    When I enter "P@EMAIL.COM" into the "Primary email address" field
    And I enter "S@EMAIL.COM" into the "Secondary email address" field
    And I enter "07123 456 789" into the "Mobile telephone number" field
    And I enter "07123 456 789" into the "Home telephone number" field
    And I enter "07123 456 789" into the "Work telephone number" field
    When I click the "Return to account details" button

    Then I see the status of "Contact details" is "Provided"

    When I click on the "Contact details" link
    And I see "P@EMAIL.COM" in the "Primary email address" field
    And I see "S@EMAIL.COM" in the "Secondary email address" field
    And I see "07123 456 789" in the "Mobile telephone number" field
    And I see "07123 456 789" in the "Home telephone number" field
    And I see "07123 456 789" in the "Work telephone number" field

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Contact details" is "Not provided"

    When I click on the "Contact details" link
    And I see "" in the "Primary email address" field
    And I see "" in the "Secondary email address" field
    And I see "" in the "Mobile telephone number" field
    And I see "" in the "Home telephone number" field
    And I see "" in the "Work telephone number" field

  Scenario: (AC.9) Grey navigation links routes correctly [@PO-272, @PO-344, @PO-345, @PO-419, @PO-371, @PO-370, @PO-358]
    When I enter "P@EMAIL.COM" into the "Primary email address" field
    And I click the "Add employer details" button

    Then I see "Employer details" on the page header

  Scenario: (AC.10, AC.11) Unsaved data is cleared when cancel is clicked [@PO-272, @PO-344, @PO-345, @PO-419, @PO-371, @PO-370, @PO-358]
    When I enter "P@EMAIL.COM" into the "Primary email address" field
    And I enter "07123 456 789" into the "Mobile telephone number" field

    Then I click Cancel, a window pops up and I click Ok

    Then I see the status of "Contact details" is "Not provided"

    When I click on the "Contact details" link
    Then I see "" in the "Primary email address" field
    And I see "" in the "Secondary email address" field
    And I see "" in the "Mobile telephone number" field
    And I see "" in the "Home telephone number" field
    And I see "" in the "Work telephone number" field



    Then I enter "P@EMAIL.COM" into the "Primary email address" field
    And I enter "07123 456 789" into the "Mobile telephone number" field

    When I click Cancel, a window pops up and I click Cancel

    Then I see "Defendant contact details" on the page header
    And I see "P@EMAIL.COM" in the "Primary email address" field
    And I see "07123 456 789" in the "Mobile telephone number" field

    Then I click the "Return to account details" button

    Then I see the status of "Contact details" is "Provided"

    When I click on the "Contact details" link

    Then I enter "P-EDIT@EMAIL.COM" into the "Primary email address" field
    And I enter "07123 456 789" into the "Mobile telephone number" field

    When I click Cancel, a window pops up and I click Ok

    Then I see "Account details" on the page header

    When I click on the "Contact details" link
    And I see "P@EMAIL.COM" in the "Primary email address" field
    And I see "07123 456 789" in the "Mobile telephone number" field

    Then I clear the "Primary email address" field
    And I enter "PEMAIL.COM" into the "Primary email address" field
    And I click the "Return to account details" button
    Then I see the error message "Enter primary email address in the correct format, like name@example.com" above the "Primary email address" field

    When I click Cancel, a window pops up and I click Cancel

    Then I see "Defendant contact details" on the page header
    And I see "PEMAIL.COM" in the "Primary email address" field
    And I see the error message "Enter primary email address in the correct format, like name@example.com" above the "Primary email address" field

  Scenario: Contact Details - Axe Core
    Then I check accessibility


