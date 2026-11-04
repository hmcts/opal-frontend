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

  @JIRA-STORY:PO-3669 @JIRA-EPIC:PO-2660
  Scenario: AC6 - Cancel on a blank Court Fee Details form returns to Till Details
    When I cancel blank Court Fee Details
    Then I see empty Till Details for "Camden and Islington"

  @JIRA-STORY:PO-3669 @JIRA-EPIC:PO-2660
  Scenario: AC6a - declining Cancel retains the amount and accepting it discards the payment
    When I enter a court fee amount and decline Cancel
    And I accept Cancel on Court Fee Details
    Then I see empty Till Details for "Camden and Islington"
    When I add a payment to the till
    And I continue with payment category "courtFee"
    Then the Court Fee Details form is blank

  @JIRA-STORY:PO-3669 @JIRA-EPIC:PO-2660
  Scenario: AC7 EMAC1 - required fields show an error summary with links to the fields
    When I continue without Court Fee Details
    Then the Court Fee Details validation summary and field errors are displayed
