@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Minor creditor - Account Enquiries - View Account Details Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Minor creditor amend accessibility
    Background:
      Given a published account exists with an individual minor creditor:
        | prosecutor case reference | PCRMINA11Y{uniqUpper} |
        | title                     | Mr                    |
        | first name                | Access                |
        | last name                 | Minor{uniq}           |
        | address line 1            | 1 Test Street         |
        | postcode                  | AB1 2CD               |
      And I am on the Account Search page - Individuals form displayed by default
      When I view the Minor creditors search form
      And I search using the following inputs:
        | minor creditor type  | Individual    |
        | individual last name | Minor{uniq}   |
        | first names          | Access        |
        | address line 1       | 1 Test Street |
        | postcode             | AB1 2CD       |
      Then I see the Search results page
      When I open the latest matching result from the search results
      And I go to the Creditor tab

    @R1B @JIRA-STORY:PO-1984 @JIRA-EPIC:PO-1285 @JIRA-TEST-KEY:PO-7556
    Scenario: Amend minor creditor details form and validation summary states are accessible
      When I view the amend minor creditor details form
      # Check accessibility on the amend minor creditor form
      Then I check the page for accessibility
      # Check accessibility when the validation error summary is displayed
      When I attempt to save the amend minor creditor details with first name ""
      Then I should remain on the amend minor creditor details page
      And I should see the minor creditor amend error summary contains "Enter minor creditor’s first name"
      And I check the page for accessibility
