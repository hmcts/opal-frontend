Feature: Account Enquiries - View Account Details

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        And I clear all approved draft accounts
        When I navigate to Search For An Account

    @PO-1593 @866
    Scenario: As a user I can view account details of an defendant account
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted                    |
            | account.defendant.forenames             | John                         |
            | account.defendant.surname               | TestSurname                  |
            | account.defendant.email_address_1       | John.TestSurname@outlook.com |
            | account.defendant.telephone_number_home | 02078259314                  |
            | account.account_type                    | Fine                         |
            | account.prosecutor_case_reference       | PCR-AUTO-002                 |
            | account.collection_order_made           | false                        |
            | account.collection_order_made_today     | false                        |
            | account.payment_card_request            | false                        |
            | account.defendant.dob                   | 2002-05-15                   |
        When I update the last created draft account with status "Publishing Pending"
        And the update should succeed and return a new strong ETag
        And I enter "TestSurname" into the "Last name" field
        And I click the "Search" button
        Then I click the latest published account link
        And I see "Mr John TESTSURNAME" on the page header

    @967
    Scenario: As a user I can view account details of a company account
        And I create a "company" draft account with the following details:
            | Account_status                      | Submitted        |
            | account.defendant.company_name      | TEST COMPANY     |
            | account.defendant.email_address_1   | ops@sainsco.test |
            | account.defendant.post_code         | AB23 4RN         |
            | account.account_type                | Fine             |
            | account.prosecutor_case_reference   | PCR-COMP-002     |
            | account.collection_order_made       | false            |
            | account.collection_order_made_today | false            |
            | account.payment_card_request        | false            |
        When I update the last created draft account with status "Publishing Pending"
        And the update should succeed and return a new strong ETag
        And I click on the "Companies" link
        And I enter "TEST COMPANY" into the "Company name" field
        And I click the "Search" button
        Then I click the latest published account link
        And I see "TEST COMPANY" on the page header