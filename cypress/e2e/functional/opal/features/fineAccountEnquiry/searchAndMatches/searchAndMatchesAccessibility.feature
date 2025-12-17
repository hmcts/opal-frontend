Feature: Search and Matches Accessibility

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I am on the Account Search page - Individuals form displayed by default

  Scenario: Check Search and Matches Accessibility with Axe-Core
    ## Check Accessibility on Individuals Tab
    When I search using the following inputs:
      | individual last name      | * |
      | first names               | * |
      | Date of birth             | * |
      | National Insurance number | * |
      | Address line 1            | * |
      | Postcode                  | * |
    Then I check the page for accessibility

    ## Check Accessibility on Companies Tab
    When I view the Companies search form
    Then I check the page for accessibility

    ## Check Accessibility on Minor Creditors Tab
    And I view the Minor Creditors search form
    Then I check the page for accessibility

    # Check Accessibility on Major Creditors Tab
    And I view the Major Creditors search form
    Then I check the page for accessibility

    # Check Accessibility on Search Results
    # this is verifying accessibility on no results returned
    And I view the Individuals search form
    When I search using the following inputs:
      | individual last name | Smith |
      | first names          | John  |
    Then I see the Search results page
    And I check the page for accessibility
