@JIRA-LABEL:primary-nav-and-dashboards
Feature: Reports landing page navigation
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-2613 @JIRA-STORY:PO-3758 @JIRA-EPIC:PO-2627 @JIRA-TEST-KEY:PO-5284
  Scenario: Your reports keeps Reports selected in the primary navigation
    #AC1d: Report tab stays selected
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page
    And the Reports item remains selected in the primary navigation
    When I open Your reports from the Reports landing page
    Then I am taken to the Your reports summary list screen

  @JIRA-STORY:PO-3758 @JIRA-EPIC:PO-3685
  Scenario Outline: Operational report links are available from the Reports landing page
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page
    When I open the Reports landing page link "<reportLink>"
    Then I am taken to the Reports summary list screen for "<reportLink>"

    @JIRA-TEST-KEY:PO-5285
    Examples:
      | reportLink                            |
      | Operational reports (by enforcement) |
    @JIRA-TEST-KEY:PO-5286
    Examples:
      | reportLink                            |
      | Operational reports (by payments)    |
