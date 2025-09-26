@PO-777
Feature: View Defendant Account Summary - Add Comments

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        When I navigate to Search For An Account

    Scenario: Navigate to Add Comments screen from Account Summary
        # Search for an account
        When I click on the "Individuals" link
        And I enter "Smith" into the "Last name" field
        And I enter "John" into the "First names" field
        When I click the "Search" button

        # Select an account from search results
        Then I click on the first search result link

        # Navigate to Add Comments
        When I click on the "Add comments" link
        Then I see "Comments" on the page header

        # Verify the form loads correctly
        And I see the "Comment" field
        And I see the "Line 1" field
        And I see the "Line 2" field
        And I see the "Line 3" field
        And I see the "Save comments" button
        And I see the "Cancel" link

    Scenario: Navigate to Change Comments screen when comments exist
        # Search for an account with existing comments
        When I click on the "Individuals" link
        And I enter "TestUser" into the "Last name" field
        And I enter "Existing" into the "First names" field
        When I click the "Search" button

        # Select an account from search results
        Then I click on the first search result link

        # Navigate to Change Comments (when comments already exist)
        When I click on the "Change" link
        Then I see "Comments" on the page header

        # Verify the form loads with existing data
        And I see the "Comment" field
        And I see the "Save comments" button
        And I see the "Cancel" link

