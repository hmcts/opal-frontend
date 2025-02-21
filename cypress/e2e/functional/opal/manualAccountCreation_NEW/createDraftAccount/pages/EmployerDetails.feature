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

  Scenario: (AC.7) Entered data persists in the session [@PO-272, @PO-280, @PO-368, @PO-434, @PO-435]
    Then I see "Employer details" on the page header

    And I enter "Test Corp" into the "Employer name" field
    And I enter "AB123456C" into the "Employee reference" field
    And I enter "employer@example.com" into the "Employer email address" field
    And I enter "01234567890" into the "Employer telephone" field
    And I enter "Addr1" into the "Address line 1" field
    And I enter "Addr2" into the "Address line 2" field
    And I enter "Addr3" into the "Address line 3" field
    And I enter "Addr4" into the "Address line 4" field
    And I enter "Addr5" into the "Address line 5" field
    And I enter "TE12 3ST" into the "Postcode" field
    And I click the "Return to account details" button

    Then I see the status of "Employer details" is "Provided"

    When I click on the "Employer details" link
    And I see "Test Corp" in the "Employer name" field
    And I see "AB123456C" in the "Employee reference" field
    And I see "employer@example.com" in the "Employer email address" field
    And I see "01234567890" in the "Employer telephone" field
    And I see "Addr1" in the "Address line 1" field
    And I see "Addr2" in the "Address line 2" field
    And I see "Addr3" in the "Address line 3" field
    And I see "Addr4" in the "Address line 4" field
    And I see "Addr5" in the "Address line 5" field
    And I see "TE12 3ST" in the "Postcode" field

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Employer details" is "Not provided"

    When I click on the "Employer details" link
    And I see "" in the "Employer name" field
    And I see "" in the "Employee reference" field
    And I see "" in the "Employer email address" field
    And I see "" in the "Employer telephone" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Address line 2" field
    And I see "" in the "Address line 3" field
    And I see "" in the "Address line 4" field
    And I see "" in the "Address line 5" field
    And I see "" in the "Postcode" field

  Scenario: (AC.8, AC.9, AC.10) Unsaved data is cleared when cancel is clicked [@PO-272, @PO-280, @PO-368, @PO-434, @PO-435]
    And I enter "Test Corp" into the "Employer name" field
    And I enter "AB123456C" into the "Employee reference" field
    And I enter "Addr1" into the "Address line 1" field

    When I click Cancel, a window pops up and I click Ok

    Then I see the status of "Employer details" is "Not provided"

    When I click on the "Employer details" link

    And I see "" in the "Employer name" field
    And I see "" in the "Employee reference" field
    And I see "" in the "Employer email address" field

    And I enter "Test Corp" into the "Employer name" field
    And I enter "AB123456C" into the "Employee reference" field
    And I enter "Addr1" into the "Address line 1" field

    Then I click the "Return to account details" button
    And I see the status of "Employer details" is "Provided"

    When I click on the "Employer details" link
    And I enter "Edited Corp" into the "Employer name" field
    And I click Cancel, a window pops up and I click Ok

    When I click on the "Employer details" link
    And I see "Test Corp" in the "Employer name" field

    And I enter "Edited Corp" into the "Employer name" field
    And I click Cancel, a window pops up and I click Cancel

    Then I see "Edited Corp" in the "Employer name" field

    When I enter "Test Corp" into the "Employer name" field
    And I click Cancel, a window pops up and I click Ok


    Then I see the status of "Employer details" is "Provided"

    When I click on the "Employer details" link
    And I see "Test Corp" in the "Employer name" field

  Scenario: Employer Details - Axe Core
    Then I check accessibility
