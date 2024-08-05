Feature: PO-523  Update the Create Account screen for new account types and functionality

  Background:
    Given I am on the OPAL Frontend
    And I see "Opal" in the header
    And I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation
    Then I see "Create account" as the caption on the page
    And I see "Business unit and defendant type" on the page header

  Scenario: AC1, AC2 & AC3 - New account types, Fixed Penalty options and Conditional Caution

    When I validate the "Fine" radio button is not selected
    And I validate the "Fixed Penalty" radio button is not selected
    And I validate the "Conditional Caution" radio button is not selected
    And I select the "Fixed Penalty" radio button
    And I see the heading under the fixed penalty radio button is "Defendant type"
    And I validate the "Adult or youth only" radio button is not selected
    And I validate the "Company" radio button is not selected

    When I select the "Adult or youth only" radio button
    And I validate the "Adult or youth only" radio button is selected
    And I validate the "Company" radio button is not selected
    And I select the "Company" radio button
    Then I validate the "Company" radio button is selected
    And I validate the "Adult or youth only" radio button is not selected

    When I select the "Conditional Caution" radio button
    #And I see "Adult or youth only" text - line 63 in generic steps?
    Then I validate the "Conditional Caution" radio button is selected
    And I validate the "Fine" radio button is not selected
    And I validate the "Fixed Penalty" radio button is not selected

  Scenario: AC4a & AC4d - Error validation with BU blank

    When I select the "Fixed Penalty" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    Then I see the error message "Enter a business unit" at the top of the page
    #Error message above radio button insert here

    When I select the "Conditional Caution" radio button
    And I click the "Continue" button
    Then I see the error message "Enter a business unit" at the top of the page
    #Error message above radio button insert here

    When I select the "Fixed Penalty" radio button
    And I click the "Continue" button
    Then I see the error message "Enter a business unit" at the top of the page
    And I see the error message "Select a defendant type" at the top of the page
  #Error message above radio button insert here
  #Error message above radio button insert here

  Scenario: AC4b & AC4c - Error validation with BU populated

    When I enter "London South" into the business unit search box
    And I click the "Continue" button
    Then I see the error message "Select an account type" at the top of the page
    #Error message above radio button insert here

    When I select the "Fixed Penalty" radio button
    And I click the "Continue" button
    Then I see the error message "Select a defendant type" at the top of the page
  #Error message above radio button insert here

  Scenario: AC5 - Two BU user continues successfully

    When I enter "London South" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header
    And I see the business unit is "London South West"
    And I see the defendant type is "Adult or youth only"

    When I go back in the browser
    Then I see "Create account" as the caption on the page
    And I see "Business unit and defendant type" on the page header
    And I see the value "London South West" in the business unit search box
    And I validate the "Fine" radio button is selected
    And I validate the "Adult or youth only" radio button is selected
