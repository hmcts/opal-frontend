@JIRA-LABEL:account-enquiry
Feature: Major Creditor History and notes

  @R1B @JIRA-STORY:PO-2657 @JIRA-EPIC:PO-2655
  Scenario: AC1a. Transformation service - consumes raw Major Creditor history data from the API
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I am on the Account Search page - Individuals form displayed by default
    And I open the business unit filter from the search page
    And I clear all selected business units on the "Fines" tab
    And I clear all selected business units on the "Confiscation" tab
    When I select the following business units:
      | tab   | businessUnit |
      | Fines | West London  |
    And I save the selected business units and the filter summary is "West London"
    And I view the Major Creditors search form
    And I search for the major creditor "Crown Prosecution Service (DPP)"
    And I open the Major Creditor History and notes tab
    Then I should see the Major Creditor History and notes tab
