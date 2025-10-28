Feature: Account Enquiries - View Account Details

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        And I clear all approved draft accounts
        When I navigate to Search For An Account

    @PO-1593 @866 @PO-1110
    Scenario: As a user I can view account details of an defendant account
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

        When I click on the "Defendant" link
        Then I click on the "Change" link
        And I see "Defendant details" on the page header

        # AC4 - Route Guard
        When I enter "Test" into the "First name" field
        Then I click Cancel, a window pops up and I click Cancel
        Then I see 'Test' in the 'First name' field

        When I click Cancel, a window pops up and I click Ok
        Then I see "Mr John ACCDETAILSURNAME" on the page header


        # AC3 - Cancel Changes
        When I click on the "Defendant" link
        Then I click on the "Change" link
        When I click on the "Cancel" link
        Then I see "Mr John ACCDETAILSURNAME" on the page header

        When I click on the "Defendant" link
        And I click on the "Change" link
        And I enter "Test" into the "First name" field

        Then I click "Cancel", a window pops up and I click Cancel
        Then I see "Test" in the "First name" field

        Then I click "Cancel", a window pops up and I click Ok
        Then I see "Mr John ACCDETAILSURNAME" on the page header

    @967
    Scenario: As a user I can view account details of a company account
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