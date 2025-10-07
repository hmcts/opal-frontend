@PO-777
Feature: View Defendant Account Summary - Add Comments

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        When I navigate to Search For An Account

    Scenario: Navigate to Add Comments screen from Account Summary
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted                      |
            | account.defendant.forenames             | John                           |
            | account.defendant.surname               | AccDetailSurname               |
            | account.defendant.email_address_1       | John.AccDetailSurname@test.com |
            | account.defendant.telephone_number_home | 02078259314                    |
            | account.account_type                    | Fine                           |
            | account.prosecutor_case_reference       | PCR-AUTO-002                   |
            | account.collection_order_made           | false                          |
            | account.collection_order_made_today     | false                          |
            | account.payment_card_request            | false                          |
            | account.defendant.dob                   | 2002-05-15                     |
        When I update the last created draft account with status "Publishing Pending"
        And the update should succeed and return a new strong ETag
        And I enter "AccDetailSurname" into the "Last name" field
        And I click the "Search" button
        Then I click the latest published account link
        And I see "Mr John ACCDETAILSURNAME" on the page header

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

