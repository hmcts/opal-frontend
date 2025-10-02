# cypress/e2e/fines/filter-by-business-unit.feature
Feature: Filter by Business Unit

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    When I navigate to Search For An Account
    And I click the "Change" link in the "Business units" section
    Then I am on the "Filter by business unit" page

  @PO-711 @AC1a
  Scenario: AC1a — Page chrome and defaults on first load (Fines)
    Then I see the page heading "Filter by business unit"
    Then I see the following tabs:
      | Fines        |
      | Confiscation |
    And I see the master checkbox label "Fines business units"
    And I see the "Save selection" button
    And I see the "Cancel" link

  @PO-711 @AC1b
  Scenario: AC1b — Switching to Confiscation shows Confiscation header
    When I click on the "Confiscation" link
    Then I see the master checkbox label "Confiscation business units"
    And I remain on the "Filter by business unit" page

  @PO-711 @AC7
  Scenario: AC7 — Saving sends the combined selection across tabs
    And I unselect all business units on the "Fines" tab
    Then no business units are selected on the "Fines" tab
    And I click on the "Confiscation" link
    And I unselect all business units on the "Confiscation" tab
    And no business units are selected on the "Confiscation" tab

    # Act: pick some on each tab
    When I click on the "Fines" link
    And I select the business units on Fines:
      | Bedfordshire |
      | Bolton       |
    And I click on the "Confiscation" link
    And I select the business units on Confiscation:
      | Berwick |
    And I click the "Save selection" button
    Then I am on the "Search for an account" page
    And the business unit filter summary shows "Bedfordshire Bolton Berwick"




# @PO-711 @AC8
# Scenario: AC8 — Cancel does not save and returns to previous page
#   # Arrange: make some changes
#   And I select the business units on Fines:
#     | London Central & South East |
#   And I click on the "Confiscation" link
#   And I select the business units on Confiscation:
#     | London Confiscation Orders |

#   # Spy that no save occurs
#   And I spy on the "save selected business units" API call
#   When I click on the "Cancel" link
#   Then I am taken back to the "Search for an account" page
#   And the "save selected business units" API call was not made

#   # Optional: reopen and confirm changes were not persisted
#   When I click the "Change" link in the "Business units" section
#   Then no business units are selected on the "Fines" tab
#   And I click on the "Confiscation" link
#   And no business units are selected on the "Confiscation" tab

# @PO-711 @AC9
# Scenario: AC9 — Switching tabs preserves selections and total count
#   # Start on Fines
#   And the "Save selection" button shows a total of 0
#   When I select the business units on Fines:
#     | London North West |
#     | London South West |
#   Then the "Save selection" button shows a total of 2

#   # Go to Confiscation and add one more
#   When I click on the "Confiscation" link
#   And I select the business units on Confiscation:
#     | London Confiscation Orders |
#   Then the "Save selection" button shows a total of 3

#   # Return to Fines and confirm previous Fines selections are still ticked
#   When I click on the "Fines" link
#   Then the following business units are selected on Fines:
#     | London North West |
#     | London South West |
#   And the "Save selection" button shows a total of 3

# @PO-711 @AC10
# Scenario: AC10 — Select-all is scoped to the active tab only
#   # Fines select-all does not affect Confiscation
#   And no business units are selected on the "Fines" tab
#   And I click the "Fines business units" select-all checkbox
#   Then all business units are selected on the "Fines" tab

#   When I click on the "Confiscation" link
#   Then no business units are selected on the "Confiscation" tab

#   # Confiscation select-all does not affect Fines
#   When I click the "Confiscation business units" select-all checkbox
#   Then all business units are selected on the "Confiscation" tab

#   When I click on the "Fines" link
#   Then all business units are still selected on the "Fines" tab
