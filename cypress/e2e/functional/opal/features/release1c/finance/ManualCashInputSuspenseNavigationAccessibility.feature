@JIRA-LABEL:manual-cash-input @JIRA-LABEL:accessibility @JIRA-EPIC:PO-2660 @JIRA-STORY:PO-3682 @R1CFinancialMovements
Feature: Manual Cash Input - Suspense navigation accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till for account confirmation
    And I continue
    And I add a payment to the till
    And I continue with payment category "criminal"

  @AC1
  Scenario: AC1 - Suspense Details accessibility after a consolidated child selects suspense
    When I select a Manual Cash Input account that is "consolidated"
    And I pay the consolidated Manual Cash Input account into suspense
    Then I see Suspense Details
    And I check the page for accessibility

  @AC2
  Scenario: AC2 - Suspense Details accessibility after a restricted account selects suspense
    When I select a Manual Cash Input account that is "written off"
    And I pay the restricted Manual Cash Input account into suspense
    Then I see Suspense Details
    And I check the page for accessibility
