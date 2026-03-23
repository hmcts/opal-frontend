Feature: Sign In Smoke Test
  @JIRA-KEY:POT-3047
  Scenario: The user can sign in to and sign out of the application
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And The sign out link should be visible
