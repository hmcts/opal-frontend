Feature: Sign In Smoke Test
  Scenario: The user can sign in to and sign out of the application
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header
    When I click Sign in
    Then I see "API Test Page" in the page body header
    And The sign out link should be visible

    When I click the Sign out link
    Then I see "Sign in" in the page body header
