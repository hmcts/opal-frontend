@JIRA-LABEL:manual-cash-input @JIRA-EPIC:PO-2439 @R1CFinancialMovements
Feature: Manual Cash Input - Create Till

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  # AC1, AC1a and AC2: navigate from Finance to Manual Cash Input, then begin the Create Till journey.
  @JIRA-STORY:PO-3475
  Scenario: AC1, AC1a and AC2 - a Finance user opens Manual Cash Input and starts creating a till
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input create and allocate
    And I select Create Till from Manual Cash Input
    Then I see the following text on the page "Create till"

  # AC5a, AC5aii and AC6a/RGAC1/RGAC1a: decline the native leave-page warning and retain selection.
  @JIRA-STORY:PO-3475
  Scenario: AC5a, AC5aii and AC6a - a user can cancel the native leave-page warning and retain selected tills
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input with outstanding tills
    And I select a till and decline the Manual Cash Input leave-page warning
    Then I remain on Manual Cash Input with the till selected

  # AC5a, AC5ai and AC6a/RGAC1/RGAC1b: accept the native leave-page warning and return to Finance.
  @JIRA-STORY:PO-3475
  Scenario: AC5a, AC5ai and AC6a - a user can accept the native leave-page warning and return to Finance
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input with outstanding tills
    And I select a till and accept the Manual Cash Input leave-page warning
    Then I return to the Finance landing page

  # AC6b/CSAC3: refreshing the page clears the previously selected table sorting.
  @JIRA-STORY:PO-3475
  Scenario: AC6b - refreshing Manual Cash Input resets table sorting
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input with outstanding tills
    And I sort Manual Cash Input tills and refresh the page
    Then Manual Cash Input till sorting is reset
