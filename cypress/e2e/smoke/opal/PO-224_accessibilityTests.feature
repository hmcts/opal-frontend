Feature: PO-224 Accesibility Tests
  Scenario: Sign in Page - Accessibility
    Given I am on the OPAL Frontend
    Then I check accessibility

  Scenario: Dashboard - Accessibility
    Given I am on the OPAL Frontend
    Then I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    Then I check accessibility

