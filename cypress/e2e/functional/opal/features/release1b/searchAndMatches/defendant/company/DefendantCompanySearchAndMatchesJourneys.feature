@JIRA-LABEL:account-enquiry
Feature: Defendant Company Search And Matches Journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and opening
  company defendant matching records, including the legacy-data scaffold path,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1BUatTechJCDE @JIRA-STORY:PO-712 @JIRA-STORY:PO-706 @JIRA-STORY:PO-707 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5291
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

  # Legacy-data scenarios are scaffolds.
  # Replace the LEGACY_* placeholders with real seeded data values before executing them.

  @LegacyData @JIRA-STORY:PO-712 @JIRA-STORY:PO-706 @JIRA-STORY:PO-707 @JIRA-EPIC:PO-704
  # Minimum data set required: one company defendant account with company name LEGACY_COMPANY_NAME, prosecutor case reference LEGACY_COMPANY_REFERENCE, and account header text LEGACY_COMPANY_HEADER.
  Scenario: Search for a company defendant account from legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I view the Companies search form
    And I search using the following inputs:
      | company name | <LEGACY_COMPANY_NAME> |
    Then I see the Search results page
    And I see the Companies search results:
      | Account | <LEGACY_COMPANY_ACCOUNT_NUMBER> |
    When I open the latest matching result from the search results
    Then I should see the account header contains "<LEGACY_COMPANY_NAME>"
    @R1BUatTechJCDE @JIRA-TEST-KEY:PO-10325
    Examples:
      | LEGACY_COMPANY_NAME | LEGACY_COMPANY_ACCOUNT_NUMBER |
      | OPALTEST            | 26000471W                     |
    @R1BUatTechPreprod @skip
    Examples:
      | LEGACY_COMPANY_NAME | LEGACY_COMPANY_REFERENCE |
      | Journey Co          | PCRJRNYCO1234            |

  @LegacyData @JIRA-STORY:PO-712 @JIRA-STORY:PO-706 @JIRA-STORY:PO-707 @JIRA-EPIC:PO-704 @JIRA-DEFECT:PO-10245
  Scenario: Search for a company defendant account from legacy data and validate the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I view the Companies search form
    And I search using the following inputs:
      | account number | <LEGACY_COMPANY_ACCOUNT_NUMBER> |
    Then I see the Search results page
    And I see the Companies search results:
      | Account        | <LEGACY_COMPANY_ACCOUNT_NUMBER> |
      | Company        | <LEGACY_COMPANY_NAME>           |
      | Address line 1 | <LEGACY_COMPANY_ADR_LINE_1>     |
      | Postcode       | <LEGACY_COMPANY_POSTCODE>       |
      | Business unit  | <BUSINESS_UNIT>                 |
      | Ref            | <LEGACY_COMPANY_REF>            |
      | Enf            | <LEGACY_COMPANY_ENF>            |
      | Balance        | <LEGACY_COMPANY_BALANCE>        |
    When I open the latest matching result from the search results
    Then I should see the account header contains "<LEGACY_COMPANY_NAME>"
    @R1BUatTechJCDE @JIRA-TEST-KEY:PO-10326
    Examples:
      | LEGACY_COMPANY_ACCOUNT_NUMBER | LEGACY_COMPANY_NAME         | LEGACY_COMPANY_ALIASES                                                                              | LEGACY_COMPANY_ADR_LINE_1 | LEGACY_COMPANY_POSTCODE | BUSINESS_UNIT | LEGACY_COMPANY_REF    | LEGACY_COMPANY_ENF | LEGACY_COMPANY_BALANCE |
      | 24000050E                     | Company A Chocolate Limited | The Alias Company A The Alias Company B The Alias Company C The Alias Company D The Alias Company E | Company address line 001  | EN51 1RL                | West London   | CA-Company-Master1-1A | NOENF              | -£600.01               |
    @R1BUatTechPreprod @skip
    Examples:
      | LEGACY_COMPANY_ACCOUNT_NUMBER | LEGACY_COMPANY_NAME | LEGACY_COMPANY_ALIASES | LEGACY_COMPANY_ADR_LINE_1 | LEGACY_COMPANY_POSTCODE | BUSINESS_UNIT | LEGACY_COMPANY_REF | LEGACY_COMPANY_ENF | LEGACY_COMPANY_BALANCE |
      | placeholder                   | placeholder         | placeholder            | placeholder               | placeholder             | placeholder   | placeholder        | placeholder        | placeholder            |
