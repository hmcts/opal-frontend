@JIRA-LABEL:manual-cash-input @JIRA-LABEL:accessibility @JIRA-EPIC:PO-2439 @JIRA-STORY:PO-3530 @R1CFinancialMovements
Feature: Manual Cash Input - Confirm account accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till for account confirmation
    And I continue
    And I add a payment to the till
    And I continue with payment category "criminal"

  @AC15
  Scenario Outline: Eligible and ordinary restricted account accessibility
    When I select a Manual Cash Input account that is "<state>"
    Then I see Manual Cash Input account "12345678" on "<heading>"
    And I check the page for accessibility

    Examples:
      | state       | heading                              |
      | eligible    | Confirm account                      |
      | written off | You cannot pay into this account     |

  @AC7 @AC8 @AC15
  Scenario: Consolidated choices, validation and eligible master accessibility
    When I select a consolidated Manual Cash Input account whose master is "eligible"
    Then I check the page for accessibility
    When I continue with Manual Cash Input next step "none"
    Then I see the Manual Cash Input next step validation and focus
    And I check the page for accessibility
    When I continue with Manual Cash Input next step "master"
    Then I see Manual Cash Input account "87654321" on "Confirm account"
    And I check the page for accessibility

  @AC8 @AC15
  Scenario: Restricted master accessibility
    When I select a consolidated Manual Cash Input account whose master is "written off"
    And I continue with Manual Cash Input next step "master"
    Then I see Manual Cash Input account "87654321" on "You cannot pay into this account"
    And I check the page for accessibility

  @JIRA-STORY:PO-3682 @AC1
  Scenario: AC1 - Suspense Details accessibility after a consolidated child selects suspense
    When I select a Manual Cash Input account that is "consolidated"
    And I pay the consolidated Manual Cash Input account into suspense
    Then I see Suspense Details
    And I check the page for accessibility

  @JIRA-STORY:PO-3682 @AC2
  Scenario: AC2 - Suspense Details accessibility after a restricted account selects suspense
    When I select a Manual Cash Input account that is "written off"
    And I pay the restricted Manual Cash Input account into suspense
    Then I see Suspense Details
    And I check the page for accessibility
