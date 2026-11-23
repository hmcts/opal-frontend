@JIRA-LABEL:finance @JIRA-LABEL:accessibility
Feature: Variant Banking File Upload Accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-8684 @JIRA-EPIC:PO-3952 @R1CBankingInterfaces
  Scenario: The Variant Banking file upload page is accessible
    When I select the Fines primary navigation item "Finance"
    And I open the Finance banking interface link "Upload variant banking files"
    Then I see the following text on the page "Upload variant banking files"
    And I check the page for accessibility
