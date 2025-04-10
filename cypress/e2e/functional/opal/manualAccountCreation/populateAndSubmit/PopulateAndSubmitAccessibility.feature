Feature: Accessibility Tests for Populate and Submit Screens
    # This feature file ensures that all screens that can't be covered elsewhere in the Populate and Submit flow meet accessibility standards using Axe-Core.

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
        Then I am on the dashboard

    Scenario: Dashboard - Axe Core
        Then I check accessibility

    Scenario: Manual Account Creation - Axe Core
        Given I navigate to Manual Account Creation
        And I enter "West London" into the business unit search box
        And I select the "Fine" radio button
        And I select the "Adult or youth only" radio button
        Then I check accessibility

    Scenario: Account Details - Axe Core
        Given I navigate to Manual Account Creation
        And I enter "West London" into the business unit search box
        And I select the "Fine" radio button
        And I select the "Adult or youth only" radio button
        Then I click the "Continue" button
        Then I check accessibility
