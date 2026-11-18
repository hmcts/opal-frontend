@JIRA-LABEL:finance
Feature: Outbound Interface Files

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-8674 @JIRA-EPIC:PO-3952 @R1CBankingInterfaces
  Scenario: An authorised user can access the Outbound Interface Files page
    When I select the Fines primary navigation item "Finance"
    And I open the Finance banking interface link "Outbound files"
    Then I see the following text on the page "Outbound interface files"

  @JIRA-STORY:PO-8674 @JIRA-EPIC:PO-3952 @R1CBankingInterfaces
  Scenario: The Outbound Interface Files page displays its filters and refresh action
    When I select the Fines primary navigation item "Finance"
    And I open the Finance banking interface link "Outbound files"
    Then I see the following text on the page "Filter by business unit"
    And I see the following text on the page "Filter by date"
    And I see the following text on the page "Last 7 days"
    And I see the following text on the page "Custom days"
    And I see the following text on the page "Date range"
    And I see the following text on the page "Refresh"
