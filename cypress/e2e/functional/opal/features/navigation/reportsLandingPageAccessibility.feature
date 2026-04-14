@JIRA-LABEL:navigation
@JIRA-STORY:PO-2322
Feature: Reports landing page navigation
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2613 @JIRA-EPIC:PO-2627 @JIRA-KEY:POT-4756
  Scenario: Reports landing page accessibility
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page
    Then I check the page for accessibility
