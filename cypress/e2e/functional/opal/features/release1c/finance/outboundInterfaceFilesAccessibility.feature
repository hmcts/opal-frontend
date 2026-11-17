@JIRA-LABEL:finance @JIRA-LABEL:accessibility
Feature: Outbound Interface Files Accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-8674 @JIRA-EPIC:PO-3952 @R1CBankingInterfaces
  Scenario: Outbound Interface Files page is accessible
    When I select the Fines primary navigation item "Finance"
    And I open the Finance banking interface link "Outbound files"
    Then I see the following text on the page "Outbound interface files"
    And I check the page for accessibility
