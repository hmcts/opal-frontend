Feature: Accessibility Tests for Fixed Penalty Screens
  # This feature file ensures that all screens related to fixed penalty account creation meet accessibility standards using Axe-Core.

  ## Review account screen is covered in the Populate and Submit accessibility tests.

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    Then I am on the dashboard

  Scenario Outline: Manual Fixed Penalty Details - <defendant_type> - Axe Core
    Given I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fixed Penalty" radio button
    And I select the "<defendant_type>" radio button

    When I click the "Continue" button
    Then I see "Fixed Penalty details" on the page header
    Then I check accessibility
    Examples:
      | defendant_type      |
      | Adult or youth only |
      | Company             |
