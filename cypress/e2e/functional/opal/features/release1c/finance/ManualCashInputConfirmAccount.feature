@JIRA-LABEL:manual-cash-input @JIRA-EPIC:PO-2439 @JIRA-STORY:PO-3530 @R1CFinancialMovements
Feature: Manual Cash Input - Confirm account and payment restrictions

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

  @AC1 @AC3
  Scenario: Confirm an eligible account for a criminal payment
    When I select a Manual Cash Input account that is "eligible"
    Then I see Manual Cash Input account "12345678" on "Confirm account"
    When I confirm Manual Cash Input account ID "1"

  @AC4 @AC5b @AC10
  Scenario: A restricted account explains the reason and allows suspense
    When I select a Manual Cash Input account that is "written off"
    Then I see Manual Cash Input account "12345678" on "You cannot pay into this account"
    And the Manual Cash Input restriction is "Account has been written off in full"
    When I pay the restricted Manual Cash Input account into suspense

  @AC3 @AC5a @AC7 @AC8a
  Scenario: A consolidated child requires a choice before confirming the eligible master
    When I select a consolidated Manual Cash Input account whose master is "eligible"
    Then the Manual Cash Input restriction is "Account has been consolidated."
    When I continue with Manual Cash Input next step "none"
    Then I see the Manual Cash Input next step validation and focus
    When I continue with Manual Cash Input next step "master"
    Then I see Manual Cash Input account "87654321" on "Confirm account"
    When I confirm Manual Cash Input account ID "2"

  @AC8b @AC10
  Scenario: A restricted master is checked before payment
    When I select a consolidated Manual Cash Input account whose master is "written off"
    And I continue with Manual Cash Input next step "master"
    Then I see Manual Cash Input account "87654321" on "You cannot pay into this account"
    And the Manual Cash Input restriction is "Account has been written off in full"
    When I pay the restricted Manual Cash Input account into suspense

  @AC9
  Scenario: A consolidated child can pay into suspense
    When I select a Manual Cash Input account that is "consolidated"
    And I pay the consolidated Manual Cash Input account into suspense

  @AC11
  Scenario: Back retains the original search results
    When I select a Manual Cash Input account that is "eligible"
    And I return from Manual Cash Input account details to the retained results

  @AC11
  Scenario: Browser Back from the master returns directly to the original results
    When I select a consolidated Manual Cash Input account whose master is "eligible"
    And I continue with Manual Cash Input next step "master"
    Then I see Manual Cash Input account "87654321" on "Confirm account"
    When I use browser Back from the Manual Cash Input master to the retained results

  @AC12
  Scenario: The master links to its own Account Enquiry
    When I select a consolidated Manual Cash Input account whose master is "eligible"
    And I continue with Manual Cash Input next step "master"
    Then I see Manual Cash Input account "87654321" on "Confirm account"
    When I open Manual Cash Input account ID "2" in Account Enquiry

  # Immediate memory clearing is asserted in component tests; re-entry also resets search.
  @AC13
  Scenario: Cancelling a consolidated payment returns to the till and permits a new payment
    When I select a Manual Cash Input account that is "consolidated"
    And I cancel Manual Cash Input account confirmation and start a new payment
