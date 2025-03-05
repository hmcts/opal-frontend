@ManualAccountCreation @CompanyDetails @PO-345 @PO-265
Feature: Manual account creation - Company Details
  #This feature file contains tests for the Company Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the CompanyDetailsComponent.cy.ts component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I click on the "Company details" link
    And I see "Company details" on the page header

  Scenario: (AC.12) Entered data persists in the session [@PO-345, @PO-365]
    When I enter "COMPANY NAME" into the "Company name" field
    And I select the "Add company aliases" checkbox
    And I set the "Alias 1", "Company name" to "Alias 1"
    And I select add another alias
    And I set the "Alias 2", "Company name" to "Alias 2"

    And I enter "Addr1" into the "Address line 1" field
    And I enter "Addr2" into the "Address line 2" field
    And I enter "Addr3" into the "Address line 3" field
    And I enter "TE1 1ST" into the "Postcode" field

    When I click the "Return to account details" button

    Then I see the status of "Company details" is "Provided"

    When I click on the "Company details" link
    And I see "COMPANY NAME" in the "Company name" field
    And I validate the "Add company aliases" checkbox is checked
    And I see "Alias 1", "Company name" is set to "Alias 1"
    And I see "Alias 2", "Company name" is set to "Alias 2"
    And I see "Addr1" in the "Address line 1" field
    And I see "Addr2" in the "Address line 2" field
    And I see "Addr3" in the "Address line 3" field
    And I see "TE1 1ST" in the "Postcode" field

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see the status of "Company details" is "Not provided"

    When I click on the "Company details" link
    And I see "" in the "Company name" field
    And I validate the "Add company aliases" checkbox is not checked
    And I see "" in the "Address line 1" field
    And I see "" in the "Address line 2" field
    And I see "" in the "Address line 3" field
    And I see "" in the "Postcode" field

  Scenario: (AC.12) Grey navigation links routes correctly [@PO-345, @PO-365]
    When I enter "COMPANY NAME" into the "Company name" field
    And I enter "Addr1" into the "Address line 1" field
    And I click the "Add contact details" button

    Then I see "Defendant contact details" on the page header

  Scenario: (AC.13, AC.14) Unsaved data is cleared when cancel is clicked [@PO-345, @PO-365]
    When I enter "COMPANY NAME" into the "Company name" field
    And I select the "Add company aliases" checkbox
    And I set the "Alias 1", "Company name" to "Alias 1"
    And I select add another alias
    And I set the "Alias 2", "Company name" to "Alias 2"

    And I enter "Addr1" into the "Address line 1" field
    And I enter "Addr2" into the "Address line 2" field
    And I enter "Addr3" into the "Address line 3" field
    And I enter "TE1 1ST" into the "Postcode" field

    Then I click Cancel, a window pops up and I click Ok

    Then I see the status of "Company details" is "Not provided"

    When I click on the "Company details" link
    And I see "" in the "Company name" field
    And I validate the "Add company aliases" checkbox is not checked
    And I see "" in the "Address line 1" field
    And I see "" in the "Address line 2" field
    And I see "" in the "Address line 3" field
    And I see "" in the "Postcode" field

    Then I enter "COMPANY NAME" into the "Company name" field
    And I enter "Addr1" into the "Address line 1" field

    When I click Cancel, a window pops up and I click Cancel

    Then I see "Company details" on the page header
    And I see "COMPANY NAME" in the "Company name" field
    And I see "Addr1" in the "Address line 1" field

    Then I click the "Return to account details" button

    Then I see the status of "Company details" is "Provided"

    When I click on the "Company details" link

    Then I enter "COMPANY NAME EDITED" into the "Company name" field
    And I enter "Addr2" into the "Address line 2" field

    When I click Cancel, a window pops up and I click Ok

    Then I see "Account details" on the page header

    When I click on the "Company details" link
    And I see "COMPANY NAME" in the "Company name" field
    And I see "Addr1" in the "Address line 1" field
    And I see "" in the "Address line 2" field

    Then I clear the "Company name" field
    And I click the "Return to account details" button
    Then I see the error message "Enter company name" above the "Company name" field

    When I click Cancel, a window pops up and I click Cancel

    Then I see "Company details" on the page header
    And I see "" in the "Company name" field
    And I see the error message "Enter company name" above the "Company name" field

  Scenario: Company Details - Axe Core
    Then I check accessibility


