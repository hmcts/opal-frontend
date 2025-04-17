Feature: PO-224 Accesibility Tests
  Scenario: Dashboard - Accessibility
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    Then I check accessibility

