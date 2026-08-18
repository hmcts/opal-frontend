@JIRA-LABEL:account-enquiry
Feature: Defendant Shared Search And Matches Journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and viewing matching records,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1BUatTechJCDE @JIRA-STORY:PO-709 @JIRA-STORY:PO-706 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5294
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

  # Legacy-data scenarios are scaffolds.
  # Replace the LEGACY_* placeholders with real seeded data values before executing them.

  @skip @LegacyData @R1BUatTechJCDE @JIRA-STORY:PO-709 @JIRA-STORY:PO-706 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account and one company defendant account sharing prosecutor case reference LEGACY_SHARED_REFERENCE, with the company account header text LEGACY_SHARED_REFERENCE_COMPANY_HEADER.
  Scenario Outline: Search by prosecutor case reference in legacy data and review results across defendant tabs
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | account number | <LEGACY_SHARED_ACCOUNT_NUMBER> |
    Then I see the Search results page
    And I see the Individuals search results:
      | Account | <LEGACY_SHARED_ACCOUNT_NUMBER>  |
      | Name    | <LEGACY_SHARED_INDIVIDUAL_NAME> |
    And I see the Companies search results by tab switch:
      | Account | <LEGACY_SHARED_ACCOUNT_NUMBER> |
      | Company | <LEGACY_SHARED_COMPANY_NAME>   |
    When I open the latest matching result from the Companies search results
    Then I should see the account header contains "<LEGACY_SHARED_COMPANY_NAME>"
    @JCDE
    Examples:
      | LEGACY_SHARED_ACCOUNT_NUMBER | LEGACY_SHARED_COMPANY_NAME | LEGACY_SHARED_INDIVIDUAL_NAME |
      | 26000471W                    | OPALTEST                   | EnfPgAccessyeyjkqsje, Alex    |
    @PRE-PROD @skip
    Examples:
      | LEGACY_SHARED_ACCOUNT_NUMBER | LEGACY_SHARED_COMPANY_NAME | LEGACY_SHARED_INDIVIDUAL_NAME |
      | 26000471W                    | —                          | EnfPgAccessyeyjkqsje, Alex    |
