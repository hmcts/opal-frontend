@JIRA-LABEL:consolidation
Feature: Accessibility Tests for Fines Consolidation
  # This feature file ensures consolidation entry points meet accessibility standards using Axe-Core.

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should be on the dashboard

  @JIRA-STORY:PO-2413 @JIRA-KEY:POT-3210
  Scenario: Consolidate Accessibility for Individuals
    When I open Consolidate accounts
    Then I check the page for accessibility
    And I continue to the consolidation account search as an "Individual" defendant
    Then I am on the consolidation Search tab for Individuals
    And I check the page for accessibility

  @JIRA-STORY:PO-2414 @JIRA-KEY:POT-3211
  Scenario: Consolidate Accessibility for Companies
    When I open Consolidate accounts
    Then I check the page for accessibility
    And I continue to the consolidation account search as an "Company" defendant
    Then I am on the consolidation Search tab for Companies
    And I check the page for accessibility
