@JIRA-LABEL:navigation @JIRA-STORY:PO-9762 @R1CSuspense
Feature: Finance Suspense permissions
  # Uses real seeded users and user-state responses; no permission stubs or DB changes.
  # The signed-in user's permissions are verified before asserting the UI behaviour.

  Scenario Outline: Either Suspense permission allows the Finance Suspense journey
    Given I am logged in on the Fines Search landing page with email "<email>"
    Then my Suspense permissions are "<permissions>"
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page
    And I see the Suspense section and its Manage Suspense Items link
    When I open Manage Suspense Items from Finance
    Then I am on the Suspense search page

    Examples:
      | email                            | permissions |
      | opal-test-3@dev.platform.hmcts.net | View only   |
      | opal-test-4@dev.platform.hmcts.net | Manage only |
      | opal-test@dev.platform.hmcts.net   | Both        |

  @R1CFinancialMovements
  Scenario: A user without either Suspense permission retains Cash access but cannot see Suspense
    Given I am logged in on the Fines Search landing page with email "opal-test-5@dev.platform.hmcts.net"
    Then my Suspense permissions are "Neither"
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page
    And I see the following text on the page "Manual cash input"
    And I do not see the Suspense section or its Manage Suspense Items link
