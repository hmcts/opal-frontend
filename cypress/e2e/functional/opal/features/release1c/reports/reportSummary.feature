@JIRA-LABEL:reports
Feature: Report Summary
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2306 @JIRA-EPIC:PO-2248 @AC1 @R1CEnforcementOperationalReporting
  Scenario Outline: AC1 - Given a report is listed on the Summary list screen, selecting Date and time navigates to Report Summary
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page
    When I open the Reports landing page link "<reportLink>"
    And I select the first report Date and time link
    Then I am taken to the Report summary screen

    Examples:
      | reportLink                           |
      | Operational reports (by enforcement) |
      | Operational reports (by payments)    |

  @JIRA-STORY:PO-2306 @JIRA-EPIC:PO-2248 @AC2 @R1CEnforcementOperationalReporting
  Scenario: AC2 - Given a report is listed on Your reports, selecting Date and time navigates to Report Summary
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page
    When I open the Reports landing page link "Your reports"
    And I select the first report Date and time link
    Then I am taken to the Report summary screen
