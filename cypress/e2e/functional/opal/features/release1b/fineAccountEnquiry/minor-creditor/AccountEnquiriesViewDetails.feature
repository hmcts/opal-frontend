@JIRA-LABEL:account-enquiry
Feature: Minor creditor - Account Enquiries – View Account Details
  As a caseworker
  I want to view an account’s details
  So that I can confirm and, when needed, safely discard edits

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Minor creditor amend creditor details baseline
    Background:
      Given a published account exists with an individual minor creditor:
        | prosecutor case reference | PCRMINAMEND{uniqUpper} |
        | title                     | Mr                     |
        | first name                | John                   |
        | last name                 | AmendMinor{uniq}       |
        | address line 1            | 1 Test Street          |
        | postcode                  | AB1 2CD                |
      And I am on the Account Search page - Individuals form displayed by default
      When I view the Minor creditors search form
      And I search using the following inputs:
        | minor creditor type  | Individual       |
        | individual last name | AmendMinor{uniq} |
        | first names          | John             |
        | address line 1       | 1 Test Street    |
        | postcode             | AB1 2CD          |
      Then I see the Search results page
      When I open the latest matching result from the search results
      Then I should see the account header contains "Mr John AMENDMINOR{uniqUpper}"
      When I go to the Creditor tab

    @R1B @JIRA-STORY:PO-1984 @JIRA-EPIC:PO-1285 @JIRA-TEST-KEY:PO-7549
    Scenario: Discard amended minor creditor details, return to the Creditor tab without changing the creditor name
      # AC2a – Cancel with unsaved changes shows a warning and confirming discard returns to Creditor with no save
      When I amend the minor creditor first name to "Updated" and discard the changes
      Then I should return to the account details page Creditor tab
      And I should see the minor creditor name contains "Mr John AMENDMINOR{uniqUpper}"

    @R1B @JIRA-STORY:PO-1984 @JIRA-EPIC:PO-1285 @JIRA-TEST-KEY:PO-7550
    Scenario: Amend minor creditor's first name and save, return to the Creditor tab and see the updated name
      # AC2b – Save valid changes returns to Creditor and persists updates
      When I amend the minor creditor first name to "Updated" and save
      Then I should return to the account details page Creditor tab
      And I should see the minor creditor name contains "Mr Updated AMENDMINOR{uniqUpper}"
      And I verify minor creditor amendments via API for first name "Updated"

    @R1B @JIRA-STORY:PO-1984 @JIRA-EPIC:PO-1285 @JIRA-TEST-KEY:PO-7551
    Scenario: Saving invalid amend minor creditor details keeps me on the form and displays validation errors
      # AC2c – Save invalid changes remains on the same screen and shows relevant errors
      When I attempt to amend the minor creditor first name to "" and save
      Then I should remain on the amend minor creditor details page
      And I should see the minor creditor amend error summary contains "Enter minor creditor’s first name"

  Rule: Minor creditor History and notes tab
    Background:
      Given a published account exists with an individual minor creditor:
        | prosecutor case reference | PCRMINHIST{uniqUpper} |
        | title                     | Mr                    |
        | first name                | Harper                |
        | last name                 | HistMinor{uniq}       |
        | address line 1            | 1 Test Street         |
        | postcode                  | AB1 2CD               |
      And the History and notes API is stubbed with standard tab data
      And I am on the Account Search page - Individuals form displayed by default
      When I view the Minor creditors search form
      And I search using the following inputs:
        | minor creditor type  | Individual      |
        | individual last name | HistMinor{uniq} |
        | first names          | Harper          |
        | address line 1       | 1 Test Street   |
        | postcode             | AB1 2CD         |
      Then I see the Search results page
      When I open the latest matching result from the search results
      Then I should see the account header contains "Mr Harper HISTMINOR{uniqUpper}"

    @R1B @JIRA-STORY:PO-2640 @JIRA-EPIC:PO-2653
    Scenario: Minor creditor History and notes items load and can be filtered
      When I go to the History and notes tab
      Then I should see the History and notes items load
      When I filter the History and notes results to Notes
      Then I should only see Note items in History and notes

    @R1B @JIRA-STORY:PO-2640 @JIRA-EPIC:PO-2653
    Scenario: History and notes account links open the associated defendant record in a new tab
      When I go to the History and notes tab
      And I open the first History and notes account link in a new tab
