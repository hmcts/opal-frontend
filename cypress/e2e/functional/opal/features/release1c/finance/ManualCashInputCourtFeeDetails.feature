@JIRA-LABEL:manual-cash-input @JIRA-EPIC:PO-2439 @R1CFinancialMovements
Feature: Manual Cash Input - Court Fee Details

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "courtFee"

  @JIRA-STORY:PO-3669
  Scenario: AC5a - an exact court fee payment opens Payment Details
    When I submit a CF001 court fee payment of "25.00" for "2" items
    Then I see Court Fee Payment Details

  @JIRA-STORY:PO-3669
  Scenario Outline: AC5b - an overpayment or underpayment opens confirmation
    When I submit a CF001 court fee payment of "<amount>" for "2" items
    Then I see Court Fee Overpayment/Underpayment Confirmation

    Examples:
      | amount |
      | 25.01  |
      | 24.99  |
