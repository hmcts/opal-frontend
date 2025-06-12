Feature: Accessibility Tests for Check and Validate Screens
    # This feature file ensures that all screens in the Check and Validate flow meet accessibility standards using Axe-Core.

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

    Scenario: Draft Account List, Account Details, and Check and Validate Sections - Axe Core

        Given I navigate to Create and Manage Draft Accounts
        Then I check accessibility

        # Create a draft account with rejected status for testing
        Given I create a "company" draft account with the following details:
            | account.defendant.company_name | TEST Accessibility-Check |
        When I update the last created draft account with status "Rejected"
        Then I click on the "Rejected" link
        Then I click on the "TEST Accessibility-Check" link

        # Account Details screen - Axe Core
        And I see the "Check and submit" section heading
        Then I check accessibility

        # Check Account screen - Axe Core
        When I click the "Check account" button
        Then I see "Check account details" on the page header
        Then I check accessibility

        # Submit for review screen - Axe Core
        When I click the "Submit for review" button
        Then I see "You have submitted TEST Accessibility-Check's account for review" text on the page

        When I click on the "In review" link
        Then I see "TEST Accessibility-Check" text on the page
        Then I check accessibility

        When I update the last created draft account with status "Deleted"
        Then I click on the "Deleted" link
        Then I see "TEST Accessibility-Check" text on the page
        Then I check accessibility

        # Create a new account for testing the Approved tab
        Given I create a "company" draft account with the following details:
            | account.defendant.company_name | TEST Accessibility-Check-Approved |
        When I update the last created draft account with status "Approved"
        Then I click on the "Approved" link
        Then I see "TEST Accessibility-Check-Approved" text on the page
        Then I check accessibility

