
Feature: Fines primary navigation
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

@JIRA-EPIC:PO-2627
  @JIRA-STORY:PO-2611 @JIRA-KEY:POT-5049
  Scenario: AC1a AC1b AC1c AC2a AC2b AC3a AC3b - The Fines Search landing page is shown by default after login
    Then I see the Fines primary navigation with Search selected by default

  @JIRA-STORY:PO-2611
  Scenario Outline: AC4a AC4b AC4c - Selecting a top-level Fines area updates the active navigation item - <menuItem>
    When I select the Fines primary navigation item "<menuItem>"
    Then I am taken to the "<menuItem>" Fines landing page

@JIRA-EPIC:PO-2627
    @JIRA-KEY:POT-5050
    Examples:
      | menuItem       |
      | Accounts       |
@JIRA-EPIC:PO-2627
    @JIRA-KEY:POT-5051
    Examples:
      | menuItem       |
      | Finance        |
@JIRA-EPIC:PO-2627
    @JIRA-KEY:POT-5052
    Examples:
      | menuItem       |
      | Reports        |
@JIRA-EPIC:PO-2627
    @JIRA-KEY:POT-5053
    Examples:
      | menuItem       |
      | Administration |

@JIRA-EPIC:PO-2627
  @JIRA-STORY:PO-2611 @JIRA-KEY:POT-5054
  Scenario: AC5a - Signing out from the Fines primary navigation returns the user to sign in
    When I sign out from the Fines primary navigation
    Then I am returned to the OPAL sign-in page

