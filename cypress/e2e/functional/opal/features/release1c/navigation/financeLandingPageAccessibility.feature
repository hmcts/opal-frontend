@JIRA-LABEL:navigation
Feature: Finance Landing Page Accessibility
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2582 @JIRA-EPIC:PO-2468 @R1CFinancialMovements
  Scenario: Finance landing page accessibility
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page
    And I see the following text on the page "Automatic Cash Input"
    Then I check the page for accessibility
