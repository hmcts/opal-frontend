@JIRA-LABEL:Smoke-Accessibility
Feature: PO-224 Accessibility Tests
  @JIRA-STORY:PO-224 @JIRA-KEY:POT-3046
  Scenario: Dashboard - Accessibility
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I check the page for accessibility

