@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Minor Creditor View Defendant Account Summary Accessibility

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

  @R1B @JIRA-STORY:PO-2963 @JIRA-EPIC:PO-2630
  Scenario: AC6 - Repayment Minor Creditor header summary is accessible
    Given a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRMINREPA11Y{uniqUpper} |
      | title                     | Mrs                      |
      | first name                | Mina                     |
      | last name                 | RepaymentAlly{uniq}      |
      | address line 1            | 1 High Street            |
      | postcode                  | MC1 1AA                  |
    And the minor creditor header summary API returns a repayment with paid out value "50"
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual          |
      | individual last name | RepaymentAlly{uniq} |
      | first names          | Mina                |
      | address line 1       | 1 High Street       |
      | postcode             | MC1 1AA             |
    Then I see the Search results page
    When I open the latest matching result from the search results
    Then I should see only the repayment Paid out minor creditor summary metric value "£50.00"
    And I check the page for accessibility
