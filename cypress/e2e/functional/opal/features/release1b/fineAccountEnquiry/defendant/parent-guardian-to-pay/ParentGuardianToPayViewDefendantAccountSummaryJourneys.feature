@JIRA-LABEL:account-enquiry
Feature: Parent Guardian To Pay View Defendant Account Summary Journeys
  High-value end-to-end journeys for View Defendant Account Summary.
  This scenario covers the core business flow for opening a parent or guardian to pay account
  and verifying the default At a glance summary and Welsh language preference content.

  Background:
    Given I clear all approved accounts

  @R1BDrop1UatTechJCDE @JIRA-STORY:PO-779 @JIRA-STORY:PO-866 @JIRA-EPIC:PO-812
  Scenario: View a parent or guardian account summary with Welsh language preferences
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published Welsh-speaking parent or guardian account exists:
      | first name                | Megan                               |
      | last name                 | SummaryWelshPG{uniq}                |
      | prosecutor case reference | PCRR1BWPG{uniqUpper}                |
      | document language         | Welsh and English                   |
      | court hearing language    | Welsh and English                   |
      | publishing user           | opal-test-10@dev.platform.hmcts.net |
    When I search for the account by last name "SummaryWelshPG{uniq}" and open the latest result
    Then I should see the account summary header contains "MEGAN SUMMARYWELSHPG{uniqUpper}"
    And the At a glance tab should be selected by default
    And I should see the read only sections on the At a glance tab:
      | Parent or guardian |
      | Payment terms      |
      | Enforcement status |
      | Comment            |
    And I should see the following language preferences on the At a glance tab:
      | Document language      | Welsh and English |
      | Court hearing language | Welsh and English |
    When I view the Parent or guardian tab
    Then I should see the following language preferences on the Parent or guardian tab:
      | Document language      | Welsh and English |
      | Court hearing language | Welsh and English |
