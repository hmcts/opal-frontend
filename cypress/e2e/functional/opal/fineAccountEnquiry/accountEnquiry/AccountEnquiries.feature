Feature: Account Search and Matches

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        And I clear all approved draft accounts
        When I navigate to Search For An Account


    Scenario: As a user I can view account details
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted               |
            | account.defendant.forenames             | Peter                   |
            | account.defendant.surname               | JOEJOEs                 |
            | account.defendant.email_address_1       | peter.baS4r@outlook.com |
            | account.defendant.telephone_number_home | 02078259314             |
            | account.account_type                    | Fine                    |
            | account.prosecutor_case_reference       | PCR-AUTO-002            |
            | account.collection_order_made           | false                   |
            | account.collection_order_made_today     | false                   |
            | account.payment_card_request            | false                   |
            | account.defendant.dob                   | 2009-05-15              |
        When I update the last created draft account with status "Publishing Pending"
        And I enter "JOEJOE" into the "Last name" field
        And I click the "Search" button
        Then I click the published account link

