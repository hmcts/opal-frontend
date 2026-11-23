@JIRA-LABEL:finance @JIRA-LABEL:variant-banking-file-upload
Feature: Variant Banking File Upload

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-8684 @JIRA-EPIC:PO-3952 @R1CBankingInterfaces
  Scenario: An authorised user uploads multiple Variant Banking files from Finance
    When I select the Fines primary navigation item "Finance"
    And I open the Finance banking interface link "Upload variant banking files"
    Then I can upload multiple Variant Banking files successfully
