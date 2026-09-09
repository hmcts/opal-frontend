@JIRA-LABEL:auto-payments-processing-files @JIRA-EPIC:PO-2468 @R1CFinancialMovements
Feature: Automatic Cash Input - Select Business Units

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2584
  Scenario: AC3 and AC3a - only permitted business units are displayed in alphabetical order
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Automatic Cash Input Select Business Units
    Then only business units with Process and allocate payments permission are displayed
