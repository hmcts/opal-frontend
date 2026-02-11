Feature: Account Enquiries - Amend Payment Terms Accessibility

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status                           | Submitted           |
      | account.defendant.forenames              | John                |
      | account.defendant.surname                | AmendPayTerms{uniq} |
      | account.defendant.email_address_1        | john.amend{uniq}@test.com |
      | account.defendant.telephone_number_home  | 02078250001         |
      | account.account_type                     | Fine                |
      | account.prosecutor_case_reference        | PCR-AUTO-010        |
      | account.collection_order_made            | false               |
      | account.collection_order_made_today      | false               |
      | account.payment_card_request             | false               |
      | account.defendant.dob                    | 2002-05-15          |
      | account.offences.0.impositions.0.amount_imposed | 250          |
      | account.offences.0.impositions.0.amount_paid    | 300          |
      | account.payment_terms.payment_terms_type_code   | B            |
      | account.payment_terms.effective_date            | 2025-05-30   |

  Scenario: Amend payment terms page accessibility
    When I search for the account by last name "AmendPayTerms{uniq}" and open the latest result
    And I go to the Payment terms tab
    And I open the amend payment terms form
    Then I check the page for accessibility
