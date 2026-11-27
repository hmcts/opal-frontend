@JIRA-LABEL:manual-cash-input @JIRA-LABEL:accessibility @JIRA-EPIC:PO-2660 @JIRA-STORY:PO-3674 @R1CFinancialMovements
Feature: Manual Cash Input - Suspense Payer Details Accessibility

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  Scenario: Suspense Payer Details accessibility across payer types and required validation
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    And I record a suspense payment for reason "overpayment"
    Then the suspense payer form is displayed
    And I check the page for accessibility
    When I continue with the suspense payer details
    Then a suspense payer type is required
    And I check the page for accessibility
    When the suspense payer type is "individual"
    Then I check the page for accessibility
    When I continue with the suspense payer details
    Then the suspense payer field "lastName" has error "Enter last name"
    And I check the page for accessibility
    When the suspense payer type is "company"
    Then I check the page for accessibility
    When I continue with the suspense payer details
    Then the suspense payer field "companyName" has error "Enter company name"
    And I check the page for accessibility
