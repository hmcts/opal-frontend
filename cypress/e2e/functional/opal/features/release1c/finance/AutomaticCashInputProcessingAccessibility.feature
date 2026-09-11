@JIRA-LABEL:auto-payments-processing-files @JIRA-LABEL:accessibility @JIRA-EPIC:PO-2468 @R1CFinancialMovements
Feature: Automatic Cash Input - Processing Accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2585
  Scenario: AC9 - Process files screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Automatic Cash Input Select Business Units
    And I select business units and continue to Processing
    Then I check the page for accessibility
