@ManualAccountCreation @CompanyDetails @PO-345 @PO-265
Feature: Manual account creation - Company Details
  #This feature file contains tests for the Company Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the CompanyDetailsComponent.cy.ts component tests

  Background:
    Given I am logged in with email "opal-test@hmcts.net"
    When I start a fine manual account for business unit "West London" with defendant type "Company"
    And I view the "Company details" task

  Scenario: (AC.12) Entered data persists in the session [@PO-345, @PO-365]
    When I complete manual company details:
      | company name   | COMPANY NAME |
      | address line 1 | Addr1        |
      | address line 2 | Addr2        |
      | address line 3 | Addr3        |
      | postcode       | TE1 1ST      |
    And I add manual company aliases:
      | alias | name    |
      | 1     | ALIAS 1 |
      | 2     | ALIAS 2 |
    And I return to account details
    Then the "Company details" task status is "Provided"
    When I view the "Company details" task
    Then the manual company details fields are:
      | company name   | COMPANY NAME |
      | address line 1 | Addr1        |
      | address line 2 | Addr2        |
      | address line 3 | Addr3        |
      | postcode       | TE1 1ST      |
    And the manual company aliases are:
      | alias | name    |
      | 1     | ALIAS 1 |
      | 2     | ALIAS 2 |
    And the manual company aliases checkbox is "checked"
    When I restart manual fine company account creation for business unit "West London" with account type "Fine" and defendant type "Company"
    Then the "Company details" task status is "Not provided"
    When I view the "Company details" task
    Then the manual company details fields are:
      | company name   |  |
      | address line 1 |  |
      | address line 2 |  |
      | address line 3 |  |
      | postcode       |  |
    And the manual company aliases checkbox is "not checked"

  Scenario: (AC.12) Grey navigation links routes correctly [@PO-345, @PO-365]
    When I complete manual company details:
      | company name   | COMPANY NAME |
      | address line 1 | Addr1        |
    And I continue to defendant contact details from company details
    Then I should see the header containing text "Defendant contact details"


  Scenario: (AC.13) Unsaved data is cleared when user confirms cancel [@PO-345, @PO-365]
    When I complete manual company details:
      | company name   | COMPANY NAME |
      | address line 1 | Addr1        |
      | address line 2 | Addr2        |
      | address line 3 | Addr3        |
      | postcode       | TE1 1ST      |
    And I add manual company aliases:
      | alias | name    |
      | 1     | ALIAS 1 |
      | 2     | ALIAS 2 |
    And I cancel company details choosing "Ok" and return to account details
    Then the "Company details" task status is "Not provided"
    When I view the "Company details" task
    Then the manual company details fields are:
      | company name   |  |
      | address line 1 |  |
      | address line 2 |  |
      | address line 3 |  |
      | postcode       |  |
    And the manual company aliases checkbox is "not checked"


  Scenario: (AC.13) Unsaved data is retained when user cancels the cancel [@PO-345, @PO-365]
    When I complete manual company details:
      | company name   | COMPANY NAME |
      | address line 1 | Addr1        |
    And I cancel company details choosing "Cancel"
    And the manual company details fields are:
      | company name   | COMPANY NAME |
      | address line 1 | Addr1        |


  Scenario: (AC.14) Confirming cancel restores last saved company details [@PO-345, @PO-365]
    When I complete manual company details:
      | company name   | COMPANY NAME |
      | address line 1 | Addr1        |
    And I return to account details
    Then the "Company details" task status is "Provided"
    When I view the "Company details" task
    And I complete manual company details:
      | company name   | COMPANY NAME EDITED |
      | address line 2 | Addr2               |
    And I cancel company details choosing "Ok" and return to account details
    When I view the "Company details" task
    Then the manual company details fields are:
      | company name   | COMPANY NAME |
      | address line 1 | Addr1        |
      | address line 2 |              |

  Scenario: (AC.14) Inline error persists when cancelling and revisiting company details [@PO-345, @PO-365]
    When I complete manual company details:
      | address line 1 | Addr1 |
    And I return to account details
    Then I see a manual company inline error "Enter company name" for "Company name"
    When I cancel company details choosing "Cancel"
    And the manual company details fields are:
      | company name   |       |
      | address line 1 | Addr1 |
    Then I see a manual company inline error "Enter company name" for "Company name"

  Scenario: Company Details - Axe Core
    Then I check the page for accessibility
