@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Major creditor - Account Enquiries - View Account Details Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Major creditor account details accessibility

    @R1B @JIRA-STORY:PO-2128 @JIRA-EPIC:PO-1286
    Scenario: Check Account Details View Accessibility with Axe-Core for Major Creditor Account
      Given I am on the Account Search page - Individuals form displayed by default
      And I open the business unit filter from the search page
      And I clear all selected business units on the "Fines" tab
      And I clear all selected business units on the "Confiscation" tab
      When I select the following business units:
        | tab   | businessUnit |
        | Fines | West London  |
      And I save the selected business units and the filter summary is "West London"
      When I view the Major Creditors search form
      Then I check the page for accessibility
      When I search for the major creditor "Crown Prosecution Service (DPP)"
      Then I check the page for accessibility

