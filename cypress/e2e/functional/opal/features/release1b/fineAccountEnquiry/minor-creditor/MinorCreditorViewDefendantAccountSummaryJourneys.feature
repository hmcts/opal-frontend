@JIRA-LABEL:account-enquiry
Feature: Minor Creditor View Defendant Account Summary Journeys
  High-value end-to-end journeys for View Defendant Account Summary.
  These scenarios cover the core business flows for opening a minor creditor account
  from search results and verifying the default account summary content, including
  the account-number search path.

  Background:
    Given I clear all approved accounts

  @R1BUatTechJCDE @JIRA-STORY:PO-1917 @JIRA-STORY:PO-6361 @JIRA-EPIC:PO-2234 @JIRA-TEST-KEY:PO-5570
  Scenario: Search for a minor creditor account and view the default account summary
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRMINSUM{uniqUpper} |
      | title                     | Mrs                  |
      | first name                | Mina                 |
      | last name                 | SummaryMinor{uniq}   |
      | address line 1            | 1 High Street        |
      | postcode                  | MC1 1AA              |
    And the minor creditor header summary API returns awarded value "-200"
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual         |
      | individual last name | SummaryMinor{uniq} |
      | first names          | Mina               |
      | address line 1       | 1 High Street      |
      | postcode             | MC1 1AA            |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | SummaryMinor{uniq}, Mina |
      | Address line 1 | 1 High Street            |
    When I open the latest matching result from the search results
    Then I should see the account header contains "Mrs Mina SUMMARYMINOR{uniqUpper}"
    And the intercepted minor creditor header summary awarded value is "-200"
    And the At a glance tab should be selected by default
    And I should see the following minor creditor summary metric values:
      | Awarded | £200.00 |
    And I should see the following minor creditor values on the At a glance tab:
      | Name         | Mrs Mina SUMMARYMINOR{uniqUpper} |
      | Address      | 1 High Street                    |
      | BACS details | Provided                         |

  @R1BUatTechJCDE @JIRA-STORY:PO-8927 @JIRA-EPIC:PO-812
  Scenario: Search for a minor creditor account by account number and view the default account summary
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRMINACC{uniqUpper} |
      | title                     | Mrs                  |
      | first name                | Mina                 |
      | last name                 | AccountSearch{uniq}  |
      | address line 1            | 1 High Street        |
      | postcode                  | MC1 1AA              |
    And I am on the Account Search page - Individuals form displayed by default
    When I search for the last created account by account number
    Then I see the Search results page
    When I open the latest matching result from the search results
    Then I should see the account header contains "Minor Creditor Seed AccountSearch{uniqUpper}"
