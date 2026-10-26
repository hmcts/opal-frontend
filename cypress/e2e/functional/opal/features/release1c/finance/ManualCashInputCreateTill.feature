@JIRA-LABEL:manual-cash-input @JIRA-EPIC:PO-2439 @R1CFinancialMovements
Feature: Manual Cash Input - Create Till

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  # AC1: Create till from Manual Cash Input navigates to Select a Business Unit.
  # AC1a: Select a Business Unit is displayed with its page content and actions.
  @JIRA-STORY:PO-3475 @JIRA-STORY:PO-3476
  Scenario: AC1, AC1a - a Finance user opens Manual Cash Input and is taken to Select a Business Unit
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    Then I see the following text on the page "Create till"

  # AC2: A user with two or more permitted business units receives an autocomplete list.
  # AC2a: Business units are displayed in ascending alphabetical order.
  @JIRA-STORY:PO-3476
  Scenario: AC2, AC2a - a user can view alphabetically ordered permitted business units
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    Then the Manual Cash Input business units are listed alphabetically

  # AC3: Exactly one permitted business unit is shown read-only and cannot be amended.
  # AC4: Continue with a valid business unit navigates to Till Details.
  @JIRA-STORY:PO-3476
  Scenario: AC3, AC4 - a user with one permitted business unit continues with the read-only value
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till with one unit
    And I continue with the read-only unit
    Then I see the following text on the page "Till details"

  # AC4: A selected valid business unit is carried into Till Details.
  @JIRA-STORY:PO-3476
  Scenario: AC4 - a user selects a business unit and continues to Till Details
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue
    Then I see the following text on the page "Camden and Islington"

  # AC5: Continue without a valid selection remains on the page and displays "Select business unit".
  @JIRA-STORY:PO-3476
  Scenario: AC5 - a user cannot continue without selecting a business unit
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I continue without a selection
    Then I see the following text on the page "Select business unit"

  # AC6: Cancel with no selection returns to Manual Cash Input without validation.
  @JIRA-STORY:PO-3476
  Scenario: AC6 - a user cancels a blank business unit selection
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I cancel
    Then I see the following text on the page "Manual cash input"

  # AC6a: Cancel after a selection displays the common data-loss route guard.
  # AC6ai: Continuing from the route guard returns to Manual Cash Input and clears the selection.
  # AC6a/AC6aii: Declining the route guard retains the selection on Select a Business Unit.
  @JIRA-STORY:PO-3476
  Scenario: AC6a, AC6ai, AC6aii - a user can decide whether to discard a selected business unit
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I cancel with a unit
    And I accept the warning
    Then I see the following text on the page "Manual cash input"

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
