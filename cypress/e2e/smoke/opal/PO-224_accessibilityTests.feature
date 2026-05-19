@JIRA-LABEL:Smoke-Accessibility
@JIRA-NFR:PO-2322
Feature: PO-224 Accessibility Tests
  @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-3996
  Scenario: Dashboard - Accessibility
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I check the page for accessibility
