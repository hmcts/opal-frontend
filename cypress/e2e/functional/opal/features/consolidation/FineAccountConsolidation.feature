Feature: Fines Account Consolidation
  Validate consolidation navigation from select business unit to account search.

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should be on the dashboard

  @PO-2412
  Scenario: AC1 - User is navigated to Search tab for Individuals after selecting BU and Individual
    When I open Consolidate accounts
    And I continue to the consolidation account search as an "Individual" defendant
    Then I am on the consolidation Search tab for Individuals

  @PO-2412
  Scenario: AC8 - Switching tabs retains entered Search data
    When I open Consolidate accounts
    And I continue to the consolidation account search as an "Individual" defendant
    And I enter the following consolidation search details:
      | account number             | 12345678    |
      | national insurance number  | AB123456C   |
      | last name                  | Smith       |
      | first names                | John        |
      | date of birth              | 01/01/1990  |
      | address line 1             | 1 High St   |
      | postcode                   | SW1A 1AA    |
      | last name exact match      | true        |
      | first names exact match    | true        |
      | include aliases            | true        |
    And I switch consolidation tabs and return to Search
    Then the consolidation search details are retained:
      | account number             | 12345678    |
      | national insurance number  | AB123456C   |
      | last name                  | Smith       |
      | first names                | John        |
      | date of birth              | 01/01/1990  |
      | address line 1             | 1 High St   |
      | postcode                   | SW1A 1AA    |
      | last name exact match      | true        |
      | first names exact match    | true        |
      | include aliases            | true        |
