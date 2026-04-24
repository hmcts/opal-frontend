@JIRA-LABEL:account-enquiry
Feature: View Defendant Account Summary - End-to-end journeys
  High-value end-to-end journeys for View Defendant Account Summary.
  These scenarios cover the core business flows for landing on the account details screen,
  viewing the default At a glance summary, and confirming Welsh language preferences where applicable,
  while reusing existing journey coverage for comments and account activity notes.
  Note: This Epic is still in development

  Background:
    Given I clear all approved accounts

  @R1B @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-KEY:POT-5107
  Scenario: Search for an adult or youth defendant account and view the default account summary
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Jordan               |
      | last name                 | SummaryAdult{uniq}   |
      | prosecutor case reference | PCRR1BSUM{uniqUpper} |
      | date of birth             | 2001-05-15           |
    When I search for the account by last name "SummaryAdult{uniq}" and open the latest result
    Then I should see the account summary header contains "JORDAN SUMMARYADULT{uniqUpper}"
    And the At a glance tab should be selected by default
    And I should see the read only sections on the At a glance tab:
      | Defendant          |
      | Payment terms      |
      | Enforcement status |
      | Comment            |
    And I should see the account header summary values:
      | Account type | Fine                 |
      | Case number  | PCRR1BSUM{uniqUpper} |


  @skip @R1B @JIRA-STORY:PO-779 @JIRA-STORY:PO-866
  Scenario: View a parent or guardian account summary with Welsh language preferences
    Given I am logged in with email "opal-test-6@dev.platform.hmcts.net"
    And a published Welsh-speaking parent or guardian account exists:
      | first name                | Megan                              |
      | last name                 | SummaryWelshPG{uniq}               |
      | prosecutor case reference | PCRR1BWPG{uniqUpper}               |
      | publishing user           | opal-test-8@dev.platform.hmcts.net |
    When I search for the account by last name "SummaryWelshPG{uniq}" and open the latest result
    Then I should see the account summary header contains "MEGAN SUMMARYWELSHPG{uniqUpper}"
    And the At a glance tab should be selected by default
    And I should see the read only sections on the At a glance tab:
      | Parent or guardian   |
      | Language preferences |
      | Payment terms        |
      | Enforcement status   |
      | Comment              |
    And I should see the following language preferences on the At a glance tab:
      | Document language      | Welsh and English |
      | Court hearing language | Welsh and English |

  @R1B @only
  Scenario: Search for a minor creditor account and view the default account summary
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRMINSUM{uniqUpper} |
      | title                     | Mrs                  |
      | first name                | Mina                 |
      | last name                 | SummaryMinor{uniq}   |
      | address line 1            | 1 High Street        |
      | postcode                  | MC1 1AA              |
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
    And the At a glance tab should be selected by default
    And I should see the following minor creditor values on the At a glance tab:
      | Name         | Mrs Mina SUMMARYMINOR{uniqUpper} |
      | Address      | 1 High Street                    |
      | BACS details | Provided                         |
