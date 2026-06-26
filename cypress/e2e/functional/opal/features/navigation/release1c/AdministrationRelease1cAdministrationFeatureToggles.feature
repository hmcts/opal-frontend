@JIRA-LABEL:primary-nav-and-dashboards
Feature: Administration Release 1C Administration Feature Toggles

  @R1CAdministration @JIRA-STORY:PO-7266 @JIRA-EPIC:PO-3685 @FeatureFlag @JIRA-TEST-KEY:PO-8359
  Scenario: Administration navigation and entry points are available when release 1c administration is enabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I open the "Administration" landing page
    And I open the "Test Administration Link" landing page link
    Then I see the following text on the page "Test Administration Link"

  @R1CAdministrationOff @FeatureFlag @JIRA-STORY:PO-7266 @JIRA-EPIC:PO-3685
  Scenario: Administration is hidden from the primary navigation when release 1c administration is disabled
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Accounts"
    Then I should not see the Fines primary navigation item "Administration"

  @R1CAdministrationOff @FeatureFlag @JIRA-STORY:PO-7266 @JIRA-EPIC:PO-3685
  Scenario: Direct navigation to Administration is blocked when disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I attempt to open the "Administration" entry point
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action
