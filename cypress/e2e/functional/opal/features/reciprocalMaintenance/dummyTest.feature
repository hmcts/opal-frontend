@JIRA-LABEL:reciprocal-maintenance
Feature: Reciprocal Maintenance - dummy test
  @JIRA-KEY:POT-3123
  Scenario: The user can sign in to and sign out of the application
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should see the service header containing text "Opal"
