@JIRA-LABEL:auto-payments-processing-files @JIRA-EPIC:PO-2468 @R1CFinancialMovements
Feature: Automatic Cash Input - Select Business Units Accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2584
  Scenario: AC7 - Select Business Units page accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Automatic Cash Input Select Business Units
    And I see the following text on the page "Select business units"
    Then I check the page for accessibility
