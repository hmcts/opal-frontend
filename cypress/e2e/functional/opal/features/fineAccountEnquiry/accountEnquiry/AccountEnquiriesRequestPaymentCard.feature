Feature: Account Enquiries – Request Payment Card
  As an Opal user
  I want to request a payment card for a defendant
  So that I can confirm or cancel the request

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts

  Rule: Eligible account baseline
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
        | Account_status                          | Submitted                           |
        | account.defendant.forenames             | Jamie                               |
        | account.defendant.surname               | PayCardRequest{uniq}                |
        | account.defendant.email_address_1       | Jamie.PayCardRequest{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078259314                         |
        | account.account_type                    | Fine                                |
        | account.prosecutor_case_reference       | PCR-AUTO-013                        |
        | account.collection_order_made           | false                               |
        | account.collection_order_made_today     | false                               |
        | account.payment_card_request            | false                               |
        | account.defendant.dob                   | 2002-05-15                          |
      When I search for the account by last name "PayCardRequest{uniq}" and open the latest result
      Then I should see the page header contains "Mr Jamie PAYCARDREQUEST{uniqUpper}"
      When I go to the Payment terms section

    @PO-1803
    Scenario: Confirming a payment card request shows success and updates the last requested date
      #AC1bii/AC1biii - Successfully requesting a payment card shows a success message and updates the last requested date
      When I start a payment card request
      And I confirm the payment card request
      Then I should see the payment card request success message
      And the payment card last requested date should be today date

      #AC1biiii - Requesting a payment card when one already exists shows an error
      When I start a payment card request
      And I confirm the payment card request
      Then I should see the payment card request already exists error
