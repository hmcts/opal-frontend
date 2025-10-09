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
    And I am on the "Filter by business unit" page

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

  @PO-711 @AC8
  Scenario: AC8 — Cancel does not save and returns to previous page
    And I unselect all business units on the "Fines" tab
    And I unselect all business units on the "Confiscation" tab
    When I click on the "Cancel" link
    Then I am taken back to the "Search for an account" page
    And the business unit filter summary shows "All business units"

  @PO-711 @AC9
  Scenario: AC9 — Switching tabs preserves selections and total count
    And I unselect all business units on the "Fines" tab
    And I unselect all business units on the "Confiscation" tab
    Then the "Save selection" button shows a total of 0

    # Make two selections on Fines
    And I select the business units on Fines:
      | Bedfordshire |
      | Bolton       |
    Then the "Save selection" button shows a total of 2

    # Switch away and back — ensure selections & total are preserved
    When I click on the "Confiscation" link
    Then the "Save selection" button shows a total of 2

    When I click on the "Fines" link
    Then the following business units are selected on "Fines":
      | Bedfordshire |
      | Bolton       |
    And the "Save selection" button shows a total of 2


  @PO-711 @AC10
  Scenario: AC10 — Previously entered search criteria remain populated after saving amended business unit filter
    # Background ends on "Filter by business unit" → go back first
    When I click on the "Cancel" link
    Then I am taken back to the "Search for an account" page

    # Fill in Individuals search criteria
    When I click on the "Individuals" link
    And I enter "Smith" into the "Last name" field
    And I select the last name exact match checkbox
    And I enter "John" into the "First names" field
    And I select the first names exact match checkbox
    And I select the "Include aliases" checkbox
    And I enter "15/05/1980" into the Date of birth field
    And I enter "AB123456C" into the "National Insurance number" field
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field

    # Amend the Business Unit filter
    And I click the "Change" link in the "Business units" section
    Then I am on the "Filter by business unit" page
    And I unselect all business units on the "Fines" tab
    And I select the business units on Fines:
      | Bedfordshire |
    When I click the "Save selection" button

    # Back on Search page — all previously entered values should still be present
    Then I am on the "Search for an account" page
    And I see "Smith" in the "Last name" field
    And I see "John" in the "First names" field
    And I see "15/05/1980" in the Date of birth field
    And I see "AB123456C" in the "National Insurance number" field
    And I see "123 Test Street" in the "Address line 1" field
    And I see "SW1A 1AA" in the "Postcode" field
    And I verify the first names exact match checkbox is checked
    And I verify the last name exact match checkbox is checked
    And I validate the "Include aliases" checkbox is checked
