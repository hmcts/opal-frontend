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
    And I attempt to cancel editing and choose "Cancel" on the confirmation dialog
    Then I should remain on the edit page
    And I should see the First name field still contains "Test"

    When I attempt to cancel editing and choose "OK" on the confirmation dialog
    Then I should return to the account details page
    And I should see the account header contains "Mr John ACCDETAILSURNAME"

  @967 @PO-1111
  Scenario: As a user I can view account details of a company account
    Given a company draft account exists with details:
      | Account_status                      | Submitted              |
      | account.defendant.company_name      | Accdetail comp         |
      | account.defendant.email_address_1   | Accdetailcomp@test.com |
      | account.defendant.post_code         | AB23 4RN               |
      | account.account_type                | Fine                   |
      | account.prosecutor_case_reference   | PCR-AUTO-003           |
      | account.collection_order_made       | false                  |
      | account.collection_order_made_today | false                  |
      | account.payment_card_request        | false                  |

    When I publish the last draft account to "Publishing Pending" (assert strong ETag)
    And I open and verify company account details for "Accdetail comp"

    # AC4 - Route Guard
    When I edit company defendant "Company name" to "Test"
    And I cancel editing (dismiss confirmation)
    Then the "Company name" field shows "Test"

    When I cancel editing (accept confirmation)
    Then I am on the account details page headed "Accdetail comp"

    # AC3 - Cancel Changes
    When I edit company defendant "Company name" to "Test"
    And I cancel editing via the link
    Then I am on the account details page headed "Accdetail comp"

    When I edit company defendant "Company name" to "Test"
    And I cancel editing (dismiss confirmation)
    Then the "Company name" field shows "Test"

    When I cancel editing (accept confirmation)
    Then I am on the account details page headed "Accdetail comp"

