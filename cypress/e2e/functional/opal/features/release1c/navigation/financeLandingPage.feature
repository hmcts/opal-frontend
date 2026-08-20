@JIRA-LABEL:navigation
Feature: Finance Landing Page
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-3480 @JIRA-EPIC:PO-2439 @R1CFinancialMovements
  Scenario: Manual cash input is available to an authorised user from the Finance landing page
    # AC1: Finance displays the Manual cash input link.
    # AC1a: the authenticated test user has Process and allocate payments permission.
    # AC1b: the Cash section is displayed with the Manual cash input link.
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page
    And I see the following text on the page "Cash"
    And I see the following text on the page "Manual cash input"
