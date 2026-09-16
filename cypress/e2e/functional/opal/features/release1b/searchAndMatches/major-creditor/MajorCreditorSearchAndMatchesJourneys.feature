@JIRA-LABEL:account-enquiry
Feature: Major Creditor Search And Matches Journeys
  High-value end-to-end journeys for Search and Matches.
  This scaffold covers the legacy-data path for major creditor search

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"

  # Legacy-data scenarios are scaffolds.
  # Replace the LEGACY_* placeholders with real seeded data values before executing them.

  @LegacyData @JIRA-STORY:PO-2350 @JIRA-EPIC:PO-1286
  # Minimum data set required: one major creditor available for business unit LEGACY_MAJOR_CREDITOR_BUSINESS_UNIT, searchable as LEGACY_MAJOR_CREDITOR_NAME, and opening a details page whose header contains LEGACY_MAJOR_CREDITOR_HEADER.
  Scenario Outline: Search for a major creditor account from legacy data
    Given I am on the Account Search page - Individuals form displayed by default
    And I open the business unit filter from the search page
    And I clear all selected business units on the "Fines" tab
    And I clear all selected business units on the "Confiscation" tab
    When I select the following business units:
      | tab   | businessUnit                          |
      | Fines | <LEGACY_MAJOR_CREDITOR_BUSINESS_UNIT> |
    And I save the selected business units and the filter summary is "<LEGACY_MAJOR_CREDITOR_BUSINESS_UNIT>"
    And I view the Major Creditors search form
    When I search for the major creditor "<LEGACY_MAJOR_CREDITOR_NAME>"
    Then I should see the account header contains "<LEGACY_MAJOR_CREDITOR_HEADER>"
    @R1BDrop2UatTechJCDE
    Examples:
      | LEGACY_MAJOR_CREDITOR_BUSINESS_UNIT | LEGACY_MAJOR_CREDITOR_NAME | LEGACY_MAJOR_CREDITOR_HEADER |
      | placeholder                         | placeholder                | placeholder                  |
    @R1BDrop2UatTechPreprod
    Examples:
      | LEGACY_MAJOR_CREDITOR_BUSINESS_UNIT | LEGACY_MAJOR_CREDITOR_NAME | LEGACY_MAJOR_CREDITOR_HEADER |
      | placeholder                         | placeholder                | placeholder                  |
