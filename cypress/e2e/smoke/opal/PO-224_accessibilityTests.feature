Feature: PO-224 Accesibility Tests
  Scenario: Sign in Page - Accessibility
    Given I am on the OPAL Frontend
    And I see "Sign in" on the sign in page
    Then I check accessibility

  Scenario: Dashboard - Accessibility
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    Then I check accessibility

