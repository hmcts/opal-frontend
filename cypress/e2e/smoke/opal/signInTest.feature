Feature: Sign In Smoke Test
  Scenario: The user can sign in to and sign out of the application
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And The sign out link should be visible
