@JIRA-LABEL:account-enquiry
Feature: Search and matches - Legacy data journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and viewing matching records,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @skip @LegacyData @R1B @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with searchable surname LEGACY_INDIVIDUAL_LAST_NAME, prosecutor case reference LEGACY_INDIVIDUAL_REFERENCE, and summary header text LEGACY_INDIVIDUAL_SUMMARY_HEADER.
  Scenario: Search for an individual defendant account from legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | individual last name | LEGACY_INDIVIDUAL_LAST_NAME |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | LEGACY_INDIVIDUAL_REFERENCE |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "LEGACY_INDIVIDUAL_SUMMARY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with a unique searchable date of birth LEGACY_INDIVIDUAL_DATE_OF_BIRTH (DD/MM/YYYY), prosecutor case reference LEGACY_INDIVIDUAL_DOB_REFERENCE, and summary header text LEGACY_INDIVIDUAL_DOB_SUMMARY_HEADER.
  Scenario: Search for an individual defendant account from legacy data by date of birth and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | date of birth | LEGACY_INDIVIDUAL_DATE_OF_BIRTH |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | LEGACY_INDIVIDUAL_DOB_REFERENCE |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "LEGACY_INDIVIDUAL_DOB_SUMMARY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with searchable national insurance number LEGACY_INDIVIDUAL_NI_NUMBER, prosecutor case reference LEGACY_INDIVIDUAL_NI_REFERENCE, and summary header text LEGACY_INDIVIDUAL_NI_SUMMARY_HEADER.
  Scenario: Search for an individual defendant account from legacy data by national insurance number and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | national insurance number | LEGACY_INDIVIDUAL_NI_NUMBER |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | LEGACY_INDIVIDUAL_NI_REFERENCE |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "LEGACY_INDIVIDUAL_NI_SUMMARY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-705 @JIRA-STORY:PO-706 @JIRA-STORY:PO-717 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with a unique searchable postcode LEGACY_INDIVIDUAL_POSTCODE, prosecutor case reference LEGACY_INDIVIDUAL_POSTCODE_REFERENCE, and summary header text LEGACY_INDIVIDUAL_POSTCODE_SUMMARY_HEADER.
  Scenario: Search for an individual defendant account from legacy data by postcode and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | postcode | LEGACY_INDIVIDUAL_POSTCODE |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | LEGACY_INDIVIDUAL_POSTCODE_REFERENCE |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "LEGACY_INDIVIDUAL_POSTCODE_SUMMARY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-712 @JIRA-STORY:PO-706 @JIRA-STORY:PO-707 @JIRA-EPIC:PO-704
  # Minimum data set required: one company defendant account with company name LEGACY_COMPANY_NAME, prosecutor case reference LEGACY_COMPANY_REFERENCE, and account header text LEGACY_COMPANY_HEADER.
  Scenario: Search for a company defendant account from legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I view the Companies search form
    And I search using the following inputs:
      | company name | LEGACY_COMPANY_NAME |
    Then I see the Search results page
    And I see the Companies search results:
      | Ref | LEGACY_COMPANY_REFERENCE |
    When I open the latest matching result from the search results
    Then I should see the account header contains "LEGACY_COMPANY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual minor creditor with last name LEGACY_MINOR_CREDITOR_LAST_NAME, display name LEGACY_MINOR_CREDITOR_NAME, and address line 1 LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1.
  Scenario: Search for a minor creditor account from legacy data and review the matching results
    Given I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual                           |
      | individual last name | LEGACY_MINOR_CREDITOR_LAST_NAME      |
      | address line 1       | LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1 |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | LEGACY_MINOR_CREDITOR_NAME           |
      | Address line 1 | LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1 |

  @skip @LegacyData @R1B @JIRA-STORY:PO-709 @JIRA-STORY:PO-706 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account and one company defendant account sharing prosecutor case reference LEGACY_SHARED_REFERENCE, with the company account header text LEGACY_SHARED_REFERENCE_COMPANY_HEADER.
  Scenario: Search by prosecutor case reference in legacy data and review results across defendant tabs
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | reference or case number | LEGACY_SHARED_REFERENCE |
    Then I see the Search results page
    And I see the Individuals search results:
      | Ref | LEGACY_SHARED_REFERENCE |
    And I see the Companies search results by tab switch:
      | Ref | LEGACY_SHARED_REFERENCE |
    When I open the latest matching result from the Companies search results
    Then I should see the account header contains "LEGACY_SHARED_REFERENCE_COMPANY_HEADER"

  @skip @LegacyData @R1B @JIRA-STORY:PO-706 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual defendant account with account number LEGACY_ACCOUNT_NUMBER and summary header text LEGACY_ACCOUNT_SUMMARY_HEADER.
  Scenario: Search by account number in legacy data and open the matching record
    Given I am on the Account Search page - Individuals form displayed by default
    When I search using the following inputs:
      | account number | LEGACY_ACCOUNT_NUMBER |
    Then I see the Search results page
    And I see the Individuals search results:
      | Account | LEGACY_ACCOUNT_NUMBER |
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "LEGACY_ACCOUNT_SUMMARY_HEADER"
