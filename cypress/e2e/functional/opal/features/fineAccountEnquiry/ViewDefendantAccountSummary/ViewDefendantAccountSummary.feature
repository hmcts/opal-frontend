@PO-777
Feature: View Defendant Account Summary - Add Comments

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        And I clear all approved draft accounts
        When I navigate to Search For An Account

    @PO-777
    Scenario: Complete View Defendant Account Adult or Youth Summary and Comments functionality
        # AC1 - Create & publish an individual (adultOrYouthOnly) account then view header summary
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

        # AC2 / AC3 - Navigate to Add Comments (no existing comments) and verify form fields
        When I click on the "Add comments" link
        Then I see "Comments" on the page header
        And I enter "Comment Test" into the "comment" text field
        And I enter "Line1 Test" into the "Line 1" text field
        And I enter "Line2 Test" into the "Line 2" text field
        And I enter "Line3 Test" into the "Line 3" text field
        And I see the "Save comments" button
        And I see the "Cancel" link
        And I click on the "Cancel" link
        And I see "Mr John ACCDETAILSURNAME" on the page header

        # AC9a - Test route guard with unsaved changes
        # Test cancel with unsaved changes (route guard should trigger)
        When I click on the "Add comments" link
        And I see "Comments" on the page header
        And I enter "Comment Test" into the "comment" text field
        Then I click "Cancel", a window pops up and I click Cancel
        And I see "Comments" on the page header
        And I see "Comment Test" in the "comment" text field

        Then I click "Cancel", a window pops up and I click Ok
        And I see "Mr John ACCDETAILSURNAME" on the page header

        # AC5 - Navigate to Change Comments when comments already exist
        When I click on the "Add comments" link
        Then I see "Comments" on the page header
        And I enter "Comment Test" into the "comment" text field
        And I enter "Line1 Test" into the "Line 1" text field
        And I enter "Line2 Test" into the "Line 2" text field
        And I enter "Line3 Test" into the "Line 3" text field
        And I see the "Save comments" button
        And I click the "Save comments" button
        And I see "Mr John ACCDETAILSURNAME" on the page header

        # AC5c - Verify updated comments display in Comments section
        Then I see "Comment Test" text on the page
        And I see "Line1 Test" text on the page
        And I see "Line2 Test" text on the page
        And I see "Line3 Test" text on the page

        When I click on the "Change" link
        Then I see "Comments" on the page header
        And I see "Comment Test" in the "comment" text field
        And I see "Line1 Test" in the "Line 1" text field
        And I see "Line2 Test" in the "Line 2" text field
        And I see "Line3 Test" in the "Line 3" text field


    @PO-777
    Scenario: Complete View Defendant Company Account Summary and Comments functionality
        # AC4 - Create & publish a company account then view header summary
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

        # AC9a - Test route guard with unsaved changes
        # Test cancel with unsaved changes (route guard should trigger)
        When I click on the "Add comments" link
        And I see "Comments" on the page header
        And I enter "Company Comment" into the "comment" text field
        Then I click "Cancel", a window pops up and I click Cancel
        And I see "Comments" on the page header
        And I see "Company Comment" in the "comment" text field

        Then I click "Cancel", a window pops up and I click Ok
        And I see "Accdetail comp" on the page header

        # AC2 / AC3 - Navigate to Add Comments and test form functionality
        When I click on the "Add comments" link
        Then I see "Comments" on the page header
        And I enter "Company Comment" into the "comment" text field
        And I enter "Company Line1" into the "Line 1" text field
        And I enter "Company Line2" into the "Line 2" text field
        And I enter "Company Line3" into the "Line 3" text field
        And I see the "Save comments" button
        And I see the "Cancel" link
        And I click the "Save comments" button
        And I see "Accdetail comp" on the page header

        # AC5c - Verify updated comments display for company account
        Then I see "Company Comment" text on the page
        And I see "Company Line1" text on the page
        And I see "Company Line2" text on the page
        And I see "Company Line3" text on the page

        When I click on the "Change" link
        Then I see "Comments" on the page header
        And I see "Company Comment" in the "comment" text field
        And I see "Company Line1" in the "Line 1" text field
        And I see "Company Line2" in the "Line 2" text field
        And I see "Company Line3" in the "Line 3" text field

    @PO-777
    Scenario: Complete View Defendant Adult or Youth with Parent Guardian to Pay Account Summary and Comments functionality
        # Create & publish a pgToPay account then view header summary
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

        # AC9a - Test route guard with unsaved changes
        # Test cancel with unsaved changes (route guard should trigger)
        When I click on the "Add comments" link
        And I see "Comments" on the page header
        And I enter "Parent Guardian Comment" into the "comment" text field
        Then I click "Cancel", a window pops up and I click Cancel
        And I see "Comments" on the page header
        And I see "Parent Guardian Comment" in the "comment" text field

        Then I click "Cancel", a window pops up and I click Ok
        And I see "Miss Michael PARENTGUARDIANSURNAME" on the page header

        # AC2 / AC3 - Navigate to Add Comments and test form functionality for pgToPay account
        When I click on the "Add comments" link
        Then I see "Comments" on the page header
        And I enter "Parent Guardian Comment" into the "comment" text field
        And I enter "Parent Guardian Line1" into the "Line 1" text field
        And I enter "Parent Guardian Line2" into the "Line 2" text field
        And I enter "Parent Guardian Line3" into the "Line 3" text field
        And I see the "Save comments" button
        And I see the "Cancel" link
        And I click the "Save comments" button
        And I see "Miss Michael PARENTGUARDIANSURNAME" on the page header

        # AC5c - Verify updated comments display for pgToPay account
        Then I see "Parent Guardian Comment" text on the page
        And I see "Parent Guardian Line1" text on the page
        And I see "Parent Guardian Line2" text on the page
        And I see "Parent Guardian Line3" text on the page

        When I click on the "Change" link
        Then I see "Comments" on the page header
        And I see "Parent Guardian Comment" in the "comment" text field
        And I see "Parent Guardian Line1" in the "Line 1" text field
        And I see "Parent Guardian Line2" in the "Line 2" text field
        And I see "Parent Guardian Line3" in the "Line 3" text field
