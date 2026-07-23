@JIRA-LABEL:account-enquiry
Feature: Account Enquiry Release 1B Feature Toggles

  @R1BOff @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-8017
  Scenario: Accounts is the default landing page when release 1b is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    Then I am taken to the "Accounts" Fines landing page
    And I should not see the Fines primary navigation item "Search"

  @R1BOff @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-8018
  Scenario: Direct navigation to Account Search is blocked when release 1b is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Account Search page
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action

  @R1BOff @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-8019
  Scenario: Direct navigation to Account Enquiry is blocked when release 1b is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Riley                   |
      | last name                 | Release1BDirect{uniq}   |
      | prosecutor case reference | PCRR1BDIRECT{uniqUpper} |
      | date of birth             | 2001-04-15              |
    When I navigate directly to the last created published account details
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action
