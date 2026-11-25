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

  @JIRA-STORY:PO-3669 @JIRA-STORY:PO-3671
  Scenario: AC5a, AC1, AC1bi - an exact court fee payment opens Payment Details for the selected business unit
    When I submit a CF001 court fee payment of "25.00" for "2" items
    Then I see Court Fee Payment Details
    And the Payment Details screen shows business unit "Camden and Islington"

  @JIRA-STORY:PO-3669 @JIRA-STORY:PO-3670
  Scenario Outline: AC5b, AC1 - an overpayment or underpayment opens confirmation
    When I submit a CF001 court fee payment of "<amount>" for "2" items
    Then I see Court Fee Overpayment/Underpayment Confirmation

    Examples:
      | amount |
      | 25.01  |
      | 24.99  |

  @JIRA-STORY:PO-3670
  Scenario: AC2 - the confirmation identifies an overpayment
    When I submit a CF001 court fee payment of "25.01" for "2" items
    Then the confirmation identifies the payment as an "overpayment"

  @JIRA-STORY:PO-3670
  Scenario: AC2 - the confirmation identifies an underpayment
    When I submit a CF001 court fee payment of "24.99" for "2" items
    Then the confirmation identifies the payment as an "underpayment"

  @JIRA-STORY:PO-3670
  Scenario: AC2a - the overpayment information banner shows the overpaid amount
    When I submit a CF001 court fee payment of "30.00" for "2" items
    Then the "information" confirmation banner shows a "5.00" overpayment

  @JIRA-STORY:PO-3670
  Scenario: AC2b - the underpayment warning banner shows the underpaid amount
    When I submit a CF001 court fee payment of "24.99" for "2" items
    Then the "warning" confirmation banner shows a "0.01" underpayment

  @JIRA-STORY:PO-3670
  Scenario Outline: AC2c - the confirmation displays the calculated difference
    When I submit a CF001 court fee payment of "<amount>" for "2" items
    Then the "<banner>" confirmation banner shows a "5.00" <type>

    Examples:
      | amount | banner      | type         |
      | 30.00  | information | overpayment  |
      | 20.00  | warning     | underpayment |

  @JIRA-STORY:PO-3670
  Scenario: AC3 - the confirmation displays the entered court fee details
    When I submit a CF001 court fee payment of "30.00" for "2" items
    Then the confirmation shows court fee "CF001 – Application (£12.50)", amount "£30.00", and "2" items

  @JIRA-STORY:PO-3670
  Scenario: AC4 - an overpayment displays Confirm and Cancel
    When I submit a CF001 court fee payment of "30.00" for "2" items
    Then the overpayment confirmation offers Confirm and Cancel

  @JIRA-STORY:PO-3670 @JIRA-STORY:PO-3671
  Scenario: AC4a, AC1a - confirming an overpayment opens Payment Details
    When I submit a CF001 court fee payment of "30.00" for "2" items
    And I confirm the overpayment
    Then I see Court Fee Payment Details

  @JIRA-STORY:PO-3670
  Scenario: AC4b - cancelling an overpayment returns to Court Fee Details
    When I submit a CF001 court fee payment of "30.00" for "2" items
    And I cancel the overpayment
    Then I see Court Fee Details

  @JIRA-STORY:PO-3670
  Scenario: AC5 - an underpayment cannot continue to Payment Details
    When I submit a CF001 court fee payment of "24.99" for "2" items
    Then the underpayment cannot continue to Payment Details
    And the underpayment confirmation offers Cancel and return to till and Go back

  @JIRA-STORY:PO-3670
  Scenario: AC5a, AC5ai - returning to the till discards the underpayment data
    When I submit a CF001 court fee payment of "24.99" for "2" items
    And I cancel the underpayment and return to the till
    Then I see empty Till Details for "Camden and Islington"
    When I add a payment to the till
    And I continue with payment category "courtFee"
    Then the Court Fee Details form is blank

  @JIRA-STORY:PO-3670
  Scenario Outline: AC6 - Back returns from either confirmation view to Court Fee Details
    When I submit a CF001 court fee payment of "<amount>" for "2" items
    And I go back from the Court Fee confirmation
    Then I see Court Fee Details

    Examples:
      | amount |
      | 30.00  |
      | 24.99  |
