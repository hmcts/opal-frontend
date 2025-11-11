Feature: Account Enquiries – View Account Details
  As a caseworker
  I want to view an account’s details
  So that I can confirm and, when needed, safely discard edits

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved draft accounts

  @PO-1593 @866 @PO-1110
  Scenario: View defendant account details and handle cancel flows
    # AC1 – Account setup
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

    # AC2 – Search and view account details
    When I search for the account by last name "AccDetailSurname" and open the latest result
    Then I should see the page header contains "Mr John ACCDETAILSURNAME"

    # AC3 – Navigate to Defendant details
    When I go to the Defendant details section and the header is "Defendant details"

    # AC4 – Route Guard (cancel edit flow)
    When I edit the Defendant details and change the First name to "Test"
    And I attempt to cancel editing and choose Cancel on the confirmation dialog
    Then I should remain on the edit page
    And I should see the First name field still contains "Test"

    When I attempt to cancel editing and choose OK on the confirmation dialog
    Then I should return to the account details page
    And I should see the account header contains "Mr John ACCDETAILSURNAME"

  @967 @PO-1111
  Scenario: As a user, I can view and manage company account details
    Given I create a "company" draft account with the following details and set status "Publishing Pending":
      | account.defendant.company_name    | Accdetail comp         |
      | account.defendant.email_address   | Accdetailcomp@test.com |
      | account.defendant.post_code       | AB23 4RN               |
      | account.prosecutor_case_reference | PCR-AUTO-003           |
      | account.account_type              | Fine                   |
    When I open the company account details for "Accdetail comp"
    # AC4 - Route Guard
    And I verify route guard behaviour when cancelling company edits
    # AC3 - Cancel Changes
    And I verify cancel-changes behaviour for company edits
    Then I should see the account header contains "Accdetail comp"

  @PO-2315
  Scenario: As a user I can view account details of a non-paying defendant account
    And I create a "pgToPay" draft account with the following details:
      | account.defendant.forenames       | Jane         |
      | account.defendant.surname         | TestNonPayee |
      | account.prosecutor_case_reference | PCR-AUTO-004 |
    # AC2 – Search and view account details
    When I search for the account by last name "TestNonPayee" and open the latest result
    Then I should see the page header contains "Miss Jane TestNonPayee"

    # AC3 – Navigate to Defendant details
    When I go to the Defendant details section and the header is "Defendant details"

    When I edit the Defendant details and change the First name to "Test"
    And I attempt to cancel editing and choose Cancel on the confirmation dialog
    Then I should remain on the edit page
    And I should see the First name field still contains "Test"

    When I attempt to cancel editing and choose OK on the confirmation dialog
    Then I should return to the account details page
    And I should see the account header contains "Miss Jane TestNonPayee"

