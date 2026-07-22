@JIRA-LABEL:manual-account-creation
Feature: Multiple sign out
  As a signed-in user
  I want to sign out from different entry points
  So that the application returns me to the sign-in page

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-8886 @JIRA-EPIC:PO-812
  Scenario: Sign out after navigating to create account
    And I open Create and Manage Draft Accounts
    And I sign out
    Then I should be redirected to the sign-in page

  @JIRA-STORY:PO-8886 @JIRA-EPIC:PO-812
  Scenario: Sign out from the Employer details task
    And I start a fine manual account for business unit "West London" with defendant type "Adult or youth only" and originator type "New"
    And I view the "Employer details" task
    And I sign out
    Then I should be redirected to the sign-in page

  @JIRA-STORY:PO-8886 @JIRA-EPIC:PO-812
  Scenario: Sign out from the Rejected tab
    And I open Create and Manage Draft Accounts
    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I sign out
    Then I should be redirected to the sign-in page
