@JIRA-LABEL:manual-cash-input @JIRA-LABEL:accessibility @JIRA-EPIC:PO-2439 @R1CFinancialMovements
Feature: Manual Cash Input - Create Till Accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  # AC7: axe-core accessibility coverage for the Manual Cash Input screen.
  @JIRA-STORY:PO-3475
  Scenario: AC7 - Manual Cash Input create and allocate screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input create and allocate
    Then I check the page for accessibility

  # AC7: axe-core accessibility coverage for Select Business Unit (Manual Payments In).
  @JIRA-STORY:PO-3475
  Scenario: AC7 - Select Business Unit (Manual Payments In) screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input create and allocate
    And I select Create Till from Manual Cash Input
    Then I check the page for accessibility
