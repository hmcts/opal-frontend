@JIRA-LABEL:manual-cash-input @JIRA-LABEL:accessibility @JIRA-EPIC:PO-2439 @JIRA-STORY:PO-3532 @R1CFinancialMovements
Feature: Manual Cash Input - Payment Details Accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till for account confirmation
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "criminal"

  @AC11
  Scenario: AC11 - Payment Details screen accessibility
    When I select a Manual Cash Input account that is "eligible"
    Then I see Manual Cash Input account "12345678" on "Confirm account"
    When I confirm Manual Cash Input account ID "1"
    Then I check the page for accessibility
