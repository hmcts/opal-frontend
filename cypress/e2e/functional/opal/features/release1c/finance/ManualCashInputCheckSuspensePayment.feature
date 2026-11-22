@JIRA-LABEL:manual-cash-input @JIRA-EPIC:PO-2660 @R1CFinancialMovements
Feature: Manual Cash Input - Check Suspense Payment

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "suspense"
    And I submit an unidentified credit transfer suspense payment

  # AC1: a completed Suspense Details journey opens Check Suspense Payment.
  # AC1a: the screen exposes its heading, summary card, note field and actions.
  # AC2/AC2b: an unidentified amount shows the mapped credit-transfer data and Relevant details, not payer details.
  @JIRA-STORY:PO-3675 @AC1 @AC1a @AC2 @AC2b
  Scenario: AC1, AC1a, AC2, AC2b - an unidentified credit-transfer payment is checked with relevant details
    Then I see Check Suspense Payment

  # AC3/AC3a: each displayed payment-detail Change link opens Suspense Details.
  @JIRA-STORY:PO-3675 @AC3 @AC3a
  Scenario Outline: AC3, AC3a - each payment-detail Change link opens Suspense Details
    When I follow the Change link for payment detail "<payment detail>"
    Then I see Suspense Details

    Examples:
      | payment detail        |
      | amount                |
      | payment received from |
      | method of payment     |
      | source                |
      | payment reference     |
      | suspense reason       |
      | relevant details      |

  # AC2 data mapping: every configured credit-transfer source is retained in the summary.
  @JIRA-STORY:PO-3675 @AC2
  Scenario Outline: AC2 - the selected credit-transfer source is shown in the payment summary
    When I change the credit-transfer source to "<source>"
    Then I see the following text on the page "<source>"

    Examples:
      | source          |
      | Barclaycard     |
      | British Telecom |
      | DWP/AEA         |
      | NatWest         |
      | Other           |

  # AC2 data mapping: each non-credit-transfer method shows its correct reference treatment and omits Source.
  @JIRA-STORY:PO-3675 @AC2
  Scenario Outline: AC2 - the selected payment method shows only its applicable summary fields
    When I change the payment method to "<method>" displayed as "<method label>" with reference "<reference>"
    Then I see the following text on the page "<method label>"

    Examples:
      | method      | method label    | reference |
      | notesCoins  | Notes and coins |           |
      | postalOrder | Postal order    | PO-123    |
      | cheque      | Cheque          | CH-123    |

  # AC4: neither save action can proceed without the mandatory suspense note.
  @JIRA-STORY:PO-3675 @AC4
  Scenario Outline: AC4 - a blank suspense note prevents either save action
    Then a suspense note is required before I can "<save action>"

    Examples:
      | save action                  |
      | save and review till         |
      | save and add another payment |

  # AC4 negative boundary: whitespace is not a valid note.
  @JIRA-STORY:PO-3675 @AC4
  Scenario: AC4 - a whitespace-only suspense note is rejected
    Then a whitespace-only suspense note is rejected

  # AC4 permitted boundary: exactly 1,000 characters can be saved.
  # AC5/AC5a: the saved payment is associated with the till and Till Details is shown.
  @JIRA-STORY:PO-3675 @AC4 @AC5 @AC5a
  Scenario: AC4, AC5, AC5a - the 1000-character note boundary saves to Till Details
    When I save a suspense payment with a 1000-character note
    Then I see the following text on the page "Till details"

  # AC5/AC5a: save and review persists the payment and permits a later amendment.
  @JIRA-STORY:PO-3675 @AC5 @AC5a
  Scenario: AC5, AC5a - save and review adds the payment to the till and supports updating it
    When I save the suspense payment and review the till
    And I change the saved suspense payment
    And I update the saved suspense payment
    Then I see the following text on the page "Till details"

  # AC2/AC2a: non-unidentified reasons show payer type, name and address instead of Relevant details.
  # AC3b: each payer Change link opens Payer Details.
  @JIRA-STORY:PO-3675 @AC2 @AC2a @AC3 @AC3b
  Scenario: AC2, AC2a, AC3, AC3b - an identified payer is summarised and can be amended
    When I amend the suspense payment with identified payer details
    When I change the suspense payer details
    Then I see the following text on the page "Payer details"

  # AC3/AC3b: each payer-detail Change link opens Payer Details.
  @JIRA-STORY:PO-3675 @AC3 @AC3b
  Scenario Outline: AC3, AC3b - each payer-detail Change link opens Payer Details
    When I amend the suspense payment with identified payer details
    And I follow the Change link for payer detail "<payer detail>"
    Then I see the following text on the page "Payer details"

    Examples:
      | payer detail  |
      | payer type    |
      | payer name    |
      | payer address |

  # AC2 data mapping: every identified suspense reason routes through payer details and is retained.
  @JIRA-STORY:PO-3675 @AC2 @AC2a
  Scenario Outline: AC2, AC2a - each identified suspense reason displays payer details
    When I amend the suspense payment with reason "<reason>" displayed as "<reason label>"
    Then I see the following text on the page "<reason label>"

    Examples:
      | reason        | reason label               |
      | overpayment   | Fines overpayment (OF)     |
      | advance       | Fine paid in advance (FA)  |
      | miscellaneous | Miscellaneous payment (MS) |

  # AC6/AC6a: save-and-add persists the payment, opens Payment Category and retains it on the till.
  @JIRA-STORY:PO-3675 @AC6 @AC6a
  Scenario: AC6, AC6a - save and add another payment opens Payment Category and retains the payment
    When I save the suspense payment and add another payment
    Then I see the following text on the page "Till details"

  # AC7/AC7a/AC7ai: accepting the route guard discards the draft and returns to Till Details.
  @JIRA-STORY:PO-3675 @AC7 @AC7a @AC7ai
  Scenario: AC7, AC7a, AC7ai - cancelling a draft and accepting the warning discards it
    When I cancel the suspense payment and "accept" the leave-page warning
    Then I see the following text on the page "There are no payments"

  # AC7/AC7a/AC7aii: declining the route guard stays on the page and retains entered data.
  @JIRA-STORY:PO-3675 @AC7 @AC7a @AC7aii
  Scenario: AC7, AC7a, AC7aii - declining the cancellation warning retains the draft
    When I cancel the suspense payment and "decline" the leave-page warning
    Then I see Check Suspense Payment
