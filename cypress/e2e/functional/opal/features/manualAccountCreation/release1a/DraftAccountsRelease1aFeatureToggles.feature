@JIRA-LABEL:manual-account-creation
Feature: Draft Accounts Release 1A Feature Toggles

  @R1A @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685
  Scenario: Direct navigation to the Accounts dashboard is allowed when release 1a is enabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Accounts dashboard
    Then I am taken to the "Accounts" Fines landing page

  @R1A @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685
  Scenario Outline: Direct navigation to <entryPoint> is allowed when release 1a is enabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Accounts dashboard entry point "<entryPoint>"
    Then I should see the header containing text "<header>"

    Examples:
      | entryPoint                        | header          |
      | Create and Manage Draft Accounts  | Create accounts |
      | Check and Validate Draft Accounts | Review accounts |

  @R1AOff @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685
  Scenario: Access denied is shown after sign in when release 1a is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    Then I should see an Access Denied page
    And I do not see the Fines primary navigation

  @R1AOff @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685
  Scenario: Direct navigation to the Accounts dashboard is blocked when release 1a is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Accounts dashboard
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action

  @R1AOff @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685
  Scenario Outline: Direct navigation to <entryPoint> is blocked when release 1a is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Accounts dashboard entry point "<entryPoint>"
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action

    Examples:
      | entryPoint                        |
      | Create and Manage Draft Accounts  |
      | Check and Validate Draft Accounts |

  @R1BOff @JIRA-STORY:PO-3719 @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685
  Scenario: Approved account numbers are shown as plain text when release 1b is disabled
    Given I clear all approved accounts
    And I create a "company" approved account with the following details:
      | account_snapshot.defendant_name | Release1B Text Only Ltd {uniq} |
    And I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I open Create and Manage Draft Accounts
    And I view the "Approved" tab on the Create and Manage Draft Accounts page
    Then the approved draft account number "FP123456" is shown as plain text
