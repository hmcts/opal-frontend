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

  @JIRA-STORY:PO-3486 @JIRA-STORY:PO-3489 @AC1
  Scenario: AC4, AC1, AC1a, AC1b, AC1c - Criminal continues to Search for an Account
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "criminal"
    Then I see Search for an Account
    And the selected business unit is displayed on Search for an Account
    And the Search for an Account screen displays the quick and advanced search fields

  # Update this test to assert the completed screen when PO-3669 is in QA.
  @JIRA-STORY:PO-3486
  @JIRA-STORY:PO-3679
  Scenario: AC1, AC4a - Court Fee continues to Court Fee Details
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "courtFee"
    Then I see Court Fee Details

  # Update this test to assert the completed screen when PO-3673 is in QA.
  @JIRA-STORY:PO-3486
  @JIRA-STORY:PO-3679
  Scenario: AC2, AC4b - Suspense continues to Suspense Details
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I add a payment to the till
    And I continue with payment category "suspense"
    Then I see Suspense Details

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
