@JIRA-LABEL:consolidation
@JIRA-STORY:PO-2322
Feature: Accessibility Tests for Fines Consolidation
  # This feature file ensures consolidation entry points meet accessibility standards using Axe-Core.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I should be on the dashboard

  @JIRA-STORY:PO-2413 @JIRA-STORY:PO-2415 @JIRA-STORY:PO-2417
  Scenario: Consolidate Accessibility for Individuals
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                          | Submitted                                  |
      | account.defendant.forenames             | Consolidation                              |
      | account.defendant.surname               | Accessibility{uniq}                        |
      | account.defendant.email_address_1       | consolidation.accessibility{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259314                                |
      | account.account_type                    | Fine                                       |
      | account.prosecutor_case_reference       | CONS-A11Y-IND-{uniq}                       |
      | account.collection_order_made           | false                                      |
      | account.collection_order_made_today     | false                                      |
      | account.payment_card_request            | false                                      |
      | account.defendant.dob                   | 2002-05-15                                 |
    When I open Consolidate accounts
    Then I check the page for accessibility
    And I continue to the consolidation account search as an "Individual" defendant selecting business unit "Camberwell Green"
    Then I am on the consolidation Search tab for Individuals
    And I check the page for accessibility
    And I enter the following consolidation search details:
      | account number | 12345678            |
      | last name      | Accessibility{uniq} |
    When I click Search on consolidation account search
    Then I see the consolidation search error page for "Individual"
    And I check the page for accessibility
    When I go back from the consolidation search error page
    Then I am on the consolidation Search tab for Individuals
    When I clear the consolidation search
    And I enter the following consolidation search details:
      | last name             | Nobody |
      | last name exact match | true   |
    When I click Search on consolidation account search
    Then I see the consolidation no matching results state
    Then I check the page for accessibility
    When I click Check your search on consolidation no matching results
    Then I am on the consolidation Search tab for Individuals
    And I enter the following consolidation search details:
      | last name             | Accessibility{uniq} |
      | last name exact match | true                |
    When I click Search on consolidation account search
    Then I am on the consolidation Results tab
    And I check the page for accessibility

  @JIRA-STORY:PO-2414 @JIRA-STORY:PO-2421 @JIRA-STORY:PO-2417
  Scenario: Consolidate Accessibility for Companies
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                                |
      | account.defendant.company_name      | Consolidation Access Comp {uniq}         |
      | account.defendant.email_address_1   | consolidation.access.comp{uniq}@test.com |
      | account.defendant.post_code         | AB23 4RN                                 |
      | account.account_type                | Fine                                     |
      | account.prosecutor_case_reference   | CONS-A11Y-COMP-{uniq}                    |
      | account.collection_order_made       | false                                    |
      | account.collection_order_made_today | false                                    |
      | account.payment_card_request        | false                                    |
    When I open Consolidate accounts
    Then I check the page for accessibility
    And I continue to the consolidation account search as an "Company" defendant selecting business unit "Camberwell Green"
    Then I am on the consolidation Search tab for Companies
    And I check the page for accessibility
    And I enter the following consolidation search details:
      | account number | 12345678                         |
      | company name   | Consolidation Access Comp {uniq} |
    When I click Search on consolidation account search
    Then I see the consolidation search error page for "Company"
    And I check the page for accessibility
    When I go back from the consolidation search error page
    Then I am on the consolidation Search tab for Companies
    When I clear the consolidation search
    And I enter the following consolidation search details:
      | company name       | Nobody |
      | Search exact match | true   |
    When I click Search on consolidation account search
    Then I see the consolidation no matching results state
    Then I check the page for accessibility
    When I click Check your search on consolidation no matching results
    Then I am on the consolidation Search tab for Companies
    When I clear the consolidation search
    And I enter the following consolidation search details:
      | company name       | Consolidation Access Comp {uniq} |
      | Search exact match | true                             |
    When I click Search on consolidation account search
    Then I am on the consolidation Results tab
    And I check the page for accessibility
