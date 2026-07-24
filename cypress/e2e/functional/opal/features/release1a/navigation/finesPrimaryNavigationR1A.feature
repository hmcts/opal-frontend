Feature: Fines primary navigation

  @JIRA-STORY:PO-2611 @JIRA-EPIC:PO-2627 @R1A @JIRA-STORY:PO-3719 @JIRA-TEST-KEY:PO-5407
  Scenario: AC4a AC4b AC4c - Selecting the Accounts top-level Fines area updates the active navigation item
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Accounts"
    Then I am taken to the "Accounts" Fines landing page
