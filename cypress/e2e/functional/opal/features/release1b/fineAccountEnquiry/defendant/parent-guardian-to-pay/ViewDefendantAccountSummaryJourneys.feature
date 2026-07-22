@JIRA-LABEL:account-enquiry
Feature: Defendant - Parent or guardian to pay - View Defendant Account Summary - End-to-end journeys
  High-value end-to-end journeys for View Defendant Account Summary.
  These scenarios cover the core business flows for landing on the account details screen,
  viewing the default At a glance summary, and confirming Welsh language preferences where applicable,
  while reusing existing journey coverage for comments and account activity notes.
  Note: This Epic is still in development

  Background:
    Given I clear all approved accounts

  @skip @R1B @JIRA-STORY:PO-779 @JIRA-STORY:PO-866 @JIRA-EPIC:PO-812
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
