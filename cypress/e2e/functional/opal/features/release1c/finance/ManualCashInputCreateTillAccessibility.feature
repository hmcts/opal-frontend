@JIRA-LABEL:manual-cash-input @JIRA-LABEL:accessibility @JIRA-EPIC:PO-2439 @R1CFinancialMovements
Feature: Manual Cash Input - Create Till Accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  # AC7: axe-core accessibility coverage for the Manual Cash Input screen.
  @JIRA-STORY:PO-3475
  Scenario: AC7 - Manual Cash Input create and allocate screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    Then I check the page for accessibility
  # AC7/EMAC1: axe-core accessibility coverage for Select a Business Unit (Manual Payments In).
  @JIRA-STORY:PO-3475 @JIRA-STORY:PO-3476
  Scenario: AC7 - Select Business Unit (Manual Payments In) screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    Then I check the page for accessibility

  # PO-3485 AC4: axe-core coverage for Till Details with an empty till.
  @JIRA-STORY:PO-3485
  Scenario: AC4 - Till Details screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    Then I check the page for accessibility

  # PO-3486 AC8: axe-core coverage for Payment Category.
  @JIRA-STORY:PO-3486
  Scenario: AC8 - Payment Category screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    Then I check the page for accessibility

  # PO-3490 AC9: axe-core accessibility coverage for Manual Cash Input Search Results.
  @JIRA-STORY:PO-3490
  Scenario: AC9 - Manual Cash Input Search Results screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "criminal"
    And I search for a matching defendant and open Manual Cash Input Search Results
    Then I check the page for accessibility

  # PO-3670 AC8: axe-core coverage for both confirmation states.
  @JIRA-STORY:PO-3670
  Scenario Outline: AC8 - Court Fee Overpayment/Underpayment Confirmation accessibility for <type>
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "courtFee"
    And I submit a CF001 court fee payment of "<amount>" for "2" items
    Then I see Court Fee Overpayment/Underpayment Confirmation
    And I check the page for accessibility

    Examples:
      | type          | amount |
      | overpayment   | 25.01  |
      | underpayment  | 24.99  |

  # PO-3671 AC9: axe-core coverage for Payment Details (Court Fee).
  @JIRA-STORY:PO-3671
  Scenario: AC9 - Court Fee Payment Details screen accessibility
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "courtFee"
    And I submit a CF001 court fee payment of "25.00" for "2" items
    Then I see Court Fee Payment Details
    And I check the page for accessibility
