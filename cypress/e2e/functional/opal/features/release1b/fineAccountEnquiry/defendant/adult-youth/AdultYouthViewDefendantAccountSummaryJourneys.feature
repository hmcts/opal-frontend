@JIRA-LABEL:account-enquiry
Feature: Adult Youth View Defendant Account Summary Journeys
  High-value end-to-end journeys for View Defendant Account Summary.
  This scenario covers the core business flow for opening an adult or youth defendant account
  and verifying the default At a glance summary content.

  Background:
    Given I clear all approved accounts

  @R1BUatTechJCDE @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5569
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
