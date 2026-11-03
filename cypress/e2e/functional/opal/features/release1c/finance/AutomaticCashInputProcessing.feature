@JIRA-LABEL:auto-payments-processing-files @JIRA-EPIC:PO-2468 @R1CFinancialMovements
Feature: Automatic Cash Input - Processing

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2585
  Scenario: AC3 and AC3a - only eligible files associated with selected business units are displayed
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Automatic Cash Input Select Business Units
    And I select business units and continue to Processing
    Then only files for the selected business units are displayed

  @JIRA-STORY:PO-2588 @AC1 @AC2 @AC2a @AC2b @AC2c @AC3 @AC3a @AC4 @AC4a
  Scenario: AC1, AC2, AC3 and AC4 - users view ignored files from the last 14 days and open their File Summary
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Automatic Cash Input Select Business Units
    And I select a business unit and continue to Ignored files
    Then I can view ignored files from the last 14 days and open their File Summary
