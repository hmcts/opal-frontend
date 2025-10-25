Feature: Add Account Note - View Defendant Account Details Accessibility

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        And I clear all approved draft accounts
        When I navigate to Search For An Account

    Scenario: Check Add Account Note Accessibility with Axe-Core for Individual Account

        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted                           |
            | account.defendant.forenames             | James                               |
            | account.defendant.surname               | GrahamAddNoteSurname                |
            | account.defendant.email_address_1       | James.GrahamAddNoteSurname@test.com |
            | account.defendant.telephone_number_home | 02078259314                         |
            | account.account_type                    | Fine                                |
            | account.prosecutor_case_reference       | PCR-AUTO-002                        |
            | account.collection_order_made           | false                               |
            | account.collection_order_made_today     | false                               |
            | account.payment_card_request            | false                               |
            | account.defendant.dob                   | 2002-05-15                          |

        When I update the last created draft account with status "Publishing Pending"
        And the update should succeed and return a new strong ETag
        And I enter "GrahamAddNoteSurname" into the "Last name" field
        And I click the "Search" button
        Then I click the latest published account link
        Then I see "Mr James GRAHAMADDNOTESURNAME" on the page header

        ## Check Accessibility on Add Account Note Page
        When I click the "Add account note " button
        Then I see "Add account note" on the page header
        Then I check accessibility

        ## Check Accessibility with Form Data Entered for Company
        When I enter "Valid test account note for company accessibility testing" into the "notes" text field
        Then I click the "Save note" button

        Then I see "AccNote comp" on the page header
        Then I check accessibility

    Scenario: Check Add Account Note Accessibility with Axe-Core for Company Account
        And I create a "company" draft account with the following details:
            | Account_status                      | Submitted             |
            | account.defendant.company_name      | AccNote comp          |
            | account.defendant.email_address_1   | AAccNotecomp@test.com |
            | account.defendant.post_code         | AB23 4RN              |
            | account.account_type                | Fine                  |
            | account.prosecutor_case_reference   | PCR-AUTO-003          |
            | account.collection_order_made       | false                 |
            | account.collection_order_made_today | false                 |
            | account.payment_card_request        | false                 |
        When I update the last created draft account with status "Publishing Pending"
        And the update should succeed and return a new strong ETag
        And I click on the "Companies" link
        And I enter "AccNote comp" into the "Company name" field
        And I click the "Search" button
        Then I click the latest published account link
        And I see "AccNote comp" on the page header

        ## Check Accessibility on Add Account Note Page for Company
        When I click the "Add account note " button
        Then I see "Add account note" on the page header
        Then I check accessibility

        ## Check Accessibility with Form Data Entered for Company
        When I enter "Valid test account note for company accessibility testing" into the "notes" text field
        Then I click the "Save note" button

        Then I see "AccNote comp" on the page header
        Then I check accessibility