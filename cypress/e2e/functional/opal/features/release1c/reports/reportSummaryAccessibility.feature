@JIRA-LABEL:reports
Feature: Report Summary Accessibility
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2306 @JIRA-EPIC:PO-2248 @AC1 @R1CEnforcementOperationalReporting
  Scenario Outline: Report Summary accessibility when opened from an Operational report summary list
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page
    When I open the Reports landing page link "<reportLink>"
    And I select the first report Date and time link
    Then I am taken to the Report summary screen
    And I check the page for accessibility

    Examples:
      | reportLink                           |
      | Operational reports (by enforcement) |
      | Operational reports (by payments)    |
