@JIRA-LABEL:account-enquiry
Feature: Defendant Shared Search And Matches Journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and viewing matching records,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1BDrop1UatTechJCDE @JIRA-STORY:PO-709 @JIRA-STORY:PO-706 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5294
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

  @LegacyData @JIRA-STORY:PO-709 @JIRA-STORY:PO-706 @JIRA-EPIC:PO-704 @JIRA-DEFECT:PO-10245
  # Minimum data set required: one individual defendant account result and one company defendant account result returned for the same searchable account number, so both results tabs can be validated.
  Scenario Outline: Search by account number in legacy data and validate results across defendant tabs
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | account number | <LEGACY_SHARED_ACCOUNT_NUMBER> |
    Then I see the Individuals search results:
      | Account            | <LEGACY_SHARED_ACCOUNT_NUMBER>             |
      | Name               | <LEGACY_SHARED_INDIVIDUAL_NAME>            |
      | Aliases            | <LEGACY_SHARED_INDIVIDUAL_ALIASES>         |
      | Date of birth      | <LEGACY_SHARED_INDIVIDUAL_DOB>             |
      | Address line 1     | <LEGACY_SHARED_INDIVIDUAL_ADR_LINE_1>      |
      | Postcode           | <LEGACY_SHARED_INDIVIDUAL_POSTCODE>        |
      | NI number          | <LEGACY_SHARED_INDIVIDUAL_NI_NUMBER>       |
      | Parent or guardian | <LEGACY_SHARED_INDIVIDUAL_PARENT_GUARDIAN> |
      | Business unit      | <LEGACY_SHARED_INDIVIDUAL_BUSINESS_UNIT>   |
      | Ref                | <LEGACY_SHARED_INDIVIDUAL_REF>             |
      | ENF                | <LEGACY_SHARED_INDIVIDUAL_ENF>             |
      | Balance            | <LEGACY_SHARED_INDIVIDUAL_BALANCE>         |
    And I see the Companies search results by tab switch:
      | Account        | <LEGACY_SHARED_COMPANY_ACCOUNT_NUMBER> |
      | Company        | <LEGACY_SHARED_COMPANY_NAME>           |
      | Aliases        | <LEGACY_SHARED_COMPANY_ALIASES>        |
      | Address line 1 | <LEGACY_SHARED_COMPANY_ADR_LINE_1>     |
      | Postcode       | <LEGACY_SHARED_COMPANY_POSTCODE>       |
      | Business unit  | <LEGACY_SHARED_COMPANY_BUSINESS_UNIT>  |
      | Ref            | <LEGACY_SHARED_COMPANY_REF>            |
      | ENF            | <LEGACY_SHARED_COMPANY_ENF>            |
      | Balance        | <LEGACY_SHARED_COMPANY_BALANCE>        |
    @R1BDrop1UatTechJCDE @JIRA-TEST-KEY:PO-10334
    Examples:
      | LEGACY_SHARED_ACCOUNT_NUMBER | LEGACY_SHARED_INDIVIDUAL_NAME | LEGACY_SHARED_INDIVIDUAL_ALIASES | LEGACY_SHARED_INDIVIDUAL_DOB | LEGACY_SHARED_INDIVIDUAL_ADR_LINE_1 | LEGACY_SHARED_INDIVIDUAL_POSTCODE | LEGACY_SHARED_INDIVIDUAL_NI_NUMBER | LEGACY_SHARED_INDIVIDUAL_PARENT_GUARDIAN | LEGACY_SHARED_INDIVIDUAL_BUSINESS_UNIT | LEGACY_SHARED_INDIVIDUAL_REF | LEGACY_SHARED_INDIVIDUAL_ENF | LEGACY_SHARED_INDIVIDUAL_BALANCE | LEGACY_SHARED_COMPANY_ACCOUNT_NUMBER | LEGACY_SHARED_COMPANY_NAME | LEGACY_SHARED_COMPANY_ALIASES | LEGACY_SHARED_COMPANY_ADR_LINE_1 | LEGACY_SHARED_COMPANY_POSTCODE | LEGACY_SHARED_COMPANY_BUSINESS_UNIT | LEGACY_SHARED_COMPANY_REF | LEGACY_SHARED_COMPANY_ENF | LEGACY_SHARED_COMPANY_BALANCE |
      | 26000471W                    | EnfPgAccessyeyjkqsje, Alex    | LNAME, fname                     | 10 Nov 2010                  | 1 Address Street                    | RG12 8EU                          | AB 12 23 98 B                      | FNAME LNAME                              | Libra National Computer System         | PCR-AUTO-025                 | PRIS                         | -£200.00                         | 26000471W                            | OPALTEST                   | —                             | Company addline1                 | EN51 1RL                       | West London                         | —                         | —                         | -£120.99                      |
    @R1BDrop1UatTechPreprod @skip
    Examples:
      | LEGACY_SHARED_ACCOUNT_NUMBER | LEGACY_SHARED_INDIVIDUAL_NAME | LEGACY_SHARED_INDIVIDUAL_ALIASES | LEGACY_SHARED_INDIVIDUAL_DOB | LEGACY_SHARED_INDIVIDUAL_ADR_LINE_1 | LEGACY_SHARED_INDIVIDUAL_POSTCODE | LEGACY_SHARED_INDIVIDUAL_NI_NUMBER | LEGACY_SHARED_INDIVIDUAL_PARENT_GUARDIAN | LEGACY_SHARED_INDIVIDUAL_BUSINESS_UNIT | LEGACY_SHARED_INDIVIDUAL_REF | LEGACY_SHARED_INDIVIDUAL_ENF | LEGACY_SHARED_INDIVIDUAL_BALANCE | LEGACY_SHARED_COMPANY_ACCOUNT_NUMBER | LEGACY_SHARED_COMPANY_NAME | LEGACY_SHARED_COMPANY_ALIASES | LEGACY_SHARED_COMPANY_ADR_LINE_1 | LEGACY_SHARED_COMPANY_POSTCODE | LEGACY_SHARED_COMPANY_BUSINESS_UNIT | LEGACY_SHARED_COMPANY_REF | LEGACY_SHARED_COMPANY_ENF | LEGACY_SHARED_COMPANY_BALANCE |
      | TEMPLATE_ACCOUNT             | TEMPLATE_INDIVIDUAL_NAME      | TEMPLATE_INDIVIDUAL_ALIASES      | TEMPLATE_INDIVIDUAL_DOB      | TEMPLATE_INDIVIDUAL_ADR_LINE_1      | TEMPLATE_INDIVIDUAL_POSTCODE      | TEMPLATE_INDIVIDUAL_NI_NUMBER      | TEMPLATE_INDIVIDUAL_PARENT_GUARDIAN      | TEMPLATE_INDIVIDUAL_BUSINESS_UNIT      | TEMPLATE_INDIVIDUAL_REF      | TEMPLATE_INDIVIDUAL_ENF      | TEMPLATE_INDIVIDUAL_BALANCE      | TEMPLATE_COMPANY_ACCOUNT_NUMBER      | TEMPLATE_COMPANY_NAME      | TEMPLATE_COMPANY_ALIASES      | TEMPLATE_COMPANY_ADR_LINE_1      | TEMPLATE_COMPANY_POSTCODE      | TEMPLATE_COMPANY_BUSINESS_UNIT      | TEMPLATE_COMPANY_REF      | TEMPLATE_COMPANY_ENF      | TEMPLATE_COMPANY_BALANCE      |
