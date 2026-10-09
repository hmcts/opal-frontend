@JIRA-LABEL:account-enquiry
Feature: Amend defendant payment terms from a minor creditor account
  As an Opal user
  I want to change payment terms for a defendant with an outstanding balance
  So that I can manage payment after searching for their minor creditor

  @R1BDrop2 @JIRA-DEFECT:PO-9151 @JIRA-EPIC:PO-2234
  Scenario: An outstanding negative balance allows payment terms amendments via the minor creditor account
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
    And a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRMINPAY{uniqUpper} |
      | title                     | Mrs                 |
      | first name                | Mina                |
      | last name                 | PaymentMinor{uniq}  |
      | address line 1            | 1 Test Street       |
      | postcode                  | AB1 2CD             |
    And I stub the defendant header summary payment terms account balance to -100
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual         |
      | individual last name | PaymentMinor{uniq} |
      | first names          | Mina               |
      | address line 1       | 1 Test Street      |
      | postcode             | AB1 2CD            |
    Then I see the Search results page
    When I open the latest matching result from the search results
    Then I should see the account header contains "Mrs Mina PAYMENTMINOR{uniqUpper}"
    When I open the defendant linked from the minor creditor account
    And I go to the Payment terms section
    And the amend payment terms form is displayed
    Then I should be on the Payment terms amend screen
    When I cancel payment terms amendments
    Then I should return to the Payment terms tab
