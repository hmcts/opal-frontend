Feature: Account Enquiries - View Account Details Accessibility

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved draft accounts

  Scenario: Check Account Details View Accessibility with Axe-Core for Individual Account
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
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
    When I search for the account by last name "AccDetailSurname"
    ## Check Accessibility on Search Results Page
    Then I check the page for accessibility
    And I select the latest published account and verify the header is "Mr John ACCDETAILSURNAME"
    ## Check Accessibility on Account Details Page
    Then I check accessibility

  Scenario: Check Account Details View Accessibility with Axe-Core for Company Account
    Given I create a "company" draft account with the following details and set status "Publishing Pending":
      | Account_status                      | Submitted              |
      | account.defendant.company_name      | Accdetail comp         |
      | account.defendant.email_address_1   | Accdetailcomp@test.com |
      | account.defendant.post_code         | AB23 4RN               |
      | account.account_type                | Fine                   |
      | account.prosecutor_case_reference   | PCR-AUTO-003           |
      | account.collection_order_made       | false                  |
      | account.collection_order_made_today | false                  |
      | account.payment_card_request        | false                  |
    When I search for the account by company name "Accdetail comp"
    # Check Accessibility on Company Search Results Page
    Then I check the page for accessibility
    # Check Accessibility on Company Account Details Page
    And I select the latest published account and verify the header is "Accdetail comp"
    Then I check the page for accessibility
