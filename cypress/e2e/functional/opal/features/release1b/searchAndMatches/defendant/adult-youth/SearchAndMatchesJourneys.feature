@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth search and matches journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and viewing matching records,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-DEFECT:PO-3541 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5290
  Scenario: Search for an individual defendant account and open the matching record
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                              | Submitted                        |
      | account.defendant.forenames                 | Jordan                           |
      | account.defendant.surname                   | JourneyInd{uniq}                 |
      | account.defendant.email_address_1           | jordan.journeyind{uniq}@test.com |
      | account.defendant.telephone_number_home     | 02078250021                      |
      | account.defendant.national_insurance_number | AB123456C                        |
      | account.defendant.address_line_1            | 123 Journey Street               |
      | account.defendant.post_code                 | AB1 2CD                          |
      | account.account_type                        | Fine                             |
      | account.prosecutor_case_reference           | PCRJRNYIND{uniqUpper}            |
      | account.collection_order_made               | false                            |
      | account.collection_order_made_today         | false                            |
      | account.payment_card_request                | false                            |
      | account.defendant.dob                       | 2001-05-15                       |
    And I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | individual last name      | JourneyInd{uniq}   |
      | first names               | Jordan             |
      | date of birth             | 15/05/2001         |
      | national insurance number | AB123456C          |
      | address line 1            | 123 Journey Street |
      | postcode                  | AB1 2CD            |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | PCRJRNYIND{uniqUpper} |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "JOURNEYIND{uniqUpper}"


  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-706 @JIRA-TEST-KEY:PO-5295
  Scenario: Search by account number and open the matching record
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                          | Submitted                           |
      | account.defendant.forenames             | Casey                               |
      | account.defendant.surname               | JourneyAccount{uniq}                |
      | account.defendant.email_address_1       | casey.journeyaccount{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078250041                         |
      | account.account_type                    | Fine                                |
      | account.prosecutor_case_reference       | PCRJRNYACC{uniqUpper}               |
      | account.collection_order_made           | false                               |
      | account.collection_order_made_today     | false                               |
      | account.payment_card_request            | false                               |
      | account.defendant.dob                   | 1999-02-10                          |
    And I am on the Account Search page - Individuals form displayed by default
    When I search for the last created account by account number
    Then I see the Search results page
    And I see the Individuals search results for the last created account
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "JOURNEYACCOUNT{uniqUpper}"

  # Legacy-data scenarios are scaffolds.
  # Replace the LEGACY_* placeholders with real seeded data values before executing them.
