@JIRA-LABEL:consolidation
Feature: Fines Account Consolidation
  Validate consolidation navigation from select business unit to account search.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I should be on the dashboard
    Then I open Consolidate accounts

  @JIRA-STORY:PO-2413 @JIRA-KEY:POT-3328
  Scenario: Consolidation account search for Individuals
    When I continue to the consolidation account search as an "Individual" defendant

    # AC1 - User is navigated to Search tab for Individuals after selecting BU and Individual
    Then I am on the consolidation Search tab for Individuals

    # AC8 - Switching tabs retains entered Search data
    And I enter the following consolidation search details:
      | account number            | 12345678   |
      | national insurance number | AB123456C  |
      | last name                 | Smith      |
      | first names               | John       |
      | date of birth             | 01/01/1990 |
      | address line 1            | 1 High St  |
      | postcode                  | SW1A 1AA   |
      | last name exact match     | true       |
      | first names exact match   | true       |
      | include aliases           | true       |
    And I switch consolidation tabs and return to Search
    Then the consolidation search details are retained:
      | account number            | 12345678   |
      | national insurance number | AB123456C  |
      | last name                 | Smith      |
      | first names               | John       |
      | date of birth             | 01/01/1990 |
      | address line 1            | 1 High St  |
      | postcode                  | SW1A 1AA   |
      | last name exact match     | true       |
      | first names exact match   | true       |
      | include aliases           | true       |
    Then I click Search on consolidation account search
    Then the consolidation search details are retained:
      | account number            | 12345678   |
      | national insurance number | AB123456C  |
      | last name                 | Smith      |
      | first names               | John       |
      | date of birth             | 01/01/1990 |
      | address line 1            | 1 High St  |
      | postcode                  | SW1A 1AA   |
      | last name exact match     | true       |
      | first names exact match   | true       |
      | include aliases           | true       |

  @JIRA-STORY:PO-2414 @JIRA-KEY:POT-3329
  Scenario: Consolidation account search for Companies
    When I continue to the consolidation account search as an "Company" defendant
    # AC1 - User is navigated to Search tab for Companies after selecting BU and Company
    Then I am on the consolidation Search tab for Companies

    # AC8 - Switching tabs retains entered Search data
    And I enter the following consolidation search details:
      | account number     | 12345678     |
      | company name       | Company Name |
      | address line 1     | 1 High St    |
      | postcode           | SW1A 1AA     |
      | Search exact match | true         |
      | include aliases    | true         |
    And I switch consolidation tabs and return to Search
    Then the consolidation search details are retained:
      | account number     | 12345678     |
      | company name       | Company Name |
      | address line 1     | 1 High St    |
      | postcode           | SW1A 1AA     |
      | Search exact match | true         |
      | include aliases    | true         |
    Then I click Search on consolidation account search
    Then the consolidation search details are retained:
      | account number     | 12345678     |
      | company name       | Company Name |
      | address line 1     | 1 High St    |
      | postcode           | SW1A 1AA     |
      | Search exact match | true         |
      | include aliases    | true         |
