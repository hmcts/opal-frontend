@JIRA-LABEL:account-enquiry
Feature: Major Creditor Search And Matches

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"

  @R1B @JIRA-STORY:PO-2350 @JIRA-EPIC:PO-1286
  Scenario: Search for the Central Fund account for Camberwell Green
    Given I am on the Account Search page - Individuals form displayed by default
    And I open the business unit filter from the search page
    And I clear all selected business units on the "Fines" tab
    And I clear all selected business units on the "Confiscation" tab
    When I select the following business units:
      | tab   | businessUnit     |
      | Fines | Camberwell Green |
    And I save the selected business units and the filter summary is "Camberwell Green"
    And I view the Major Creditors search form
    When I search for the major creditor "HM Courts & Tribunals Service"
    Then I should see the account header contains "HM Courts & Tribunals Service"
