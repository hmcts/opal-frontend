@JIRA-LABEL:account-enquiry
Feature: Defendant - Company search and matches journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and viewing matching records,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-712 @JIRA-STORY:PO-706 @JIRA-STORY:PO-707 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5291
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

