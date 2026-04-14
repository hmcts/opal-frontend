@JIRA-LABEL:account-enquiry
Feature: Account Search and Matches - End-to-end journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and viewing matching records,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-DEFECT:PO-3541 @JIRA-KEY:POT-4700
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

  @R1B @JIRA-STORY:PO-712 @JIRA-STORY:PO-706 @JIRA-STORY:PO-707 @JIRA-KEY:POT-4607
  Scenario: Search for a company defendant account and open the matching record
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                 |
      | account.defendant.company_name      | Journey Co {uniq}         |
      | account.defendant.address_line_1    | 456 Company Road          |
      | account.defendant.email_address_1   | journey.co{uniq}@test.com |
      | account.defendant.post_code         | AB23 4RN                  |
      | account.account_type                | Fine                      |
      | account.prosecutor_case_reference   | PCRJRNYCO{uniqUpper}      |
      | account.collection_order_made       | false                     |
      | account.collection_order_made_today | false                     |
      | account.payment_card_request        | false                     |
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Companies search form
    And I search using the following inputs:
      | company name   | Journey Co {uniq} |
      | address line 1 | 456 Company Road  |
      | postcode       | AB23 4RN          |
    Then I see the Search results page
    And I see the Companies search results:
      | Ref | PCRJRNYCO{uniqUpper} |
    When I open the latest matching result from the search results
    Then I should see the account header contains "Journey Co {uniq}"

  @R1B @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708 @JIRA-KEY:POT-4608
  Scenario: Search for a minor creditor account and review the matching results
    Given a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRJRNYMIN{uniqUpper} |
      | first name                | Mina                  |
      | last name                 | JourneyMinor{uniq}    |
      | address line 1            | 1 High Street         |
      | postcode                  | MC1 1AA               |
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual         |
      | individual last name | JourneyMinor{uniq} |
      | first names          | Mina               |
      | address line 1       | 1 High Street      |
      | postcode             | MC1 1AA            |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | JourneyMinor{uniq}, Mina |
      | Address line 1 | 1 High Street            |

  @R1B @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708 @JIRA-KEY:POT-4609
  Scenario: Search for a company minor creditor account and review the matching results
    Given a published account exists with a company minor creditor:
      | prosecutor case reference | PCRJRNYMINCO{uniqUpper} |
      | company name              | Journey Minor Co {uniq} |
      | address line 1            | 2 High Street           |
      | postcode                  | MC1 1AB                 |
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type | Company                 |
      | company name        | Journey Minor Co {uniq} |
      | address line 1      | 2 High Street           |
      | postcode            | MC1 1AB                 |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | Journey Minor Co {uniq} |
      | Address line 1 | 2 High Street           |

  @R1B @JIRA-STORY:PO-709 @JIRA-STORY:PO-706 @JIRA-KEY:POT-4610
  Scenario: Search by prosecutor case reference and review results across defendant tabs
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                          | Submitted                       |
      | account.defendant.forenames             | Riley                           |
      | account.defendant.surname               | JourneyRef{uniq}                |
      | account.defendant.email_address_1       | riley.journeyref{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078250031                     |
      | account.account_type                    | Fine                            |
      | account.prosecutor_case_reference       | PCRJRNYREF{uniqUpper}           |
      | account.collection_order_made           | false                           |
      | account.collection_order_made_today     | false                           |
      | account.payment_card_request            | false                           |
      | account.defendant.dob                   | 2000-08-14                      |
    And I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                     |
      | account.defendant.company_name      | Journey Ref Co {uniq}         |
      | account.defendant.email_address_1   | journey.ref.co{uniq}@test.com |
      | account.defendant.post_code         | AB23 4RN                      |
      | account.account_type                | Fine                          |
      | account.prosecutor_case_reference   | PCRJRNYREF{uniqUpper}         |
      | account.collection_order_made       | false                         |
      | account.collection_order_made_today | false                         |
      | account.payment_card_request        | false                         |
    And I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | reference or case number | PCRJRNYREF{uniqUpper} |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | PCRJRNYREF{uniqUpper} |
    And I see the Companies search results by tab switch:
      | Ref | PCRJRNYREF{uniqUpper} |
    When I open the latest matching result from the Companies search results
    Then I should see the account header contains "Journey Ref Co {uniq}"

  @R1B @JIRA-STORY:PO-706 @JIRA-KEY:POT-4611
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

  @skip @LegacyData @R1B @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717
  # Minimum data set required: one individual defendant account with searchable surname LEGACY_INDIVIDUAL_LAST_NAME, prosecutor case reference LEGACY_INDIVIDUAL_REFERENCE, and summary header text LEGACY_INDIVIDUAL_SUMMARY_HEADER.
  Scenario: Search for an individual defendant account from legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | individual last name | LEGACY_INDIVIDUAL_LAST_NAME |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | LEGACY_INDIVIDUAL_REFERENCE |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "LEGACY_INDIVIDUAL_SUMMARY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-712 @JIRA-STORY:PO-706 @JIRA-STORY:PO-707
  # Minimum data set required: one company defendant account with company name LEGACY_COMPANY_NAME, prosecutor case reference LEGACY_COMPANY_REFERENCE, and account header text LEGACY_COMPANY_HEADER.
  Scenario: Search for a company defendant account from legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I view the Companies search form
    And I search using the following inputs:
      | company name | LEGACY_COMPANY_NAME |
    Then I see the Search results page
    And I see the Companies search results:
      | Ref | LEGACY_COMPANY_REFERENCE |
    When I open the latest matching result from the search results
    Then I should see the account header contains "LEGACY_COMPANY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708
  # Minimum data set required: one individual minor creditor with last name LEGACY_MINOR_CREDITOR_LAST_NAME, display name LEGACY_MINOR_CREDITOR_NAME, and address line 1 LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1.
  Scenario: Search for a minor creditor account from legacy data and review the matching results
    Given I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual                           |
      | individual last name | LEGACY_MINOR_CREDITOR_LAST_NAME      |
      | address line 1       | LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1 |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | LEGACY_MINOR_CREDITOR_NAME           |
      | Address line 1 | LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1 |

  @skip @LegacyData @R1B @JIRA-STORY:PO-709 @JIRA-STORY:PO-706
  # Minimum data set required: one individual defendant account and one company defendant account sharing prosecutor case reference LEGACY_SHARED_REFERENCE, with the company account header text LEGACY_SHARED_REFERENCE_COMPANY_HEADER.
  Scenario: Search by prosecutor case reference in legacy data and review results across defendant tabs
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | reference or case number | LEGACY_SHARED_REFERENCE |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | LEGACY_SHARED_REFERENCE |
    And I see the Companies search results by tab switch:
      | Ref | LEGACY_SHARED_REFERENCE |
    When I open the latest matching result from the Companies search results
    Then I should see the account header contains "LEGACY_SHARED_REFERENCE_COMPANY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-706
  # Minimum data set required: one individual defendant account with account number LEGACY_ACCOUNT_NUMBER and summary header text LEGACY_ACCOUNT_SUMMARY_HEADER.
  Scenario: Search by account number in legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | account number | LEGACY_ACCOUNT_NUMBER |
    Then I see the Search results page
    And I see the Individuals search results:
      | Account | LEGACY_ACCOUNT_NUMBER |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "LEGACY_ACCOUNT_SUMMARY_HEADER"
