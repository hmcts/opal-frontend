@JIRA-LABEL:manual-account-creation
@logout
Feature: Sign out flows
  As a signed-in user
  I want to sign out from different entry points
  So that the application returns me to the sign-in page

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
  @JIRA-STORY:PO-8886
  Scenario: Sign out after navigating to create account
    And I open Create and Manage Draft Accounts
    And I sign out
    Then I should be on the "Sign in" page
  @JIRA-STORY:PO-8886
  Scenario: Sign out after navigating to search
    When I click on search
    And I sign out
    Then I should be on the "Sign in" page
  @JIRA-STORY:PO-8886
  Scenario: Sign out after navigating to account
    And I open Create and Manage Draft Accounts
    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I sign out
    Then I should be on the "Sign in" page
