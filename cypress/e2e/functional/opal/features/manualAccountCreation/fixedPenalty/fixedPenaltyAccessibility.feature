@UAT-Technical
Feature: Accessibility Tests for Fixed Penalty Screens
  # This feature file ensures that all screens related to fixed penalty account creation meet accessibility standards using Axe-Core.

  ## Review account screen is covered in the Populate and Submit accessibility tests.

  Background:
    Given I am logged in with email "opal-test@hmcts.net"
    Then I should be on the dashboard

  Scenario Outline: Fixed Penalty details page is accessible for <defendant_type>
    When I start a fixed penalty account for business unit "West London" and defendant type "<defendant_type>"
    Then I check the page for accessibility
    Examples:
      | defendant_type      |
      | Adult or youth only |
      | Company             |
