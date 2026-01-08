@PO-777
Feature: View Defendant Account Summary - Add Comments Accessibility

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts

  @PO-777
  Scenario: Complete View Defendant Account Adult or Youth Summary and Comments functionality
    # Create & publish an individual (adultOrYouthOnly) account then check accessibility
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status                          | Submitted                      |
      | account.defendant.forenames             | John                           |
      | account.defendant.surname               | AccDetailSurname{uniq}               |
      | account.defendant.email_address_1       | John.AccDetailSurname{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259314                    |
      | account.account_type                    | Fine                           |
      | account.prosecutor_case_reference       | PCR-AUTO-002                   |
      | account.collection_order_made           | false                          |
      | account.collection_order_made_today     | false                          |
      | account.payment_card_request            | false                          |
      | account.defendant.dob                   | 2002-05-15                     |
    And I search for the account by last name "AccDetailSurname{uniq}" and verify the page header is "Mr John ACCDETAILSURNAME{uniqUpper}"

    #  Check Accessibility on Add Comments Page
    When I open the Comments page from the defendant summary and verify the page contents
    Then I check the page for accessibility and navigate back

    # Check Accessibility with Form Data Entered
    When I save the following comments and verify the account header is "Mr John ACCDETAILSURNAME{uniqUpper}":
      | field   | text         |
      | Comment | Comment Test |
      | Line 1  | Line1 Test   |
      | Line 2  | Line2 Test   |
      | Line 3  | Line3 Test   |
    Then I check the page for accessibility

  Scenario: Check View Defendant Company Account Summary and Comments Accessibility with Axe-Core
    # Create & publish a company account then check accessibility
    Given I create a "company" draft account with the following details and set status "Publishing Pending":
      | Account_status                      | Submitted              |
      | account.defendant.company_name      | Accdetail comp{uniq}         |
      | account.defendant.email_address_1   | Accdetailcomp{uniq}@test.com |
      | account.defendant.post_code         | AB23 4RN               |
      | account.account_type                | Fine                   |
      | account.prosecutor_case_reference   | PCR-AUTO-003           |
      | account.collection_order_made       | false                  |
      | account.collection_order_made_today | false                  |
      | account.payment_card_request        | false                  |
    When I open the company account details for "Accdetail comp{uniq}"

    # Check Accessibility on Add Comments Page for Company
    When I open the Comments page from the defendant summary and verify the page contents
    Then I check the page for accessibility and navigate back

    # Check Accessibility with Company Form Data Entered
    When I save the following comments and verify the account header is "Accdetail comp{uniq}":
      | field   | text            |
      | Comment | Company Comment |
      | Line 1  | Company Line1   |
      | Line 2  | Company Line2   |
      | Line 3  | Company Line3   |
    Then I check the page for accessibility

  Scenario: Check View Defendant Parent Guardian Account Summary and Comments Accessibility with Axe-Core
    # Create & publish a pgToPay account then check accessibility
    Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending":
      | Account_status                          | Submitted                       |
      | account.defendant.forenames             | Michael                         |
      | account.defendant.surname               | ParentGuardianSurname{uniq}           |
      | account.defendant.email_address_1       | Michael.ParentGuardian{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259318                     |
      | account.account_type                    | Fine                            |
      | account.prosecutor_case_reference       | PCR-AUTO-007                    |
      | account.collection_order_made           | false                           |
      | account.collection_order_made_today     | false                           |
      | account.payment_card_request            | false                           |
      | account.defendant.dob                   | 2010-05-15                      |
    When I search for the account by last name "ParentGuardianSurname{uniq}" and verify the page header is "Miss Michael PARENTGUARDIANSURNAME{uniqUpper}"

    # Check Accessibility on Add Comments Page for Parent Guardian Account
    When I open the Comments page from the defendant summary and verify the page contents
    Then I check the page for accessibility and navigate back

    # Check Accessibility with Parent Guardian Form Data Entered
    When I save the following comments and verify the account header is "Miss Michael PARENTGUARDIANSURNAME{uniqUpper}":
      | field   | text                    |
      | Comment | Parent Guardian Comment |
      | Line 1  | Parent Guardian Line1   |
      | Line 2  | Parent Guardian Line2   |
      | Line 3  | Parent Guardian Line3   |


    # Check accessibility with populated comments
    Then I check the page for accessibility
