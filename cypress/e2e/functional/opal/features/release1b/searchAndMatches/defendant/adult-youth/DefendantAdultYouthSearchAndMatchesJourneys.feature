@JIRA-LABEL:account-enquiry
Feature: Defendant Adult Youth Search And Matches Journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and viewing matching records,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1BUatTechJCDE @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-DEFECT:PO-3541 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5290
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
      | individual last name | JourneyInd{uniq}   |
      | first names          | Jordan             |
      | date of birth        | 15/05/2001         |
      | address line 1       | 123 Journey Street |
      | postcode             | AB1 2CD            |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | PCRJRNYIND{uniqUpper} |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "JOURNEYIND{uniqUpper}"

  @R1B @JIRA-STORY:PO-2953 @JIRA-EPIC:PO-2630 @JIRA-TEST-KEY:PO-10014
  Scenario: Search for an individual defendant account by National Insurance number and open the matching record
    # PO-2953 - AC7
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                              | Submitted                       |
      | account.defendant.forenames                 | Jordan                          |
      | account.defendant.surname                   | JourneyNI{uniq}                 |
      | account.defendant.email_address_1           | jordan.journeyni{uniq}@test.com |
      | account.defendant.telephone_number_home     | 02078250021                     |
      | account.defendant.national_insurance_number | QQ123456C                       |
      | account.defendant.address_line_1            | 123 Journey Street              |
      | account.defendant.post_code                 | AB1 2CD                         |
      | account.account_type                        | Fine                            |
      | account.prosecutor_case_reference           | PCRJRNYNI{uniqUpper}            |
      | account.collection_order_made               | false                           |
      | account.collection_order_made_today         | false                           |
      | account.payment_card_request                | false                           |
      | account.defendant.dob                       | 2001-05-15                      |
    And I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | national insurance number | QQ123456C |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | PCRJRNYNI{uniqUpper} |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "JOURNEYNI{uniqUpper}"

  @R1B @JIRA-STORY:PO-2953 @JIRA-EPIC:PO-2630 @JIRA-TEST-KEY:PO-10015
  Scenario: Search for an individual defendant account by National Insurance number with spaces and open the matching record
    # PO-2953 - AC8
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                              | Submitted                          |
      | account.defendant.forenames                 | Nina                               |
      | account.defendant.surname                   | JourneyNiSpace{uniq}               |
      | account.defendant.email_address_1           | nina.journeynispace{uniq}@test.com |
      | account.defendant.telephone_number_home     | 02078250052                        |
      | account.defendant.national_insurance_number | CD987654D                          |
      | account.defendant.address_line_1            | 789 NI Street                      |
      | account.defendant.post_code                 | AB12 3CD                           |
      | account.account_type                        | Fine                               |
      | account.prosecutor_case_reference           | PCRJRNYNISPACE{uniqUpper}          |
      | account.collection_order_made               | false                              |
      | account.collection_order_made_today         | false                              |
      | account.payment_card_request                | false                              |
      | account.defendant.dob                       | 2002-09-21                         |
    And I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | national insurance number | CD 98 76 54 D |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | PCRJRNYNISPACE{uniqUpper} |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "JOURNEYNISPACE{uniqUpper}"


  @JIRA-EPIC:PO-704 @R1BUatTechJCDE @JIRA-STORY:PO-706 @JIRA-TEST-KEY:PO-5295
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

  @LegacyData @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with searchable surname LEGACY_INDIVIDUAL_LAST_NAME, prosecutor case reference LEGACY_INDIVIDUAL_REFERENCE, and summary header text LEGACY_INDIVIDUAL_SUMMARY_HEADER.
  Scenario Outline: Search for an individual defendant account from legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | individual last name | <LEGACY_INDIVIDUAL_LAST_NAME> |
    Then I see the Search results page
    And I see the Individuals search results:
      | Account | <LEGACY_INDIVIDUAL_ACCOUNT_NUMBER> |
    When I open the matching result from the search results:
      | Business unit | <BUSINESS_UNIT> |
    Then I should see the account summary header contains "<LEGACY_INDIVIDUAL_SUMMARY_HEADER>"
    @R1BUatTechJCDE
    Examples:
      | LEGACY_INDIVIDUAL_LAST_NAME | LEGACY_INDIVIDUAL_ACCOUNT_NUMBER | LEGACY_INDIVIDUAL_SUMMARY_HEADER | BUSINESS_UNIT |
      | AdultOpenPaidWO             | 25000184C                        | Mr Arne ADULTOPENPAIDWO          | West London   |
    @R1BUatTechPRE-PROD @skip
    Examples:
      | LEGACY_INDIVIDUAL_LAST_NAME | LEGACY_INDIVIDUAL_ACCOUNT_NUMBER | LEGACY_INDIVIDUAL_SUMMARY_HEADER | BUSINESS_UNIT |
      | Jones                       | 25000185D                        | LEGACY JONES                     | West London   |

  @LegacyData @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with a unique searchable date of birth LEGACY_INDIVIDUAL_DATE_OF_BIRTH (DD/MM/YYYY), prosecutor case reference LEGACY_INDIVIDUAL_DOB_REFERENCE, and summary header text LEGACY_INDIVIDUAL_DOB_SUMMARY_HEADER.
  # Application requires last name when individual search form is used, so this is included in the search criteria.
  Scenario Outline: Search for an individual defendant account from legacy data by date of birth and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | individual last name | <LEGACY_INDIVIDUAL_LAST_NAME_PARTIAL> |
      | date of birth        | <LEGACY_INDIVIDUAL_DATE_OF_BIRTH>     |
    Then I see the Search results page
    And I see the Individuals search results:
      | Account       | <LEGACY_INDIVIDUAL_ACCOUNT_NUMBER> |
      | Date of birth | 09 Sep 1999                        |
    When I open the matching result from the search results:
      | Business unit | <BUSINESS_UNIT> |
    Then I should see the account summary header contains "<LEGACY_INDIVIDUAL_DOB_SUMMARY_HEADER>"
    @R1BUatTechJCDE
    Examples:
      | LEGACY_INDIVIDUAL_LAST_NAME_PARTIAL | LEGACY_INDIVIDUAL_DATE_OF_BIRTH | LEGACY_INDIVIDUAL_ACCOUNT_NUMBER | LEGACY_INDIVIDUAL_DOB_SUMMARY_HEADER | BUSINESS_UNIT |
      | AdultO                              | 09/09/1999                      | 25000184C                        | Mr Arne ADULTOPENPAIDWO              | West London   |
    @R1BUatTechPRE-PROD @skip
    Examples:
      | LEGACY_INDIVIDUAL_LAST_NAME_PARTIAL | LEGACY_INDIVIDUAL_DATE_OF_BIRTH | LEGACY_INDIVIDUAL_ACCOUNT_NUMBER | LEGACY_INDIVIDUAL_DOB_SUMMARY_HEADER | BUSINESS_UNIT |
      | Adult                               | 01/01/1990                      | 25000185D                        | LEGACY JONES                         | West London   |

  @LegacyData @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with searchable national insurance number LEGACY_INDIVIDUAL_NI_NUMBER, prosecutor case reference LEGACY_INDIVIDUAL_NI_REFERENCE, and summary header text LEGACY_INDIVIDUAL_NI_SUMMARY_HEADER.
  Scenario Outline: Search for an individual defendant account from legacy data by national insurance number and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | national insurance number | <LEGACY_INDIVIDUAL_NI_NUMBER> |
    Then I see the Search results page
    And I see the Individuals search results:
      | Account   | <LEGACY_INDIVIDUAL_ACCOUNT_NUMBER> |
      | NI number | <LEGACY_INDIVIDUAL_NI_NUMBER>      |
    When I open the matching result from the search results:
      | Business unit | <BUSINESS_UNIT> |
    Then I should see the account summary header contains "<LEGACY_INDIVIDUAL_NI_SUMMARY_HEADER>"
    @R1BUatTechJCDE
    Examples:
      | LEGACY_INDIVIDUAL_NI_NUMBER | LEGACY_INDIVIDUAL_ACCOUNT_NUMBER | LEGACY_INDIVIDUAL_NI_SUMMARY_HEADER | BUSINESS_UNIT |
      | NI 19 99 09 A               | 25000184C                        | Mr Arne ADULTOPENPAIDWO             | West London   |
    @R1BUatTechPRE-PROD @skip
    Examples:
      | LEGACY_INDIVIDUAL_NI_NUMBER | LEGACY_INDIVIDUAL_NI_REFERENCE | LEGACY_INDIVIDUAL_NI_SUMMARY_HEADER | BUSINESS_UNIT |
      | QQ123456C                   | LEGACY NI REFERENCE            | LEGACY NI SUMMARY HEADER            | West London   |

  @LegacyData @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with a unique searchable postcode LEGACY_INDIVIDUAL_POSTCODE, prosecutor case reference LEGACY_INDIVIDUAL_POSTCODE_REFERENCE, and summary header text LEGACY_INDIVIDUAL_POSTCODE_SUMMARY_HEADER.
  Scenario Outline: Search for an individual defendant account from legacy data by postcode and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | individual last name | <LEGACY_INDIVIDUAL_LAST_NAME_PARTIAL> |
      | postcode             | <LEGACY_INDIVIDUAL_POSTCODE>          |
    Then I see the Search results page
    And I see the Individuals search results:
      | Postcode | <LEGACY_INDIVIDUAL_POSTCODE> |
    When I open the matching result from the search results:
      | Business unit | <BUSINESS_UNIT> |
    Then I should see the account summary header contains "<LEGACY_INDIVIDUAL_POSTCODE_SUMMARY_HEADER>"
    @R1BUatTechJCDE
    Examples:
      | LEGACY_INDIVIDUAL_LAST_NAME_PARTIAL | LEGACY_INDIVIDUAL_POSTCODE | LEGACY_INDIVIDUAL_POSTCODE_REFERENCE | LEGACY_INDIVIDUAL_POSTCODE_SUMMARY_HEADER | BUSINESS_UNIT |
      | A                                   | UN2 1QE                    | PCRJRNYINDPOSTCODE                   | Mr Brod ADULTACCUNIQUEB                   | West London   |
    @R1BUatTechPRE-PROD @skip
    Examples:
      | LEGACY_INDIVIDUAL_LAST_NAME_PARTIAL | LEGACY_INDIVIDUAL_POSTCODE | LEGACY_INDIVIDUAL_POSTCODE_REFERENCE | LEGACY_INDIVIDUAL_POSTCODE_SUMMARY_HEADER | BUSINESS_UNIT |
      |                                     | AB1 2CD                    | LEGACY POSTCODE REFERENCE            | LEGACY POSTCODE SUMMARY HEADER            | West London   |
  @LegacyData @JIRA-STORY:PO-706 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with account number LEGACY_ACCOUNT_NUMBER and summary header text LEGACY_ACCOUNT_SUMMARY_HEADER.
  Scenario: Search by account number in legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | account number | <LEGACY_ACCOUNT_NUMBER> |
    Then I see the Search results page
    And I see the Individuals search results:
      | Account | <LEGACY_ACCOUNT_NUMBER> |
    When I open the matching result from the search results:
      | Business unit | <BUSINESS_UNIT> |
    Then I should see the account summary header contains "<LEGACY_ACCOUNT_SUMMARY_HEADER>"
    @R1BUatTechJCDE
    Examples:
      | LEGACY_ACCOUNT_NUMBER | LEGACY_ACCOUNT_SUMMARY_HEADER | BUSINESS_UNIT |
      | 25000180S             | Mr Brod ADULTACCUNIQUEB       | West London   |
    @R1BUatTechPRE-PROD @skip
    Examples:
      | LEGACY_ACCOUNT_NUMBER | LEGACY_ACCOUNT_SUMMARY_HEADER | BUSINESS_UNIT |
      | 25000185D             | LEGACY JONES                  | West London   |

  @LegacyData @JIRA-STORY:PO-706 @JIRA-EPIC:PO-704
  Scenario: Search for a individual defendant account from legacy data and validate the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I view the Individuals search form
    And I search using the following inputs:
      | account number | <LEGACY_INDIVIDUAL_ACCOUNT_NUMBER> |
    Then I see the Search results page
    And I see the Individuals search results:
      | Account            | <LEGACY_INDIVIDUAL_ACCOUNT_NUMBER>  |
      | Name               | <LEGACY_INDIVIDUAL_NAME>            |
      | Aliases            | <LEGACY_INDIVIDUAL_ALIASES>         |
      | Date of birth      | <LEGACY_INDIVIDUAL_DOB>             |
      | Address line 1     | <LEGACY_INDIVIDUAL_ADR_LINE_1>      |
      | Postcode           | <LEGACY_INDIVIDUAL_POSTCODE>        |
      | NI number          | <LEGACY_INDIVIDUAL_NI_NUMBER>       |
      | Parent or guardian | <LEGACY_INDIVIDUAL_PARENT_GUARDIAN> |
      | Balance            | <LEGACY_INDIVIDUAL_BALANCE>         |

    @R1BUatTechJCDE
    Examples:
      | LEGACY_INDIVIDUAL_ACCOUNT_NUMBER | LEGACY_INDIVIDUAL_NAME           | LEGACY_INDIVIDUAL_ALIASES | LEGACY_INDIVIDUAL_DOB | LEGACY_INDIVIDUAL_ADR_LINE_1 | LEGACY_INDIVIDUAL_POSTCODE | LEGACY_INDIVIDUAL_NI_NUMBER | LEGACY_INDIVIDUAL_PARENT_GUARDIAN | LEGACY_INDIVIDUAL_BALANCE |
      | 15000055L                        | EDTTEMPLATESTWENTYONE, TWENTYONE | Alias, Alice              | 01 Jan 1998           | 123 ASDF ASD                 | EN5 8QQ                    | NI 12 34 56 A               | TWENTYONE PARENTTWENTYONE         | -£200.00                  |
    @R1BUatTechPRE-PROD @skip
    Examples:
      | LEGACY_INDIVIDUAL_ACCOUNT_NUMBER | LEGACY_INDIVIDUAL_NAME | LEGACY_INDIVIDUAL_ALIASES | LEGACY_INDIVIDUAL_DOB | LEGACY_INDIVIDUAL_ADR_LINE_1 | LEGACY_INDIVIDUAL_POSTCODE | LEGACY_INDIVIDUAL_NI_NUMBER | LEGACY_INDIVIDUAL_PARENT_GUARDIAN | LEGACY_INDIVIDUAL_BALANCE |
      | placeholder                      | placeholder            | placeholder               | placeholder           | placeholder                  | placeholder                | placeholder                 | placeholder                       | placeholder               |
