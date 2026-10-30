@JIRA-LABEL:manual-cash-input @JIRA-EPIC:PO-2439 @R1CFinancialMovements
Feature: Manual Cash Input - Payment Category

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  # AC1: Add payment from Till Details opens Payment Category.
  @JIRA-STORY:PO-3486
  Scenario: AC1 - a user opens Payment Category from Till Details
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    Then I see the following text on the page "Payment category"

  @JIRA-STORY:PO-3486
  Scenario: AC4 - Criminal continues to Search for an Account
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "criminal"
    Then I see Search for an Account

  # Current AC4a behaviour: Continue leaves the user here.
  # Update this expectation when PO-3669 and PO-3679 deliver the Court Fee journey.
  @JIRA-STORY:PO-3486
  Scenario: AC4a - Court Fee Continue leaves the user on Payment Category
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "courtFee"
    Then I remain on Payment Category

  # Current AC4b behaviour: Continue leaves the user here.
  # Update this expectation when PO-3673 and PO-3679 deliver the Suspense journey.
  @JIRA-STORY:PO-3486
  Scenario: AC4b - Suspense Continue leaves the user on Payment Category
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "suspense"
    Then I remain on Payment Category

  @JIRA-STORY:PO-3486
  Scenario: AC5, EMAC1, EMAC1a - missing category shows a summary and focuses the field from its error link
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    When I continue without selecting a payment category
    Then the payment category validation summary and field error are displayed

  @JIRA-STORY:PO-3486
  Scenario: AC6 - Cancel returns to Till Details without adding a payment
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    When I cancel Payment Category
    Then I see empty Till Details for "Camden and Islington"
