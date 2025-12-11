Feature: Filter by Business Unit

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    When I navigate to the Filter by business unit page

  @PO-711 @AC1a
  Scenario: AC1a — Page and defaults on first load (Fines)
    Then the Filter by business unit page for Fines is shown with defaults

  @PO-711 @AC1b
  Scenario: AC1b — Switching to Confiscation shows Confiscation header
    When the user switches to the Confiscation tab
    Then the Confiscation Filter by business unit page is shown with defaults

  @PO-711 @AC7
  Scenario: AC7 — Saving sends the combined selection across tabs
    And I clear all selected business units on the "Fines" tab
    And I clear all selected business units on the "Confiscation" tab
    # Act: pick some on each tab
    When I select the following business units:
      | tab          | businessUnit |
      | Fines        | Bedfordshire |
      | Fines        | Bolton       |
      | Confiscation | Berwick      |
    And I save the selected business units and the filter summary is "Bedfordshire, Berwick, Bolton"


  @PO-711 @AC8
  Scenario: AC8 — Cancel does not save and returns to previous page
    And I clear all selected business units on the "Fines" tab
    And I clear all selected business units on the "Confiscation" tab
    When I cancel the business unit selection
    Then the business unit filter summary is "All business units"


  @PO-711 @AC9
  Scenario: AC9 — Switching tabs preserves selections and total count
    And I clear all selected business units on the "Fines" tab
    And I clear all selected business units on the "Confiscation" tab
    Then the "Save selection" button displays a total of 0

    # Make two selections on Fines
    When I select the following business units:
      | tab   | businessUnit |
      | Fines | Bedfordshire |
      | Fines | Bolton       |
    Then the "Save selection" button displays a total of 2

    # Switch away and back — ensure selections & total are preserved
    When I switch to the "Confiscation" tab
    Then the "Save selection" button displays a total of 2

    When I switch to the "Fines" tab
    Then the business units selected on "Fines" are:
      | Bedfordshire |
      | Bolton       |
    And the "Save selection" button displays a total of 2


  @PO-711 @AC10
  Scenario: AC10 — Previously entered search criteria remain populated after saving amended business unit filter
    # Background ends on "Filter by business unit" → go back first
    When I cancel the business unit selection
    # Fill in Individuals search criteria
    When I view the Individuals search form and enter the following:
      | individual last name      | Smith           |
      | last name exact match     | Yes             |
      | first names               | John            |
      | first names exact match   | Yes             |
      | date of birth             | 15/05/1980      |
      | national insurance number | AB123456C       |
      | address line 1            | 123 Test Street |
      | postcode                  | SW1A 1AA        |
      | include aliases           | Yes             |
    # Amend the Business Unit filter
    And I open the business unit filter from the search page
    And I clear all selected business units on the "Fines" tab
    And I clear all selected business units on the "Confiscation" tab
    When I select the following business units:
      | tab   | businessUnit |
      | Fines | Bedfordshire |
    And I save the selected business units and the filter summary is "Bedfordshire"
    # Back on Search page — all previously entered values should still be present
    Then I see the "Search for an account" page for individuals with the following details:
      | individual last name      | Smith           |
      | first names               | John            |
      | date of birth             | 15/05/1980      |
      | national insurance number | AB123456C       |
      | address line 1            | 123 Test Street |
      | postcode                  | SW1A 1AA        |
      | last name exact match     | Yes             |
      | first names exact match   | Yes             |
      | include aliases           | Yes             |
