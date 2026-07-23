@JIRA-LABEL:manual-account-creation
Feature: Manual Account Creation Release 1B Feature Toggles

  @R1BOff @JIRA-STORY:PO-3719 @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-8022
  Scenario: Approved account numbers are shown as plain text when release 1b is disabled
    Given I clear all approved accounts
    And I create a "company" approved account with the following details:
      | account_snapshot.defendant_name | Release1B Text Only Ltd {uniq} |
    And I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I open Create and Manage Draft Accounts
    And I view the "Approved" tab on the Create and Manage Draft Accounts page
    Then the approved draft account number "FP123456" is shown as plain text
