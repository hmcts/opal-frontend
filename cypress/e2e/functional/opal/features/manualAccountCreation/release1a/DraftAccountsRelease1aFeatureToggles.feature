@JIRA-LABEL:manual-account-creation
Feature: Draft Accounts Release 1A Feature Toggles

  @R1A @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-7560
  Scenario: Direct navigation to the Accounts dashboard is allowed when release 1a is enabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Accounts dashboard
    Then I am taken to the "Accounts" Fines landing page

  @R1A @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685
  Scenario Outline: Direct navigation to <entryPoint> is allowed when release 1a is enabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Accounts dashboard entry point "<entryPoint>"
    Then I should see the header containing text "<header>"

    @JIRA-TEST-KEY:PO-7561
    Examples:
      | entryPoint                        | header          |
      | Create and Manage Draft Accounts  | Create accounts |
    @JIRA-TEST-KEY:PO-7562
    Examples:
      | entryPoint                        | header          |
      | Check and Validate Draft Accounts | Review accounts |

  @R1AOff @FeatureFlag @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-7920
  Scenario: Sign in is rejected when release 1a is disabled
    Given I attempt to authenticate with email "opal-test@dev.platform.hmcts.net"
    Then the authenticated endpoint responds with status 401
    And the URL should contain "/error/internal-server"
    And the error page shows:
      | field  | value                                      |
      | header | Sorry, there is a problem with the service |
    And I should see the service header containing text "Opal"
    And I do not see the Fines primary navigation

  @R1AOff @FeatureFlag @JIRA-STORY:PO-3719 @JIRA-EPIC:PO-3685
  Scenario Outline: Sign in to <entryPoint> is rejected when release 1a is disabled
    Given I attempt to authenticate with email "opal-test@dev.platform.hmcts.net" on path "<path>"
    Then the authenticated endpoint responds with status 401
    And the URL should contain "/error/internal-server"
    And the error page shows:
      | field  | value                                      |
      | header | Sorry, there is a problem with the service |
    And I should see the service header containing text "Opal"
    And I do not see the Fines primary navigation

    @JIRA-TEST-KEY:PO-7921
    Examples:
      | entryPoint         | path                      |
      | Accounts dashboard | /fines/dashboard/accounts |
    @JIRA-TEST-KEY:PO-7922
    Examples:
      | entryPoint                       | path                                      |
      | Create and Manage Draft Accounts | /fines/draft/create-and-manage/tabs#review |
    @JIRA-TEST-KEY:PO-7923
    Examples:
      | entryPoint                        | path                                       |
      | Check and Validate Draft Accounts | /fines/draft/check-and-validate/tabs#to-review |

  @R1BOff @FeatureFlag @JIRA-STORY:PO-3719 @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-8022
  Scenario: Approved account numbers are shown as plain text when release 1b is disabled
    Given I clear all approved accounts
    And I create a "company" approved account with the following details:
      | account_snapshot.defendant_name | Release1B Text Only Ltd {uniq} |
    And I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I open Create and Manage Draft Accounts
    And I view the "Approved" tab on the Create and Manage Draft Accounts page
    Then the approved draft account number "FP123456" is shown as plain text
