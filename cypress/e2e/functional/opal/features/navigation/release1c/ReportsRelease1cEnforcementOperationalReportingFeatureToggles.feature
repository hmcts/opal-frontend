@JIRA-LABEL:primary-nav-and-dashboards
Feature: Reports Release 1C Enforcement Operational Reporting Feature Toggles

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
      | entryPoint                            |
      | Reports dashboard                     |
      | Your reports                          |
      | Operational reports (by enforcement) |
      | Operational reports (by payments)    |
