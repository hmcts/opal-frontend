Feature: Sign In Smoke Test
  Scenario: The user can sign in to and sign out of the application
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And The sign out link should be visible

    When I click the Sign out link
    Then I see "Sign in" on the sign in page
