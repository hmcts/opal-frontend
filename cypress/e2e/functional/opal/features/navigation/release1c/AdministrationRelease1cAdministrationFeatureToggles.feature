@JIRA-LABEL:primary-nav-and-dashboards
Feature: Administration Release 1C Administration Feature Toggles

  @R1CAdministration @JIRA-STORY:PO-7266 @JIRA-EPIC:PO-3685
  Scenario: Administration navigation and entry points are available when release 1c administration is enabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Administration"
    Then I am taken to the "Administration" Fines landing page
    And I should see the header containing text "Administration"
    When I open the "Test Administration Link" landing page link
    Then I should see the header containing text "Test Administration Link"

  @R1CAdministrationOff @JIRA-STORY:PO-7266 @JIRA-EPIC:PO-3685
  Scenario: Administration is hidden from the primary navigation when release 1c administration is disabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I should not see the Fines primary navigation item "Administration"
