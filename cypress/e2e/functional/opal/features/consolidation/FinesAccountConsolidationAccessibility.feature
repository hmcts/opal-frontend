Feature: Accessibility Tests for Fines Consolidation
  # This feature file ensures consolidation entry points meet accessibility standards using Axe-Core.

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should be on the dashboard

  @PO-2412
  Scenario: Consolidate Accessibility for Individuals
    When I open Consolidate accounts
    Then I check the page for accessibility
    And I continue to the consolidation account search as an "Individual" defendant
    Then I am on the consolidation Search tab for Individuals
    And I check the page for accessibility

