Feature: PO-224 Accessibility Tests
  @JIRA-KEY:POT-3046
  Scenario: Dashboard - Accessibility
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I check the page for accessibility

