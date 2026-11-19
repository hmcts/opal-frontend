@JIRA-LABEL:manual-cash-input @JIRA-EPIC:PO-2439 @R1CFinancialMovements
Feature: Manual Cash Input - Search Results

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  # AC3c: the account number link opens the matching account in Account Enquiry.
  @JIRA-STORY:PO-3490
  Scenario: AC3c - Account number link opens Account Enquiry in a new tab
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "criminal"
    And I search for a matching defendant and open Manual Cash Input Search Results
    And I open the first Manual Cash Input account result in a new tab

  # PO-3529 AC3a: Go back returns to Search for an Account with submitted criteria retained.
  @JIRA-STORY:PO-3529
  Scenario: AC3a - Go back retains combined company search criteria
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "criminal"
    And I submit combined account number and company criteria in Manual Cash Input Search
    And I select Go back from the Invalid Search Combination screen
    Then I see Search for an account with the submitted company criteria retained
