@JIRA-LABEL:primary-nav-and-dashboards
Feature: Financial Movements Release 1C Financial Movements Feature Toggles

  @R1CFinancialMovements @JIRA-STORY:PO-7266 @JIRA-EPIC:PO-3685
  Scenario: Finance navigation and entry points are available when release 1c financial movements is enabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page
    And I should see the header containing text "Finance"
    When I open the "Test Finance Link" landing page link
    Then I see the following text on the page "Test Finance Link"

  @R1CFinancialMovementsOff @JIRA-STORY:PO-7266 @JIRA-EPIC:PO-3685
  Scenario: Finance is hidden from the primary navigation when release 1c financial movements is disabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I should not see the Fines primary navigation item "Finance"

  @R1CFinancialMovementsOff @JIRA-STORY:PO-7266 @JIRA-EPIC:PO-3685
  Scenario: Direct navigation to the Finance entry point is blocked when release 1c financial movements is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the "Finance" entry point
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action
