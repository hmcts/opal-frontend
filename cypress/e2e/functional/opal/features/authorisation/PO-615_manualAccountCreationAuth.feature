Feature: PO-615 – Manual account creation – unauthorised user is shown Access Denied

  Background:
    Given I am logged in with email "opal-test-2@HMCTS.NET"

  Scenario: AC1, AC3 – Unauthorised user presented with Access Denied
    When I open Manual Account Creation
    Then I should see an Access Denied page
    And I should see an error message "You do not have the appropriate permissions to access this page."
    And I should see a "Back to dashboard" action
