Feature: Accessibility Tests for Check and Validate Screens
  # This feature file ensures that all screens in the Check and Validate flow meet accessibility standards using Axe-Core.

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I open Create and Manage Draft Accounts

  Scenario: Create and Manage landing page passes accessibility checks
    Then I check the page for accessibility

@only
  Scenario: Rejected tab is accessible for rejected draft account
    Given I create a "pgToPay" draft account with the following details and set status "Rejected":
      | account.defendant.forenames | Accessibility |
      | account.defendant.surname   | TEST{uniq}          |
    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    Then I see the following text "TEST{uniq}, Accessibility"
    And I check the page for accessibility

  Scenario: Approved tab is accessible
    When I view the "Approved" tab on the Create and Manage Draft Accounts page
    Then I check the page for accessibility

  Scenario: Deleted tab is accessible
    When I view the "Deleted" tab on the Create and Manage Draft Accounts page
    Then I check the page for accessibility

  Scenario: Check and submit task list is accessible for rejected draft
    Given I create a "pgToPay" draft account with the following details and set status "Rejected":
      | account.defendant.forenames | Accessibility |
      | account.defendant.surname   | TEST{uniq}          |
    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I open the draft account for defendant "TEST{uniqUpper}, Accessibility"
    Then I see the following text "Check and submit"
    And I check the page for accessibility

  Scenario: Check account details page is accessible for rejected draft
    Given I create a "pgToPay" draft account with the following details and set status "Rejected":
      | account.defendant.forenames | Accessibility |
      | account.defendant.surname   | TEST{uniq}          |
    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I open the draft account for defendant "TEST{uniqUpper}, Accessibility"
    And I check the manual account details for account header "Miss Accessibility TEST{uniqUpper}"
    And I check the page for accessibility

  Scenario: Submitting a rejected draft for review shows confirmation
    Given I create a "pgToPay" draft account with the following details and set status "Rejected":
      | account.defendant.forenames | Accessibility |
      | account.defendant.surname   | TEST{uniq}          |
    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I open the draft account for defendant "TEST{uniqUpper}, Accessibility"
    And I check the manual account details for account header "Miss Accessibility TEST{uniqUpper}"
    When I submit the manual account for review
    Then I see the following text "You have submitted Accessibility TEST{uniq}'s account for review"
    And I check the page for accessibility
