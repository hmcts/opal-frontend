@JIRA-LABEL:navigation
Feature: Reports landing page navigation
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2613 @JIRA-EPIC:PO-2627
  Scenario: Your reports keeps Reports selected in the primary navigation
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page
    And the Reports item remains selected in the primary navigation
    When I open Your reports from the Reports landing page
    Then I am taken to the Your reports summary list screen
