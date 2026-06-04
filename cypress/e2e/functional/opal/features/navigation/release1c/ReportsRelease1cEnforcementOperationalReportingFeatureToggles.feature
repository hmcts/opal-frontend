@JIRA-LABEL:primary-nav-and-dashboards
Feature: Reports Release 1C Enforcement Operational Reporting Feature Toggles

  @FeatureFlag @R1CEnforcementOperationalReporting @JIRA-STORY:PO-3758 @JIRA-EPIC:PO-3685
  Scenario: Reports navigation and entry points are available when release 1c enforcement operational reporting is enabled
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page
    And the Reports item remains selected in the primary navigation
    When I open Your reports from the Reports landing page
    Then I am taken to the Your reports summary list screen

  @FeatureFlag @R1CEnforcementOperationalReportingOff @JIRA-STORY:PO-3758 @JIRA-EPIC:PO-3685
  Scenario: Reports is hidden from the primary navigation when release 1c enforcement operational reporting is disabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I should not see the Fines primary navigation item "Reports"

  @FeatureFlag @R1CEnforcementOperationalReportingOff @JIRA-STORY:PO-3758 @JIRA-EPIC:PO-3685
  Scenario Outline: Direct navigation to <entryPoint> is blocked when release 1c enforcement operational reporting is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Reports entry point "<entryPoint>"
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action

    Examples:
      | entryPoint                           |
      | Reports dashboard                    |
      | Your reports                         |
      | Operational reports (by enforcement) |
      | Operational reports (by payments)    |

  @FeatureFlag @R1CEnforcementOperationalReporting @JIRA-STORY:PO-3758 @JIRA-EPIC:PO-3685
  Scenario Outline: Direct navigation to <entryPoint> is allowed when release 1c enforcement operational reporting is enabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Reports entry point "<entryPoint>"
    Then I am taken to the Reports summary list screen for "<entryPoint>"

    Examples:
      | entryPoint                           |
      | Operational reports (by enforcement) |
      | Operational reports (by payments)    |
