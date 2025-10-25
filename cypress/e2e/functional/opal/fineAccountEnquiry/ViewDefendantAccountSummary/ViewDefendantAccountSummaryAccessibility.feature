@PO-777
Feature: View Defendant Account Summary - Add Comments Accessibility

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        And I clear all approved draft accounts
        When I navigate to Search For An Account

    Scenario: Check View Defendant Account Summary and Comments Accessibility with Axe-Core for Individual Account
        # Create & publish an individual (adultOrYouthOnly) account then check accessibility
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

        ## Check Accessibility on Add Comments Page
        When I click on the "Add comments" link
        Then I see "Comments" on the page header
        Then I check accessibility

        ## Check Accessibility with Form Data Entered
        And I enter "Comment Test" into the "comment" text field
        And I enter "Line1 Test" into the "Line 1" text field
        And I enter "Line2 Test" into the "Line 2" text field
        And I enter "Line3 Test" into the "Line 3" text field

        ## Save comments and check accessibility with populated comments
        And I click the "Save comments" button
        And I see "Mr John ACCDETAILSURNAME" on the page header
        Then I check accessibility

    Scenario: Check View Defendant Company Account Summary and Comments Accessibility with Axe-Core
        # Create & publish a company account then check accessibility
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

        ## Check Accessibility on Add Comments Page for Company
        When I click on the "Add comments" link
        Then I see "Comments" on the page header
        Then I check accessibility

        ## Check Accessibility with Company Form Data Entered
        And I enter "Company Comment" into the "comment" text field
        And I enter "Company Line1" into the "Line 1" text field
        And I enter "Company Line2" into the "Line 2" text field
        And I enter "Company Line3" into the "Line 3" text field
        ## Save comments and check accessibility with populated comments
        When I click the "Save comments" button
        And I see "Accdetail comp" on the page header
        Then I check accessibility

    Scenario: Check View Defendant Parent Guardian Account Summary and Comments Accessibility with Axe-Core
        # Create & publish a pgToPay account then check accessibility
        And I create a "pgToPay" draft account with the following details:
            | Account_status                          | Submitted                       |
            | account.defendant.forenames             | Michael                         |
            | account.defendant.surname               | ParentGuardianSurname           |
            | account.defendant.email_address_1       | Michael.ParentGuardian@test.com |
            | account.defendant.telephone_number_home | 02078259318                     |
            | account.account_type                    | Fine                            |
            | account.prosecutor_case_reference       | PCR-AUTO-007                    |
            | account.collection_order_made           | false                           |
            | account.collection_order_made_today     | false                           |
            | account.payment_card_request            | false                           |
            | account.defendant.dob                   | 2010-05-15                      |
        When I update the last created draft account with status "Publishing Pending"
        And the update should succeed and return a new strong ETag
        And I enter "ParentGuardianSurname" into the "Last name" field
        And I click the "Search" button
        Then I click the latest published account link
        And I see "Miss Michael PARENTGUARDIANSURNAME" on the page header

        ## Check Accessibility on Add Comments Page for Parent Guardian Account
        When I click on the "Add comments" link
        Then I see "Comments" on the page header
        Then I check accessibility

        ## Check Accessibility with Parent Guardian Form Data Entered
        And I enter "Parent Guardian Comment" into the "comment" text field
        And I enter "Parent Guardian Line1" into the "Line 1" text field
        And I enter "Parent Guardian Line2" into the "Line 2" text field
        And I enter "Parent Guardian Line3" into the "Line 3" text field

        ## Save comments and check accessibility with populated comments
        When I click the "Save comments" button
        And I see "Miss Michael PARENTGUARDIANSURNAME" on the page header
        Then I check accessibility