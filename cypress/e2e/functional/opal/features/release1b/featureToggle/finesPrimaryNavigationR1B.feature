Feature: Fines Primary Navigation R1 B

  @JIRA-EPIC:PO-2627 @JIRA-STORY:PO-2611 @JIRA-STORY:PO-3720 @R1BDrop1 @JIRA-TEST-KEY:PO-5406
  Scenario: AC1a AC1b AC1c AC2a AC2b AC3a AC3b - The Fines Search landing page is shown by default after login
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    Then I see the Fines primary navigation with Search selected by default

  @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685 @R1BDrop1 @JIRA-TEST-KEY:PO-8357
  Scenario: Search is shown as the landing page after login when release 1b is enabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    Then I see the Fines primary navigation with Search selected by default
    When I open Search for an Account

  @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685 @R1BOff @JIRA-TEST-KEY:PO-8023
  Scenario: Search is hidden as the landing page after login when release 1b is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    Then I should not see the Fines primary navigation item "Search"

  @JIRA-EPIC:PO-2627 @JIRA-STORY:PO-2611 @JIRA-TEST-KEY:PO-5411 @R1BDrop1
  Scenario: AC5a - Signing out from the Fines primary navigation returns the user to sign in
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I sign out from the Fines primary navigation
    Then I am returned to the OPAL sign-in page

  @JIRA-STORY:PO-2611 @JIRA-EPIC:PO-2627 @R1BDrop1 @JIRA-STORY:PO-3719 @JIRA-TEST-KEY:PO-5407
  Scenario: AC4a AC4b AC4c - Selecting the Accounts top-level Fines area updates the active navigation item
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Accounts"
    Then I am taken to the "Accounts" Fines landing page
