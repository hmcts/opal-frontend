Feature: Add Account Note - View Defendant Account Details
    # This feature file contains tests for adding an account note in the View Defendant Account Details section #
    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        And I clear all approved draft accounts
        When I navigate to Search For An Account

    @PO-771 @807
    Scenario: As a user I can add defendant account note

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

        # (AC.1) Navigate to Add account note screen
        Then I see "Mr John ACCDETAILSURNAME" on the page header
        When I click the "Add account note " button
        Then I see "Add account note" on the page header
        And I see "You have 1000 characters remaining" on the page

        #(AC4) valid data
        And I enter "Valid test account note" into the "notes" text field
        And I click the "Save note" button
        Then I see "Mr John ACCDETAILSURNAME" on the page header
        And I see the URL contains "details"

        # #(AC5) Cancel button without entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I click on the "Cancel" link
        Then I see "Mr John ACCDETAILSURNAME" on the page header
        And I see the URL contains "details"

        # (AC5a) Cancel button after entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I enter "This is a test account note for validation" into the "notes" text field
        Then I click on the "Cancel" link
        Then I verify "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes." a window pops up and I click Ok
        Then I see "Mr John ACCDETAILSURNAME" on the page header

        # (AC5b) Browser back button after entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I enter "This is a test account note for back button" into the "notes" text field
        And I click the browser back button, a window pops up and I click Ok
        Then I see "Mr John ACCDETAILSURNAME" on the page header
        And I see the URL contains "details"

    @809
    Scenario: As a user I can add the account note for company defendant
        And I create a "company" draft account with the following details:
            | Account_status                      | Submitted              |
            | account.defendant.company_name      | Accdetail comp         |
            | account.defendant.email_address_1   | Accdetailcomp@test.com |
            | account.defendant.post_code         | AB23 4RN               |
            | account.account_type                | Fine                   |
            | account.prosecutor_case_reference   | PCR-AUTO-003           |
            | account.collection_order_made       | false                  |
            | account.collection_order_made_today | false                  |
            | account.payment_card_request        | false                  |
        When I update the last created draft account with status "Publishing Pending"
        And the update should succeed and return a new strong ETag
        And I click on the "Companies" link
        And I enter "Accdetail comp" into the "Company name" field
        And I click the "Search" button
        Then I click the latest published account link
        And I see "Accdetail comp" on the page header

        # (AC.1) Navigate to Add account note screen
        Then I see "Accdetail comp" on the page header
        When I click the "Add account note " button
        Then I see "Add account note" on the page header
        And I see "You have 1000 characters remaining" on the page

        #(AC4) valid data
        And I enter "Valid test account note" into the "notes" text field
        And I click the "Save note" button
        Then I see "Accdetail comp" on the page header
        And I see the URL contains "details"

        # #(AC5) Cancel button without entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I click on the "Cancel" link
        Then I see "Accdetail comp" on the page header
        And I see the URL contains "details"

        # #(AC5a) Cancel button after entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I enter "This is a test account note for validation" into the "notes" text field
        Then I click on the "Cancel" link
        Then I verify "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes." a window pops up and I click Ok
        Then I see "Accdetail comp" on the page header

        # #(AC5b) Browser back button after entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I enter "This is a test account note for back button" into the "notes" text field
        And I click the browser back button, a window pops up and I click Ok
        Then I see "Accdetail comp" on the page header
        And I see the URL contains "details"


