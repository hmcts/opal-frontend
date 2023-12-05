Feature: test Feature
  Scenario: test scenario
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header
    When I click Sign in
    Then The sign out button should be visible
