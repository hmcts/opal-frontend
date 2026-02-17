Feature: Accessibility Tests for Fines Consolidation
  # This feature file ensures consolidation entry points meet accessibility standards using Axe-Core.

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should be on the dashboard

  Scenario: Consolidation page passes accessibility checks
    When I open Consolidate accounts
    Then I check the page for accessibility
