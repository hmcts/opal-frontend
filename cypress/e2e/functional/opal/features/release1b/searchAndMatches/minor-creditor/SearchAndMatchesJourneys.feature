@JIRA-LABEL:account-enquiry
Feature: Minor creditor search and matches journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and viewing matching records,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5292
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


  @R1B @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5293
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

