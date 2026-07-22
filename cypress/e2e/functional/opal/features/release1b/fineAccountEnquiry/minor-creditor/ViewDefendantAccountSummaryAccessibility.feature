@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Minor creditor - View Defendant Account Summary - Add Comments Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-1917 @JIRA-STORY:PO-6361 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5574
  Scenario: Check View Minor Creditor Account Summary Accessibility with Axe-Core
    Given a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRMINA11Y{uniqUpper} |
      | title                     | Mrs                   |
      | first name                | Mina                  |
      | last name                 | AllyMinor{uniq}       |
      | address line 1            | 1 High Street         |
      | postcode                  | MC1 1AA               |
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual      |
      | individual last name | AllyMinor{uniq} |
      | first names          | Mina            |
      | address line 1       | 1 High Street   |
      | postcode             | MC1 1AA         |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | AllyMinor{uniq}, Mina |
      | Address line 1 | 1 High Street         |
    When I open the latest matching result from the search results
    Then I should see the account header contains "Mrs Mina ALLYMINOR{uniqUpper}"
    And the At a glance tab should be selected by default
    And I check the page for accessibility
    When I go to the Creditor tab
    Then I check the page for accessibility
