Feature: Account Enquiries - Request Payment Card Accessibility

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts

  Scenario: Check Request Payment Card confirmation accessibility
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
      | Account_status                          | Submitted                          |
      | account.defendant.forenames             | Jamie                              |
      | account.defendant.surname               | PayCardAccess{uniq}                |
      | account.defendant.email_address_1       | Jamie.PayCardAccess{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259314                        |
      | account.account_type                    | Fine                               |
      | account.prosecutor_case_reference       | PCR-AUTO-014                       |
      | account.collection_order_made           | false                              |
      | account.collection_order_made_today     | false                              |
      | account.payment_card_request            | false                              |
      | account.defendant.dob                   | 2002-05-15                         |
    When I search for the account by last name "PayCardAccess{uniq}" and open the latest result
    And I go to the Payment terms section
    And I start a payment card request
    Then I should see the request payment card confirmation screen
    And I check the page for accessibility
